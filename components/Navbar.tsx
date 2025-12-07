import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Menu, X, Globe, Settings, LogOut } from 'lucide-react';
import { RoutePath } from '../types';
import authService from '../services/authService';
import { useLanguage } from '../services/languageContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  React.useEffect(() => {
    const u = authService.getCurrentUser();
    setCurrentUser(u);

    const onAuthChange = (e: any) => {
      setCurrentUser(e?.detail?.user ?? authService.getCurrentUser());
    };
    window.addEventListener('authChange', onAuthChange as EventListener);
    return () => window.removeEventListener('authChange', onAuthChange as EventListener);
  }, []);

  const initials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  };

  const handleUserMenuClick = (path: string) => {
    navigate(path);
    setIsUserMenuOpen(false);
  };

  const handleUserMenuLogout = () => {
    authService.clearCurrentUser();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate(RoutePath.HOME);
  };

  const renderUserMenu = () => {
    if (!currentUser) return null;

    const menuItems = [];
    
    if (currentUser.role === 'admin') {
      menuItems.push(
        { label: 'Panel Admin', path: RoutePath.ADMIN_DASHBOARD },
        { label: 'Tableau de bord', path: RoutePath.DASHBOARD },
        { label: 'Paramètres du profil', path: RoutePath.PROFILE }
      );
    } else if (currentUser.role === 'agent') {
      menuItems.push(
        { label: 'Tableau de bord', path: RoutePath.DASHBOARD },
        { label: 'Paramètres du profil', path: RoutePath.PROFILE }
      );
    } else if (currentUser.role === 'visitor') {
      menuItems.push(
        { label: 'Paramètres du profil', path: RoutePath.PROFILE }
      );
    }

    return (
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => item.path ? handleUserMenuClick(item.path) : console.log(item.action)}
            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {item.path === RoutePath.PROFILE && <Settings size={16} />}
            {item.label}
          </button>
        ))}
        <button
          onClick={handleUserMenuLogout}
          className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-200"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={RoutePath.HOME} className="flex items-center gap-3">
              <img 
                src="https://i.imgur.com/M1bNYA1.png" 
                alt="My Immo Logo" 
                className="h-10 w-auto" 
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">My Immo</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link
                  to={RoutePath.HOME}
                  className={`text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ${isActive(RoutePath.HOME) ? 'text-primary-600' : ''}`}
                >
                  Accueil
                </Link>
                <Link
                  to={RoutePath.LISTINGS}
                  className={`text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ${isActive(RoutePath.LISTINGS) ? 'text-primary-600' : ''}`}
                >
                  Annonces
                </Link>
                <a href="#about" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">À propos</a>
                <a href="#contact" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Contact</a>

                {/* User info */}
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{currentUser.fullName}</div>
                    <div className="text-xs text-gray-500">{currentUser.role === 'visitor' ? 'Visiteur' : currentUser.role === 'agent' ? 'Agent' : 'Admin'}</div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold hover:bg-primary-700 transition-colors"
                    >
                      {initials(currentUser.fullName)}
                    </button>
                    {isUserMenuOpen && renderUserMenu()}
                  </div>
                </div>
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    title={`Langue actuelle: ${language === 'fr' ? 'Français' : 'English'}`}
                  >
                    <span className="text-2xl">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                  </button>
                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button onClick={() => handleLanguageChange('fr')} className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 ${language === 'fr' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <span className="text-2xl">🇫🇷</span>
                        <span>Français</span>
                      </button>
                      <button onClick={() => handleLanguageChange('en')} className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 ${language === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <span className="text-2xl">🇬🇧</span>
                        <span>English</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={RoutePath.LOGIN}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(RoutePath.LOGIN)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <LogIn size={18} />
                  CONNEXION
                </Link>
                <Link
                  to={RoutePath.SIGNUP}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                >
                  INSCRIPTION
                </Link>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    title={`Langue actuelle: ${language === 'fr' ? 'Français' : 'English'}`}
                  >
                    <span className="text-2xl">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                  </button>
                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button onClick={() => handleLanguageChange('fr')} className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 ${language === 'fr' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <span className="text-2xl">🇫🇷</span>
                        <span>Français</span>
                      </button>
                      <button onClick={() => handleLanguageChange('en')} className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 ${language === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <span className="text-2xl">🇬🇧</span>
                        <span>English</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser ? (
              <>
                <Link
                  to={RoutePath.HOME}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(RoutePath.HOME)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Accueil
                </Link>
                <Link
                  to={RoutePath.LISTINGS}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(RoutePath.LISTINGS)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Annonces
                </Link>
                <a href="#about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
                  À propos
                </a>
                <a href="#contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50">
                  Contact
                </a>

                {/* Mobile User Menu */}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-xs">
                      {initials(currentUser.fullName)}
                    </div>
                    <div className="text-right flex-1">
                      <div className="text-sm font-medium text-gray-900">{currentUser.fullName}</div>
                      <div className="text-xs text-gray-500">{currentUser.role === 'visitor' ? 'Visiteur' : currentUser.role === 'agent' ? 'Agent' : 'Admin'}</div>
                    </div>
                  </div>
                  
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        handleUserMenuClick(RoutePath.ADMIN_DASHBOARD);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Panel Admin
                    </button>
                  )}
                  
                  {(currentUser.role === 'admin' || currentUser.role === 'agent') && (
                    <button
                      onClick={() => {
                        handleUserMenuClick(RoutePath.DASHBOARD);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Tableau de bord
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      handleUserMenuClick(RoutePath.PROFILE);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Paramètres du profil
                  </button>
                  
                  <button
                    onClick={() => {
                      handleUserMenuLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-200"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>

                {/* Mobile Language Selector */}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex items-center gap-2 px-3 py-2 text-gray-600">
                    <Globe size={18} />
                    <span className="text-sm font-medium">Langue</span>
                  </div>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                      language === 'fr'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇫🇷</span>
                    Français
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                      language === 'en'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇬🇧</span>
                    English
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to={RoutePath.LOGIN}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${
                     isActive(RoutePath.LOGIN)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <LogIn size={20} />
                  CONNEXION
                </Link>
                <Link
                  to={RoutePath.SIGNUP}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700 transition-colors"
                >
                  INSCRIPTION
                </Link>

                {/* Mobile Language Selector */}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex items-center gap-2 px-3 py-2 text-gray-600">
                    <Globe size={18} />
                    <span className="text-sm font-medium">Langue</span>
                  </div>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                      language === 'fr'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇫🇷</span>
                    Français
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                      language === 'en'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇬🇧</span>
                    English
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};