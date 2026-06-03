import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const openApiKey = process.env.OPENAI_API_KEY;

if (openApiKey) {
  console.log('OpenAI API support active (GPT-4o-mini).');
}

let genAI = null;
if (apiKey && typeof apiKey === 'string' && (apiKey.startsWith('AIza') || apiKey.startsWith('AQ.'))) {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('Gemini API initialized successfully.');
} else {
  if (apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not a valid Google AI Studio key (typically starts with 'AIza' or 'AQ.'). InboxSentry is running in premium SIMULATOR mode for seamless local testing.");
  } else if (!openApiKey) {
    console.warn("WARNING: Neither GEMINI_API_KEY nor OPENAI_API_KEY is defined in the environment. InboxSentry is running in premium SIMULATOR mode.");
  }
}

/**
 * Analyzes an incoming email for Category (Folder), Urgency, and Sentiment.
 * @param {string} subject 
 * @param {string} body 
 * @param {string[]} folders - Dynamic list of folder categories defined by the user
 * @returns {Promise<{category: string, urgency: string, sentiment: string, summary: string}>}
 */
export async function analyzeEmail(subject, body, folders = ['Support', 'Sales', 'Billing', 'General']) {
  const openApiKey = process.env.OPENAI_API_KEY;
  if (openApiKey) {
    try {
      const categoryDescriptions = folders.map(f => {
        const name = typeof f === 'string' ? f : f.category;
        const instruction = typeof f === 'string' ? 'No custom guidelines provided.' : (f.prompt_instruction || 'No custom guidelines provided.');
        return `- "${name}": Guidelines/Rules: ${instruction}`;
      }).join('\n');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI assistant that organizes business emails into folders. Respond ONLY with a JSON object.'
            },
            {
              role: 'user',
              content: `
                Analyze the following email and choose exactly one folder category from the dynamic list below.
                Choose the category whose description and guidelines match the email content best. If it doesn't clearly fit any specific folder, choose "General Inbox" or the fallback category.

                Available Folder Categories and Guidelines:
                ${categoryDescriptions}

                Response JSON Schema:
                {
                  "category": "string", (Choose exactly one category name from the list above)
                  "urgency": "string", (Choose exactly one from ["High", "Medium", "Low"])
                  "sentiment": "string", (Choose exactly one from ["Positive", "Neutral", "Negative"])
                  "summary": "string" (A very brief 1-sentence summary of what the sender wants)
                }

                Here is the email to analyze:
                Subject: ${subject}
                Body: ${body}
              `
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || response.statusText);
      }
      return JSON.parse(data.choices[0].message.content);
    } catch (err) {
      console.error('Error with OpenAI analyzeEmail API:', err.message);
    }
  }

  if (!genAI) {
    // Return high-quality simulated metadata if API key is not present
    return simulateAnalysis(subject, body, folders);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const categoryDescriptions = folders.map(f => {
      const name = typeof f === 'string' ? f : f.category;
      const instruction = typeof f === 'string' ? 'No custom guidelines provided.' : (f.prompt_instruction || 'No custom guidelines provided.');
      return `- "${name}": Guidelines/Rules: ${instruction}`;
    }).join('\n');

    const prompt = `
      You are an expert AI assistant that organizes business emails into folders.
      Analyze the following email and choose exactly one folder category from the dynamic list below.
      Choose the category whose description and guidelines match the email content best. If it doesn't clearly fit any specific folder, choose "General".

      Available Folder Categories and Guidelines:
      ${categoryDescriptions}

      Response JSON Schema:
      {
        "category": "string", (Choose exactly one category name from the list above. Choose "General" if it doesn't match any specific category guidelines)
        "urgency": "string", (Choose exactly one from ["High", "Medium", "Low"])
        "sentiment": "string", (Choose exactly one from ["Positive", "Neutral", "Negative"])
        "summary": "string" (A very brief 1-sentence summary of what the sender wants)
      }

      Here is the email to analyze:
      Subject: ${subject}
      Body: ${body}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error with Gemini analyzeEmail API:', error);
    return simulateAnalysis(subject, body, folders);
  }
}

/**
 * Generates an automated draft reply to an email based on rules and desired tone.
 * @param {string} originalSender 
 * @param {string} originalSubject 
 * @param {string} originalBody 
 * @param {string} categoryInstruction 
 * @param {string} tone 
 * @returns {Promise<string>}
 */
export async function generateDraft(originalSender, originalSubject, originalBody, categoryInstruction, tone = 'Professional') {
  const openApiKey = process.env.OPENAI_API_KEY;
  if (openApiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `
                You are an automated AI email responder for our company. 
                Your task is to draft a polite, highly effective response to the customer's email.
                
                Here are the guidelines you MUST follow:
                - Category-specific instructions: ${categoryInstruction}
                - Tone to use: ${tone} (e.g. Professional, Friendly, or Direct)
                - Keep it relatively concise, well-formatted with paragraph breaks, and free of placeholders like "[My Name]". Sign off as "The Customer Operations Team".
                
                Here is the email details to respond to:
                Sender: ${originalSender}
                Subject: ${originalSubject}
                Body: ${originalBody}
                
                Write ONLY the response body. Do not include subject lines or header details.
              `
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || response.statusText);
      }
      return data.choices[0].message.content.trim();
    } catch (err) {
      console.error('Error with OpenAI generateDraft API:', err.message);
    }
  }

  if (!genAI) {
    return simulateDraft(originalSender, originalSubject, originalBody, tone);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

    const systemPrompt = `
      You are an automated AI email responder for our company. 
      Your task is to draft a polite, highly effective response to the customer's email.
      
      Here are the guidelines you MUST follow:
      - Category-specific instructions: ${categoryInstruction}
      - Tone to use: ${tone} (e.g. Professional, Friendly, or Direct)
      - Keep it relatively concise, well-formatted with paragraph breaks, and free of placeholders like "[My Name]". Sign off as "The Customer Operations Team".
      
      Here is the email details to respond to:
      Sender: ${originalSender}
      Subject: ${originalSubject}
      Body: ${originalBody}
      
      Write ONLY the response body. Do not include subject lines or header details.
    `;

    const result = await model.generateContent(systemPrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Error with Gemini generateDraft API:', error);
    return simulateDraft(originalSender, originalSubject, originalBody, tone);
  }
}

// Fallback simulator functions for zero-config testing
function simulateAnalysis(subject, body, folders = ['Support', 'Sales', 'Billing', 'General']) {
  // Strip HTML tags and links to match pure visible text keywords
  const plainText = (subject + ' ' + body)
    .replace(/<[^>]*>/g, ' ') 
    .replace(/https?:\/\/\S+/g, ' ')
    .toLowerCase();
  
  const folderNames = folders.map(f => typeof f === 'string' ? f : f.category);
  
  let category = folderNames.includes('General') ? 'General' : (folderNames[0] || 'General');
  let urgency = 'Medium';
  let sentiment = 'Neutral';
  let summary = 'A message requiring triage and sorting.';

  // Attempt dynamic keyword matching against folder names & guideline keywords in text
  for (const f of folders) {
    const name = typeof f === 'string' ? f : f.category;
    const instruction = typeof f === 'string' ? '' : (f.prompt_instruction || '').toLowerCase();
    
    // Check if email text contains folder name
    if (plainText.includes(name.toLowerCase())) {
      category = name;
      break;
    }
    
    if (instruction) {
      // Simple word match fallback
      const keywords = ['refund', 'charge', 'invoice', 'bug', 'broken', 'error', 'sales', 'buy', 'demo', 'pricing'];
      for (const keyword of keywords) {
        if (instruction.includes(keyword) && plainText.includes(keyword)) {
          category = name;
          break;
        }
      }
    }
  }

  // Fallbacks for standard scenarios if no direct keyword hits
  if (category === 'General' || !folderNames.includes(category)) {
    if ((plainText.includes('refund') || plainText.includes('charge') || plainText.includes('invoice')) && folderNames.includes('Billing')) {
      category = 'Billing';
    } else if ((plainText.includes('broken') || plainText.includes('bug') || plainText.includes('error') || plainText.includes('not working')) && folderNames.includes('Support')) {
      category = 'Support';
    } else if ((plainText.includes('buy') || plainText.includes('demo') || plainText.includes('interested')) && folderNames.includes('Sales')) {
      category = 'Sales';
    }
  }

  // Urgency & Sentiment rules
  if (plainText.includes('urgent') || plainText.includes('critical') || plainText.includes('broken') || plainText.includes('double charge') || plainText.includes('crash')) {
    urgency = 'High';
  }
  if (plainText.includes('wrong') || plainText.includes('angry') || plainText.includes('frustrated') || plainText.includes('fail') || plainText.includes('crashes')) {
    sentiment = 'Negative';
  } else if (plainText.includes('love') || plainText.includes('thanks') || plainText.includes('interested')) {
    sentiment = 'Positive';
  }

  return { category, urgency, sentiment, summary };
}

function simulateDraft(sender, subject, body, tone) {
  const lowercaseBody = body.toLowerCase();
  let name = sender.split('@')[0];
  name = name.charAt(0).toUpperCase() + name.slice(1);

  let response = '';

  if (lowercaseBody.includes('refund') || lowercaseBody.includes('charge') || lowercaseBody.includes('billing')) {
    if (tone === 'Friendly') {
      response = `Hi ${name}!\n\nThanks for reaching out! I completely understand wanting to get this billing sorted out, and I'd be happy to help. \n\nI have pulled up your account details and sent this straight to our billing specialists to review the charge. We will make sure this gets resolved for you right away. \n\nHave an awesome day, and please let me know if you need anything else!\n\nBest, \nThe Customer Operations Team`;
    } else if (tone === 'Direct') {
      response = `Hello ${name},\n\nWe have received your billing query. \n\nYour account has been flagged for billing review, and a specialist will inspect the charges and process any necessary adjustments within 1 business day.\n\nRegards,\nThe Customer Operations Team`;
    } else {
      response = `Dear ${name},\n\nThank you for contacting us regarding your billing inquiry. \n\nI have logged this request and forwarded your invoice details to our finance department for immediate review. We aim to investigate all billing discrepancies and process adjustments within 24 hours. \n\nWe appreciate your patience. Please let us know if we can assist you with anything further.\n\nSincerely,\nThe Customer Operations Team`;
    }
  } else if (lowercaseBody.includes('broken') || lowercaseBody.includes('bug') || lowercaseBody.includes('not working')) {
    if (tone === 'Friendly') {
      response = `Hi ${name}!\n\nOh no, I'm so sorry you ran into this glitch! That's definitely not the experience we want you to have.\n\nCould you do me a quick favor and let me know if this happens on mobile or desktop? In the meantime, I've escalated this bug report directly to our engineering squad so they can squash it.\n\nThanks for your patience, we'll get this running smoothly in no time!\n\nWarmly,\nThe Customer Operations Team`;
    } else if (tone === 'Direct') {
      response = `Hello ${name},\n\nThank you for reporting this technical issue. \n\nOur engineering team has been notified. To help us resolve this faster, please reply with your operating system, browser version, and any error logs if available.\n\nWe will update you as soon as a fix is deployed.\n\nRegards,\nThe Customer Operations Team`;
    } else {
      response = `Dear ${name},\n\nThank you for reaching out to report this technical issue. We sincerely apologize for the inconvenience this has caused.\n\nI have created a support ticket and escalated this matter to our engineering team for investigation. We are currently working to replicate the issue and deploy a patch. \n\nWe will keep you informed of our progress. If you have any additional details to provide, please reply directly to this thread.\n\nSincerely,\nThe Customer Operations Team`;
    }
  } else {
    // General
    if (tone === 'Friendly') {
      response = `Hi ${name}!\n\nThanks so much for reaching out to us. \n\nI just wanted to drop a quick line to let you know we've received your email and are looking into your questions right now. We'll get back to you with a full answer super soon!\n\nHope you have a fantastic day!\n\nWarmly,\nThe Customer Operations Team`;
    } else if (tone === 'Direct') {
      response = `Hello ${name},\n\nThank you for your message. \n\nWe have received your email and our team is currently reviewing your inquiry. We will provide a detailed response shortly.\n\nRegards,\nThe Customer Operations Team`;
    } else {
      response = `Dear ${name},\n\nThank you for contacting our customer operations team. \n\nWe have successfully received your inquiry. Our team is currently reviewing the details of your request to ensure we provide you with the most accurate and helpful response possible. You can expect a follow-up from us shortly.\n\nThank you for your time and cooperation.\n\nSincerely,\nThe Customer Operations Team`;
    }
  }

  return response;
}
