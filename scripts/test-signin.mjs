import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, anon, { auth: { persistSession: false } });

async function run() {
  const email = 'admin@myimmo.cm';
  const password = '9gahPR8XOSmtVLi!Mm1';
  console.log('Attempting sign-in for', email);
  try {
    const res = await supabase.auth.signInWithPassword({ email, password });
    console.log('Sign-in response:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Sign-in failed:', err);
  }
}

run();
