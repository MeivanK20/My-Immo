interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_REDIRECT_URL?: string;
  // add other env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
