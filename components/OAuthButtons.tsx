import React from 'react';
import { useAuth } from '../services/authContext';

interface OAuthButtonsProps {
  className?: string;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M44.5 20H24v8.5h11.9C34.9 32.9 30.1 36 24 36c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.6 0 6.9 1.4 9.4 3.7l6.6-6.6C35.9 3.1 30.2 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c11 0 20-7.9 20-21 0-1.4-.1-2.2-.5-3z" fill="#4285F4"/>
    </svg>
  );
}

export default function OAuthButtons({ className }: OAuthButtonsProps) {
  const { signInWithProvider } = useAuth();

  const handleProvider = async (provider: string) => {
    try {
      // Compute redirect URL: prefer explicit env, otherwise use current origin + /auth/callback
      const redirectTo = (import.meta.env.VITE_SUPABASE_REDIRECT_URL as string | undefined) || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined);
      // Initiates OAuth flow (redirect handled by Supabase)
      await signInWithProvider(provider, redirectTo);
    } catch (err) {
      console.error('OAuth sign-in error', err);
    }
  };

  return (
    <div className={className || ''}>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => handleProvider('google')}
          className="w-full inline-flex items-center justify-center gap-3 py-2 px-4 border rounded-lg bg-white text-sm text-gray-700 hover:shadow-md transition-all"
          aria-label="Continuer avec Google"
        >
          <span className="sr-only">Continuer avec Google</span>
          <span className="flex items-center justify-center w-5 h-5">
            <GoogleIcon />
          </span>
          <span>Continuer avec Google</span>
        </button>
      </div>
    </div>
  );
}
