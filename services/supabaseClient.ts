// Small helper that **enables Supabase only when env vars are present**.
// This keeps the project flexible: local fallbacks continue to work unless
// you set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your env.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL as string) || undefined;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || undefined;

export const isSupabaseEnabled = Boolean(url && key);

export const supabase: SupabaseClient | null = isSupabaseEnabled
	? createClient(url!, key!)
	: null;

export default supabase;

// To enable Supabase:
// 1) Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your `.env` or `.env.local`.
// 2) Restart the dev server. The client will be created automatically when both
//    variables are present.
