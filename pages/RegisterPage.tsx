import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { User, NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface RegisterPageProps {
  onRegister: (name: string, email: string, role: 'visitor' | 'agent') => User | null;
  onNavigate: NavigationFunction;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigate }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'visitor' | 'agent'>('visitor');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError(t('registerPage.errorRequired'));
      return;
    }
    const newUser = onRegister(name, email, role);
    if (!newUser) {
      setError(t('registerPage.errorExists'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('home')}>
          <Logo />
        </div>
        <div className="bg-brand-card p-8 rounded-lg shadow-2xl">
          <h2 className="text-center text-2xl font-bold text-white mb-6">
            {t('registerPage.title')}
          </h2>
          <form onSubmit={handleRegister} className="space-y-6">
            {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">{error}</p>}
            <Input
              label={t('registerPage.fullName')}
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              label={t('registerPage.email')}
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label={t('registerPage.password')}
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('registerPage.iAmA')}</label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer text-gray-300">
                  <input type="radio" name="role" value="visitor" checked={role === 'visitor'} onChange={() => setRole('visitor')} className="focus:ring-brand-red h-4 w-4 text-brand-red border-gray-500 bg-brand-dark" />
                  <span>{t('registerPage.visitor')}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-gray-300">
                  <input type="radio" name="role" value="agent" checked={role === 'agent'} onChange={() => setRole('agent')} className="focus:ring-brand-red h-4 w-4 text-brand-red border-gray-500 bg-brand-dark" />
                  <span>{t('registerPage.agent')}</span>
                </label>
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full">
                {t('registerPage.register')}
              </Button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-400">
            {t('registerPage.haveAccount')}{' '}
            <button onClick={() => onNavigate('login')} className="font-medium text-brand-red hover:text-brand-red/80">
              {t('registerPage.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
