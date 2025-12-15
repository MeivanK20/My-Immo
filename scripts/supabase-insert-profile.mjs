import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function run() {
  try {
    const ts = Date.now();
    const email = `profile+${ts}@example.com`;
    const full_name = `Profile Test ${ts}`;
    const phone = '+10000000000';
    const role = 'visitor';

    console.log('Inserting profile with email:', email);
    const { data, error } = await supabase.from('profiles').insert([{ full_name, email, phone, role }]).select().maybeSingle();
    if (error) {
      console.error('Insert failed:', error);
      process.exit(1);
    }

    console.log('Inserted profile:', data);
    // Keep inserted id for optional cleanup
    const createdId = data?.id;
    console.log(`Profile created with id: ${createdId}`);
    console.log('To delete this profile later, run `scripts/supabase-delete-profile.mjs <id>`');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
