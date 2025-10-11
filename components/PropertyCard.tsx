// Fix: Implement the PropertyCard component. This file was empty, causing it to not be recognized as a module.
import React from 'react';
import { Property, NavigationFunction } from '../types';

interface PropertyCardProps {
  property: Property;
  onNavigate: NavigationFunction;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onNavigate }) => {
  const { title, media, price, type, bedrooms, bathrooms, area, city, neighborhood } = property;
  const firstMedia = media?.[0];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer" onClick={() => onNavigate('propertyDetail', property)}>
      <div className="relative">
        {firstMedia?.type === 'image' ? (
          <img className="w-full h-56 object-cover" src={firstMedia.url} alt={title} />
        ) : firstMedia?.type === 'video' ? (
           <div className="relative w-full h-56 bg-black">
              <video className="w-full h-full object-cover" muted loop>
                 <source src={firstMedia.url} type={firstMedia.url.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                 <svg className="w-12 h-12 text-white opacity-75" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
              </div>
           </div>
        ) : (
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Média non disponible</span>
          </div>
        )}
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${type === 'rent' ? 'bg-blue-500' : 'bg-green-500'}`}>
          {type === 'rent' ? 'À Louer' : 'À Vendre'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-brand-dark mb-1 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{neighborhood}, {city}</p>
        <p className="text-xl font-bold text-brand-red mb-3">{formatPrice(price)} {type === 'rent' && '/ mois'}</p>
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-3">
          <span>{bedrooms} ch.</span>
          <span>{bathrooms} sdb.</span>
          <span>{area} m²</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;