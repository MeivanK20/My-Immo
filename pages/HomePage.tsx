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
        className="relative h-[600px] flex items-center justify-center text-white overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/seed/hero-bg/1920/1080')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent"></div>
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">{t('homePage.heroTitle')}</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">{t('homePage.heroSubtitle')}</p>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-2xl md:flex items-center gap-4 max-w-2xl mx-auto border border-white/20">
            <select 
              value={selectedRegion} 
              onChange={(e) => { setSelectedRegion(e.target.value); setSelectedCity(''); }}
              className="w-full md:w-1/3 p-3 mb-4 md:mb-0 bg-white/10 text-white border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red placeholder-gray-400"
            >
              <option value="" style={{color: 'black'}}>{t('homePage.allRegions')}</option>
              {regions.map(r => <option key={r} value={r} style={{color: 'black'}}>{r}</option>)}
            </select>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedRegion}
              className="w-full md:w-1/3 p-3 mb-4 md:mb-0 bg-white/10 text-white border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red disabled:opacity-50"
            >
              <option value="" style={{color: 'black'}}>{t('homePage.allCities')}</option>
              {selectedRegion && locations[selectedRegion as keyof typeof locations] &&
                Object.keys(locations[selectedRegion as keyof typeof locations]).map(c => <option key={c} value={c} style={{color: 'black'}}>{c}</option>)
              }
            </select>
            <Button onClick={handleSearch} className="w-full md:w-auto">{t('homePage.search')}</Button>
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