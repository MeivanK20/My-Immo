import supabase, { isSupabaseEnabled } from './supabaseClient';
import type { User } from '../types';

type Role = 'visitor' | 'agent' | 'admin';

const toUser = async (supabaseUser: any): Promise<User | null> => {
  if (!supabaseUser) return null;
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', supabaseUser.id).maybeSingle();
    if (error) {
      console.warn('Could not fetch profile:', error);
      return {
        id: supabaseUser.id,
        email: supabaseUser.email,
        fullName: (supabaseUser.user_metadata && supabaseUser.user_metadata.fullName) || supabaseUser.email.split('@')[0],
        role: (supabaseUser.user_metadata && supabaseUser.user_metadata.role) || 'visitor',
        phone: (supabaseUser.user_metadata && supabaseUser.user_metadata.phone) || null,
        profilePhoto: null,
        createdAt: new Date(),
      } as User;
    }

    const profile = data || {};
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      fullName: profile.full_name || (supabaseUser.user_metadata && supabaseUser.user_metadata.fullName) || supabaseUser.email.split('@')[0],
      role: (profile.role as Role) || (supabaseUser.user_metadata && supabaseUser.user_metadata.role) || 'visitor',
      phone: profile.phone || (supabaseUser.user_metadata && supabaseUser.user_metadata.phone) || null,
      profilePhoto: profile.profile_photo || null,
      createdAt: new Date(profile.created_at || new Date().toISOString()),
    } as User;
  } catch (err) {
    console.error('toUser error', err);
    return null;
  }
};

const authService = {
  async signUp(data: { fullName: string; email: string; password: string; role?: Role; phone?: string }) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase not configured');
    try {
      // @ts-ignore
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { fullName: data.fullName, role: data.role || 'visitor', phone: data.phone } },
      });
      if (error) throw error;

      // If Supabase returned a user object, try to upsert a profile for it.
      if (signUpData.user?.id) {
        try {
          await supabase.from('profiles').upsert({
            id: signUpData.user.id,
            email: data.email,
            full_name: data.fullName,
            role: data.role || 'visitor',
            phone: data.phone || null,
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Profile upsert failed', e);
        }
      }

      // Determine whether email confirmation is required. If supabase did not return a user
      // object directly, consider the account pending confirmation.
      const requiresEmailConfirmation = !signUpData.user;

      const user = await authService.getCurrentUser();
      return { user, requiresEmailConfirmation };
    } catch (err) {
      console.error('Sign up error:', err);
      throw err;
    }
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase not configured');
    try {
      // @ts-ignore
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = await authService.getCurrentUser();
      return user;
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  },

  async signOut() {
    if (!isSupabaseEnabled || !supabase) return;
    try {
      // @ts-ignore
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
      throw err;
    }
  },

  async signInWithProvider(provider: string, redirectTo?: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase not configured');
    try {
      // @ts-ignore
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: redirectTo ? { redirectTo } : undefined,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Sign in with provider error:', err);
      throw err;
    }
  },

  async getCurrentSession() {
    if (!isSupabaseEnabled || !supabase) return null;
    try {
      // @ts-ignore
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data?.session ?? null;
    } catch (err) {
      console.error('Get session error:', err);
      return null;
    }
  },

  async getCurrentUser() {
    if (!isSupabaseEnabled || !supabase) return null;
    try {
      // @ts-ignore
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return null;
      return await toUser(data.user);
    } catch (err) {
      console.error('Get current user error:', err);
      return null;
    }
  },

  async updateUserProfile(userId: string, updates: Record<string, any>) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase not configured');
    try {
      const { data, error } = await supabase.from('profiles').update({
        full_name: updates.fullName,
        role: updates.role,
        phone: updates.phone,
        profile_photo: updates.profilePhoto,
        ...updates,
      }).eq('id', userId).select().maybeSingle();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  },

  async changePassword(newPassword: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase not configured');
    try {
      // @ts-ignore
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Change password error:', err);
      throw err;
    }
  },

  async deleteAccount(userId: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase not configured');
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Delete account error:', err);
      throw err;
    }
  },

  onAuthStateChange(cb: (user: User | null) => void) {
    if (!isSupabaseEnabled || !supabase) return () => {};
    // @ts-ignore
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = await authService.getCurrentUser();
        cb(u);
      } else {
        cb(null);
      }
    });

    return () => subscription?.unsubscribe && subscription.unsubscribe();
  },

  async sendPasswordReset(email: string, redirectTo?: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase not configured');
    try {
      // @ts-ignore
      if (typeof supabase.auth.resetPasswordForEmail === 'function') {
        // @ts-ignore
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
        return data;
      }

      // fallback
      // @ts-ignore
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Send password reset error:', err);
      throw err;
    }
  },
};

export default authService;
