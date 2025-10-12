import React from 'react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import { NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationSuccessPageProps {
  email: string;
  onNavigate: NavigationFunction;
}

const RegistrationSuccessPage: React.FC<RegistrationSuccessPageProps> = ({ email, onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-280px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center cursor-pointer" onClick={() => onNavigate('home')}>
          <Logo />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-6 text-2xl font-bold text-brand-dark">
            {t('registrationSuccessPage.title')}
          </h2>
          <p className="mt-4 text-gray-600">
            {t('registrationSuccessPage.message', { email })}
          </p>
          <div className="mt-8">
            <Button onClick={() => onNavigate('login')} className="w-full">
              {t('registrationSuccessPage.loginButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;