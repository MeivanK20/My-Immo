import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseAuthService } from './supabaseAuthService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to keep localStorage in sync (backwards compatibility)
  const persistUser = (u: User | null) => {
    if (u) {
      try {
        localStorage.setItem('currentUser', JSON.stringify(u));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    persistUser(newUser);
  };

  const logout = async () => {
    try {
      await supabaseAuthService.signout();
    } catch (e) {
      console.warn('Sign out failed:', e);
    }
    setUser(null);
  };

  // On mount: load current user from Supabase (source of truth)
  useEffect(() => {
    let mounted = true;

    (async () => {
      setIsLoading(true);
      try {
        const current = await supabaseAuthService.getCurrentUser();
        if (mounted) {
          setUserState(current);
          persistUser(current);
        }
      } catch (e) {
        console.error('Error loading current user from Supabase:', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    // Subscribe to Supabase auth state changes
    const { data: subscription } = supabaseAuthService.onAuthStateChange((u) => {
      // callback receives a User | null
      setUserState(u);
      persistUser(u);
    }) as any;

    return () => {
      mounted = false;
      try {
        subscription?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
