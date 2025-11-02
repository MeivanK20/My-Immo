import React from 'react';
import Button from './Button';
import { useLanguage } from '../../contexts/LanguageContext';

interface DataErrorBannerProps {
  error: string;
  onRetry: () => void;
}

const DataErrorBanner: React.FC<DataErrorBannerProps> = ({ error, onRetry }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-red-900/50 text-red-200 p-4" role="alert">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-bold">{t('app.fetchError')}</p>
            <p className="text-sm font-mono bg-brand-dark/30 p-1 rounded mt-1">{error}</p>
          </div>
        </div>
        <Button onClick={onRetry} variant="secondary" className="border-red-400 text-red-200 hover:bg-red-400/20 hover:text-white flex-shrink-0">
          Retry
        </Button>
      </div>
    </div>
  );
};

export default DataErrorBanner;
