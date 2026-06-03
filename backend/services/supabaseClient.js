import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseConfigured) {
  console.log('==================================================');
  console.log('SUPABASE CLOUD DATABASE CONNECTED AND ACTIVE');
  console.log('==================================================');
} else {
  console.log('==================================================');
  console.log('NO SUPABASE KEYS SET. INBOXSENTRY RUNNING ON LOCAL SQLite.');
  console.log('==================================================');
}

export default supabase;
