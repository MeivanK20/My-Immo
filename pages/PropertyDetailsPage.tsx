// Fix: Implement the PropertyDetailsPage component. This file was empty.
import React, { useState, useEffect } from 'react';
import { Property, User, Media } from '../types';

interface PropertyDetailsPageProps {
  property: Property;
  agent: User | undefined;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
};

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ property, agent }) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | undefined>(property?.media?.[0]);

  useEffect(() => {
    setSelectedMedia(property?.media?.[0]);
  }, [property]);

  if (!property) {
    return <div className="text-center py-16">Propriété non trouvée.</div>;
  }

  const { title, description, price, type, bedrooms, bathrooms, area, media, city, neighborhood, region } = property;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Media Gallery */}
        <div className="p-4">
           <div className="mb-4 bg-black rounded-lg">
             {selectedMedia?.type === 'image' ? (
               <img src={selectedMedia.url} alt={title} className="w-full max-h-[500px] object-contain rounded-lg"/>
             ) : selectedMedia?.type === 'video' ? (
               <video src={selectedMedia.url} controls autoPlay className="w-full max-h-[500px] rounded-lg" />
             ) : (
               <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                 <p className="text-gray-500">Média non disponible</p>
               </div>
             )}
           </div>
           {/* Thumbnails */}
           {media && media.length > 1 && (
             <div className="flex space-x-2 overflow-x-auto pb-2">
               {media.map((item, index) => (
                 <button 
                    key={index} 
                    onClick={() => setSelectedMedia(item)} 
                    className={`flex-shrink-0 w-24 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${item.url === selectedMedia?.url ? 'border-brand-red scale-105' : 'border-transparent'}`}
                 >
                   {item.type === 'image' ? (
                     <img src={item.url} alt={`thumb ${index}`} className="w-full h-full object-cover" />
                   ) : (
                     <div className="relative w-full h-full bg-black">
                       <video src={item.url} className="w-full h-full object-cover" muted />
                       <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                           <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                           </svg>
                       </div>
                     </div>
                   )}
                 </button>
               ))}
             </div>
           )}
        </div>
        
        <div className="p-6 md:flex gap-8">
            {/* Main details */}
            <div className="w-full md:w-2/3">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${type === 'rent' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    {type === 'rent' ? 'À Louer' : 'À Vendre'}
                </span>
                <h1 className="text-3xl font-bold text-brand-dark mt-2">{title}</h1>
                <p className="text-md text-gray-500 mb-4">{neighborhood}, {city}, {region}</p>
                <p className="text-3xl font-bold text-brand-red mb-6">{formatPrice(price)} {type === 'rent' && '/ mois'}</p>

                <h2 className="text-xl font-semibold text-brand-dark mb-2">Description</h2>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{description}</p>
                
                <h2 className="text-xl font-semibold text-brand-dark mb-3">Caractéristiques</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-bold text-lg">{bedrooms}</div>
                        <div className="text-sm text-gray-600">Chambres</div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-bold text-lg">{bathrooms}</div>
                        <div className="text-sm text-gray-600">Salles de bain</div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-bold text-lg">{area} m²</div>
                        <div className="text-sm text-gray-600">Superficie</div>
                    </div>
                </div>
            </div>

            {/* Agent Card */}
            <aside className="w-full md:w-1/3 mt-8 md:mt-0">
                <div className="bg-white p-6 rounded-lg shadow-md border sticky top-24">
                    <h3 className="text-xl font-bold mb-4 text-brand-dark">Contacter l'agent</h3>
                    {agent ? (
                        <div>
                            <p className="font-semibold text-lg">{agent.name}</p>
                            <p className="text-gray-600">{agent.email}</p>
                            <button className="mt-4 w-full bg-brand-red text-white py-2 rounded-md hover:bg-brand-red-dark transition">Envoyer un message</button>
                        </div>
                    ) : (
                        <p>Information de l'agent non disponible.</p>
                    )}
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;