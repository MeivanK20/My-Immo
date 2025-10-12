import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Logo: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center">
      <svg width="60" height="60" viewBox="0 0 150 150" className="mb-1">
        <g transform="translate(10, 0)">
          {/* Main house structure - Gray */}
          <path d="M70 10 L120 40 L120 110 L70 110 Z" fill="#4b5563"/>
          
          {/* Tall Left Structure - Darker Gray */}
          <path d="M20 0 L70 10 L70 110 L20 120 Z" fill="#374151"/>

          {/* Roof - Red */}
          <path d="M65 15 L125 45 L125 55 L65 25 Z" fill="#ef4444"/>

          {/* Entrance - White */}
          <path d="M45 45 L70 55 L70 110 L45 100 Z" fill="white"/>

          {/* Doorway detail - Black */}
          <path d="M70 55 L90 60 L90 85 L70 80 Z" fill="black" />

          {/* Doorway detail - Red */}
          <path d="M70 80 L90 85 L90 100 L70 95 Z" fill="#ef4444" />

          {/* Window */}
          <rect x="100" y="70" width="15" height="10" fill="white"/>
          <rect x="100" y="85" width="15" height="10" fill="white"/>
          <rect x="120" y="70" width="15" height="10" fill="white"/>
          <rect x="120" y="85" width="15" height="10" fill="white"/>
        </g>
      </svg>
      <div className="text-center leading-none">
        <span className="text-xl font-serif text-brand-dark">My Immo</span>
        <p className="text-xs tracking-widest text-brand-gray">{t('logo.subtext')}</p>
      </div>
    </div>
  );
};

export default Logo;
