

import React, { useState, useEffect } from 'react';
import { NavigationFunction, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/common/Button';

declare global {
  interface Window {
    Monetbil: any;
  }
}

interface PaymentPageProps {
  currentUser: User | null;
  onSuccessfulPayment: (paymentDetails: any) => void;
  onNavigate: NavigationFunction;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ currentUser, onSuccessfulPayment, onNavigate }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [monetbilReady, setMonetbilReady] = useState(false);

  useEffect(() => {
    // Check immediately in case the script is already loaded and executed.
    if (typeof window.Monetbil !== 'undefined') {
      setMonetbilReady(true);
      return;
    }

    // Poll to see when the Monetbil script has loaded and initialized.
    const interval = setInterval(() => {
      if (typeof window.Monetbil !== 'undefined') {
        setMonetbilReady(true);
        clearInterval(interval);
      }
    }, 500);

    // Cleanup the interval if the component unmounts.
    return () => clearInterval(interval);
  }, []);


  const handlePayment = () => {
    if (!currentUser) {
      setError('User not found.');
      return;
    }
    setError('');
    
    if (!monetbilReady) {
      setError('Monetbil payment service is not available. Please check your connection and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        amount: '10000',
        phone: currentUser.phone || '',
        country: 'CM',
        currency: 'XAF',
        email: currentUser.email,
        first_name: currentUser.name.split(' ')[0],
        last_name: currentUser.name.split(' ').slice(1).join(' '),
        service_key: 'e0Ic7UWrUiz56lNDI0mATUbe4ZcVXiDZ', 
        item_ref: `PREMIUM-${currentUser.id}-${Date.now()}`,
        title: t('pricingPage.premiumPlan'),
        description: t('pricingPage.subtitle'),
        onComplete: (payment: any) => {
          console.log('Paiement Monetbil réussi côté client :', payment);
          
          // La fonction onSuccessfulPayment gère la liaison sécurisée avec Supabase.
          // Elle enregistre la transaction dans la base de données avant de mettre à jour le profil de l'utilisateur.
          // C'est une étape cruciale pour la sécurité et l'audit.
          setIsLoading(false);
          onSuccessfulPayment(payment);
        },
        onClose: () => {
          setIsLoading(false);
        },
        onError: (err: any) => {
          console.error('Erreur de paiement:', err);
          setError(err.message || t('contactPage.sendError'));
          setIsLoading(false);
        }
      };

      // Déclenche le widget de paiement Monetbil
      window.Monetbil.pay(paymentData);

    } catch (e: any) {
        console.error("Failed to initiate Monetbil payment:", e);
        setError("An unexpected error occurred while launching the payment widget.");
        setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-280px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red mb-4"></div>
        <h2 className="text-2xl font-bold text-white">{t('paymentPage.processingTitle')}</h2>
        <p className="text-gray-400 mt-2">{t('paymentPage.processingSubtitle')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">{t('paymentPage.title')}</h1>
        <p className="text-lg text-gray-400 mt-2">{t('paymentPage.subtitle')}</p>
        <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
      </div>

      <div className="bg-brand-card p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b border-brand-dark pb-4 mb-6">
          <div>
            <p className="font-semibold text-lg text-white">{t('pricingPage.premiumPlan')}</p>
            <p className="text-sm text-gray-400">{t('paymentPage.billedMonthly')}</p>
          </div>
          <p className="text-2xl font-bold text-white">{t('pricingPage.premiumPrice')}</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">{t('paymentPage.paymentMethod')}</h2>
        <div className="p-4 bg-brand-dark/50 rounded-lg text-center">
            <p className="text-gray-300">{t('paymentPage.monetbilInfo')}</p>
        </div>
        
        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm text-center my-4">{error}</p>}
        {!monetbilReady && !error && (
          <p className="bg-yellow-500/20 text-yellow-300 p-3 rounded-md text-sm text-center my-4">Initializing payment service...</p>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8">
            <Button variant="secondary" onClick={() => onNavigate('pricing')} className="w-full sm:w-auto">{t('paymentPage.goBack')}</Button>
            <Button onClick={handlePayment} className="w-full sm:w-2/3" disabled={!monetbilReady || isLoading}>
              {t('paymentPage.payNow')} {t('pricingPage.premiumPrice')}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;