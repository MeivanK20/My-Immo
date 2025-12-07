import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

type Language = 'fr' | 'en';

interface LanguageSwitcherProps {
  onLanguageChange?: (language: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const handleLanguageSelect = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language);
    // Vous pouvez implémenter la logique de changement de langue ici
    console.log(`Langue changée en: ${language}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Changer la langue"
        title="Changer la langue"
      >
        <Globe size={18} />
        <span className="text-lg">
          {languages.find(l => l.code === currentLanguage)?.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                currentLanguage === lang.code
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLanguage === lang.code && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
