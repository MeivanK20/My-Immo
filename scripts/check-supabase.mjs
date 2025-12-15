import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function run() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) {
      // If the project doesn't have the `profiles` table, that's OK — connection still works.
      console.warn('Query error (profiles):', error.message ?? error);
    } else {
      console.log('Supabase connected — sample profiles:', data);
    }

    // Try auth endpoints to validate the auth service is reachable
    try {
      const sessionResp = await supabase.auth.getSession();
      console.log('Auth session check result:', sessionResp?.data ?? null);
    } catch (e) {
      console.warn('Auth session check failed:', e?.message ?? e);
    }

    try {
      const userResp = await supabase.auth.getUser();
      console.log('Auth getUser result:', userResp?.data ?? null);
    } catch (e) {
      console.warn('Auth getUser failed:', e?.message ?? e);
    }

    console.log('Supabase connectivity check finished.');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

run();
