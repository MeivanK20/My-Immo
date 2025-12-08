-- Create profiles table and trigger to sync auth.users -> public.profiles
-- Run this in Supabase SQL editor (or via psql / supabase CLI) for your project.

-- Table to store user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text,
  phone text,
  profile_photo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- Enable Row Level Security (recommended)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access for profiles (adjust as needed)
CREATE POLICY IF NOT EXISTS "Public read profiles" ON public.profiles
  FOR SELECT USING (true);

-- Allow users to insert their profile (auth.uid() must equal id)
CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Optional: allow authenticated users to read their own profile via SELECT (already public read above)
CREATE POLICY IF NOT EXISTS "Users can select their own profile" ON public.profiles
  FOR SELECT USING (true);

-- Function to create a profile when a new auth user is created
-- This trigger runs on insert into auth.users and inserts a row into public.profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- If a profile already exists, do nothing
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Try to extract sensible metadata fields from the user record
  INSERT INTO public.profiles (id, email, full_name, role, phone, profile_photo, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'fullName', NEW.raw_user_meta_data->>'full_name', NEW.user_metadata->>'fullName', NEW.user_metadata->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'role', NEW.user_metadata->>'role', 'visitor'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.user_metadata->>'phone'),
    COALESCE(NEW.raw_user_meta_data->>'profile_photo', NEW.user_metadata->>'profile_photo'),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users (fires when a new user is created by Supabase Auth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Notes:
-- 1) Run this in your Supabase project's SQL editor.
-- 2) Ensure your Supabase project's Authentication > Providers (Google) are configured with correct
--    Client ID / Client Secret and that Redirect URLs include your app (e.g. http://localhost:3000/).
-- 3) If you have stricter RLS needs, adjust policies accordingly. The trigger uses SECURITY DEFINER
--    so it will run with the function owner's privileges; if you encounter permission errors, you may
--    need to set the function owner or temporarily relax RLS while installing.
