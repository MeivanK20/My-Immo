import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { User, NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: (email: string) => User | null;
  onNavigate: NavigationFunction;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = onLogin(email);
    if (!user) {
      setError(t('loginPage.error'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center" onClick={() => onNavigate('home')}>
             <Logo />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-center text-2xl font-bold text-brand-dark mb-6">
                {t('loginPage.title')}
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</p>}
                <Input
                label={t('loginPage.email')}
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                />
                <Input
                label={t('loginPage.password')}
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                />
                <div>
                    <Button type="submit" className="w-full">
                        {t('loginPage.login')}
                    </Button>
                </div>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-600">
                {t('loginPage.noAccount')}{' '}
                <button onClick={() => onNavigate('register')} className="font-medium text-brand-red hover:text-brand-red-dark">
                {t('loginPage.register')}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;