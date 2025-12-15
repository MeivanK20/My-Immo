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
  const ts = Date.now();
  const candidates = [
    `test${ts}@example.com`,
    `tester${ts}@example.com`,
    `test.user${ts}@example.com`,
  ];
  const password = `TestPass!${Math.random().toString(36).slice(2, 8)}`;

  let lastErr = null;
  for (const testEmail of candidates) {
    console.log('Attempting to create test user', testEmail);
    const { data, error } = await supabase.auth.signUp({ email: testEmail, password });
    if (!error) {
      console.log('Sign-up response:', data);
      console.log('Note: anon key cannot delete users; this test user will remain in the project.');
      process.exit(0);
    }
    console.warn('Sign-up attempt failed for', testEmail, error.message ?? error);
    lastErr = error;
  }
  console.error('All sign-up attempts failed; last error:', lastErr);
  process.exit(1);

}

run();
