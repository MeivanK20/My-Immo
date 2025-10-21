import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { NavigationFunction } from '../types';

interface PrivacyPolicyPageProps {
  onNavigate: NavigationFunction;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { t, locale } = useLanguage();
  return (
    <div className="bg-brand-dark">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">{t('privacyPage.title')}</h1>
          <p className="text-lg text-gray-400 mt-2">{t('privacyPage.lastUpdated', { date: new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US') })}</p>
          <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
        </div>

        <div className="prose lg:prose-lg max-w-none text-gray-300 prose-headings:text-white prose-strong:text-white space-y-6">
          <p>{t('privacyPage.p1')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('privacyPage.h1')}</h2>
          <p>{t('privacyPage.p2')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('privacyPage.li1_strong')}</strong> {t('privacyPage.li1_text')}</li>
            <li><strong>{t('privacyPage.li2_strong')}</strong> {t('privacyPage.li2_text')}</li>
            <li><strong>{t('privacyPage.li3_strong')}</strong> {t('privacyPage.li3_text')}</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">{t('privacyPage.h2')}</h2>
          <p>{t('privacyPage.p3')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacyPage.li4')}</li>
            <li>{t('privacyPage.li5')}</li>
            <li>{t('privacyPage.li6')}</li>
            <li>{t('privacyPage.li7')}</li>
            <li>{t('privacyPage.li8')}</li>
          </ul>

          <h2 className="text-2xl font-semibold pt-4">{t('privacyPage.h3')}</h2>
          <p>{t('privacyPage.p4')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('privacyPage.h4')}</h2>
          <p>{t('privacyPage.p5')}</p>

          <h2 className="text-2xl font-semibold pt-4">{t('privacyPage.h5')}</h2>
          <p>
            {t('privacyPage.p6_part1')}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="text-brand-red hover:underline">
              {t('privacyPage.contactLink')}
            </a>
            {t('privacyPage.p6_part2')}
          </p>

          <h2 className="text-2xl font-semibold pt-4">{t('privacyPage.h6')}</h2>
          <p>{t('privacyPage.p7')}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;