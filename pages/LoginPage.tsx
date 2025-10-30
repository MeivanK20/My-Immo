import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import GoogleIcon from '../components/icons/GoogleIcon';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => void;
  onNavigate: NavigationFunction;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoogleSignIn, onNavigate }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onLogin(email, password);
      // Navigation is handled within the onLogin implementation in App.tsx
    } catch (error: any) {
      setError(error.message || t('loginPage.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInClick = () => {
    setError('');
    onGoogleSignIn();
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('home')}>
             <Logo />
        </div>
        <div className="bg-brand-card p-8 rounded-lg shadow-2xl">
            <h2 className="text-center text-2xl font-bold text-white mb-6">
                {t('loginPage.title')}
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">{error}</p>}
                <Input
                label={t('loginPage.email')}
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
                />
                <Input
                label={t('loginPage.password')}
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
                />
                <div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? `${t('loginPage.loggingIn')}...` : t('loginPage.login')}
                    </Button>
                </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-brand-dark" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-brand-card text-gray-400">
                  {t('loginPage.orContinueWith')}
                </span>
              </div>
            </div>

            <div>
              <Button
                type="button"
                variant="secondary"
                className="w-full flex items-center justify-center gap-3"
                onClick={handleGoogleSignInClick}
                disabled={isLoading}
              >
                <GoogleIcon />
                {t('loginPage.googleSignIn')}
              </Button>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-400">
                {t('loginPage.noAccount')}{' '}
                <button onClick={() => onNavigate('register')} className="font-medium text-brand-red hover:text-brand-red/80">
                {t('loginPage.register')}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;