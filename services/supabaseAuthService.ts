import { supabase } from './supabaseService';
import { User } from '../types';

export const supabaseAuthService = {
  // Sign up a new user
  async signup(email: string, password: string, fullName: string, role: 'visitor' | 'agent' = 'visitor', companyName?: string, licenseNumber?: string): Promise<User> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Create user profile
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            fullName,
            role,
            companyName: role === 'agent' ? companyName : null,
            licenseNumber: role === 'agent' ? licenseNumber : null,
            createdAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        createdAt: new Date(userData.createdAt),
      } as User;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Sign in user
  async signin(email: string, password: string): Promise<User> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign in failed');

      // Fetch user profile
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        profilePhoto: userData.profilePhoto,
        createdAt: new Date(userData.createdAt),
      } as User;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out user
  async signout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) return null;

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) return null;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        profilePhoto: userData.profilePhoto,
        createdAt: new Date(userData.createdAt),
      } as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        profilePhoto: userData.profilePhoto,
        createdAt: new Date(userData.createdAt),
      } as User;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Delete user account
  async deleteAccount(userId: string): Promise<void> {
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Delete auth user (requires admin key, handled by RLS)
      // Note: The user must be signed in, and can only delete their own account
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  // Listen for auth changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  // Sign up with Google
  async signUpWithGoogle(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign up error:', error);
      throw error;
    }
  },

  // Handle OAuth callback and create/update user profile
  async handleOAuthCallback(): Promise<User | null> {
    try {
      // After OAuth redirect, the session may be encoded in the URL.
      // Use getSessionFromUrl() first to parse and set the session, then fallback to getSession().
      let session: any = null;

      try {
        // Some versions of supabase-js expose getSessionFromUrl(); use it if available.
        const getSessionFromUrl = (supabase.auth as any).getSessionFromUrl;
        console.debug('[supabaseAuthService] OAuth callback - location:', window.location.href);
        if (typeof getSessionFromUrl === 'function') {
          try {
            const { data: sessionData, error: urlErr } = await getSessionFromUrl();
            console.debug('[supabaseAuthService] getSessionFromUrl result:', { sessionData, urlErr });
            if (!urlErr && sessionData?.session) {
              session = sessionData.session;
            }
          } catch (innerErr) {
            console.warn('[supabaseAuthService] getSessionFromUrl failed:', innerErr);
          }
        } else {
          console.debug('[supabaseAuthService] getSessionFromUrl not available on this client');
        }
      } catch (e) {
        console.warn('[supabaseAuthService] error while trying getSessionFromUrl fallback', e);
      }

      if (!session) {
        try {
          const { data: sessResp, error: getErr } = await supabase.auth.getSession();
          console.debug('[supabaseAuthService] getSession result:', { sessResp, getErr });
          if (!getErr && sessResp?.session) {
            session = sessResp.session;
          }
        } catch (e) {
          console.warn('[supabaseAuthService] getSession failed:', e);
        }
      }

      if (!session?.user) return null;

      const { data: userData, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // If user profile doesn't exist, create it with default visitor role
      if (checkError?.code === 'PGRST116') {
        const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
        const { data: newUserData, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              fullName: fullName,
              role: 'visitor',
              createdAt: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createError) throw createError;

        return {
          id: newUserData.id,
          email: newUserData.email,
          fullName: newUserData.fullName,
          role: newUserData.role,
          createdAt: new Date(newUserData.createdAt),
        } as User;
      }

      if (checkError) throw checkError;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        profilePhoto: userData.profilePhoto,
        createdAt: new Date(userData.createdAt),
      } as User;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  },
};
