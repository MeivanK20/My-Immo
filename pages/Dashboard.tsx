import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, Eye, Home } from 'lucide-react';
import { PROPERTIES } from '../constants';
import { RoutePath } from '../types';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/languageContext';
import { useAuth } from '../services/authContext';

interface Message {
  id: string;
  sender: string;
  propertyTitle: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'messages'>('listings');
  const [userListings] = useState(PROPERTIES.slice(0, 3)); // Simule les annonces de l'agent
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Jean Dupont',
      propertyTitle: 'Magnifique Villa à Bastos',
      message: 'Bonjour, je suis intéressé par cette propriété. Pouvez-vous me donner plus de détails?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      sender: 'Marie Sow',
      propertyTitle: 'Appartement moderne à Douala',
      message: 'Quand est-ce possible de visiter?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
              <p className="text-gray-600 mt-1">Bienvenue, Agent Immobilier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'listings'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Home size={18} />
                {t('dashboard.my_listings')} ({userListings.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'messages'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                {t('dashboard.messages')} {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">{unreadCount}</span>}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.my_listings')}</h2>
              <button 
                onClick={() => navigate(RoutePath.ADD_PROPERTY)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Plus size={18} />
                Nouvelle Annonce
              </button>
            </div>

            {userListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Home size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Vous n'avez pas encore d'annonces</p>
                <button 
                  onClick={() => navigate(RoutePath.ADD_PROPERTY)}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Créer une annonce
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {userListings.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-4 p-6">
                      <img
                        src={property.imageUrl}
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{property.address}</p>
                        <p className="text-primary-600 font-bold text-lg mt-2">{property.price.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Voir">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.messages')}</h2>

            {messages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Vous n'avez pas encore de messages</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-lg border transition-colors ${
                      msg.read
                        ? 'bg-white border-gray-200'
                        : 'bg-primary-50 border-primary-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{msg.sender}</h3>
                          {!msg.read && (
                            <span className="inline-block w-2 h-2 bg-primary-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">À propos de: <span className="font-medium">{msg.propertyTitle}</span></p>
                        <p className="text-gray-700">{msg.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {msg.timestamp.toLocaleDateString()} à {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex-shrink-0">
                        Répondre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
