
import React, { useState, useMemo } from 'react';
import { Property, NavigationFunction, User } from '../types';
import PropertyCard from '../components/PropertyCard';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';
import AutocompleteInput from '../components/common/AutocompleteInput';

interface HomePageProps {
  properties: Property[];
  onNavigate: NavigationFunction;
  onSearch: (filters: any) => void;
  user: User | null;
  allUsers: User[];
  locations: any;
}

const HomePage: React.FC<HomePageProps> = ({ properties, onNavigate, onSearch, user, allUsers, locations }) => {
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const { t } = useLanguage();

  const handleSearch = () => {
    onSearch({ region, city, neighborhood });
    onNavigate('listings');
  };

  const featuredProperties = properties.slice(0, 3);
  
  const regions = useMemo(() => Object.keys(locations), [locations]);
  
  const cities = useMemo(() => {
      if (region && locations[region as keyof typeof locations]) {
          return Object.keys(locations[region as keyof typeof locations]);
      }
      return [];
  }, [region, locations]);

  const neighborhoods = useMemo(() => {
      if (region && city && locations[region as keyof typeof locations]?.[city as keyof any]) {
          return (locations[region as keyof typeof locations] as any)[city];
      }
      return [];
  }, [region, city, locations]);

  const partners = [
    { name: 'Partner 1', logoUrl: 'https://i.imgur.com/zEud8Yz.png' },
    { name: 'Partner 2', logoUrl: 'https://i.imgur.com/KvZTbFi.png' },
    { name: 'Partner 3', logoUrl: 'https://i.imgur.com/pUqybpc.png' },
    { name: 'Partner 4', logoUrl: 'https://i.imgur.com/Eikn0h3.png' },
    { name: 'Partner 5', logoUrl: 'https://i.imgur.com/63vAuam.png' },
    { name: 'Partner 6', logoUrl: 'https://i.imgur.com/s2qFPpI.png' },
    { name: 'Partner 7', logoUrl: 'https://i.imgur.com/ycO4g2b.png' },
    { name: 'Partner 8', logoUrl: 'https://i.imgur.com/oiogd0B.png' },
  ];
  
  const getAgentForProperty = (property: Property) => allUsers.find(u => u.id === property.agent_id);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-white overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent"></div>
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">{t('homePage.heroTitle')}</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">{t('homePage.heroSubtitle')}</p>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-2xl md:flex items-center gap-4 max-w-4xl mx-auto border border-white/20">
            <AutocompleteInput
              value={region}
              onChange={(value) => { setRegion(value); setCity(''); setNeighborhood(''); }}
              suggestions={regions}
              placeholder={t('homePage.allRegions')}
            />
            <AutocompleteInput
              value={city}
              onChange={(value) => { setCity(value); setNeighborhood(''); }}
              suggestions={cities}
              placeholder={t('homePage.allCities')}
              disabled={!region || !regions.includes(region)}
            />
             <AutocompleteInput
              value={neighborhood}
              onChange={setNeighborhood}
              suggestions={neighborhoods}
              placeholder={t('homePage.allNeighborhoods')}
              disabled={!city || !cities.includes(city)}
            />
            <Button onClick={handleSearch} className="w-full mt-4 md:mt-0 md:w-auto flex-shrink-0">{t('homePage.search')}</Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-2">{t('homePage.featuredListings')}</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <PropertyCard property={property} onNavigate={onNavigate} user={user} agent={getAgentForProperty(property)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-brand-dark/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-2">{t('homePage.ourPartners')}</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto mb-12"></div>
          <div className="relative w-full overflow-hidden">
            {/* Gradient Fades */}
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-brand-dark/50 via-brand-dark/50 to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-brand-dark/50 via-brand-dark/50 to-transparent z-10"></div>
            
            <div className="flex animate-marquee whitespace-nowrap">
              {[...partners, ...partners].map((partner, index) => (
                <div key={index} className="group flex-shrink-0 w-64 mx-8 flex items-center justify-center h-40 p-6 bg-brand-card/20 rounded-2xl transition-all duration-300 hover:bg-brand-card/50 hover:shadow-glow-white hover:-translate-y-1">
                  <img 
                    src={partner.logoUrl} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
