
import React, { useState, useMemo } from 'react';
import { Property, NavigationFunction } from '../types';
import PropertyCard from '../components/PropertyCard';
import { regions, locations } from '../data/locations';
import Select from '../components/common/Select';
import Button from '../components/common/Button';

interface ListingsPageProps {
  properties: Property[];
  onNavigate: NavigationFunction;
  initialFilters: any;
}

const ListingsPage: React.FC<ListingsPageProps> = ({ properties, onNavigate, initialFilters }) => {
    const [filters, setFilters] = useState({
        region: initialFilters.region || '',
        city: initialFilters.city || '',
        neighborhood: '',
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

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="lg:flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4 mb-8 lg:mb-0">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-brand-dark">Filtres</h3>
            <div className="space-y-4">
              <Select label="Région" name="region" value={filters.region} onChange={handleRegionChange}>
                <option value="">Toutes les régions</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
              
              <Select label="Ville" name="city" value={filters.city} onChange={handleCityChange} disabled={!filters.region}>
                <option value="">Toutes les villes</option>
                {filters.region && locations[filters.region as keyof typeof locations] &&
                  Object.keys(locations[filters.region as keyof typeof locations]).map(c => <option key={c} value={c}>{c}</option>)
                }
              </Select>

              <Select label="Quartier" name="neighborhood" value={filters.neighborhood} onChange={handleFilterChange} disabled={!filters.city}>
                <option value="">Tous les quartiers</option>
                {filters.city && locations[filters.region as keyof typeof locations]?.[filters.city as keyof any] &&
                  (locations[filters.region as keyof typeof locations] as any)[filters.city].map((n: string) => <option key={n} value={n}>{n}</option>)
                }
              </Select>

              <Select label="Type d'annonce" name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">Tous les types</option>
                <option value="rent">Location</option>
                <option value="sale">Vente</option>
              </Select>

              <div>
                <label className="block text-sm font-medium text-gray-700">Prix</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} className="w-1/2 p-2 border rounded-md" />
                  <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} className="w-1/2 p-2 border rounded-md" />
                </div>
              </div>
              <Button onClick={resetFilters} variant="secondary" className="w-full">Réinitialiser</Button>
            </div>
          </div>
        </aside>

        {/* Listings */}
        <main className="w-full lg:w-3/4">
          <h2 className="text-2xl font-bold mb-4 text-brand-dark">{filteredProperties.length} Propriétés trouvées</h2>
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-500">Aucune propriété ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ListingsPage;
