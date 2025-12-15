import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
// Accept either SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function run() {
  try {
    const ts = Date.now();
    const email = `admin-test+${ts}@example.com`;
    const password = `AdminTest!${Math.random().toString(36).slice(2, 8)}`;

    console.log('Creating admin user (via service role) with email:', email);
    const { data, error } = await supabase.auth.admin.createUser({ email, password, user_metadata: { full_name: 'Admin Test' } });
    if (error) {
      console.error('Admin createUser failed:', error);
      process.exit(1);
    }

    const user = (data && (data.user || data)) ?? null;
    console.log('Created user:', user?.id ?? user);

    // Clean up: delete the user we just created
    if (user && user.id) {
      console.log('Deleting user', user.id);
      const { error: delErr } = await supabase.auth.admin.deleteUser(user.id);
      if (delErr) {
        console.error('Failed to delete user:', delErr);
        process.exit(1);
      }
      console.log('User deleted successfully.');
    }

    console.log('Admin create/delete test completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
