import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './services/dbAdapter.js';
import { analyzeEmail, generateDraft } from './services/gemini.js';
import './services/emailBridge.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get OAuth credentials (loads from settings adapter with .env fallback)
async function getOAuthCredentials() {
  const settingsMap = await db.getSettings();

  return {
    clientId: settingsMap.MICROSOFT_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: settingsMap.MICROSOFT_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET || '',
    redirectUri: settingsMap.MICROSOFT_REDIRECT_URI || process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:5000/api/auth/callback'
  };
}

// ----------------------------------------------------
// 1. MICROSOFT OAUTH ENDPOINTS
// ----------------------------------------------------

// Redirect employee to Microsoft Sign-in
app.get('/api/auth/login', async (req, res) => {
  try {
    const creds = await getOAuthCredentials();
    if (!creds.clientId || !creds.redirectUri) {
      return res.status(400).send('<h1>OAuth Configuration Error</h1><p>Azure Client ID or Redirect URI is missing in Admin settings.</p>');
    }

    const msalAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize` +
      `?client_id=${creds.clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(creds.redirectUri)}` +
      `&response_mode=query` +
      `&scope=${encodeURIComponent('offline_access User.Read Mail.ReadWrite')}` +
      `&state=outlook_connect`;

    res.redirect(msalAuthUrl);
  } catch (error) {
    console.error('OAuth Redirect Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// OAuth Callback from Microsoft
app.get('/api/auth/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  const clientUrl = req.get('host').includes('localhost') 
    ? 'http://localhost:5173' 
    : `${req.protocol}://${req.get('host')}`;

  if (error) {
    console.error('OAuth Callback Microsoft Error:', error_description);
    return res.redirect(`${clientUrl}?error=${encodeURIComponent(error_description)}`);
  }

  if (!code) {
    return res.status(400).send('Authorization code missing.');
  }

  try {
    const creds = await getOAuthCredentials();
    
    // Exchange Code for Access/Refresh Tokens
    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const params = new URLSearchParams();
    params.append('client_id', creds.clientId);
    params.append('client_secret', creds.clientSecret);
    params.append('code', code);
    params.append('redirect_uri', creds.redirectUri);
    params.append('grant_type', 'authorization_code');

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token Exchange Failed:', tokenData);
      return res.status(500).send(`Token Exchange Failed: ${tokenData.error_description || tokenData.error}`);
    }

    const { access_token, refresh_token, expires_in } = tokenData;
    const expiresAt = Date.now() + (expires_in * 1000);

    // Fetch user profile from Microsoft Graph
    const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      console.error('Graph API Profile Fetch Failed:', profileData);
      return res.status(500).send('Failed to fetch profile details from Microsoft Graph.');
    }

    const email = profileData.mail || profileData.userPrincipalName;
    const name = profileData.displayName || email.split('@')[0];

    // Save or update employee account inside adapter
    await db.updateEmployeeTokens(email, name, access_token, refresh_token, expiresAt);

    console.log(`Successfully connected mailbox via OAuth: ${email}`);

    // Redirect employee back to homepage with success parameter
    res.redirect(`${clientUrl}?status=connected&email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.status(500).send('OAuth Authentication Processing Failed.');
  }
});

// ----------------------------------------------------
// 2. EMPLOYEE API ENDPOINTS
// ----------------------------------------------------

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await db.getEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to retrieve employee list', details: error.message, code: error.code || 'DB_ERR' });
  }
});

// Create a new account with email, name, and password
app.post('/api/employees', async (req, res) => {
  const { email, name, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing account email address' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.getEmployeeByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const newUser = await db.createEmployee(cleanEmail, name, password);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding account:', error);
    res.status(500).json({ error: error.message || 'Failed to create account', code: error.code || 'DB_ERR' });
  }
});

// Verify email and password credentials for sign in
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const user = await db.getEmployeeByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please register.' });
    }

    // Verify password if one is configured for this account
    if (user.password && user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Login authentication error:', error);
    res.status(500).json({ error: 'Login authentication failed', details: error.message, code: error.code || 'AUTH_ERR' });
  }
});

// Update employee account credentials (name, email, password)
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, password, avatar } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Display Name are required' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    // Check if email already in use by another user
    const existing = await db.getEmployeeByEmail(cleanEmail);
    if (existing && existing.id.toString() !== id.toString()) {
      return res.status(400).json({ error: 'This email address is already registered to another account.' });
    }

    const updated = await db.updateEmployeeProfile(id, cleanEmail, name, password, avatar);
    res.json(updated);
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile.', code: error.code || 'DB_ERR' });
  }
});

// Remove an employee and disconnect their mailbox
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await db.deleteEmployee(req.params.id);
    res.json({ message: 'Employee disconnected and removed successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: error.message || 'Failed to delete employee', code: error.code || 'DB_ERR' });
  }
});

// ----------------------------------------------------
// 3. SORTED EMAILS LOG API
// ----------------------------------------------------

// Get sorted emails audit log
app.get('/api/emails', async (req, res) => {
  const { employee_email } = req.query;
  try {
    const emails = await db.getEmails(employee_email);
    res.json(emails);
  } catch (error) {
    console.error('Error fetching sorted log:', error);
    res.status(500).json({ error: 'Failed to retrieve email sorting logs', details: error.message, code: error.code || 'DB_ERR' });
  }
});

// Simulate receiving/sorting an email for testing
app.post('/api/emails/simulate', async (req, res) => {
  const { sender_email, sender_name, subject, body, employee_email } = req.body;

  if (!sender_email || !subject || !body || !employee_email) {
    return res.status(400).json({ error: 'Missing required fields: sender_email, subject, body, employee_email' });
  }

  try {
    // Fetch custom categories
    const currentRules = await db.getRules();
    const activeRules = currentRules.length > 0 ? currentRules : [
      { category: 'Personal & Family', prompt_instruction: 'ROUTING: Sort emails here that are from friends, family members, group chats, personal event invitations, and individual social correspondences. REPLY: Keep it warm, casual, and friendly. Answer directly and naturally.' },
      { category: 'Shopping & Orders', prompt_instruction: 'ROUTING: Sort online shopping confirmations, e-commerce receipts, order tracking updates, and delivery alerts here. REPLY: Keep it polite and informal. Confirm receipt if needed.' },
      { category: 'Finance & Bills', prompt_instruction: 'ROUTING: Sort bank statements, credit card bills, utility charges, payment alerts, and investment updates here. REPLY: Write a clear, brief, and structured response.' },
      { category: 'Travel & Plans', prompt_instruction: 'ROUTING: Sort flight tickets, hotel confirmations, rental car receipts, trip itineraries, and vacation plans here. REPLY: Keep it polite and helpful.' },
      { category: 'Newsletters & Feeds', prompt_instruction: 'ROUTING: Sort daily newsletters, blog subscriptions, marketing promotions, YouTube updates, and reading feeds here. REPLY: Do not reply. Keep auto-reply disabled for this folder.' },
      { category: 'General Inbox', prompt_instruction: 'ROUTING: Use this as the fallback category for general personal messages that do not belong to finance, shopping, or family. REPLY: Write a helpful, polite, and direct response.' }
    ];

    // Run AI analysis
    const analysis = await analyzeEmail(subject, body, activeRules);

    // Save to emails log
    const created = await db.saveEmail(
      employee_email,
      sender_email,
      sender_name || sender_email.split('@')[0],
      subject,
      body,
      analysis.category,
      analysis.urgency,
      analysis.sentiment,
      analysis.summary
    );
    res.status(201).json(created);
  } catch (error) {
    console.error('Error simulating email:', error);
    res.status(500).json({ error: error.message || 'Simulation failed', code: error.code || 'SIM_ERR' });
  }
});

// Generate an automated response draft for an email
app.post('/api/emails/draft', async (req, res) => {
  const { sender_email, sender_name, subject, body, category, tone } = req.body;

  if (!subject || !body || !category) {
    return res.status(400).json({ error: 'Missing required fields: subject, body, category' });
  }

  try {
    // Fetch guideline prompt from rules table
    const rule = (await db.getRules()).find(r => r.category === category);
    const instruction = rule ? rule.prompt_instruction : 'Write a polite, helpful response addressing their questions directly.';

    const sender = sender_name || sender_email || 'Customer';
    const draftText = await generateDraft(sender, subject, body, instruction, tone || 'Professional');

    res.json({ draft: draftText });
  } catch (error) {
    console.error('Error generating draft response:', error);
    res.status(500).json({ error: error.message || 'Draft generation failed', code: error.code || 'DRAFT_ERR' });
  }
});

// ----------------------------------------------------
// 4. RULES (FOLDERS) API ENDPOINTS
// ----------------------------------------------------

app.get('/api/rules', async (req, res) => {
  try {
    const rules = await db.getRules();
    res.json(rules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load rules', details: error.message, code: error.code || 'DB_ERR' });
  }
});

app.put('/api/rules/:category', async (req, res) => {
  const { prompt_instruction } = req.body;
  try {
    await db.saveRule(req.params.category, prompt_instruction);
    res.json({ message: 'Folder rule updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to update rule', code: error.code || 'DB_ERR' });
  }
});

app.delete('/api/rules/:category', async (req, res) => {
  try {
    await db.deleteRule(req.params.category);
    res.json({ message: 'Folder rule deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to delete rule', code: error.code || 'DB_ERR' });
  }
});

// Helper to refresh tokens in server.js
async function getValidAccessTokenForServer(employeeEmail) {
  const employee = await db.getEmployeeByEmail(employeeEmail);
  if (!employee) return null;

  const isExpired = Date.now() >= (employee.token_expires_at - 60000); // 1-minute buffer
  if (!isExpired) {
    return employee.access_token;
  }

  try {
    const settingsMap = await db.getSettings();
    const creds = {
      clientId: settingsMap.MICROSOFT_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID || '',
      clientSecret: settingsMap.MICROSOFT_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET || ''
    };

    if (!creds.clientId || !creds.clientSecret) {
      console.warn('Unable to refresh token: client credentials missing.');
      return null;
    }

    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const params = new URLSearchParams();
    params.append('client_id', creds.clientId);
    params.append('client_secret', creds.clientSecret);
    params.append('refresh_token', employee.refresh_token);
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

    await db.updateEmployeeTokensById(employee.id, access_token, new_refresh_token || employee.refresh_token, expiresAt);
    return access_token;
  } catch (error) {
    console.error(`Failed to refresh token in server.js for ${employeeEmail}:`, error.message);
    await db.setEmployeePending(employee.id);
    return null;
  }
}

// Helper to get or create Outlook folder in server.js
async function getOrCreateOutlookFolderForServer(employeeEmail, folderName, accessToken) {
  try {
    const listFoldersUrl = `https://graph.microsoft.com/v1.0/users/${employeeEmail}/mailFolders?$top=250`;
    const res = await fetch(listFoldersUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      console.error('List Outlook Mailfolders failed in server.js');
      return null;
    }

    const { value: folders } = await res.json();
    const existing = folders.find(f => f.displayName.toLowerCase() === folderName.toLowerCase());

    if (existing) {
      return existing.id;
    }

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
      console.error(`Failed to create Outlook folder "${folderName}" in server.js:`, createData.error?.message);
      return null;
    }

    return createData.id;
  } catch (error) {
    console.error(`Failed in getOrCreateOutlookFolderForServer for "${folderName}":`, error.message);
    return null;
  }
}

// Manual override to re-route category + move in Outlook
app.put('/api/emails/:id/reroute', async (req, res) => {
  const { category } = req.body;
  const { id } = req.params;

  if (!category) {
    return res.status(400).json({ error: 'New category is required' });
  }

  try {
    const emailRecord = await db.getEmailById(id);
    if (!emailRecord) {
      return res.status(404).json({ error: 'Email log not found' });
    }

    const updatedRecord = await db.updateEmailCategory(id, category);

    if (emailRecord.message_id) {
      const accessToken = await getValidAccessTokenForServer(emailRecord.employee_email);
      if (accessToken) {
        const folderId = await getOrCreateOutlookFolderForServer(emailRecord.employee_email, category, accessToken);
        if (folderId) {
          const moveUrl = `https://graph.microsoft.com/v1.0/users/${emailRecord.employee_email}/messages/${emailRecord.message_id}/move`;
          const moveRes = await fetch(moveUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ destinationId: folderId })
          });

          if (moveRes.ok) {
            console.log(`Re-route Sync: Successfully moved Outlook email ID ${emailRecord.message_id} to folder "${category}"`);
          } else {
            const errData = await moveRes.json();
            console.error(`Re-route Sync: Outlook move failed:`, errData.error?.message);
          }
        }
      }
    }

    res.json(updatedRecord);
  } catch (error) {
    console.error('Error manual re-routing email:', error);
    res.status(500).json({ error: error.message || 'Failed to re-route email', code: error.code || 'DB_ERR' });
  }
});

// Toggle auto reply drafts for folder
app.put('/api/rules/:category/toggle-reply', async (req, res) => {
  const { auto_reply } = req.body;
  const { category } = req.params;

  try {
    const rule = (await db.getRules()).find(r => r.category.toLowerCase() === category.toLowerCase());
    if (!rule) {
      return res.status(404).json({ error: 'Folder rule not found' });
    }

    await db.toggleRuleAutoReply(rule.category, auto_reply ? 1 : 0);
    res.json({ category: rule.category, auto_reply: auto_reply ? 1 : 0 });
  } catch (error) {
    console.error('Error toggling auto reply:', error);
    res.status(500).json({ error: error.message || 'Failed to toggle auto reply', code: error.code || 'DB_ERR' });
  }
});

// Direct reply to email thread via Microsoft Outlook
app.post('/api/emails/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText) {
    return res.status(400).json({ error: 'Reply text is required' });
  }

  try {
    const emailRecord = await db.getEmailById(id);
    if (!emailRecord) {
      return res.status(404).json({ error: 'Email log not found' });
    }

    if (!emailRecord.message_id) {
      return res.status(400).json({ error: 'This is a simulated email record and does not have a live Microsoft Outlook message ID to reply to.' });
    }

    const accessToken = await getValidAccessTokenForServer(emailRecord.employee_email);
    if (!accessToken) {
      return res.status(400).json({ error: 'Mailbox is not connected. Please connect your Outlook Office 365 account.' });
    }

    // Direct Microsoft Graph Reply endpoint
    const replyUrl = `https://graph.microsoft.com/v1.0/users/${emailRecord.employee_email}/messages/${emailRecord.message_id}/reply`;
    const replyRes = await fetch(replyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment: replyText })
    });

    if (!replyRes.ok) {
      const err = await replyRes.json();
      throw new Error(`Graph API Send Reply failed: ${err.error?.message || replyRes.statusText}`);
    }

    res.json({ message: 'Reply sent successfully via Microsoft Outlook!' });
  } catch (error) {
    console.error('Error sending email reply:', error);
    res.status(500).json({ error: error.message || 'Failed to send reply', code: error.code || 'SMTP_ERR' });
  }
});

// ----------------------------------------------------
// 5. ADMIN SETTINGS API ENDPOINTS
// ----------------------------------------------------

app.get('/api/settings', async (req, res) => {
  try {
    const settingsMap = await db.getSettings();
    if (settingsMap.MICROSOFT_CLIENT_SECRET) {
      settingsMap.MICROSOFT_CLIENT_SECRET = '••••••••••••••••';
    }
    res.json(settingsMap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  const { client_id, client_secret, redirect_uri, gemini_api_key } = req.body;

  try {
    if (client_id !== undefined) await db.saveSetting('MICROSOFT_CLIENT_ID', client_id);
    if (client_secret !== undefined && client_secret !== '••••••••••••••••') {
      await db.saveSetting('MICROSOFT_CLIENT_SECRET', client_secret);
    }
    if (redirect_uri !== undefined) await db.saveSetting('MICROSOFT_REDIRECT_URI', redirect_uri);
    if (gemini_api_key !== undefined) {
      await db.saveSetting('GEMINI_API_KEY', gemini_api_key);
      process.env.GEMINI_API_KEY = gemini_api_key; // Update in-memory
    }
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, 'public')));

app.get(/^(?!\/api).*$/, (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('AI Email Organizer API is running. (Please open the dashboard at http://localhost:5173 to test).');
  }
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`AI EMAIL AUTOMATION ENTERPRISE RUNNING ON PORT ${PORT}`);
  console.log(`==================================================`);
});
