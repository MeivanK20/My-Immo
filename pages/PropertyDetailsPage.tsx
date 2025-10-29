import React, { useState, useEffect } from 'react';
import { Property, User, Media, Message, Rating } from '../types';
import ContactAgentModal from '../components/ContactAgentModal';
import StarRating from '../components/common/StarRating';
import { useLanguage } from '../contexts/LanguageContext';

const GoldBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;
const SilverBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;
const BronzeBadge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" /></svg>;


interface PropertyDetailsPageProps {
  property: Property;
  agent: User | undefined;
  onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => void;
  currentUser: User | null;
  onAddRating: (propertyId: string, agentUid: string, rating: number) => void;
  ratings: Rating[];
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ property, agent, onSendMessage, currentUser, onAddRating, ratings }) => {
  const { t, locale } = useLanguage();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
  };

  const [selectedMedia, setSelectedMedia] = useState<Media | undefined>(property?.media?.[0]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    setSelectedMedia(property?.media?.[0]);
  }, [property]);

  if (!property) {
    return <div className="text-center py-16">{t('propertyDetailsPage.propertyNotFound')}</div>;
  }

  const { id, title, description, price, type, bedrooms, bathrooms, area, media, city, neighborhood, region, phone } = property;

  const currentUserRating = ratings.find(r => r.propertyId === id && r.visitorUid === currentUser?.uid)?.rating || 0;
  const canRate = currentUser && currentUser.role === 'visitor' && currentUser.uid !== property.agentUid;

  const agentRatings = ratings.filter(r => r.agentUid === agent?.uid);
  const averageAgentRating = agentRatings.length > 0 ? agentRatings.reduce((acc, curr) => acc + curr.rating, 0) / agentRatings.length : 0;


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
      <div className="flex items-center gap-2 justify-center" title={`${t('propertyDetailsPage.agentBadge')}: ${agent.badge}`}>
        {badgeContent}
        <span className="font-semibold text-white">{agent.badge}</span>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="bg-brand-card rounded-lg shadow-xl overflow-hidden">
          {/* Media Gallery */}
          <div className="p-4 sm:p-6">
            <div className="mb-4 bg-brand-dark rounded-lg">
              {selectedMedia?.type === 'image' ? (
                <img src={selectedMedia.url} alt={title} className="w-full max-h-[500px] object-contain rounded-lg"/>
              ) : selectedMedia?.type === 'video' ? (
                <video src={selectedMedia.url} controls autoPlay className="w-full max-h-[500px] rounded-lg" />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t('propertyDetailsPage.mediaNotAvailable')}</p>
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
                      {type === 'rent' ? t('propertyDetailsPage.rent') : t('propertyDetailsPage.sale')}
                  </span>
                  <h1 className="text-3xl font-bold text-white mt-2">{title}</h1>
                  <p className="text-md text-gray-400 mb-4">{neighborhood}, {city}, {region}</p>
                  <p className="text-3xl font-bold text-brand-red mb-6">{formatPrice(price)} {type === 'rent' && <span className="text-lg font-normal text-gray-400">{t('propertyDetailsPage.perMonth')}</span>}</p>

                  <h2 className="text-xl font-semibold text-white mb-2">{t('propertyDetailsPage.description')}</h2>
                  <p className="text-gray-300 mb-6 whitespace-pre-line">{description}</p>
                  
                  <h2 className="text-xl font-semibold text-white mb-3">{t('propertyDetailsPage.features')}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                      <div className="bg-brand-dark/50 p-4 rounded-lg">
                          <div className="font-bold text-lg text-white">{bedrooms}</div>
                          <div className="text-sm text-gray-400">{t('propertyDetailsPage.bedrooms')}</div>
                      </div>
                      <div className="bg-brand-dark/50 p-4 rounded-lg">
                          <div className="font-bold text-lg text-white">{bathrooms}</div>
                          <div className="text-sm text-gray-400">{t('propertyDetailsPage.bathrooms')}</div>
                      </div>
                      <div className="bg-brand-dark/50 p-4 rounded-lg">
                          <div className="font-bold text-lg text-white">{area} m²</div>
                          <div className="text-sm text-gray-400">{t('propertyDetailsPage.area')}</div>
                      </div>
                  </div>

                  {/* Rating Section */}
                  {canRate && (
                    <div className="mt-8 pt-6 border-t border-brand-dark">
                        <h2 className="text-xl font-semibold text-white mb-3">{t('propertyDetailsPage.rateThisProperty')}</h2>
                        <div className="flex items-center gap-4">
                            <StarRating rating={currentUserRating} onRatingChange={(r) => onAddRating(id, property.agentUid, r)} />
                            {currentUserRating > 0 && <span className="text-gray-400">{t('propertyDetailsPage.yourRating')}: {currentUserRating}/5</span>}
                        </div>
                    </div>
                  )}

              </div>

              {/* Agent Card */}
              <aside className="w-full md:w-1/3 mt-8 md:mt-0">
                  <div className="bg-brand-dark/50 p-6 rounded-lg border border-brand-card sticky top-28">
                      <h3 className="text-xl font-bold mb-4 text-white text-center">{t('propertyDetailsPage.contactAgent')}</h3>
                      {agent ? (
                          <div className="text-center">
                              <img 
                                src={agent.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=ef4444&color=fff`} 
                                alt={`Profil de ${agent.name}`}
                                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-brand-red"
                              />
                              <p className="font-semibold text-lg text-white">{agent.name}</p>
                              <p className="text-gray-400 text-sm">{agent.email}</p>
                              {phone && <p className="text-gray-400 text-sm mt-1">Tel: <a href={`tel:${phone}`} className="text-blue-400 hover:underline">{phone}</a></p>}
                              
                              <div className="mt-4 space-y-3 pt-4 border-t border-brand-dark/50">
                                {renderBadge()}
                                {averageAgentRating > 0 && (
                                  <div className="flex items-center gap-2 justify-center" title={t('propertyDetailsPage.averageRating')}>
                                    <StarRating rating={averageAgentRating} readOnly />
                                    <span className="text-gray-300 font-semibold">{averageAgentRating.toFixed(1)}/5</span>
                                  </div>
                                )}
                              </div>
                              <button onClick={() => setIsContactModalOpen(true)} className="mt-6 w-full bg-brand-red text-white py-2 rounded-md hover:bg-brand-red-dark transition hover:shadow-glow-red">{t('propertyDetailsPage.sendMessage')}</button>
                          </div>
                      ) : (
                          <p className="text-gray-400 text-center">{t('propertyDetailsPage.agentInfoNotAvailable')}</p>
                      )}
                  </div>
              </aside>
          </div>
        </div>
      </div>
      {agent && 
        <ContactAgentModal 
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          property={property}
          agent={agent}
          onSendMessage={onSendMessage}
          currentUser={currentUser}
        />
      }
    </>
  );
};

export default PropertyDetailsPage;
