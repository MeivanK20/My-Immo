import React from 'react';
import Logo from './common/Logo';
import { NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: NavigationFunction;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  return (
    <footer className="bg-brand-dark text-gray-400 mt-16 border-t border-brand-card/50">
      <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Left side: Logo */}
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
          <Logo variant="dark" size="small" />
        </div>

        {/* Center: Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm order-last sm:order-none">
          <button onClick={() => onNavigate('about')} className="hover:text-brand-red transition">{t('header.about')}</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-brand-red transition">{t('header.contact')}</button>
          <a href="#" className="hover:text-brand-red transition">{t('footer.careers')}</a>
          <button onClick={() => onNavigate('termsOfUse')} className="hover:text-brand-red transition">{t('footer.terms')}</button>
          <button onClick={() => onNavigate('privacyPolicy')} className="hover:text-brand-red transition">{t('footer.privacy')}</button>
        </nav>
        
        {/* Right side: Copyright */}
        <div className="text-sm text-center sm:text-right">
          <p>&copy; {new Date().getFullYear()} My Immo.</p>
          <p className="text-gray-500 tracking-widest text-xs">by MEIK20</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;