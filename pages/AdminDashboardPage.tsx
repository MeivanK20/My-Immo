import React from 'react';
import { Property, User, NavigationFunction } from '../types';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminDashboardPageProps {
  allUsers: User[];
  allProperties: Property[];
  onNavigate: NavigationFunction;
  onDeleteUser: (uid: string) => void;
  onDeleteProperty: (id: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ allUsers, allProperties, onNavigate, onDeleteUser, onDeleteProperty }) => {
  const { t, locale } = useLanguage();

  const getAgentName = (agentUid: string) => {
    return allUsers.find(u => u.uid === agentUid)?.name || 'N/A';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">{t('adminDashboardPage.title')}</h1>
      
      {/* User Management */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="p-6">
          <h2 className="text-xl font-semibold">{t('adminDashboardPage.userManagement')} ({allUsers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          {allUsers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminDashboardPage.tableName')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminDashboardPage.tableEmail')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminDashboardPage.tableRole')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminDashboardPage.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map(user => (
                  <tr key={user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onDeleteUser(user.uid)} className="text-red-600 hover:text-red-900">{t('adminDashboardPage.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-gray-500">{t('adminDashboardPage.noUsers')}</p>
          )}
        </div>
      </div>

      {/* Property Management */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold">{t('adminDashboardPage.propertyManagement')} ({allProperties.length})</h2>
        </div>
        <div className="overflow-x-auto">
          {allProperties.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminDashboardPage.tablePropertyTitle')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminDashboardPage.tableAgent')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboardPage.tablePrice')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminDashboardPage.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allProperties.map(property => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getAgentName(property.agentUid)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatPrice(property.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onNavigate('propertyDetail', property)} className="text-indigo-600 hover:text-indigo-900 mr-4">{t('adminDashboardPage.view')}</button>
                      <button onClick={() => onDeleteProperty(property.id)} className="text-red-600 hover:text-red-900">{t('adminDashboardPage.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-gray-500">{t('adminDashboardPage.noProperties')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;