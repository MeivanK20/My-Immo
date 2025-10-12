import React, { useState } from 'react';
import { Property, NavigationFunction } from '../types';
import PropertyCard from '../components/PropertyCard';
import { regions, locations } from '../data/locations';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface HomePageProps {
  properties: Property[];
  onNavigate: NavigationFunction;
  onSearch: (filters: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ properties, onNavigate, onSearch }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const { t } = useLanguage();

  const handleSearch = () => {
    onSearch({ region: selectedRegion, city: selectedCity });
    onNavigate('listings');
  };

  const featuredProperties = properties.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-white" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1600/800')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('homePage.heroTitle')}</h1>
          <p className="text-lg md:text-xl mb-8">{t('homePage.heroSubtitle')}</p>
          
          <div className="bg-white p-4 rounded-lg shadow-2xl md:flex items-center gap-4 max-w-2xl mx-auto">
            <select 
              value={selectedRegion} 
              onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCity(''); }}
              className="w-full md:w-1/3 p-3 mb-4 md:mb-0 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">{t('homePage.allRegions')}</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedRegion}
              className="w-full md:w-1/3 p-3 mb-4 md:mb-0 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">{t('homePage.allCities')}</option>
              {selectedRegion && locations[selectedRegion as keyof typeof locations] &&
                Object.keys(locations[selectedRegion as keyof typeof locations]).map(c => <option key={c} value={c}>{c}</option>)
              }
            </select>
            <Button onClick={handleSearch} className="w-full md:w-auto">{t('homePage.search')}</Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-brand-dark mb-2">{t('homePage.featuredListings')}</h2>
          <div className="w-24 h-1 bg-brand-red mx-auto mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;