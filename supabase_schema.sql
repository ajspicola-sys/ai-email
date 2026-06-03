-- Supabase Database Schema for Email AI Automation Enterprise
-- Copy and run this script in your Supabase SQL Editor.

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at BIGINT,
  status TEXT DEFAULT 'Pending',
  avatar TEXT
);

-- 2. Emails Table
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  employee_email TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  subject TEXT,
  body TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  category TEXT DEFAULT 'General',
  urgency TEXT DEFAULT 'Medium',
  sentiment TEXT DEFAULT 'Neutral',
  summary TEXT,
  message_id TEXT
);

-- 3. Rules Table
CREATE TABLE IF NOT EXISTS rules (
  id SERIAL PRIMARY KEY,
  category TEXT UNIQUE NOT NULL,
  prompt_instruction TEXT NOT NULL,
  auto_reply INTEGER DEFAULT 1
);

-- 4. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 5. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  employee_email TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  service_requested TEXT,
  lead_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  employee_email TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT,
  status TEXT DEFAULT 'Pending',
  source_email_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Disable Row Level Security (RLS)
-- Run these to allow the app to query and write to Supabase using the anon key.
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
