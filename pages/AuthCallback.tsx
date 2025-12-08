import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../types';

function parseHash(hash: string) {
  // hash may look like: #access_token=...&expires_in=...
  if (!hash) return {} as Record<string, string>;
  return Object.fromEntries(hash.replace(/^#/, '').split('&').map((p) => {
    const [k, v] = p.split('=');
    return [decodeURIComponent(k), decodeURIComponent(v || '')];
  }));
}

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorCode = params.get('error_code');
    const errorDescription = params.get('error_description');

    const hashParams = parseHash(window.location.hash);

    // If there's an OAuth error returned by Supabase, display it briefly then navigate home
    if (error || errorCode) {
      // Keep the error visible for a moment so the user can read it
      console.error('OAuth callback error', { error, errorCode, errorDescription });
      return;
    }

    // If the hash contains access_token or other session info, just redirect home and let
    // the auth subscription pick up the session.
    if (hashParams['access_token'] || hashParams['session'] || params.get('access_token')) {
      // small delay to ensure Supabase client stores the session
      setTimeout(() => navigate(RoutePath.HOME), 600);
      return;
    }

    // Default: navigate home after short delay
    setTimeout(() => navigate(RoutePath.HOME), 600);
  }, [navigate]);

  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const errorCode = params.get('error_code');
  const errorDescription = params.get('error_description');

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Authentification</h2>
        {error || errorCode ? (
          <div>
            <p className="text-red-600 font-medium">Une erreur est survenue pendant l'authentification.</p>
            <p className="mt-2 text-sm text-gray-700">Code: {errorCode || error}</p>
            {errorDescription && <p className="mt-1 text-sm text-gray-600">Détails: {decodeURIComponent(errorDescription)}</p>}
            <div className="mt-4">
              <button onClick={() => window.location.href = '/'} className="px-4 py-2 rounded bg-primary-600 text-white">Retour</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700">Finalisation de l'authentification... Vous allez être redirigé(e).</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
