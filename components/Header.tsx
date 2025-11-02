import React, { useState, useEffect, useRef } from 'react';
import Logo from './common/Logo';
import { User, NavigationFunction } from '../types';
import Button from './common/Button';
import { useLanguage } from '../contexts/LanguageContext';

const FrFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-auto rounded-sm" viewBox="0 0 900 600" aria-hidden="true">
        <rect width="900" height="600" fill="#fff"/>
        <rect width="300" height="600" fill="#002654"/>
        <rect width="300" height="600" x="600" fill="#ed2939"/>
    </svg>
);

const GbFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-auto rounded-sm" viewBox="0 0 60 30" aria-hidden="true">
        <clipPath id="gb-clip">
            <path d="M0 0v30h60V0z"/>
        </clipPath>
        <path d="M0 0v30h60V0z" fill="#012169"/>
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
        <path d="M0 0l60 30m0-30L0 30" clipPath="url(#gb-clip)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
);

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ForwardArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

interface HeaderProps {
  user: User | null;
  onNavigate: NavigationFunction;
  onLogout: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout, onGoBack, onGoForward, canGoBack, canGoForward }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, locale, setLocale } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === 'fr' ? 'en' : 'fr');
  };
  
  const getUserRoleText = (role: User['role']) => {
      switch(role) {
          case 'admin': return t('header.userRoleAdmin');
          case 'agent': return t('header.userRoleAgent');
          case 'visitor': return t('header.userRoleVisitor');
          default: return '';
      }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-brand-dark/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-brand-card/50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo variant="dark" size="small" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
                onClick={onGoBack}
                disabled={!canGoBack}
                className="p-2 rounded-full text-brand-gray hover:text-white hover:bg-brand-card/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label={t('header.goBack')}
            >
                <BackArrowIcon />
            </button>
            <button
                onClick={onGoForward}
                disabled={!canGoForward}
                className="p-2 rounded-full text-brand-gray hover:text-white hover:bg-brand-card/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label={t('header.goForward')}
            >
                <ForwardArrowIcon />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onNavigate('home')} className="hidden sm:block text-brand-gray hover:text-white rounded-lg px-3 py-2 transition-colors duration-300">{t('header.home')}</button>
          <button onClick={() => user ? onNavigate('listings') : onNavigate('register')} className="hidden sm:block text-brand-gray hover:text-white rounded-lg px-3 py-2 transition-colors duration-300">{t('header.listings')}</button>
          
          {!user && (
            <>
              <button onClick={() => onNavigate('about')} className="hidden sm:block text-brand-gray hover:text-white rounded-lg px-3 py-2 transition-colors duration-300">{t('header.about')}</button>
              <button onClick={() => onNavigate('contact')} className="hidden sm:block text-brand-gray hover:text-white rounded-lg px-3 py-2 transition-colors duration-300">{t('header.contact')}</button>
            </>
          )}
          
          {user ? (
            <div className="flex items-center space-x-3" ref={menuRef}>
               <div className="text-right">
                <div className="font-semibold text-sm text-gray-100">{user.name}</div>
                <div className="text-xs capitalize -mt-0.5 text-gray-400">{getUserRoleText(user.role)}</div>
              </div>
               <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-1 rounded-full hover:bg-brand-card/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-red"
                  aria-label="Menu utilisateur"
                  aria-expanded={isMenuOpen}
                >
                  <img src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ef4444&color=fff`} alt="User avatar" className="h-10 w-10 rounded-full object-cover" />
                </button>
                {isMenuOpen && (
                   <div className="absolute right-0 mt-2 w-56 bg-brand-card rounded-md shadow-lg py-1 z-20 ring-1 ring-black/50">
                    {user.role === 'admin' && (
                      <button onClick={() => { onNavigate('adminDashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-dark hover:text-white transition-colors">{t('header.adminDashboard')}</button>
                    )}
                    {(user.role === 'agent' || user.role === 'admin') && (
                      <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-dark hover:text-white transition-colors">{t('header.dashboard')}</button>
                    )}
                    {user.role === 'agent' && user.subscriptionPlan === 'free' && (
                        <button onClick={() => { onNavigate('pricing'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-green-400 hover:bg-green-500/10 transition-colors">{t('header.upgradePlan')}</button>
                    )}
                    <button onClick={() => { onNavigate('profileSettings'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-dark hover:text-white transition-colors">{t('header.profileSettings')}</button>
                    
                    <div className="border-t border-brand-dark/50 my-1"></div>
                    <button onClick={() => { onNavigate('appwriteDemo'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-dark hover:text-white transition-colors">Appwrite Demo</button>
                    <div className="border-t border-brand-dark/50 my-1"></div>
                    
                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-dark hover:text-white transition-colors">{t('header.logout')}</button>
                     <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="sm:hidden flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-dark hover:text-white transition-colors">
                        {locale === 'fr' ? <GbFlag /> : <FrFlag />}
                        <span>{locale === 'fr' ? 'Switch to English' : 'Passer au Français'}</span>
                     </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-2 flex items-center">
                <button onClick={() => onNavigate('login')} className="text-brand-gray hover:text-white rounded-lg px-3 py-2 transition-colors duration-300">{t('header.login')}</button>
                <Button onClick={() => onNavigate('register')} variant="primary">{t('header.register')}</Button>
            </div>
          )}

          <button 
            onClick={toggleLanguage} 
            className="hidden sm:block p-1 rounded-full hover:bg-brand-card/50 transition duration-300"
            aria-label={locale === 'fr' ? 'Switch to English' : 'Switch to French'}
          >
            {locale === 'fr' ? <GbFlag /> : <FrFlag />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;