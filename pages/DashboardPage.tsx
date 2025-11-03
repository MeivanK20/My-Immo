

import React, { useState } from 'react';
import { Property, User, NavigationFunction, Message } from '../types';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';
import Modal from '../components/common/Modal';

const GoldBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;
const SilverBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;
const BronzeBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;

interface DashboardPageProps {
  currentUser: User;
  properties: Property[];
  messages: Message[];
  onNavigate: NavigationFunction;
  onDeleteProperty: (id: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, properties, messages, onNavigate, onDeleteProperty }) => {
  const { t, locale } = useLanguage();
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null; }>({ isOpen: false, id: null });
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
  };

  const handleDeleteClick = (id: string) => setConfirmModal({ isOpen: true, id });
  const handleConfirmDelete = () => {
    if (confirmModal.id) onDeleteProperty(confirmModal.id);
    setConfirmModal({ isOpen: false, id: null });
  };
  const handleCloseModal = () => setConfirmModal({ isOpen: false, id: null });
  
  const myProperties = properties;
  const messageCount = messages.length;

  const getBadgeComponent = () => {
    switch(currentUser.badge) {
      case 'Gold': return <GoldBadge />;
      case 'Silver': return <SilverBadge />;
      case 'Bronze': return <BronzeBadge />;
      default: return null;
    }
  };
  const getBadgeText = () => {
    switch(currentUser.badge) {
      case 'Gold': return t('dashboardPage.badgeGold');
      case 'Silver': return t('dashboardPage.badgeSilver');
      case 'Bronze': return t('dashboardPage.badgeBronze');
      default: return t('dashboardPage.noBadge');
    }
  };

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        {/* User info */}
        <div className="flex items-center gap-4 mb-6">
          <img src={currentUser.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=ef4444&color=fff`} alt={currentUser.name} className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <p className="text-gray-400">{currentUser.email}</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">{t('dashboardPage.title')}</h1>

        {/* Rewards Section */}
        <div className="bg-brand-card rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">{t('dashboardPage.rewardsTitle')}</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-center">
              {getBadgeComponent()}
              <p className="font-semibold mt-1">{getBadgeText()}</p>
            </div>
            <div className="flex-1">
              <p className="text-gray-400">{t('dashboardPage.rewardsDescription')}</p>
              <p className="text-lg text-white font-bold mt-2">{t('dashboardPage.yourScore')}: <span className="text-brand-red">{currentUser.score?.toFixed(2) || '0.00'}</span></p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div/> {/* Empty div for spacing */}
          <div className="flex gap-4">
            <Button onClick={() => onNavigate('messages')} variant="secondary" className="relative">
              {t('dashboardPage.viewMessages')}
              {messageCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{messageCount}</span>}
            </Button>
            <Button onClick={() => onNavigate('addProperty')}>
              {t('dashboardPage.addProperty')}
            </Button>
          </div>
        </div>

        {/* Property list */}
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
                        <button onClick={() => handleDeleteClick(property.id)} className="text-red-500 hover:text-red-400">{t('dashboardPage.delete')}</button>
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

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        title={t('dashboardPage.confirmDeleteTitle')}
      >
        <div>
          <p className="text-gray-300">{t('deleteConfirm')}</p>
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

export default DashboardPage;