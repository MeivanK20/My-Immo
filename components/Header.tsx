import React, { useState, useEffect, useRef } from 'react';
import Logo from './common/Logo';
import { User, NavigationFunction } from '../types';
import Button from './common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  user: User | null;
  onNavigate: NavigationFunction;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t, locale, setLocale } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === 'fr' ? 'en' : 'fr');
  };

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate('home')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">{t('header.home')}</button>
          <button onClick={() => onNavigate('listings')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">{t('header.listings')}</button>
          <button onClick={() => onNavigate('about')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">{t('header.about')}</button>
          <button onClick={() => onNavigate('contact')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">{t('header.contact')}</button>
          
          <button onClick={toggleLanguage} className="hidden sm:block text-sm text-brand-gray hover:text-brand-red-dark font-semibold transition duration-300">
            {locale === 'fr' ? 'English' : 'Français'}
          </button>

          {user ? (
            <div className="flex items-center space-x-3" ref={menuRef}>
               <div className="text-right">
                <div className="font-semibold text-sm text-gray-800">{user.name}</div>
                <div className="text-xs capitalize -mt-0.5 text-gray-500">{user.role === 'agent' ? t('header.userRoleAgent') : t('header.userRoleVisitor')}</div>
              </div>
               <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
                  aria-label="Menu utilisateur"
                  aria-expanded={isMenuOpen}
                >
                  <img src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f87171&color=fff`} alt="User avatar" className="h-10 w-10 rounded-full object-cover" />
                </button>
                {isMenuOpen && (
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                    {user.role === 'agent' && (
                      <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.dashboard')}</button>
                    )}
                    <button onClick={() => { onNavigate('profileSettings'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.profileSettings')}</button>
                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('header.logout')}</button>
                     <button onClick={() => { toggleLanguage(); setIsMenuOpen(false); }} className="sm:hidden block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {locale === 'fr' ? 'Switch to English' : 'Passer au Français'}
                     </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-2 flex items-center">
                <button onClick={() => onNavigate('login')} className="text-brand-gray hover:text-brand-red-dark transition duration-300 px-3 py-2">{t('header.login')}</button>
                <Button onClick={() => onNavigate('register')} variant="primary">{t('header.register')}</Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;