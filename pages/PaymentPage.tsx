import React, { useState } from 'react';
import { NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import CardIcon from '../components/icons/CardIcon';
import OrangeMoneyIcon from '../components/icons/OrangeMoneyIcon';
import MtnMoneyIcon from '../components/icons/MtnMoneyIcon';

interface PaymentPageProps {
  onSuccessfulPayment: () => void;
  onNavigate: NavigationFunction;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onSuccessfulPayment, onNavigate }) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setError('');
    if (!selectedMethod) return;

    if ((selectedMethod === 'orange' || selectedMethod === 'mtn') && !phoneNumber.trim()) {
      setError(t('paymentPage.phoneRequiredError'));
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onSuccessfulPayment();
      // The onSuccessfulPayment function will handle navigation to the dashboard
    }, 2500);
  };

  const paymentMethods = [
    { id: 'card', name: t('paymentPage.creditCard'), icon: <CardIcon /> },
    { id: 'orange', name: t('paymentPage.orangeMoney'), icon: <OrangeMoneyIcon /> },
    { id: 'mtn', name: t('paymentPage.mtnMobileMoney'), icon: <MtnMoneyIcon /> },
  ];

  if (isProcessing) {
    return (
      <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-280px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red mb-4"></div>
        <h2 className="text-2xl font-bold text-brand-dark">{t('paymentPage.processingTitle')}</h2>
        <p className="text-gray-600 mt-2">{t('paymentPage.processingSubtitle')}</p>
      </div>
    );
  }
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setError('');
    if (methodId !== 'orange' && methodId !== 'mtn') {
      setPhoneNumber('');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-dark">{t('paymentPage.title')}</h1>
        <p className="text-lg text-gray-600 mt-2">{t('paymentPage.subtitle')}</p>
        <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <p className="font-semibold text-lg text-brand-dark">{t('pricingPage.premiumPlan')}</p>
            <p className="text-sm text-gray-500">{t('paymentPage.billedMonthly')}</p>
          </div>
          <p className="text-2xl font-bold text-brand-dark">{t('pricingPage.premiumPrice')}</p>
        </div>

        <h2 className="text-xl font-semibold text-brand-dark mb-4">{t('paymentPage.selectMethod')}</h2>

        <div className="space-y-4 mb-6">
          {paymentMethods.map(method => (
            <div key={method.id}>
              <button
                onClick={() => handleMethodSelect(method.id)}
                className={`w-full flex items-center p-4 border rounded-lg text-left transition-all duration-200 ${selectedMethod === method.id ? 'border-brand-red ring-2 ring-brand-red bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-4">
                  {method.icon}
                </div>
                <span className="font-medium text-brand-dark">{method.name}</span>
                <div className="ml-auto">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-brand-red' : 'border-gray-400'}`}>
                    {selectedMethod === method.id && <div className="w-3 h-3 rounded-full bg-brand-red"></div>}
                  </div>
                </div>
              </button>
              {selectedMethod === method.id && (method.id === 'orange' || method.id === 'mtn') && (
                  <div className="p-4 bg-gray-50 rounded-b-lg -mt-2 border border-t-0 border-gray-300 animate-fade-in">
                    <Input
                      label={t('paymentPage.phoneNumberLabel')}
                      id="phone-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="6XX XXX XXX"
                      required
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">{t('paymentPage.momoDescription')}</p>
                  </div>
                )}
            </div>
          ))}
        </div>
        
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button variant="secondary" onClick={() => onNavigate('pricing')} className="w-full sm:w-auto">{t('paymentPage.goBack')}</Button>
            <Button onClick={handlePayment} disabled={!selectedMethod} className="w-full sm:w-2/3">
              {t('paymentPage.payNow')} {t('pricingPage.premiumPrice')}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
