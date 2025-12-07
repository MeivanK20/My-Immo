import React from 'react';
import { useLanguage } from '../services/languageContext';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('privacy.title')}</h1>
          <p className="text-xl text-primary-100">{t('privacy.last_updated')}: 2025-12-07</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg max-w-none">
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.section_1')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.section_1_content')}</p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.section_2')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.section_2_content')}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>{t('privacy.section_2_bullet_1')}</li>
              <li>{t('privacy.section_2_bullet_2')}</li>
              <li>{t('privacy.section_2_bullet_3')}</li>
              <li>{t('privacy.section_2_bullet_4')}</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.section_3')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.section_3_content')}</p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.section_4')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.section_4_content')}</p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.section_5')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.section_5_content')}</p>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.section_6')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.section_6_content')}</p>
          </section>

          {/* Contact Section */}
          <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.contact_section')}</h2>
            <p className="text-gray-700 mb-2">
              {t('privacy.contact_text')}: <a href="mailto:contact@myimmo.com" className="text-primary-600 hover:underline">contact@myimmo.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
