import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

// Export a `supabase` client or `null` when not configured to keep safe fallback behavior
export const supabase = isSupabaseEnabled
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : (null as any);

export default supabase;

// Debug helper: in development, provide clear console warnings when Supabase isn't configured
try {
  const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (isDev) {
    if (!isSupabaseEnabled) {
      // Avoid printing keys; just indicate presence/absence
      // eslint-disable-next-line no-console
      console.warn(
        '[supabaseClient] Supabase not configured. VITE_SUPABASE_URL present?',
        Boolean(supabaseUrl),
        'VITE_SUPABASE_ANON_KEY present?',
        Boolean(supabaseAnonKey)
      );
    } else {
      // eslint-disable-next-line no-console
      console.debug('[supabaseClient] Supabase configured (URL and anon key present).');
    }
    if (!import.meta.env.VITE_SUPABASE_REDIRECT_URL) {
      // eslint-disable-next-line no-console
      console.info('[supabaseClient] VITE_SUPABASE_REDIRECT_URL is not set. OAuth redirect may be undefined.');
    }
  }
} catch (e) {
  // ignore any runtime errors in this debug block
}
