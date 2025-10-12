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
    <footer className="bg-brand-dark text-white mt-16">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 cursor-pointer" onClick={() => onNavigate('home')}>
          <Logo />
        </div>
        <div className="flex flex-col md:flex-row text-center md:text-left">
          <div className="mb-6 md:mb-0 md:mr-12">
            <h3 className="font-bold mb-2">My Immo</h3>
            <ul>
              <li><button onClick={() => onNavigate('about')} className="hover:text-brand-red-dark transition">{t('header.about')}</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-brand-red-dark transition">{t('header.contact')}</button></li>
              <li><a href="#" className="hover:text-brand-red-dark transition">{t('footer.careers')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">{t('footer.legal')}</h3>
            <ul>
              <li><button onClick={() => onNavigate('termsOfUse')} className="hover:text-brand-red-dark transition">{t('footer.terms')}</button></li>
              <li><button onClick={() => onNavigate('privacyPolicy')} className="hover:text-brand-red-dark transition">{t('footer.privacy')}</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-black text-center py-4">
        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} My Immo. {t('footer.rightsReserved')}</p>
      </div>
    </footer>
  );
};

export default Footer;
