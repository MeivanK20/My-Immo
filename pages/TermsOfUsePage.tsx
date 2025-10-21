import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { NavigationFunction } from '../types';

interface TermsOfUsePageProps {
  onNavigate: NavigationFunction;
}

const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onNavigate }) => {
  const { t, locale } = useLanguage();
  return (
    <div className="bg-brand-dark">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">{t('termsPage.title')}</h1>
          <p className="text-lg text-gray-400 mt-2">{t('termsPage.lastUpdated', { date: new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US') })}</p>
          <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
        </div>

        <div className="prose lg:prose-lg max-w-none text-gray-300 prose-headings:text-white prose-strong:text-white space-y-6">
          <p>{t('termsPage.p1')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h1')}</h2>
          <p>{t('termsPage.p2')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h2')}</h2>
          <p>{t('termsPage.p3')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h3')}</h2>
          <p>{t('termsPage.p4')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('termsPage.li1')}</li>
            <li>{t('termsPage.li2')}</li>
            <li>{t('termsPage.li3')}</li>
            <li>{t('termsPage.li4')}</li>
          </ul>
          <p>{t('termsPage.p5')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h4')}</h2>
          <p>{t('termsPage.p6')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('termsPage.li5')}</li>
            <li>{t('termsPage.li6')}</li>
            <li>{t('termsPage.li7')}</li>
          </ul>
          <p>{t('termsPage.p7')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h5')}</h2>
          <p>{t('termsPage.p8')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h6')}</h2>
          <p>{t('termsPage.p9')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h7')}</h2>
          <p>{t('termsPage.p10')}</p>

           <h2 className="text-2xl font-semibold pt-4">{t('termsPage.h8')}</h2>
           <p>
            {t('termsPage.p11')}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="text-brand-red hover:underline">
              {t('termsPage.contactLink')}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;