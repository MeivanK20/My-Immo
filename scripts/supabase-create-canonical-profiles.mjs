import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

function generatePassword() {
  // Strong password: 16 chars, mixed
  return crypto.randomBytes(12).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16) + '!Mm1';
}

async function ensureUser(email, password, full_name, role) {
  console.log('Creating user:', email);
  const { data, error } = await supabase.auth.admin.createUser({ email, password, user_metadata: { full_name } });
  if (error) throw error;
  const user = (data && (data.user || data)) ?? null;

  const { data: profile, error: pErr } = await supabase.from('profiles').upsert([{ id: user.id, email, full_name, role }]).select().maybeSingle();
  if (pErr) throw pErr;
  return { user, profile };
}

async function run() {
  try {
    const emails = [
      { email: 'admin@myimmo.cm', full_name: 'Admin', role: 'admin' },
      { email: 'agent@myimmo.cm', full_name: 'Agent', role: 'agent' },
      { email: 'visitor@myimmo.cm', full_name: 'Visitor', role: 'visitor' }
    ];

    const created = [];
    for (const e of emails) {
      const password = generatePassword();
      const { user, profile } = await ensureUser(e.email, password, e.full_name, e.role);
      created.push({ email: e.email, password, userId: user.id, profileId: profile?.id });
      console.log(`  -> created ${e.email} (user id: ${user.id})`);
    }

    console.log('\nCREATED ACCOUNTS:');
    console.table(created.map(c => ({ email: c.email, password: c.password, userId: c.userId, profileId: c.profileId }))); // password purposefully included for immediate use

    console.log('\nIMPORTANT: Store these credentials securely.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create canonical profiles:', err);
    process.exit(1);
  }
}

run();
