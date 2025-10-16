import React from 'react';
import { Property, User, NavigationFunction } from '../types';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardPageProps {
  user: User;
  properties: Property[];
  onNavigate: NavigationFunction;
  onDeleteProperty: (id: string) => void;
  messageCount: number;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, properties, onNavigate, onDeleteProperty, messageCount }) => {
  const { t, locale } = useLanguage();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
  };

  const myProperties = properties; // Properties are pre-filtered in App.tsx
  const isFreePlan = user.role === 'agent' && user.subscriptionPlan === 'free';
  const canAddProperty = !isFreePlan || myProperties.length < 1;

  return (
    <div className="container mx-auto px-6 py-8">
      {isFreePlan && myProperties.length >= 1 && (
        <div className="bg-blue-500/20 border-l-4 border-blue-400 text-blue-200 p-4 rounded-md mb-6 flex justify-between items-center">
          <div>
            <p className="font-bold">{t('dashboardPage.upgradePrompt')}</p>
            <p>{t('dashboardPage.freePlanLimit')}: 1 / 1</p>
          </div>
          <Button onClick={() => onNavigate('pricing')} variant="primary">{t('dashboardPage.upgradeNow')}</Button>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">{t('dashboardPage.title')}</h1>
        <div className="flex gap-4">
          <Button onClick={() => onNavigate('messages')} variant="secondary" className="relative">
            {t('dashboardPage.viewMessages')}
            {messageCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{messageCount}</span>}
          </Button>
          <Button 
            onClick={() => onNavigate(canAddProperty ? 'addProperty' : 'pricing')}
            title={!canAddProperty ? t('dashboardPage.upgradePrompt') : ''}
          >
            {t('dashboardPage.addProperty')}
          </Button>
        </div>
      </div>
      
      <div className="bg-brand-card rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white">{t('dashboardPage.myListings', { count: myProperties.length })}</h2>
        </div>
        <div className="overflow-x-auto">
          {myProperties.length > 0 ? (
            <table className="min-w-full divide-y divide-brand-dark">
              <thead className="bg-brand-dark/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboardPage.tableTitle')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboardPage.tableCity')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboardPage.tablePrice')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboardPage.tableType')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboardPage.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="bg-brand-card divide-y divide-brand-dark">
                {myProperties.map(property => (
                  <tr key={property.id} className="hover:bg-brand-dark/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white cursor-pointer hover:text-brand-red" onClick={() => onNavigate('propertyDetail', property)}>
                            {property.title}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{property.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-semibold">{formatPrice(property.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.type === 'rent' ? 'bg-blue-500/20 text-blue-200' : 'bg-green-500/20 text-green-200'}`}>
                            {property.type === 'rent' ? t('dashboardPage.rent') : t('dashboardPage.sale')}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onNavigate('editProperty', property)} className="text-indigo-400 hover:text-indigo-300 mr-4">{t('dashboardPage.edit')}</button>
                      <button onClick={() => onDeleteProperty(property.id)} className="text-red-500 hover:text-red-400">{t('dashboardPage.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-gray-400">{t('dashboardPage.noProperties')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
