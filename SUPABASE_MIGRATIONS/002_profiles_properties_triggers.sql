-- 002_profiles_properties_triggers.sql
-- Enhance `profiles` and `properties` schema to match the app expectations,
-- and add triggers to keep `public.profiles` synchronized with `auth.users`.

-- 1) Ensure profiles table has expected columns
create table if not exists public.profiles (
  id uuid primary key,
  full_name text,
  email text unique,
  phone text,
  role text default 'visitor',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Enhance properties table to include fields used by the frontend
alter table if exists public.properties
  add column if not exists agent_id uuid references public.profiles(id) on delete set null,
  add column if not exists region text,
  add column if not exists city text,
  add column if not exists neighborhood text,
  add column if not exists property_type text,
  add column if not exists bedrooms int,
  add column if not exists bathrooms int,
  add column if not exists area numeric,
  add column if not exists images jsonb,
  add column if not exists updated_at timestamptz default now();

-- 3) Create index on properties.agent_id and created_at for queries
create index if not exists idx_properties_agent_id on public.properties (agent_id);
create index if not exists idx_properties_created_at on public.properties (created_at desc);

-- 4) Create trigger function to sync auth.users -> public.profiles
create or replace function public.sync_user_to_profile()
returns trigger language plpgsql security definer as $$
begin
  -- Insert or update the profile row using the auth user id
  insert into public.profiles (id, email, full_name, created_at)
  values (new.id, new.email, coalesce(new.user_metadata->>'full_name', new.raw_user_meta->>'full_name', null), now())
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();
  return new;
end;
$$;

-- 5) Create trigger for inserts and updates on auth.users
drop trigger if exists auth_user_sync on auth.users;
create trigger auth_user_sync
  after insert or update on auth.users
  for each row execute procedure public.sync_user_to_profile();

-- Notes:
-- - This migration makes `profiles.id` use the auth user id when users are created
--   (via the trigger). If you previously inserted profile rows with random UUIDs,
--   ensure you reconcile or remove duplicates as appropriate.
