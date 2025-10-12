import React, { useState, useEffect, useRef } from 'react';
import Logo from './common/Logo';
import { User, NavigationFunction } from '../types';
import Button from './common/Button';

interface HeaderProps {
  user: User | null;
  onNavigate: NavigationFunction;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          <button onClick={() => onNavigate('home')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">Accueil</button>
          <button onClick={() => onNavigate('listings')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">Annonces</button>
          <button onClick={() => onNavigate('about')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">À propos</button>
          <button onClick={() => onNavigate('contact')} className="hidden sm:block text-brand-gray hover:text-brand-red-dark transition duration-300">Contact</button>
          {user ? (
            <div className="flex items-center space-x-3" ref={menuRef}>
               <div className="text-right">
                <div className="font-semibold text-sm text-gray-800">{user.name}</div>
                <div className="text-xs capitalize -mt-0.5 text-gray-500">{user.role === 'agent' ? 'Agent / Propriétaire' : 'Visiteur'}</div>
              </div>
               <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
                  aria-label="Menu utilisateur"
                  aria-expanded={isMenuOpen}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray" fill="none" viewBox="0 0 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {isMenuOpen && (
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                    {user.role === 'agent' && (
                      <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tableau de bord</button>
                    )}
                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Déconnexion</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-2 flex items-center">
                <button onClick={() => onNavigate('login')} className="text-brand-gray hover:text-brand-red-dark transition duration-300 px-3 py-2">Connexion</button>
                <Button onClick={() => onNavigate('register')} variant="primary">Inscription</Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;