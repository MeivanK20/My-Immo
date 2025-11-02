
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qxjrylsttlwythcczxwp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4anJ5bHN0dGx3eXRoY2N6eHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODg0MTAsImV4cCI6MjA3NzY2NDQxMH0.uEOGHdY5Ml1-wwNJflw_bHK9BYbeIJP2W4Oy0WNaWNk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL and Anon Key are required. Check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
