
import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ForgotPasswordPageProps {
  onNavigate: NavigationFunction;
  onForgotPassword: (email: string) => Promise<void>;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate, onForgotPassword }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        await onForgotPassword(email);
        setSubmitted(true);
    } catch(err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('home')}>
          <Logo />
        </div>

        <div className="bg-brand-card p-8 rounded-lg shadow-2xl">
          {submitted ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('forgotPasswordPage.successTitle')}
              </h2>
              <p className="text-gray-400 mb-6">
                {t('forgotPasswordPage.successMessage')}
              </p>
              <Button onClick={() => onNavigate('login')} className="w-full">
                {t('forgotPasswordPage.backToLogin')}
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold text-white mb-2">
                {t('forgotPasswordPage.title')}
              </h2>
              <p className="text-center text-gray-400 mb-6">{t('forgotPasswordPage.subtitle')}</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">{error}</p>}
                <Input
                  label={t('forgotPasswordPage.email')}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? `${t('forgotPasswordPage.sending')}...` : t('forgotPasswordPage.sendLink')}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
