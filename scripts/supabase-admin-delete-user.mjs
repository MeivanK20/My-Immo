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

async function run() {
  try {
    const id = process.argv[2];
    if (!id) {
      console.error('Usage: node scripts/supabase-admin-delete-user.mjs <user-id>');
      process.exit(1);
    }
    console.log('Deleting user', id);
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
      console.error('Delete failed:', error);
      process.exit(1);
    }
    console.log('User deleted successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
