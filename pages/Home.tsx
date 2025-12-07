import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { PROPERTIES } from '../constants';
import { useLanguage } from '../services/languageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    region: '',
    city: '',
    neighborhood: '',
  });

  const regions = ['Littoral', 'Centre', 'Ouest', 'Nord', 'Sud', 'Est', 'Nord-Ouest', 'Sud-Ouest'];
  const cities: { [key: string]: string[] } = {
    'Littoral': ['Douala', 'Edea', 'Manfe'],
    'Centre': ['Yaoundé', 'Soa', 'Atok'],
    'Ouest': ['Bafoussam', 'Dschang', 'Foumban'],
    'Nord': ['Garoua', 'Ngaoundéré', 'Maroua'],
    'Sud': ['Ebolowa', 'Djoum', 'Kribi'],
    'Est': ['Bertoua', 'Batouri', 'Yokadouma'],
    'Nord-Ouest': ['Bamenda', 'Kumbo', 'Menchum'],
    'Sud-Ouest': ['Buea', 'Limbé', 'Kumba'],
  };
  
  const neighborhoods: { [key: string]: string[] } = {
    'Douala': ['Bastos', 'Bonapriso', 'Akwa', 'Bonamoussadi', 'Nlongkak', 'Deido', 'Logbaba'],
    'Yaoundé': ['Bastos', 'Yaoundé Centre', 'Messassi', 'Malakoff', 'Tsinga', 'Bikok'],
    'Bafoussam': ['Quartier Neuf', 'Centre Ville', 'Douala-Bafoussam'],
    'Buea': ['Molyko', 'Buea Centre', 'Down Town'],
    'Kribi': ['Kribi Centre', 'Kribi Plage'],
    'Bamenda': ['Bamenda Centre', 'Bamenda GRA'],
    'Edea': ['Edea Centre', 'Edea Port'],
    'Bertoua': ['Bertoua Centre', 'Betare-Oya'],
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => {
      const updated = { ...prev, [field]: value };
      // Reset neighborhood if city changes
      if (field === 'city') {
        updated.neighborhood = '';
      }
      return updated;
    });
  };

  const handleSearch = () => {
    // Logic for search functionality
    console.log('Searching with filters:', filters);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[550px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-e25fa1108056?q=80&w=2070&auto=format&fit=crop"
            alt="Maison de rêve"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/50"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {t('home.hero_title')}
          </h1>
          <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
            {t('home.hero_subtitle')}
          </p>

          {/* Advanced Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Region Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  {t('home.region')}
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-700 text-sm"
                >
                  <option value="">{t('home.all_regions')}</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  {t('home.city')}
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-700 text-sm"
                  disabled={!filters.region}
                >
                  <option value="">{t('home.all_cities')}</option>
                  {filters.region && cities[filters.region]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Neighborhood Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  {t('home.neighborhood')}
                </label>
                <select
                  value={filters.neighborhood}
                  onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-700 text-sm"
                  disabled={!filters.city}
                >
                  <option value="">{t('home.all_neighborhoods')}</option>
                  {filters.city && neighborhoods[filters.city]?.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  {t('home.search_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">{t('home.featured')}</h2>
            <p className="text-gray-500 mt-2">{t('home.featured_desc')}</p>
          </div>
          <button className="hidden sm:block text-primary-600 font-semibold hover:text-primary-700 hover:underline">
            {t('home.view_all')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="mt-12 text-center sm:hidden">
           <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
             {t('home.view_all_properties')}
           </button>
        </div>
      </div>

      {/* Partners Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white">{t('home.partners')}</h2>
          <p className="text-gray-400 mt-2">{t('home.partners_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Agence Prestige', logo: '🏢', description: 'Douala & Yaoundé' },
            { name: 'Royal Immobilier', logo: '👑', description: 'Expertise depuis 2010' },
            { name: 'Habitat Plus', logo: '🏠', description: 'Services complets' },
            { name: 'Elite Properties', logo: '✨', description: 'Propriétés de luxe' },
          ].map((partner) => (
            <div key={partner.name} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{partner.logo}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{partner.name}</h3>
              <p className="text-sm text-gray-600">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};