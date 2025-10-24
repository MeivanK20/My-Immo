import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { jobs } from '../data/careers';
import { Job } from '../types';
import Button from '../components/common/Button';

const BenefitsIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: { [key: string]: React.ReactNode } = {
        health: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
        hours: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        learning: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-3.172 3.172a1 1 0 001.414 1.414l3.172-3.172m15.482 0l3.172 3.172a1 1 0 001.414-1.414l-3.172-3.172" /></svg>,
        events: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    };
    return icons[name] || null;
};

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
    const { t } = useLanguage();
    const mailtoLink = `mailto:hr@myimmo.com?subject=${encodeURIComponent(`Application for ${t(job.titleKey)}`)}`;
    return (
        <div className="bg-brand-card rounded-lg shadow-lg p-6 flex flex-col sm:flex-row justify-between items-start gap-4 transition-all hover:border-brand-red/50 border border-transparent hover:shadow-glow-red">
            <div>
                <h3 className="text-xl font-bold text-white">{t(job.titleKey)}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <span>{job.location}</span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                    <span>{t(job.typeKey)}</span>
                </div>
                <p className="text-gray-300 mt-3">{t(job.descriptionKey)}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex-shrink-0">
                <Button onClick={() => window.location.href = mailtoLink} variant="primary">{t('careersPage.apply')}</Button>
            </div>
        </div>
    );
};

const CareersPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-80 flex items-center justify-center text-white"
                style={{ backgroundImage: "url('https://picsum.photos/seed/careers-hero/1600/600')" }}
            >
                <div className="absolute inset-0 bg-brand-dark opacity-60"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">{t('careersPage.heroTitle')}</h1>
                    <p className="text-lg md:text-xl mt-4 text-gray-300">{t('careersPage.heroSubtitle')}</p>
                </div>
            </section>
            
            {/* Why Join Us Section */}
            <section className="py-16 bg-brand-card">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">{t('careersPage.whyJoinUs')}</h2>
                    <div className="w-24 h-1 bg-brand-red mx-auto mb-6"></div>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {t('careersPage.whyJoinUsText')}
                    </p>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">{t('careersPage.benefitsTitle')}</h2>
                    <div className="w-24 h-1 bg-brand-red mx-auto mb-12"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="bg-brand-card/50 p-6 rounded-lg">
                            <BenefitsIcon name="health" />
                            <h3 className="text-xl font-semibold text-white mt-4 mb-2">{t('careersPage.benefit1_title')}</h3>
                            <p className="text-gray-400">{t('careersPage.benefit1_text')}</p>
                        </div>
                        <div className="bg-brand-card/50 p-6 rounded-lg">
                            <BenefitsIcon name="hours" />
                            <h3 className="text-xl font-semibold text-white mt-4 mb-2">{t('careersPage.benefit2_title')}</h3>
                            <p className="text-gray-400">{t('careersPage.benefit2_text')}</p>
                        </div>
                        <div className="bg-brand-card/50 p-6 rounded-lg">
                            <BenefitsIcon name="learning" />
                            <h3 className="text-xl font-semibold text-white mt-4 mb-2">{t('careersPage.benefit3_title')}</h3>
                            <p className="text-gray-400">{t('careersPage.benefit3_text')}</p>
                        </div>
                        <div className="bg-brand-card/50 p-6 rounded-lg">
                            <BenefitsIcon name="events" />
                            <h3 className="text-xl font-semibold text-white mt-4 mb-2">{t('careersPage.benefit4_title')}</h3>
                            <p className="text-gray-400">{t('careersPage.benefit4_text')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 bg-brand-dark">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">{t('careersPage.openPositions')}</h2>
                    <div className="w-24 h-1 bg-brand-red mx-auto mb-12"></div>
                    <div className="max-w-4xl mx-auto space-y-6">
                        {jobs.length > 0 ? (
                            jobs.map(job => <JobCard key={job.id} job={job} />)
                        ) : (
                            <div className="text-center py-12 bg-brand-card rounded-lg">
                                <p className="text-xl text-gray-400">{t('careersPage.noOpenPositions')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

// FIX: Add default export to resolve import error in App.tsx
export default CareersPage;