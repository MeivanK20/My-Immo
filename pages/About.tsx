import React from 'react';
import { useLanguage } from '../services/languageContext';
import { Users, Target, Award } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl text-primary-100 max-w-2xl">{t('about.hero_subtitle')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('about.mission_desc')}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.vision')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('about.vision_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('about.values')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <Target className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('about.value_1_title')}</h3>
              <p className="text-gray-700">{t('about.value_1_desc')}</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <Users className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('about.value_2_title')}</h3>
              <p className="text-gray-700">{t('about.value_2_desc')}</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <Award className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('about.value_3_title')}</h3>
              <p className="text-gray-700">{t('about.value_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t('about.team_title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: t('about.team_member_1_name'), role: t('about.team_member_1_role') },
              { name: t('about.team_member_2_name'), role: t('about.team_member_2_role') },
              { name: t('about.team_member_3_name'), role: t('about.team_member_3_role') },
            ].map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-primary-100">{t('about.stat_1')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-primary-100">{t('about.stat_2')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-primary-100">{t('about.stat_3')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-primary-100">{t('about.stat_4')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
