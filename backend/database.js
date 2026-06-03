import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_FILE || join(__dirname, 'database.sqlite');

// Ensure database file directory exists
const dbDir = dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
    initializeDatabase();
  }
});

export let dbResolve;
export const dbInitialized = new Promise((resolve) => {
  dbResolve = resolve;
});

// Helper function to run DB operations as promises
export const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

function initializeDatabase() {
  db.serialize(async () => {
    // 1. Create employees table for Microsoft OAuth tokens
    await dbRun(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password TEXT,
        access_token TEXT,
        refresh_token TEXT,
        token_expires_at INTEGER,
        status TEXT DEFAULT 'Pending'
      )
    `);

    // Schema migration for existing databases: add password column if missing
    try {
      await dbRun('ALTER TABLE employees ADD COLUMN password TEXT');
      console.log('Database Schema Updated: Added password column to employees table.');
    } catch (err) {
      // Column already exists, ignore error
    }

    // Schema migration for avatar column if missing
    try {
      await dbRun('ALTER TABLE employees ADD COLUMN avatar TEXT');
      console.log('Database Schema Updated: Added avatar column to employees table.');
    } catch (err) {
      // Column already exists, ignore error
    }

    // Schema migration for message_id column if missing
    try {
      await dbRun('ALTER TABLE emails ADD COLUMN message_id TEXT');
      console.log('Database Schema Updated: Added message_id column to emails table.');
    } catch (err) {
      // Column already exists, ignore error
    }

    // Schema migration for auto_reply column if missing
    try {
      await dbRun('ALTER TABLE rules ADD COLUMN auto_reply INTEGER DEFAULT 1');
      console.log('Database Schema Updated: Added auto_reply column to rules table.');
    } catch (err) {
      // Column already exists, ignore error
    }

    // 2. Create emails table to log sorted items
    await dbRun(`
      CREATE TABLE IF NOT EXISTS emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_email TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        sender_name TEXT,
        subject TEXT,
        body TEXT,
        received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        category TEXT DEFAULT 'General',
        urgency TEXT DEFAULT 'Medium',
        sentiment TEXT DEFAULT 'Neutral',
        summary TEXT
      )
    `);

    // 3. Create rules table (folders & prompts)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT UNIQUE NOT NULL,
        prompt_instruction TEXT NOT NULL
      )
    `);

    // 4. Create settings table for Azure App Registration
    await dbRun(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // 5. Create leads table to log CRM leads extracted
    await dbRun(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_email TEXT NOT NULL,
        name TEXT,
        email TEXT,
        phone TEXT,
        company TEXT,
        service_requested TEXT,
        lead_score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Create tasks table to log extracted checklist items
    await dbRun(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_email TEXT NOT NULL,
        description TEXT NOT NULL,
        due_date TEXT,
        status TEXT DEFAULT 'Pending',
        source_email_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clear legacy rules so we can repopulate with the new personal default categories
    const hasLegacySupport = await dbGet("SELECT COUNT(*) as count FROM rules WHERE category = 'Support' OR category = 'Customer Support'");
    if (hasLegacySupport.count > 0) {
      await dbRun('DELETE FROM rules');
      console.log('Legacy corporate rules wiped to load personal default categories.');
    }

    const rulesCount = await dbGet('SELECT COUNT(*) as count FROM rules');
    if (rulesCount.count === 0) {
      const defaultRules = [
        {
          category: 'Personal & Family',
          instruction: 'ROUTING: Sort emails here that are from friends, family members, group chats, personal event invitations, and individual social correspondences. REPLY: Keep it warm, casual, and friendly. Answer directly and naturally.'
        },
        {
          category: 'Shopping & Orders',
          instruction: 'ROUTING: Sort online shopping confirmations, e-commerce receipts, order tracking updates, and delivery alerts here. REPLY: Keep it polite and informal. Confirm receipt if needed.'
        },
        {
          category: 'Finance & Bills',
          instruction: 'ROUTING: Sort bank statements, credit card bills, utility charges, payment alerts, and investment updates here. REPLY: Write a clear, brief, and structured response.'
        },
        {
          category: 'Travel & Plans',
          instruction: 'ROUTING: Sort flight tickets, hotel confirmations, rental car receipts, trip itineraries, and vacation plans here. REPLY: Keep it polite and helpful.'
        },
        {
          category: 'Newsletters & Feeds',
          instruction: 'ROUTING: Sort daily newsletters, blog subscriptions, marketing promotions, YouTube updates, and reading feeds here. REPLY: Do not reply. Keep auto-reply disabled for this folder.'
        },
        {
          category: 'General Inbox',
          instruction: 'ROUTING: Use this as the fallback category for general personal messages that do not belong to finance, shopping, or family. REPLY: Write a helpful, polite, and direct response.'
        }
      ];

      for (const rule of defaultRules) {
        await dbRun(
          `INSERT OR IGNORE INTO rules (category, prompt_instruction, auto_reply) VALUES (?, ?, ?)`,
          [rule.category, rule.instruction, rule.category === 'Newsletters & Feeds' ? 0 : 1]
        );
      }
    }

    console.log('Database tables and default settings initialized successfully.');
    if (dbResolve) dbResolve();
  });
}

export default db;
