import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../types';
import { supabaseAuthService } from '../services/supabaseAuthService';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current user from the Supabase session
        const user = await supabaseAuthService.handleOAuthCallback();

        if (user) {
          // Store user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          // Dispatch auth change event
          window.dispatchEvent(new CustomEvent('authChange', { detail: { user } }));

          // Redirect based on user role
          if (user.role === 'admin') {
            navigate(RoutePath.ADMIN_DASHBOARD);
          } else if (user.role === 'agent') {
            navigate(RoutePath.DASHBOARD);
          } else {
            navigate(RoutePath.LISTINGS);
          }
        } else {
          setError('Authentification échouée. Veuillez réessayer.');
          setTimeout(() => navigate(RoutePath.LOGIN), 3000);
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError('Une erreur est survenue lors de l\'authentification.');
        setTimeout(() => navigate(RoutePath.LOGIN), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-red-600 text-lg font-semibold">{error}</div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="inline-block">
          <svg className="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-600">Traitement de votre authentification...</p>
      </div>
    </div>
  );
};
