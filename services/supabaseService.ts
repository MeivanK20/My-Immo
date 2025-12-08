import supabase, { isSupabaseEnabled } from './supabaseClient';

type SignUpPayload = {
  email: string;
  password: string;
  fullName?: string;
  role?: string;
  phone?: string;
};

export const signUp = async (payload: SignUpPayload) => {
  if (!isSupabaseEnabled || !supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    // Try v2-style signUp first
    // @ts-ignore
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: { data: { fullName: payload.fullName, role: payload.role, phone: payload.phone } },
    });

    if (error) return { error };

    // Insert a profile row if a "profiles" table exists
    try {
      const profile = {
        id: data?.user?.id ?? undefined,
        email: payload.email,
        full_name: payload.fullName ?? null,
        role: payload.role ?? 'visitor',
        phone: payload.phone ?? null,
        created_at: new Date().toISOString(),
      };

      // @ts-ignore
      await supabase.from('profiles').upsert(profile);
    } catch (err) {
      // Non-fatal: table may not exist yet
      console.warn('Could not upsert profile (table missing?):', err);
    }

    return { data };
  } catch (err: any) {
    return { error: err };
  }
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseEnabled || !supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    // v2 sign in
    // @ts-ignore
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };

    // Fetch profile if table exists
    try {
      // @ts-ignore
      const { data: profile } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
      return { data: { auth: data, profile } };
    } catch (err) {
      return { data };
    }
  } catch (err: any) {
    return { error: err };
  }
};

export const sendPasswordReset = async (email: string, redirectTo?: string) => {
  if (!isSupabaseEnabled || !supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    // Try common v2 method if available, otherwise try legacy API
    // @ts-ignore
    if (typeof supabase.auth.resetPasswordForEmail === 'function') {
      // @ts-ignore
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) return { error };
      return { data };
    }

    // v2 alternative: auth.api.resetPasswordForEmail may exist in certain versions
    // @ts-ignore
    if (supabase.auth.api && typeof supabase.auth.api.resetPasswordForEmail === 'function') {
      // @ts-ignore
      const { data, error } = await supabase.auth.api.resetPasswordForEmail(email, { redirectTo });
      if (error) return { error };
      return { data };
    }

    // As a safe fallback, use the generic `auth.resetPasswordForEmail` if present
    // @ts-ignore
    if (supabase.auth && typeof supabase.auth.resetPasswordForEmail === 'function') {
      // @ts-ignore
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) return { error };
      return { data };
    }

    return { error: new Error('Password reset API not available in this Supabase client version') };
  } catch (err: any) {
    return { error: err };
  }
};

export const getProfileByEmail = async (email: string) => {
  if (!isSupabaseEnabled || !supabase) return { error: new Error('Supabase not configured') };
  try {
    // @ts-ignore
    const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
    return { data, error };
  } catch (err: any) {
    return { error: err };
  }
};

export const upsertProfile = async (profile: Record<string, any>) => {
  if (!isSupabaseEnabled || !supabase) return { error: new Error('Supabase not configured') };
  try {
    // @ts-ignore
    const { data, error } = await supabase.from('profiles').upsert(profile).select();
    return { data, error };
  } catch (err: any) {
    return { error: err };
  }
};

export default {
  signUp,
  signIn,
  sendPasswordReset,
  getProfileByEmail,
  upsertProfile,
};
