import React from 'react';
import { Property, NavigationFunction, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const GoldBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;
const SilverBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;
const BronzeBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;


interface PropertyCardProps {
  property: Property;
  onNavigate: NavigationFunction;
  user: User | null;
  agent: User | undefined;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onNavigate, user, agent }) => {
  const { t, locale } = useLanguage();

  const handleClick = () => {
    if (user) {
      onNavigate('propertyDetail', property);
    } else {
      onNavigate('register');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
  };
  
  const { title, media, price, type, bedrooms, bathrooms, area, city, neighborhood } = property;
  const firstMedia = media?.[0];

  const renderBadge = () => {
    if (!agent?.badge) return null;
    let badgeContent;
    switch(agent.badge) {
      case 'Gold': badgeContent = <GoldBadge />; break;
      case 'Silver': badgeContent = <SilverBadge />; break;
      case 'Bronze': badgeContent = <BronzeBadge />; break;
      default: return null;
    }
    return (
      <div className="absolute top-2 left-2 p-1 bg-brand-dark/50 rounded-full backdrop-blur-sm z-10" title={`${t('propertyDetailsPage.agentBadge')}: ${agent.badge}`}>
        {badgeContent}
      </div>
    );
  }

  return (
    <div className="bg-brand-card rounded-lg shadow-lg overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-glow-red hover:-translate-y-2 border border-transparent hover:border-brand-red/50" onClick={handleClick}>
      <div className="relative overflow-hidden">
        {renderBadge()}
        {firstMedia?.type === 'image' ? (
          <img className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" src={firstMedia.url} alt={title} />
        ) : firstMedia?.type === 'video' ? (
           <div className="relative w-full h-56 bg-black">
              <video className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" muted loop>
                 <source src={firstMedia.url} type={firstMedia.url.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                 <svg className="w-12 h-12 text-white opacity-75 transform transition-transform duration-300 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
              </div>
           </div>
        ) : (
          <div className="w-full h-56 bg-brand-dark flex items-center justify-center">
            <span className="text-gray-500">{t('propertyDetailsPage.mediaNotAvailable')}</span>
          </div>
        )}
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-semibold backdrop-blur-sm ${type === 'rent' ? 'bg-blue-500/80' : 'bg-green-500/80'}`}>
          {type === 'rent' ? t('propertyCard.rent') : t('propertyCard.sale')}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">{title}</h3>
        <p className="text-sm text-gray-400 mb-2">{neighborhood}, {city}</p>
        <p className="text-xl font-bold text-brand-red mb-3">{formatPrice(price)} {type === 'rent' && <span className="text-sm font-normal text-gray-400">{t('propertyCard.perMonth')}</span>}</p>
        <div className="flex justify-between items-center text-sm text-gray-300 border-t border-brand-dark pt-3 mt-3">
          <span>{bedrooms} {t('propertyCard.bedroomsShort')}</span>
          <span>{bathrooms} {t('propertyCard.bathroomsShort')}</span>
          <span>{area} m²</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
