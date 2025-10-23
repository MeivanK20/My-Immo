import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-80 flex items-center justify-center text-white" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/about-hero/1600/600')" }}
      >
        <div className="absolute inset-0 bg-brand-dark opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{t('aboutPage.heroTitle')}</h1>
          <p className="text-lg md:text-xl mt-4 text-gray-300">{t('aboutPage.heroSubtitle')}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-brand-card">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{t('aboutPage.missionTitle')}</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 leading-relaxed">
            {t('aboutPage.missionText')}
          </p>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-16 bg-brand-dark">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{t('aboutPage.leaderTitle')}</h2>
             <div className="w-24 h-1 bg-brand-red mx-auto mb-10"></div>
            <div className="max-w-md mx-auto bg-brand-card rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
                <img 
                    src="https://picsum.photos/seed/ceo/400/400" 
                    alt="Ivan MBAYE, CEO of My Immo"
                    className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-brand-red"
                />
                <h3 className="text-2xl font-semibold text-white">{t('aboutPage.ceoName')}</h3>
                <p className="text-brand-red font-medium mb-3">{t('aboutPage.ceoTitle')}</p>
                <p className="text-gray-400">
                    {t('aboutPage.ceoQuote')}
                </p>
            </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-2">{t('aboutPage.valuesTitle')}</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Value 1: Trust */}
            <div className="bg-brand-card p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-brand-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('aboutPage.valueTrust')}</h3>
                <p className="text-gray-400">{t('aboutPage.valueTrustText')}</p>
            </div>
            {/* Value 2: Innovation */}
            <div className="bg-brand-card p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-brand-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('aboutPage.valueInnovation')}</h3>
                <p className="text-gray-400">{t('aboutPage.valueInnovationText')}</p>
            </div>
            {/* Value 3: Excellence */}
            <div className="bg-brand-card p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-brand-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M17 3l4 4M3 17l4 4" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('aboutPage.valueExcellence')}</h3>
                <p className="text-gray-400">{t('aboutPage.valueExcellenceText')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
