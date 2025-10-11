
import React from 'react';
import { Property, User, NavigationFunction } from '../types';
import Button from '../components/common/Button';

interface DashboardPageProps {
  user: User;
  properties: Property[];
  onNavigate: NavigationFunction;
  onDeleteProperty: (id: string) => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);
};

const DashboardPage: React.FC<DashboardPageProps> = ({ user, properties, onNavigate, onDeleteProperty }) => {
  const myProperties = properties.filter(p => p.agentId === user.id);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-dark">Mon tableau de bord</h1>
        <Button onClick={() => onNavigate('addProperty')}>Ajouter une propriété</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Mes annonces ({myProperties.length})</h2>
        </div>
        <div className="overflow-x-auto">
          {myProperties.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myProperties.map(property => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-brand-red" onClick={() => onNavigate('propertyDetail', property)}>
                            {property.title}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatPrice(property.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {property.type === 'rent' ? 'Location' : 'Vente'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onNavigate('editProperty', property)} className="text-indigo-600 hover:text-indigo-900 mr-4">Modifier</button>
                      <button onClick={() => onDeleteProperty(property.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-gray-500">Vous n'avez aucune annonce pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;