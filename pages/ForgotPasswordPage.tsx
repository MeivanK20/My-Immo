import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';

interface ForgotPasswordPageProps {
  onNavigate: NavigationFunction;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.createPasswordRecovery(email);
      setSubmitted(true);
    } catch (err: any) {
      // Show generic error to prevent email enumeration
      setError(err.message);
      setSubmitted(true); // Still show success UI to user
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
              <svg className="mx-auto h-12 w-12 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="mt-6 text-2xl font-bold text-white">
                {t('forgotPasswordPage.successTitle')}
              </h2>
              <p className="mt-4 text-gray-300">
                {t('forgotPasswordPage.successMessage')}
              </p>
              <div className="mt-8">
                <Button onClick={() => onNavigate('login')} className="w-full">
                  {t('forgotPasswordPage.backToLogin')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold text-white mb-2">
                {t('forgotPasswordPage.title')}
              </h2>
              <p className="text-center text-gray-400 mb-6">{t('forgotPasswordPage.subtitle')}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">{error}</p>
                )}
                <Input
                  label={t('forgotPasswordPage.email')}
                  id="reset-email"
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
              <p className="mt-6 text-center text-sm text-gray-400">
                <button
                  onClick={() => onNavigate('login')}
                  className="font-medium text-brand-red hover:text-brand-red/80"
                >
                  {t('forgotPasswordPage.backToLogin')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;