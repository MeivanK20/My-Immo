import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from './authService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; role?: string; phone?: string }) => Promise<{ user: User | null; requiresEmailConfirmation?: boolean } | null>;
  signInWithProvider: (provider: string, redirectTo?: string) => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const current = await authService.getCurrentUser();
        if (mounted) setUser(current);
      } catch (err) {
        console.error('Error loading current user from Supabase:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const unsubscribe = authService.onAuthStateChange((u) => {
      setUser(u);
    });

    return () => {
      mounted = false;
      try { unsubscribe && unsubscribe(); } catch {}
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      const signed = await authService.signIn(email, password);
      setUser(signed);
      return signed;
    } catch (err) {
      console.error('Login error', err);
      return null;
    }
  }

  async function logout() {
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  }

  async function signInWithProvider(provider: string, redirectTo?: string) {
    try {
      const res = await authService.signInWithProvider(provider, redirectTo);
      return res;
    } catch (err) {
      console.error('signInWithProvider error', err);
      return null;
    }
  }

  async function register(data: { fullName: string; email: string; password: string; role?: any; phone?: string }) {
    try {
      const result = await authService.signUp(data as any);
      // result is { user, requiresEmailConfirmation }
      if (result && (result as any).user) {
        setUser((result as any).user);
      }
      return result as any;
    } catch (err) {
      console.error('Register error', err);
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, signInWithProvider }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
