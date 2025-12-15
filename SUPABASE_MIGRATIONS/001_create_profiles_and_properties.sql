-- 001_create_profiles_and_properties.sql
-- Minimal migration to create `profiles` and `properties` tables for the app.
-- Run this in Supabase SQL editor (https://app.supabase.com) as a project SQL migration.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique,
  phone text,
  role text default 'visitor',
  created_at timestamptz default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text,
  description text,
  price numeric,
  created_at timestamptz default now()
);

-- Optional: insert a small seed record for manual testing
insert into public.profiles (full_name, email, phone) values
('Seed Agent', 'seed+agent@example.com', '+000000000')
on conflict (email) do nothing;

insert into public.properties (owner_id, title, description, price)
select p.id, 'Seeding Property', 'A seeded listing for testing', 123456
from public.profiles p where p.email = 'seed+agent@example.com'
on conflict do nothing;

-- Optional locality tables
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text unique,
  created_at timestamptz default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references public.regions(id) on delete cascade,
  name text,
  created_at timestamptz default now()
);

create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references public.cities(id) on delete cascade,
  name text,
  created_at timestamptz default now()
);
