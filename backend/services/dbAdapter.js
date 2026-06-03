import { dbRun, dbGet, dbAll } from '../database.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const db = {
  // 1. Employees (Workspace Accounts)
  async getEmployees() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .select('id, email, name, status, avatar');
      if (error) {
        console.error('Supabase getEmployees error:', error);
        throw error;
      }
      return data || [];
    } else {
      return await dbAll('SELECT id, email, name, status, avatar FROM employees');
    }
  },

  async getEmployeeByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (error) {
        console.error('Supabase getEmployeeByEmail error:', error);
        throw error;
      }
      return data;
    } else {
      return await dbGet('SELECT * FROM employees WHERE email = ?', [cleanEmail]);
    }
  },

  async createEmployee(email, name, password) {
    const cleanEmail = email.toLowerCase().trim();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .insert([{ email: cleanEmail, name: name || cleanEmail.split('@')[0], password: password || '', status: 'Pending', avatar: null }])
        .select()
        .single();
      if (error) {
        console.error('Supabase createEmployee error:', error);
        throw error;
      }
      return data;
    } else {
      await dbRun(`
        INSERT INTO employees (email, name, password, status, avatar)
        VALUES (?, ?, ?, 'Pending', null)
      `, [cleanEmail, name || cleanEmail.split('@')[0], password || '']);
      return await dbGet('SELECT id, email, name, status, avatar FROM employees WHERE email = ?', [cleanEmail]);
    }
  },

  async updateEmployeeTokens(email, name, accessToken, refreshToken, expiresAt) {
    const cleanEmail = email.toLowerCase().trim();
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('employees')
        .upsert({
          email: cleanEmail,
          name,
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: expiresAt,
          status: 'Connected'
        }, { onConflict: 'email' });
      if (error) {
        console.error('Supabase updateEmployeeTokens error:', error);
        throw error;
      }
    } else {
      await dbRun(`
        INSERT INTO employees (email, name, access_token, refresh_token, token_expires_at, status)
        VALUES (?, ?, ?, ?, ?, 'Connected')
        ON CONFLICT(email) DO UPDATE SET
          name = excluded.name,
          access_token = excluded.access_token,
          refresh_token = excluded.refresh_token,
          token_expires_at = excluded.token_expires_at,
          status = 'Connected'
      `, [cleanEmail, name, accessToken, refreshToken, expiresAt]);
    }
  },

  async updateEmployeeTokensById(id, accessToken, refreshToken, expiresAt) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('employees')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: expiresAt
        })
        .eq('id', id);
      if (error) {
        console.error('Supabase updateEmployeeTokensById error:', error);
        throw error;
      }
    } else {
      await dbRun(`
        UPDATE employees
        SET access_token = ?, refresh_token = ?, token_expires_at = ?
        WHERE id = ?
      `, [accessToken, refreshToken, expiresAt, id]);
    }
  },

  async setEmployeePending(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('employees')
        .update({ status: 'Pending' })
        .eq('id', id);
      if (error) {
        console.error('Supabase setEmployeePending error:', error);
        throw error;
      }
    } else {
      await dbRun("UPDATE employees SET status = 'Pending' WHERE id = ?", [id]);
    }
  },

  async updateEmployeeProfile(id, email, name, password, avatar) {
    const cleanEmail = email.toLowerCase().trim();
    if (isSupabaseConfigured) {
      const updates = { email: cleanEmail, name: name || cleanEmail.split('@')[0], avatar };
      if (password) updates.password = password;
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select('id, email, name, status, avatar')
        .single();
      if (error) {
        console.error('Supabase updateEmployeeProfile error:', error);
        throw error;
      }
      return data;
    } else {
      if (password) {
        await dbRun(`
          UPDATE employees
          SET email = ?, name = ?, password = ?, avatar = ?
          WHERE id = ?
        `, [cleanEmail, name || cleanEmail.split('@')[0], password, avatar, id]);
      } else {
        await dbRun(`
          UPDATE employees
          SET email = ?, name = ?, avatar = ?
          WHERE id = ?
        `, [cleanEmail, name || cleanEmail.split('@')[0], avatar, id]);
      }
      return await dbGet('SELECT id, email, name, status, avatar FROM employees WHERE id = ?', [id]);
    }
  },

  async deleteEmployee(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase deleteEmployee error:', error);
        throw error;
      }
    } else {
      await dbRun('DELETE FROM employees WHERE id = ?', [id]);
    }
  },

  async getActiveEmployees() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'Connected');
      if (error) {
        console.error('Supabase getActiveEmployees error:', error);
        throw error;
      }
      return data || [];
    } else {
      return await dbAll("SELECT * FROM employees WHERE status = 'Connected'");
    }
  },

  // 2. Emails (Sorting Logs)
  async getEmails(employeeEmail) {
    if (isSupabaseConfigured) {
      let query = supabase.from('emails').select('*');
      if (employeeEmail) {
        query = query.eq('employee_email', employeeEmail.toLowerCase().trim());
      }
      const { data, error } = await query.order('received_at', { ascending: false });
      if (error) {
        console.error('Supabase getEmails error:', error);
        throw error;
      }
      return data || [];
    } else {
      if (employeeEmail) {
        return await dbAll('SELECT * FROM emails WHERE employee_email = ? ORDER BY received_at DESC', [employeeEmail.toLowerCase().trim()]);
      } else {
        return await dbAll('SELECT * FROM emails ORDER BY received_at DESC');
      }
    }
  },

  async saveEmail(employeeEmail, senderEmail, senderName, subject, body, category, urgency, sentiment, summary, messageId = null) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('emails')
        .insert([{
          employee_email: employeeEmail,
          sender_email: senderEmail,
          sender_name: senderName,
          subject,
          body,
          category,
          urgency,
          sentiment,
          summary,
          message_id: messageId
        }])
        .select()
        .single();
      if (error) {
        console.error('Supabase saveEmail error:', error);
        throw error;
      }
      return data;
    } else {
      const result = await dbRun(`
        INSERT INTO emails (employee_email, sender_email, sender_name, subject, body, category, urgency, sentiment, summary, message_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [employeeEmail, senderEmail, senderName, subject, body, category, urgency, sentiment, summary, messageId]);
      return await dbGet('SELECT * FROM emails WHERE id = ?', [result.id]);
    }
  },

  async updateEmailCategory(id, category) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('emails')
        .update({ category })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Supabase updateEmailCategory error:', error);
        throw error;
      }
      return data;
    } else {
      await dbRun('UPDATE emails SET category = ? WHERE id = ?', [category, id]);
      return await dbGet('SELECT * FROM emails WHERE id = ?', [id]);
    }
  },

  async getEmailById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        console.error('Supabase getEmailById error:', error);
        throw error;
      }
      return data;
    } else {
      return await dbGet('SELECT * FROM emails WHERE id = ?', [id]);
    }
  },

  // 3. Rules (Folders)
  async getRules() {
    if (isSupabaseConfigured) {
      let { data, error } = await supabase.from('rules').select('*');
      if (error) {
        console.error('Supabase getRules error:', error);
        throw error;
      }
      
      const hasLegacySupport = data && data.some(r => r.category === 'Support' || r.category === 'Customer Support');
      if (hasLegacySupport) {
        // Wipe legacy rules from Supabase to load the new ones
        await supabase.from('rules').delete().gt('id', 0);
        data = [];
      }

      // Populate defaults if Supabase rules table is completely empty
      if (!data || data.length === 0) {
        const defaultRules = [
          {
            category: 'Personal & Family',
            prompt_instruction: 'ROUTING: Sort emails here that are from friends, family members, group chats, personal event invitations, and individual social correspondences. REPLY: Keep it warm, casual, and friendly. Answer directly and naturally.',
            auto_reply: 1
          },
          {
            category: 'Shopping & Orders',
            prompt_instruction: 'ROUTING: Sort online shopping confirmations, e-commerce receipts, order tracking updates, and delivery alerts here. REPLY: Keep it polite and informal. Confirm receipt if needed.',
            auto_reply: 1
          },
          {
            category: 'Finance & Bills',
            prompt_instruction: 'ROUTING: Sort bank statements, credit card bills, utility charges, payment alerts, and investment updates here. REPLY: Write a clear, brief, and structured response.',
            auto_reply: 1
          },
          {
            category: 'Travel & Plans',
            prompt_instruction: 'ROUTING: Sort flight tickets, hotel confirmations, rental car receipts, trip itineraries, and vacation plans here. REPLY: Keep it polite and helpful.',
            auto_reply: 1
          },
          {
            category: 'Newsletters & Feeds',
            prompt_instruction: 'ROUTING: Sort daily newsletters, blog subscriptions, marketing promotions, YouTube updates, and reading feeds here. REPLY: Do not reply. Keep auto-reply disabled for this folder.',
            auto_reply: 0
          },
          {
            category: 'General Inbox',
            prompt_instruction: 'ROUTING: Use this as the fallback category for general personal messages that do not belong to finance, shopping, or family. REPLY: Write a helpful, polite, and direct response.',
            auto_reply: 1
          }
        ];
        await supabase.from('rules').insert(defaultRules);
        return defaultRules;
      }
      return data;
    } else {
      return await dbAll('SELECT * FROM rules');
    }
  },

  async saveRule(category, promptInstruction, autoReply = 1) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('rules')
        .upsert({ category, prompt_instruction: promptInstruction, auto_reply: autoReply }, { onConflict: 'category' });
      if (error) {
        console.error('Supabase saveRule error:', error);
        throw error;
      }
    } else {
      const result = await dbRun('UPDATE rules SET prompt_instruction = ?, auto_reply = ? WHERE category = ?', [promptInstruction, autoReply, category]);
      if (result.changes === 0) {
        await dbRun('INSERT INTO rules (category, prompt_instruction, auto_reply) VALUES (?, ?, ?)', [category, promptInstruction, autoReply]);
      }
    }
  },

  async toggleRuleAutoReply(category, autoReply) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('rules')
        .update({ auto_reply: autoReply })
        .eq('category', category);
      if (error) {
        console.error('Supabase toggleRuleAutoReply error:', error);
        throw error;
      }
    } else {
      await dbRun('UPDATE rules SET auto_reply = ? WHERE category = ?', [autoReply, category]);
    }
  },

  async deleteRule(category) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('rules')
        .delete()
        .eq('category', category);
      if (error) {
        console.error('Supabase deleteRule error:', error);
        throw error;
      }
    } else {
      await dbRun('DELETE FROM rules WHERE category = ?', [category]);
    }
  },

  // 4. Settings
  async getSettings() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) {
        console.error('Supabase getSettings error:', error);
        throw error;
      }
      const settingsMap = {};
      (data || []).forEach(s => {
        settingsMap[s.key] = s.value;
      });
      return settingsMap;
    } else {
      const dbSettings = await dbAll('SELECT * FROM settings');
      const settingsMap = {};
      dbSettings.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      return settingsMap;
    }
  },

  async saveSetting(key, value) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value });
      if (error) {
        console.error('Supabase saveSetting error:', error);
        throw error;
      }
    } else {
      await dbRun("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
    }
  }
};

export default db;
