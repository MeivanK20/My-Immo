import React from 'react';
import { useLanguage } from '../services/languageContext';
import { ExternalLink } from 'lucide-react';

export const Careers: React.FC = () => {
  const { t } = useLanguage();

  const jobs = [
    {
      id: 1,
      title_key: 'careers.job_1_title',
      location_key: 'careers.job_location',
      type_key: 'careers.job_type_full',
      desc_key: 'careers.job_1_desc',
    },
    {
      id: 2,
      title_key: 'careers.job_2_title',
      location_key: 'careers.job_location',
      type_key: 'careers.job_type_full',
      desc_key: 'careers.job_2_desc',
    },
    {
      id: 3,
      title_key: 'careers.job_3_title',
      location_key: 'careers.job_location',
      type_key: 'careers.job_type_part',
      desc_key: 'careers.job_3_desc',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('careers.title')}</h1>
          <p className="text-xl text-primary-100">{t('careers.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Why Join Us */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('careers.why_join')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('careers.benefit_1_title')}</h3>
              <p className="text-gray-700">{t('careers.benefit_1_desc')}</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('careers.benefit_2_title')}</h3>
              <p className="text-gray-700">{t('careers.benefit_2_desc')}</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('careers.benefit_3_title')}</h3>
              <p className="text-gray-700">{t('careers.benefit_3_desc')}</p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('careers.open_positions')}</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(job.title_key)}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>{t(job.location_key)}</span>
                      <span>•</span>
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full">{t(job.type_key)}</span>
                    </div>
                    <p className="text-gray-700 mt-3">{t(job.desc_key)}</p>
                  </div>
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                    {t('careers.apply_btn')}
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Culture Section */}
        <section className="mt-20 bg-primary-50 p-12 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('careers.culture_title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('careers.culture_desc')}</p>
        </section>
      </div>
    </div>
  );
};
