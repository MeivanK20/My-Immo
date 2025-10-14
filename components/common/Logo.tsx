import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'light' }) => {
  const { t } = useLanguage();

  const pillarColor = variant === 'light' ? '#4b5563' : '#E5E7EB'; // brand-gray or gray-200 for dark variant
  const titleColor = variant === 'light' ? 'text-brand-dark' : 'text-white';
  const subtitleColor = variant === 'light' ? 'text-brand-gray' : 'text-gray-300';

  return (
    <div className="flex flex-col items-center">
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
        {/* Left pillar of the 'M' */}
        <path d="M15 90 V 30 L 35 20 V 90 H 15 Z" fill={pillarColor} />
        {/* Right pillar of the 'M' */}
        <path d="M85 90 V 30 L 65 20 V 90 H 85 Z" fill={pillarColor} />
        {/* Center 'V' shape representing a roof */}
        <path d="M50 10 L 35 20 L 50 30 L 65 20 L 50 10 Z" fill="#d40026" />
      </svg>
      <div className="text-center leading-none">
        <span className={`text-xl font-sans ${titleColor}`}>My Immo</span>
        <p className={`text-xs tracking-widest ${subtitleColor}`}>{t('logo.subtext')}</p>
      </div>
    </div>
  );
};

export default Logo;