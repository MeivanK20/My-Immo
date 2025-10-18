import React, { useState, useMemo } from 'react';
import { Property, NavigationFunction } from '../types';
import PropertyCard from '../components/PropertyCard';
import { locations } from '../data/locations';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';
import AutocompleteInput from '../components/common/AutocompleteInput';

interface HomePageProps {
  properties: Property[];
  onNavigate: NavigationFunction;
  onSearch: (filters: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ properties, onNavigate, onSearch }) => {
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const { t } = useLanguage();

  const handleSearch = () => {
    onSearch({ region, city, neighborhood });
    onNavigate('listings');
  };

  const featuredProperties = properties.slice(0, 3);
  
  const regions = useMemo(() => Object.keys(locations), []);
  
  const cities = useMemo(() => {
      if (region && locations[region as keyof typeof locations]) {
          return Object.keys(locations[region as keyof typeof locations]);
      }
      return [];
  }, [region]);

  const neighborhoods = useMemo(() => {
      if (region && city && locations[region as keyof typeof locations]?.[city as keyof any]) {
          return (locations[region as keyof typeof locations] as any)[city];
      }
      return [];
  }, [region, city]);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-white overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/seed/hero-bg/1920/1080')" }}
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
                <PropertyCard property={property} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
