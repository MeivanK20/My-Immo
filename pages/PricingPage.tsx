

import React from 'react';
import { User } from '../types';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingPageProps {
  currentUser: User;
  onNavigateToPayment: () => void;
  onSelectFreePlan: () => void;
}

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);


const PricingPage: React.FC<PricingPageProps> = ({ currentUser, onNavigateToPayment, onSelectFreePlan }) => {
  const { t } = useLanguage();

  const isVisitor = currentUser.role === 'visitor';

  const PlanCard: React.FC<{
    planName: string, 
    price: string, 
    features: string[], 
    isCurrent: boolean, 
    isPremium?: boolean,
  }> = ({ planName, price, features, isCurrent, isPremium = false }) => {

    const renderButton = () => {
        if (isCurrent) {
            return <Button variant="secondary" className="w-full" disabled>{t('pricingPage.currentPlan')}</Button>;
        }
        if (isVisitor) {
            return isPremium 
                ? <Button onClick={onNavigateToPayment} className="w-full">{t('pricingPage.getStarted')}</Button>
                : <Button onClick={onSelectFreePlan} variant="secondary" className="w-full">{t('pricingPage.getStarted')}</Button>;
        }
        // At this point, user must be an agent on the free plan, looking at premium
        if (isPremium) {
            return <Button onClick={onNavigateToPayment} className="w-full">{t('pricingPage.upgradeNow')}</Button>;
        }
        return null;
    };

    return (
        <div className={`border rounded-lg p-8 flex flex-col transition-all duration-300 ${isPremium ? 'border-brand-red/50 transform md:scale-105 bg-brand-card shadow-2xl shadow-brand-red/10' : 'bg-brand-card/50 border-brand-card'}`}>
        <h3 className="text-2xl font-bold text-white text-center">{planName}</h3>
        <p className="text-center text-gray-400 mt-2">
            <span className="text-4xl font-extrabold text-white">{price}</span> / {t('pricingPage.monthly')}
        </p>
        <ul className="mt-8 space-y-4 flex-grow">
            {features.map((feature, index) => (
            <li key={index} className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-gray-300">{feature}</span>
            </li>
            ))}
        </ul>
        <div className="mt-8">
            {renderButton()}
        </div>
        </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">{t('pricingPage.title')}</h1>
        <p className="text-lg text-gray-400 mt-2">{t('pricingPage.subtitle')}</p>
        <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
        {/* Free Plan */}
        <PlanCard 
          planName={t('pricingPage.freePlan')}
          price={t('pricingPage.freePrice')}
          features={[t('pricingPage.freeFeature1'), t('pricingPage.freeFeature2'), t('pricingPage.freeFeature3')]}
          isCurrent={currentUser.subscription_plan === 'free'}
        />

        {/* Premium Plan */}
        <PlanCard 
          planName={t('pricingPage.premiumPlan')}
          price={t('pricingPage.premiumPrice')}
          features={[t('pricingPage.premiumFeature1'), t('pricingPage.premiumFeature2'), t('pricingPage.premiumFeature3'), t('pricingPage.premiumFeature4')]}
          isCurrent={currentUser.subscription_plan === 'premium'}
          isPremium={true}
        />
      </div>
    </div>
  );
};

export default PricingPage;
