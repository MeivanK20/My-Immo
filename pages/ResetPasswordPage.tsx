import React, { useState, useEffect } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';

interface ResetPasswordPageProps {
  onNavigate: NavigationFunction;
  urlParams: { userId: string, secret: string } | null;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigate, urlParams }) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState('');
  const [secret, setSecret] = useState('');
  
  useEffect(() => {
    if (urlParams) {
        setUserId(urlParams.userId);
        setSecret(urlParams.secret);
    } else {
        setError(t('resetPasswordPage.errorInvalidLink'));
    }
  }, [urlParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError(t('resetPasswordPage.errorMismatch'));
      return;
    }
    if (!userId || !secret) {
        setError(t('resetPasswordPage.errorInvalidLink'));
        return;
    }
    setIsLoading(true);
    try {
      await authService.updatePasswordRecovery(userId, secret, password, confirmPassword);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t('resetPasswordPage.errorInvalidLink'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!urlParams) {
      return (
         <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8 bg-brand-card p-8 rounded-lg shadow-2xl text-center">
                  <h2 className="text-2xl font-bold text-red-400">{t('resetPasswordPage.errorInvalidLink')}</h2>
                  <Button onClick={() => onNavigate('login')}>{t('forgotPasswordPage.backToLogin')}</Button>
              </div>
          </div>
      )
  }

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
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
              <h2 className="mt-6 text-2xl font-bold text-white">
                {t('resetPasswordPage.successTitle')}
              </h2>
              <p className="mt-4 text-gray-300">
                {t('resetPasswordPage.successMessage')}
              </p>
              <div className="mt-8">
                <Button onClick={() => onNavigate('login')} className="w-full">
                  {t('registrationSuccessPage.loginButton')}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold text-white mb-2">
                {t('resetPasswordPage.title')}
              </h2>
              <p className="text-center text-gray-400 mb-6">{t('resetPasswordPage.subtitle')}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">{error}</p>
                )}
                <Input
                  label={t('resetPasswordPage.newPassword')}
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                 <Input
                  label={t('resetPasswordPage.confirmPassword')}
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? `${t('resetPasswordPage.resetting')}...` : t('resetPasswordPage.resetPassword')}
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

export default ResetPasswordPage;