import React, { useState } from 'react';
import { Property, User, NavigationFunction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

interface AdminDashboardPageProps {
  allUsers: User[];
  allProperties: Property[];
  onNavigate: NavigationFunction;
  onDeleteUser: (uid: string) => void;
  onDeleteProperty: (id: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ allUsers, allProperties, onNavigate, onDeleteUser, onDeleteProperty }) => {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'properties'>('users');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'user' | 'property' | null;
    id: string | null;
    message: string;
  }>({ isOpen: false, type: null, id: null, message: '' });

  const getAgentName = (agentUid: string) => {
    return allUsers.find(u => u.uid === agentUid)?.name || 'N/A';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
  };

  const handleDeleteClick = (type: 'user' | 'property', id: string) => {
    const message = type === 'user' 
      ? t('adminDashboardPage.deleteUserConfirm') 
      : t('deleteConfirm');
    setConfirmModal({ isOpen: true, type, id, message });
  };

  const handleConfirmDelete = () => {
    if (confirmModal.type === 'user' && confirmModal.id) {
      onDeleteUser(confirmModal.id);
    } else if (confirmModal.type === 'property' && confirmModal.id) {
      onDeleteProperty(confirmModal.id);
    }
    setConfirmModal({ isOpen: false, type: null, id: null, message: '' });
  };
  
  const handleCloseModal = () => {
    setConfirmModal({ isOpen: false, type: null, id: null, message: '' });
  };

  const activeTabClasses = 'border-brand-red text-brand-red';
  const inactiveTabClasses = 'border-transparent text-gray-400 hover:text-white hover:border-gray-500';

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">{t('adminDashboardPage.title')}</h1>
        
        {/* Tabs Navigation */}
        <div className="border-b border-brand-card mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'users' ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('adminDashboardPage.usersTab')} ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'properties' ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('adminDashboardPage.propertiesTab')} ({allProperties.length})
            </button>
          </nav>
        </div>

        {/* Conditional Content */}
        {activeTab === 'users' && (
          <div className="bg-brand-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white">{t('adminDashboardPage.userManagement')}</h2>
            </div>
            <div className="overflow-x-auto">
              {allUsers.length > 0 ? (
                <table className="min-w-full divide-y divide-brand-dark">
                  <thead className="bg-brand-dark/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableName')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableEmail')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableRole')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableActions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-brand-card divide-y divide-brand-dark">
                    {allUsers.map(user => (
                      <tr key={user.uid} className="hover:bg-brand-dark/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDeleteClick('user', user.uid)} className="text-red-500 hover:text-red-400">{t('adminDashboardPage.delete')}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-center text-gray-400">{t('adminDashboardPage.noUsers')}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="bg-brand-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white">{t('adminDashboardPage.propertyManagement')}</h2>
            </div>
            <div className="overflow-x-auto">
              {allProperties.length > 0 ? (
                <table className="min-w-full divide-y divide-brand-dark">
                  <thead className="bg-brand-dark/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tablePropertyTitle')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableAgent')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboardPage.tablePrice')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableActions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-brand-card divide-y divide-brand-dark">
                    {allProperties.map(property => (
                      <tr key={property.id} className="hover:bg-brand-dark/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{property.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getAgentName(property.agentUid)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-semibold">{formatPrice(property.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => onNavigate('propertyDetail', property)} className="text-indigo-400 hover:text-indigo-300 mr-4">{t('adminDashboardPage.view')}</button>
                          <button onClick={() => handleDeleteClick('property', property.id)} className="text-red-500 hover:text-red-400">{t('adminDashboardPage.delete')}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-center text-gray-400">{t('adminDashboardPage.noProperties')}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        title={t('adminDashboardPage.confirmDeleteTitle')}
      >
        <div>
          <p className="text-gray-300">{confirmModal.message}</p>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleConfirmDelete}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminDashboardPage;
