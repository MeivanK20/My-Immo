-- 004_add_username_to_profiles.sql
-- Add a username column to profiles and enforce uniqueness

alter table if exists public.profiles
  add column if not exists username text;

-- Add a unique index on lowercase username for case-insensitive uniqueness
create unique index if not exists profiles_username_idx on public.profiles (lower(username));

-- Optionally backfill username from email local-part for existing rows lacking a username
update public.profiles set username = split_part(email, '@', 1) where username is null and email is not null;
