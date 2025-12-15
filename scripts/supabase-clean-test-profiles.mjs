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

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--prefix' && args[i + 1]) {
      out.prefix = args[++i];
    } else if (a === '--emails' && args[i + 1]) {
      out.emails = args[++i].split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return out;
}

async function run() {
  try {
    const { prefix, emails } = parseArgs();
    let targets = [];

    if (emails && emails.length) {
      // fetch users by email list
      for (const email of emails) {
        const { data } = await supabase.from('auth.users').select('id,email').eq('email', email).maybeSingle();
        if (data && data.id) targets.push(data);
      }
    } else if (prefix) {
      // fetch any auth users whose email starts with the prefix
      const pattern = `${prefix}%`;
      const { data } = await supabase.from('auth.users').select('id,email').ilike('email', pattern);
      targets = data || [];
    } else {
      console.error('Usage: node scripts/supabase-clean-test-profiles.mjs --prefix <prefix>  OR  --emails a@b.com,b@c.com');
      process.exit(1);
    }

    if (!targets.length) {
      console.log('No matching users found.');
      process.exit(0);
    }

    console.log('Found users to delete:');
    console.table(targets.map(t => ({ id: t.id, email: t.email })));

    for (const t of targets) {
      console.log('Deleting auth user', t.id);
      const { error: delErr } = await supabase.auth.admin.deleteUser(t.id);
      if (delErr) console.error('Failed to delete user', t.id, delErr);
      else console.log('Deleted user', t.id);

      // also delete any profile rows with matching email
      console.log('Deleting profiles with email =', t.email);
      const { error: pErr } = await supabase.from('profiles').delete().eq('email', t.email);
      if (pErr) console.error('Failed to delete profile for', t.email, pErr);
      else console.log('Deleted profile for', t.email);
    }

    console.log('Cleanup completed.');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
