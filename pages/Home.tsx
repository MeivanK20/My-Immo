import React, { useState } from 'react';
import { Search, MapPin, Home as HomeIcon } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { PROPERTIES } from '../constants';

export const Home: React.FC = () => {
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
            alt="Immobilier Cameroun"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/50"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            TROUVEZ LE LOGEMENT DE VOTRE CHOIX
          </h1>

          {/* Advanced Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Region Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Région
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-700 text-sm"
                >
                  <option value="">Toutes régions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <HomeIcon size={16} />
                  Ville
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-700 text-sm"
                  disabled={!filters.region}
                >
                  <option value="">Toutes villes</option>
                  {filters.region && cities[filters.region]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Neighborhood Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Quartier
                </label>
                <select
                  value={filters.neighborhood}
                  onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-700 text-sm"
                  disabled={!filters.city}
                >
                  <option value="">Tous quartiers</option>
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
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section removed - replaced by Partners below */}

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Biens à la une</h2>
            <p className="text-gray-500 mt-2">Les meilleures opportunités immobilières du moment</p>
          </div>
          <button className="hidden sm:block text-primary-600 font-semibold hover:text-primary-700 hover:underline">
            Voir tout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="mt-12 text-center sm:hidden">
           <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
             Voir toutes les propriétés
           </button>
        </div>
      
      {/* Partners Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white">Nos Partenaires</h3>
          <p className="text-gray-500 mt-2">Nous travaillons avec des partenaires de confiance</p>
        </div>

        <div className="relative overflow-hidden">
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .carousel-track {
              animation: scroll 20s linear infinite;
            }
            .carousel-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="flex carousel-track">
            {[
              'https://imgur.com/zEud8Yz.png',
              'https://imgur.com/KvZTbFi.png',
              'https://imgur.com/pUqybpc.png',
              'https://imgur.com/Eikn0h3.png',
              'https://imgur.com/63vAuam.png',
              'https://imgur.com/s2qFPpI.png',
              'https://imgur.com/zEud8Yz.png',
              'https://imgur.com/KvZTbFi.png',
              'https://imgur.com/pUqybpc.png',
              'https://imgur.com/Eikn0h3.png',
              'https://imgur.com/63vAuam.png',
              'https://imgur.com/s2qFPpI.png',
            ].map((logo, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-center px-8 py-4 bg-white rounded-lg shadow-sm mx-4 flex-shrink-0"
                style={{ minWidth: '160px' }}
              >
                <img src={logo} alt={`Partenaire ${idx + 1}`} className="h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};