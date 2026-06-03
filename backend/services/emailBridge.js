import db from './dbAdapter.js';
import { analyzeEmail } from './gemini.js';
import dotenv from 'dotenv';

dotenv.config();

let isPollingActive = false;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Start the multi-tenant background poller loop
startEnterpriseInboxPoller();

/**
 * Helper to fetch Azure AD App Settings
 */
async function getAzureSettings() {
  const settingsMap = await db.getSettings();

  return {
    clientId: settingsMap.MICROSOFT_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: settingsMap.MICROSOFT_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET || ''
  };
}

/**
 * Refreshes an expired Microsoft Graph OAuth Access Token.
 */
async function refreshEmployeeToken(employeeId, refreshToken, creds) {
  try {
    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const params = new URLSearchParams();
    params.append('client_id', creds.clientId);
    params.append('client_secret', creds.clientSecret);
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error_description || data.error);
    }

    const { access_token, refresh_token: new_refresh_token, expires_in } = data;
    const expiresAt = Date.now() + (expires_in * 1000);

    // Save fresh tokens
    await db.updateEmployeeTokensById(employeeId, access_token, new_refresh_token || refreshToken, expiresAt);

    console.log(`Refreshed OAuth token successfully for Employee ID: ${employeeId}`);
    return access_token;
  } catch (error) {
    console.error(`Failed to refresh token for Employee ID ${employeeId}:`, error.message);
    // Set status to pending if refresh token is revoked
    await db.setEmployeePending(employeeId);
    return null;
  }
}

/**
 * Returns a valid access token for an employee, automatically refreshing if expired.
 */
async function getValidAccessToken(employee, creds) {
  const isExpired = Date.now() >= (employee.token_expires_at - 60000); // 1-minute buffer
  if (!isExpired) {
    return employee.access_token;
  }

  return await refreshEmployeeToken(employee.id, employee.refresh_token, creds);
}

/**
 * Helper that performs a single check across all active connected employee mailboxes.
 */
async function runPollCycle() {
  if (isPollingActive) {
    console.log('Previous polling cycle is still active. Skipping run to prevent rate-limit overlap.');
    return;
  }
  isPollingActive = true;
  try {
    const creds = await getAzureSettings();
    if (!creds.clientId || !creds.clientSecret) {
      return;
    }

    // Fetch all successfully connected employees
    const activeEmployees = await db.getActiveEmployees();
    if (activeEmployees.length === 0) return;

    // Fetch dynamic active folders
    const currentRules = await db.getRules();
    const activeRules = currentRules.length > 0 ? currentRules : [
      { category: 'Support', prompt_instruction: 'Apologize sincerely for any frustration. Provide clear, step-by-step instructions. Keep the tone helpful, empathetic, and professional.' },
      { category: 'Sales', prompt_instruction: 'Be warm, enthusiastic, and highly professional. Highlight our key value propositions. Propose a short 15-minute introductory call.' },
      { category: 'Billing', prompt_instruction: 'Maintain a clear, professional, and reassuring tone. Clarify billing discrepancies.' },
      { category: 'General', prompt_instruction: 'Write a polite, well-structured, and helpful response addressing their questions directly.' }
    ];

    for (const employee of activeEmployees) {
      try {
        const accessToken = await getValidAccessToken(employee, creds);
        if (!accessToken) continue;

        await processEmployeeInbox(employee.email, accessToken, activeRules);
      } catch (err) {
        console.error(`Error processing inbox for ${employee.email}:`, err.message);
      }
    }
  } catch (e) {
    console.error('Enterprise Poller Cycle Error:', e.message);
  } finally {
    isPollingActive = false;
  }
}

/**
 * Periodically loops through all connected employees and sorts their Outlook mailboxes.
 */
function startEnterpriseInboxPoller() {
  const POLL_INTERVAL = 30000; // Poll every 30 seconds
  console.log(`Enterprise MS Graph poller started. Auditing mailboxes every ${POLL_INTERVAL / 1000}s...`);

  // Run the very first check immediately on startup
  setTimeout(() => {
    runPollCycle();
  }, 1000);

  // Set up the recurring poller
  setInterval(() => {
    runPollCycle();
  }, POLL_INTERVAL);
}

/**
 * Checks an employee's mailbox, triages unread emails, and auto-moves them into folders.
 */
async function processEmployeeInbox(employeeEmail, accessToken, activeRules) {
  // Only look at unread emails received in the last 12 hours (to prevent back-processing thousands of old unread emails!)
  const twelveHoursAgo = new Date(Date.now() - 43200000).toISOString(); // 12 hours in ms
  const filter = encodeURIComponent(`isRead eq false and receivedDateTime ge ${twelveHoursAgo}`);
  
  // Limit to maximum 10 emails per 30-second poll cycle to prevent API throttling
  const url = `https://graph.microsoft.com/v1.0/users/${employeeEmail}/mailFolders/inbox/messages?$filter=${filter}&$top=10&$select=id,subject,bodyPreview,body,from,receivedDateTime`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Graph API fetch messages failed: ${err.error?.message || response.statusText}`);
  }

  const { value: messages } = await response.json();
  if (!messages || messages.length === 0) return;

  console.log(`Microsoft Graph: Found ${messages.length} unread email(s) for ${employeeEmail}`);

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const subject = message.subject || 'No Subject';
    const body = message.body?.content || message.bodyPreview || '';
    const senderEmail = message.from?.emailAddress?.address || 'unknown@sender.com';
    const senderName = message.from?.emailAddress?.name || senderEmail.split('@')[0];

    try {
      // Respect Gemini 5 RPM rate limit on the free tier (max 1 request every 12 seconds)
      if (i > 0) {
        if (!process.env.OPENAI_API_KEY) {
          console.log(`Waiting 12 seconds to respect Gemini 5 RPM rate limit...`);
          await delay(12000);
        } else {
          // Tiny 1-second delay for OpenAI to prevent Microsoft folder creation race conditions
          await delay(1000);
        }
      }

      // 1. Analyze email category via Gemini
      const analysis = await analyzeEmail(subject, body, activeRules);

      // 2. Log sorting audit trail in SQLite
      const savedEmail = await db.saveEmail(
        employeeEmail,
        senderEmail,
        senderName,
        subject,
        body,
        analysis.category,
        analysis.urgency,
        analysis.sentiment,
        analysis.summary,
        message.id
      );

      // Save CRM Lead if extracted
      if (analysis.lead && analysis.lead.is_lead) {
        await db.saveLead(
          employeeEmail,
          analysis.lead.name || senderName,
          analysis.lead.email || senderEmail,
          analysis.lead.phone || null,
          analysis.lead.company || null,
          analysis.lead.service_requested || null,
          analysis.lead.lead_score || 50
        );
        console.log(`AI Lead Extracted: ${analysis.lead.name || senderName} (${analysis.lead.service_requested || 'General'})`);
      }

      // Save Checklist Tasks if extracted
      if (analysis.tasks && analysis.tasks.length > 0) {
        for (const t of analysis.tasks) {
          await db.saveTask(
            employeeEmail,
            t.description,
            t.due_date || null,
            savedEmail.id
          );
        }
        console.log(`AI Checklist Tasks Extracted: ${analysis.tasks.length} item(s)`);
      }

      console.log(`AI classified email from ${senderName} into category folder: "${analysis.category}"`);

      // 3. Find or Create the Outlook folder matching that category name
      const folderId = await getOrCreateOutlookFolder(employeeEmail, analysis.category, accessToken);

      if (folderId) {
        // 4. Command Microsoft Graph to move the email into that folder
        const moveUrl = `https://graph.microsoft.com/v1.0/users/${employeeEmail}/messages/${message.id}/move`;
        const moveRes = await fetch(moveUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ destinationId: folderId })
        });

        if (moveRes.ok) {
          console.log(`Successfully moved email to live Outlook folder: "${analysis.category}"`);
        } else {
          const errData = await moveRes.json();
          console.error(`Graph API Move Message failed:`, errData.error?.message);
        }
      }

      // 5. Mark email as READ in the destination so we don't process it again
      const patchUrl = `https://graph.microsoft.com/v1.0/users/${employeeEmail}/messages/${message.id}`;
      await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRead: true })
      });

    } catch (e) {
      console.error(`Failed to triage message ID ${message.id} for employee ${employeeEmail}:`, e.message);
    }
  }
}

/**
 * Searches for a folder by name, creating it if it doesn't exist. Returns the Outlook Folder ID.
 */
async function getOrCreateOutlookFolder(employeeEmail, folderName, accessToken) {
  try {
    if (!folderName) return null;
    const lowerName = folderName.toLowerCase().trim();
    if (lowerName === 'deleted items' || lowerName === 'deleteditems' || lowerName === 'trash') {
      return 'deleteditems';
    }
    if (lowerName === 'archive') {
      return 'archive';
    }
    if (lowerName === 'junkemail' || lowerName === 'junk email') {
      return 'junkemail';
    }
    if (lowerName === 'inbox') {
      return 'inbox';
    }

    const listFoldersUrl = `https://graph.microsoft.com/v1.0/users/${employeeEmail}/mailFolders?$top=250`;
    const res = await fetch(listFoldersUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('List Outlook Mailfolders failed:', err.error?.message);
      return null;
    }

    const { value: folders } = await res.json();
    const existing = folders.find(f => f.displayName.toLowerCase() === folderName.toLowerCase());

    if (existing) {
      return existing.id;
    }

    // Create the folder since it doesn't exist
    const createFolderUrl = `https://graph.microsoft.com/v1.0/users/${employeeEmail}/mailFolders`;
    const createRes = await fetch(createFolderUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ displayName: folderName })
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      console.error(`Failed to create Outlook folder "${folderName}":`, createData.error?.message);
      return null;
    }

    console.log(`Created new Outlook folder: "${folderName}" for ${employeeEmail}`);
    return createData.id;
  } catch (error) {
    console.error(`Failed in getOrCreateOutlookFolder for "${folderName}":`, error.message);
    return null;
  }
}
