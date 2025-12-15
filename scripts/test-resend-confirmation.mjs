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
  console.log('Sending magic link to', email);
  try {
    const res = await supabase.auth.signInWithOtp({ email });
    console.log('Response:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error sending:', err);
  }
}

run();
