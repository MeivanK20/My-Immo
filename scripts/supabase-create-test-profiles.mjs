import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function createUserWithProfile({ email, password, full_name, role }) {
  const { data, error } = await supabase.auth.admin.createUser({ email, password, user_metadata: { full_name } });
  if (error) throw error;
  const user = (data && (data.user || data)) ?? null;
  // Ensure a profile row exists and set role/full_name
  const { data: profile, error: pErr } = await supabase.from('profiles').upsert([{ id: user.id, email, full_name, role }]).select().maybeSingle();
  if (pErr) throw pErr;
  return { user, profile };
}

async function run() {
  try {
    const ts = Date.now();
    const timestamp = Math.floor(ts / 1000);
    const items = [
      { key: 'admin', full_name: 'Admin Test', role: 'admin' },
      { key: 'agent', full_name: 'Agent Test', role: 'agent' },
      { key: 'visitor', full_name: 'Visiteur Test', role: 'visitor' }
    ];

    const created = [];

    for (const it of items) {
      const email = `test+${it.key}+${timestamp}@example.com`;
      const password = `Test!${Math.random().toString(36).slice(2, 8)}${timestamp.toString().slice(-4)}`;
      console.log(`Creating ${it.key} user with email: ${email}`);
      const { user, profile } = await createUserWithProfile({ email, password, full_name: it.full_name, role: it.role });
      console.log(`  -> user id: ${user.id}`);
      console.log(`  -> profile id: ${profile?.id}`);
      created.push({ key: it.key, email, userId: user.id, profileId: profile?.id });
    }

    console.log('\nCreated test profiles:');
    console.table(created);

    console.log('\nTo delete these profiles and users, run:');
    console.log('  node scripts/supabase-clean-test-profiles.mjs --prefix test+');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create test profiles:', err);
    process.exit(1);
  }
}

run();
