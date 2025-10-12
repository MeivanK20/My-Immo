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

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-brand-dark">{t('dashboardPage.title')}</h1>
        <div className="flex gap-4">
          <Button onClick={() => onNavigate('messages')} variant="secondary" className="relative">
            {t('dashboardPage.viewMessages')}
            {messageCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{messageCount}</span>}
          </Button>
          <Button onClick={() => onNavigate('addProperty')}>{t('dashboardPage.addProperty')}</Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold">{t('dashboardPage.myListings', { count: myProperties.length })}</h2>
        </div>
        <div className="overflow-x-auto">
          {myProperties.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboardPage.tableTitle')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboardPage.tableCity')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboardPage.tablePrice')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboardPage.tableType')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboardPage.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myProperties.map(property => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-brand-red" onClick={() => onNavigate('propertyDetail', property)}>
                            {property.title}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatPrice(property.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {property.type === 'rent' ? t('dashboardPage.rent') : t('dashboardPage.sale')}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onNavigate('editProperty', property)} className="text-indigo-600 hover:text-indigo-900 mr-4">{t('dashboardPage.edit')}</button>
                      <button onClick={() => onDeleteProperty(property.id)} className="text-red-600 hover:text-red-900">{t('dashboardPage.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-gray-500">{t('dashboardPage.noProperties')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
