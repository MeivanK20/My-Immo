import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../translations';

export type Locale = 'en' | 'fr';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// FIX: Define props with an interface for clarity and to resolve potential type inference issues.
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [locale, setLocale] = useState<Locale>('fr');

  const t = (key: string, values?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation key "${key}" not found for locale "${locale}"`);
        let fallbackResult: any = translations['en'];
         for (const fk of keys) {
           fallbackResult = fallbackResult?.[fk];
           if (fallbackResult === undefined) return key;
        }
        return fallbackResult || key;
      }
    }
    
    let resultString = result;
    if (values) {
      Object.keys(values).forEach(valueKey => {
        resultString = resultString.replace(`{{${valueKey}}}`, String(values[valueKey]));
      });
    }

    return resultString;
  };

  // FIX: Corrected a typo in the closing tag for LanguageContext.Provider.
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};