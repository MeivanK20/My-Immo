import React from 'react';
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-primary-100 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-72 overflow-hidden bg-primary-100">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
          {property.tag}
        </div>
        <button className="absolute top-4 right-4 p-2.5 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
          <Heart size={20} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900/80 to-transparent p-6">
          <p className="text-white font-bold text-2xl">
            {new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(property.price)}
          </p>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-primary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{property.title}</h3>
        <div className="flex items-center text-primary-600 text-sm mb-5">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-primary-100">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-primary-700 font-semibold">
              <Bed size={18} className="text-primary-600" />
              <span>{property.beds}</span>
            </div>
            <span className="text-xs text-primary-500 font-medium">Chambres</span>
          </div>
          <div className="w-px h-8 bg-primary-100"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-primary-700 font-semibold">
              <Bath size={18} className="text-primary-600" />
              <span>{property.baths}</span>
            </div>
            <span className="text-xs text-gray-400">Douches</span>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-gray-700 font-semibold">
              <Maximize size={18} className="text-primary-500" />
              <span>{property.sqft}</span>
            </div>
            <span className="text-xs text-gray-400">m²</span>
          </div>
        </div>
        
        <button className="w-full mt-2 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors">
          Voir détails
        </button>
      </div>
    </div>
  );
};