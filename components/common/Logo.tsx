import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'normal' | 'small';
}

const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'normal' }) => {
  const { t } = useLanguage();

  const isSmall = size === 'small';

  const pillarColor = variant === 'light' ? '#4b5563' : '#E5E7EB'; // brand-gray or gray-200 for dark variant
  const titleColor = variant === 'light' ? 'text-brand-dark' : 'text-white';
  const subtitleColor = variant === 'light' ? 'text-brand-gray' : 'text-gray-400';

  if (isSmall) {
    return (
      <div className="flex items-center gap-2">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left pillar of the 'M' */}
          <path d="M15 90 V 30 L 35 20 V 90 H 15 Z" fill={pillarColor} />
          {/* Right pillar of the 'M' */}
          <path d="M85 90 V 30 L 65 20 V 90 H 85 Z" fill={pillarColor} />
          {/* Center 'V' shape representing a roof */}
          <path d="M50 10 L 35 20 L 50 30 L 65 20 L 50 10 Z" fill="#ef4444" />
        </svg>
        <span className={`text-xl font-sans ${titleColor}`}>My Immo</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
        {/* Left pillar of the 'M' */}
        <path d="M15 90 V 30 L 35 20 V 90 H 15 Z" fill={pillarColor} />
        {/* Right pillar of the 'M' */}
        <path d="M85 90 V 30 L 65 20 V 90 H 85 Z" fill={pillarColor} />
        {/* Center 'V' shape representing a roof */}
        <path d="M50 10 L 35 20 L 50 30 L 65 20 L 50 10 Z" fill="#ef4444" />
      </svg>
      <div className="text-center leading-none">
        <span className={`text-xl font-sans ${titleColor}`}>My Immo</span>
        <p className={`text-xs tracking-widest ${subtitleColor}`}>{t('logo.subtext')}</p>
      </div>
    </div>
  );
};

export default Logo;
