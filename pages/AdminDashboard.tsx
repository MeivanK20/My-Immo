import React, { useState } from 'react';
import { Users, Home, MessageSquare, BarChart3, Search, Edit2, Trash2, Eye, Ban, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoutePath, User } from '../types';

interface DashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalVisitors: number;
  totalProperties: number;
  totalMessages: number;
  pendingApprovals: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'properties' | 'messages'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'agent1@example.com',
      fullName: 'Jean Dupont',
      role: 'agent',
      createdAt: new Date('2025-01-15'),
    },
    {
      id: '2',
      email: 'visitor1@example.com',
      fullName: 'Marie Sow',
      role: 'visitor',
      createdAt: new Date('2025-02-01'),
    },
    {
      id: '3',
      email: 'agent2@example.com',
      fullName: 'Pierre Nguema',
      role: 'agent',
      createdAt: new Date('2025-02-10'),
    },
    {
      id: '4',
      email: 'visitor2@example.com',
      fullName: 'Sophie Martin',
      role: 'visitor',
      createdAt: new Date('2025-02-20'),
    },
  ]);

  const [properties] = useState([
    {
      id: '1',
      title: 'Magnifique Villa à Bastos',
      price: 450000000,
      address: 'Douala, Bastos',
      status: 'approved',
      agent: 'Jean Dupont',
      listings: 23,
    },
    {
      id: '2',
      title: 'Appartement moderne',
      price: 120000000,
      address: 'Yaoundé, Centre',
      status: 'pending',
      agent: 'Pierre Nguema',
      listings: 5,
    },
  ]);

  const stats: DashboardStats = {
    totalUsers: users.length,
    totalAgents: users.filter(u => u.role === 'agent').length,
    totalVisitors: users.filter(u => u.role === 'visitor').length,
    totalProperties: 45,
    totalMessages: 128,
    pendingApprovals: 3,
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      const existingIndex = users.findIndex(u => u.id === selectedUser.id);
      if (existingIndex >= 0) {
        const updatedUsers = [...users];
        updatedUsers[existingIndex] = selectedUser;
        setUsers(updatedUsers);
      } else {
        setUsers([...users, { ...selectedUser, id: Date.now().toString() }]);
      }
      setShowUserModal(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Gestion complète du site My Immo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                Aperçu
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Utilisateurs ({users.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'properties'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Home size={18} />
                Annonces
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={18} />
                Messages
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Utilisateurs totaux</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Users className="text-primary-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Agents</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAgents}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Home className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Visiteurs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVisitors}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <Eye className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Annonces totales</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProperties}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Home className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Messages</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMessages}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <MessageSquare className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 ring-2 ring-yellow-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">En attente d'approbation</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingApprovals}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Ban className="text-yellow-600" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedUser({
                    id: '',
                    email: '',
                    fullName: '',
                    role: 'visitor',
                    createdAt: new Date(),
                  });
                  setShowUserModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus size={18} />
                Ajouter utilisateur
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rôle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date d'inscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.fullName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-red-50 text-red-700'
                              : user.role === 'agent'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {user.role === 'visitor' ? 'Visiteur' : user.role === 'agent' ? 'Agent' : 'Admin'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.createdAt.toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Titre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Agent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Prix</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vues</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{property.agent}</td>
                        <td className="px-6 py-4 text-sm font-medium text-primary-600">
                          {property.price.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            property.status === 'approved'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {property.status === 'approved' ? 'Approuvée' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{property.listings}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Voir">
                              <Eye size={16} />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Modifier">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded transition-colors" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Gestion des messages signalés</p>
            <p className="text-gray-500 text-sm">Feature à implémenter</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedUser?.id ? 'Modifier utilisateur' : 'Ajouter utilisateur'}
              </h3>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedUser?.fullName || ''}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedUser?.role || 'visitor'}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, role: e.target.value as 'visitor' | 'agent' | 'admin' } : null)}
                >
                  <option value="visitor">Visiteur</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
