import React, { useState, useMemo } from 'react';
import { Property, NavigationFunction, User } from '../types';
import PropertyCard from '../components/PropertyCard';
import { regions, locations } from '../data/locations';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface ListingsPageProps {
  properties: Property[];
  onNavigate: NavigationFunction;
  initialFilters: any;
  user: User | null;
  allUsers: User[];
}

const ListingsPage: React.FC<ListingsPageProps> = ({ properties, onNavigate, initialFilters, user, allUsers }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
      region: initialFilters.region || '',
      city: initialFilters.city || '',
      neighborhood: initialFilters.neighborhood || '',
      type: '',
      minPrice: '',
      maxPrice: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters(prev => ({...prev, region: e.target.value, city: '', neighborhood: ''}));
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters(prev => ({...prev, city: e.target.value, neighborhood: ''}));
  }

  const resetFilters = () => {
    setFilters({
        region: '', city: '', neighborhood: '', type: '', minPrice: '', maxPrice: '',
    });
  }

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      return (
        (filters.region ? p.region === filters.region : true) &&
        (filters.city ? p.city === filters.city : true) &&
        (filters.neighborhood ? p.neighborhood === filters.neighborhood : true) &&
        (filters.type ? p.type === filters.type : true) &&
        (filters.minPrice ? p.price >= parseInt(filters.minPrice) : true) &&
        (filters.maxPrice ? p.price <= parseInt(filters.maxPrice) : true)
      );
    });
  }, [properties, filters]);

  const getAgentForProperty = (property: Property) => allUsers.find(u => u.uid === property.agentUid);

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
      {/* Ad Section (Left Column) */}
      <aside className="w-full md:w-1/4 md:sticky md:top-28 h-fit">
        <div className="bg-brand-card rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2 border-b border-brand-dark pb-2">
            {t('listingsPage.adTitle')}
          </h3>
          <div className="space-y-4 pt-2">
             {/* Placeholder for an ad */}
             <div className="animate-fade-in-up">
                <a href="#" target="_blank" rel="noopener noreferrer" className="block group">
                  <img src="https://picsum.photos/seed/ad1/300/250" alt="Ad 1" className="rounded-md w-full object-cover mb-2 transition-transform duration-300 group-hover:scale-105" />
                  <h4 className="font-semibold text-gray-200 group-hover:text-brand-red transition-colors">{t('listingsPage.ad1Title')}</h4>
                  <p className="text-sm text-gray-400">{t('listingsPage.ad1Text')}</p>
                </a>
             </div>
             {/* Another placeholder ad */}
             <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <a href="#" target="_blank" rel="noopener noreferrer" className="block group">
                  <img src="https://picsum.photos/seed/ad2/300/250" alt="Ad 2" className="rounded-md w-full object-cover mb-2 transition-transform duration-300 group-hover:scale-105" />
                  <h4 className="font-semibold text-gray-200 group-hover:text-brand-red transition-colors">{t('listingsPage.ad2Title')}</h4>
                  <p className="text-sm text-gray-400">{t('listingsPage.ad2Text')}</p>
                </a>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content (Right Column) */}
      <div className="w-full md:w-3/4">
        {/* Collapsible Filters Panel */}
        <div className="bg-brand-card p-4 rounded-lg shadow-lg mb-8">
          <details className="group" open>
            <summary className="text-xl font-bold text-white cursor-pointer list-none flex justify-between items-center">
              <span>{t('listingsPage.filters')}</span>
              <svg className="w-6 h-6 transform transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-6">
              <div className="flex-grow min-w-[180px]">
                <Select label={t('listingsPage.region')} name="region" value={filters.region} onChange={handleRegionChange}>
                  <option value="">{t('listingsPage.allRegions')}</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
              </div>
              
              <div className="flex-grow min-w-[180px]">
                <Select label={t('listingsPage.city')} name="city" value={filters.city} onChange={handleCityChange} disabled={!filters.region}>
                  <option value="">{t('listingsPage.allCities')}</option>
                  {filters.region && locations[filters.region as keyof typeof locations] &&
                    Object.keys(locations[filters.region as keyof typeof locations]).map(c => <option key={c} value={c}>{c}</option>)
                  }
                </Select>
              </div>

              <div className="flex-grow min-w-[180px]">
                <Select label={t('listingsPage.neighborhood')} name="neighborhood" value={filters.neighborhood} onChange={handleFilterChange} disabled={!filters.city}>
                  <option value="">{t('listingsPage.allNeighborhoods')}</option>
                  {filters.city && locations[filters.region as keyof typeof locations]?.[filters.city as keyof any] &&
                    (locations[filters.region as keyof typeof locations] as any)[filters.city].map((n: string) => <option key={n} value={n}>{n}</option>)
                  }
                </Select>
              </div>

              <div className="flex-grow min-w-[150px]">
                <Select label={t('listingsPage.listingType')} name="type" value={filters.type} onChange={handleFilterChange}>
                  <option value="">{t('listingsPage.allTypes')}</option>
                  <option value="rent">{t('listingsPage.rent')}</option>
                  <option value="sale">{t('listingsPage.sale')}</option>
                </Select>
              </div>

              <div className="flex-grow min-w-[200px]">
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('listingsPage.price')}</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" name="minPrice" placeholder={t('listingsPage.min')} value={filters.minPrice} onChange={handleFilterChange} className="w-1/2 p-2.5 border border-brand-card bg-brand-dark rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-red" />
                  <input type="number" name="maxPrice" placeholder={t('listingsPage.max')} value={filters.maxPrice} onChange={handleFilterChange} className="w-1/2 p-2.5 border border-brand-card bg-brand-dark rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-red" />
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button onClick={resetFilters} variant="secondary" className="w-full">{t('listingsPage.reset')}</Button>
              </div>
            </div>
          </details>
        </div>

        {/* Listings */}
        <main className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-white">{t('listingsPage.propertiesFound', { count: filteredProperties.length })}</h2>
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <PropertyCard property={property} onNavigate={onNavigate} user={user} agent={getAgentForProperty(property)} />
                 </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-brand-card rounded-lg shadow-lg">
                <p className="text-xl text-gray-400">{t('listingsPage.noProperties')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ListingsPage;
