import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error('Missing VITE_SUPABASE_URL in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey || process.env.VITE_SUPABASE_ANON_KEY || '', { auth: { persistSession: false } });

async function run() {
  try {
    console.log('Seeding sample regions/cities/neighborhoods (idempotent)');
    const sql = `
-- Regions
insert into public.regions (name, slug, description)
values ('Littoral','littoral','Région côtière contenant Douala') on conflict (lower(name)) do nothing;
insert into public.regions (name, slug, description)
values ('Centre','centre','Région contenant Yaoundé') on conflict (lower(name)) do nothing;

-- Cities
insert into public.cities (region_id, name, slug)
select r.id, 'Douala','douala' from public.regions r where lower(r.name) = 'littoral' on conflict (region_id, lower(name)) do nothing;
insert into public.cities (region_id, name, slug)
select r.id, 'Yaoundé','yaounde' from public.regions r where lower(r.name) = 'centre' on conflict (region_id, lower(name)) do nothing;

-- Neighborhoods
insert into public.neighborhoods (city_id, name, slug)
select c.id, 'Akwa','akwa' from public.cities c where lower(c.name) = 'douala' on conflict (city_id, lower(name)) do nothing;
insert into public.neighborhoods (city_id, name, slug)
select c.id, 'Bastos','bastos' from public.cities c where lower(c.name) = 'yaounde' on conflict (city_id, lower(name)) do nothing;
`;

    const { data, error } = await supabase.rpc('sql', { q: sql }).catch(() => ({ data: null, error: null }));
    // The above uses RPC wrapper for simple execution; some projects disallow it — fallback to POST via /rest if needed
    if (error) {
      console.warn('RPC method returned error or is not allowed; trying POST to /rest/v1');
      const res = await supabase.post('/rest/v1', { q: sql });
      console.log('Raw response:', res);
    } else {
      console.log('Seed executed (RPC returned):', data);
    }

    console.log('Seed step complete. If RPC failed, run `SUPABASE SQL editor` with the SQL listed in this script.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
