// Supabase removed: provide a minimal local fallback for authentication so the app can run
// without Supabase. This is a very small in-memory/localStorage-based auth shim for dev use.

import type { User } from '../types';
import { isSupabaseEnabled, supabase } from './supabaseClient';

type Role = 'visitor' | 'agent' | 'admin';

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function saveUser(u: any | null) {
  try { localStorage.setItem('myimmo_user', JSON.stringify(u)); } catch (e) {}
}

function loadUser(): any | null {
  try { const s = localStorage.getItem('myimmo_user'); return s ? JSON.parse(s) : null; } catch (e) { return null; }
}

const authService = {
  async fetchProfile(userId: string) {
    if (!isSupabaseEnabled || !supabase) return null;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async mergeUserWithProfile(user: any) {
    if (!user) return null;
    const profile = await this.fetchProfile(user.id).catch(() => null);
    const meta = (user && (user.user_metadata || {}));
    const merged: any = {
      id: user.id,
      email: user.email,
      fullName: meta.fullName || profile?.full_name || user.full_name || user.name || '',
      username: meta.username || profile?.username || undefined,
      role: profile?.role || meta.role || 'visitor',
      phone: profile?.phone || meta.phone || null,
      profilePhoto: profile?.avatar_url || meta.profilePhoto || undefined,
      createdAt: user?.created_at ? new Date(user.created_at) : (user?.createdAt || new Date()),
    };
    return merged as any;
  },
  async signUp(data: { fullName: string; email: string; password: string; role?: Role; phone?: string; username?: string }) {
    if (isSupabaseEnabled && supabase) {
      try {
        // forward metadata to Supabase user metadata (via options.data)
        const { data: res, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { fullName: data.fullName, role: data.role, phone: data.phone, username: data.username } },
        });
        if (error) throw error;
        const user = (res as any)?.user as User | null;
        // Ensure profile row is created/updated with username, role, phone, and full_name as well
        try {
          if (user) {
            const upsertPayload: any = { id: user.id };
            if (data.username) upsertPayload.username = data.username;
            if (data.role) upsertPayload.role = data.role;
            if (data.phone) upsertPayload.phone = data.phone;
            if (data.fullName) upsertPayload.full_name = data.fullName;
            await supabase.from('profiles').upsert([upsertPayload]);
          }
        } catch (e) {
          // swallow; signup should not fail due to profile upsert problems
          console.warn('Warning: could not upsert profile during signup', e);
        }
        return { user, requiresEmailConfirmation: !!(user && (user as any).confirmed_at === null) };
      } catch (err) {
        throw err;
      }
    }

    const user = {
      id: makeId(),
      email: data.email,
      fullName: data.fullName,
      role: data.role || 'visitor',
      phone: data.phone || null,
      username: data.username || undefined,
      createdAt: new Date(),
    } as User;
    saveUser(user);
    return { user, requiresEmailConfirmation: false };
  },

  async signIn(email: string, password: string) {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const userObj = (data as any)?.user;
        if (!userObj) return null;
        return await this.mergeUserWithProfile(userObj) as User;
      } catch (err: any) {
        // Map common Supabase auth errors to friendlier messages
        const code = err?.code || err?.error || null;
        const msg = (err && err.message) || String(err || '');

        if (code === 'email_not_confirmed' || msg.toLowerCase().includes('email_not_confirmed')) {
          throw new Error('Veuillez confirmer votre adresse e‑mail avant de vous connecter.');
        }
        if (code === 'invalid_login_credentials' || msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('invalid credentials') || msg.toLowerCase().includes('invalid password')) {
          throw new Error('Identifiants invalides');
        }
        if (err && err.status === 429) {
          throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
        }

        // Network or unknown errors: include original message for debugging
        console.error('Auth signIn error:', err);
        throw new Error(msg || 'Une erreur est survenue lors de la connexion');
      }
    }

    const u = loadUser();
    if (!u || u.email !== email) throw new Error('Invalid credentials');
    return u as User;
  },

  async signOut() { saveUser(null); },

  async signInWithProvider(provider: string, redirectTo?: string) {
    if (isSupabaseEnabled && supabase) {
      // start OAuth flow (this will redirect the browser)
      await supabase.auth.signInWithOAuth({ provider: provider as any, options: redirectTo ? { redirectTo } : undefined });
      return { user: null };
    }

    // Simulate provider sign-in by creating a user and, if redirectTo is provided, redirecting.
    const user = {
      id: makeId(),
      email: `${provider}_user@example.com`,
      fullName: `${provider} User`,
      role: 'visitor',
      createdAt: new Date(),
    } as User;
    saveUser(user);
    if (redirectTo && typeof window !== 'undefined') {
      // Do a hard redirect to mimic real OAuth flow
      window.location.href = redirectTo;
    }
    return { user };
  },

  async resendConfirmationEmail(email: string) {
    if (isSupabaseEnabled && supabase) {
      try {
        // Use magic link as a safe way to let users sign in / confirm email.
        const { data, error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        return { success: true, data };
      } catch (err: any) {
        // Map a couple of common Supabase errors to friendlier messages
        const code = err?.code || err?.error || null;
        if (code === 'email_address_invalid' || (err && err.message && err.message.toLowerCase().includes('email address invalid'))) {
          return { success: false, message: "Impossible d'envoyer le mail : adresse e‑mail invalide ou SMTP non configuré. Contactez l'administrateur." };
        }
        return { success: false, message: err?.message || String(err) };
      }
    }
    // Local fallback: pretend it worked
    return { success: true };
  },

  async getCurrentSession() {
    if (isSupabaseEnabled && supabase) {
      const { data } = await supabase.auth.getSession();
      const session = data?.session ?? null;
      return session;
    }
    const u = loadUser(); return u ? { user: u } : null;
  },

  async getCurrentUser() {
    if (isSupabaseEnabled && supabase) {
      const { data } = await supabase.auth.getUser();
      const userObj = (data as any)?.user ?? null;
      if (!userObj) return null;
      return await this.mergeUserWithProfile(userObj) as User;
    }
    return loadUser() as User | null;
  },

  async updateUserProfile(userId: string, updates: Record<string, any>) {
    if (isSupabaseEnabled && supabase) {
      // try to update 'profiles' table if present
      const { data, error } = await supabase.from('profiles').upsert([{ id: userId, ...updates }]).select();
      if (error) throw error;
      return (data as any)?.[0];
    }
    const u = loadUser(); if (!u || u.id !== userId) throw new Error('Not found');
    const updated = { ...u, ...updates };
    saveUser(updated);
    return updated;
  },

  async changePassword(_newPassword: string) { return true; },

  async deleteAccount(userId: string) {
    if (isSupabaseEnabled && supabase) {
      // supabase currently does not expose a direct user deletion via client (requires admin role)
      // Attempt to remove profile row for parity with local fallback
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      return true;
    }
    const u = loadUser(); if (u && u.id === userId) { saveUser(null); return true; } throw new Error('Not found');
  },

  onAuthStateChange(cb: (user: User | null) => void) {
    if (isSupabaseEnabled && supabase) {
      // @ts-ignore
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = (session as any)?.user ?? null;
        if (!u) return cb(null);
        // fetch profile and merge asynchronously, then call cb
        this.mergeUserWithProfile(u).then((merged) => cb(merged as User)).catch(() => cb(u as any));
      });
      return () => sub?.subscription?.unsubscribe?.();
    }

    // Very small subscription: call once with current user
    cb(loadUser() as User | null);
    return () => {};
  },

  async sendPasswordReset(email: string, redirectTo?: string) {
    if (isSupabaseEnabled && supabase) {
      // @ts-ignore
      const { data, error } = await (supabase.auth as any).resetPasswordForEmail?.(email, { redirectTo });
      if (error) throw error;
      return data;
    }
    return true;
  },
};

export default authService;
