

import React, { useState, useEffect } from 'react';
import { NavigationFunction, User, Property } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

// Stat Card Icons
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PropertyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

interface AdminDashboardPageProps {
  onNavigate: NavigationFunction;
  allUsers: User[];
  allProperties: Property[];
  onDeleteUser: (id: string) => void;
  onDeleteProperty: (id: string) => void;
}

interface Stats {
    totalUsers: number;
    totalAgents: number;
    totalProperties: number;
    forRentCount: number;
    forSaleCount: number;
    totalMessages: number;
    recentProperties: any[];
    recentUsers: User[];
    topAgents: { name: string; propertyCount: number; id: string; }[];
    propertiesByRegion: { region: string; count: number; }[];
}

type Tab = 'stats' | 'users' | 'properties';

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
  onNavigate,
  allUsers,
  allProperties,
  onDeleteUser,
  onDeleteProperty,
}) => {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [processedProperties, setProcessedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'user' | 'property'; id: string; name: string } | null>(null);

  useEffect(() => {
    const processAndFetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
          // Get current user profile (for 'cannot delete self' check)
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
              const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
              setCurrentUser(profile as User | null);
          }

          // Fetch data not passed in props
          const { count: messagesCount, error: messagesError } = await supabase.from('messages').select('id', { count: 'exact', head: true });
          if (messagesError) throw messagesError;

          // Process data from props
          const fetchedProperties = allProperties;
          const fetchedProfiles = allUsers;
          
          const sortedProfiles = [...fetchedProfiles].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
          const sortedProperties = [...fetchedProperties].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          const propertiesWithAgentNames = sortedProperties.map(p => {
              const agent = fetchedProfiles.find(u => u.id === p.agent_id);
              return { ...p, agentName: agent ? agent.name : 'N/A' };
          });
          setProcessedProperties(propertiesWithAgentNames);

          const agentCounts: { [key: string]: number } = {};
          fetchedProperties.forEach(p => { if (p.agent_id) agentCounts[p.agent_id] = (agentCounts[p.agent_id] || 0) + 1; });

          const topAgents = Object.entries(agentCounts)
              .map(([agentId, count]) => ({ id: agentId, name: fetchedProfiles.find(u => u.id === agentId)?.name || 'Unknown Agent', propertyCount: count }))
              .sort((a, b) => b.propertyCount - a.propertyCount)
              .slice(0, 5);

          const regionCounts: { [key: string]: number } = {};
          fetchedProperties.forEach(p => { if (p.region) regionCounts[p.region] = (regionCounts[p.region] || 0) + 1; });

          const propertiesByRegion = Object.entries(regionCounts)
              .map(([region, count]) => ({ region, count }))
              .sort((a, b) => b.count - a.count);

          setStats({
              totalUsers: fetchedProfiles.length,
              totalAgents: fetchedProfiles.filter(p => p.role === 'agent').length,
              totalProperties: fetchedProperties.length,
              forRentCount: fetchedProperties.filter(p => p.type === 'rent').length,
              forSaleCount: fetchedProperties.filter(p => p.type === 'sale').length,
              totalMessages: messagesCount || 0,
              recentProperties: propertiesWithAgentNames.slice(0, 5),
              recentUsers: sortedProfiles.slice(0, 5),
              topAgents,
              propertiesByRegion,
          });
      } catch (err: any) {
          console.error("Error processing admin data:", err);
          setError(err.message || String(err) || 'An unexpected error occurred');
      } finally {
          setIsLoading(false);
      }
    };
    
    processAndFetchData();
  }, [allUsers, allProperties]);

  const handleDeleteUserClick = (user: User) => {
    if (user.id === currentUser?.id) {
        alert(t('adminDashboardPage.cannotDeleteSelf'));
        return;
    }
    onDeleteUser(user.id);
  };

  const handleDeletePropertyClick = (property: any) => {
    setConfirmDelete({ type: 'property', id: property.id, name: property.title });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    if (confirmDelete.type === 'property') {
      onDeleteProperty(confirmDelete.id);
    }
    setConfirmDelete(null);
  };

  const TabButton: React.FC<{ name: Tab, label: string }> = ({ name, label }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`px-4 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
        activeTab === name
          ? 'border-b-2 border-brand-red text-white'
          : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const getRoleText = (role: string) => {
      switch(role) {
          case 'admin': return t('adminDashboardPage.admin');
          case 'agent': return t('adminDashboardPage.agent');
          case 'visitor': return t('adminDashboardPage.visitor');
          default: return role;
      }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div></div>;
  }
  
  if (error || !stats) {
    return <div className="container mx-auto px-6 py-8 text-center text-red-400">{t('app.fetchError')}: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">{t('adminDashboardPage.title')}</h1>
        
        <div className="flex border-b border-brand-card mb-8">
            <TabButton name="stats" label={t('adminDashboardPage.statisticsTab')} />
            <TabButton name="users" label={t('adminDashboardPage.usersTab')} />
            <TabButton name="properties" label={t('adminDashboardPage.propertiesTab')} />
        </div>

        {activeTab === 'stats' && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon />} />
                <StatCard title="Total Agents" value={stats.totalAgents} icon={<UsersIcon />} />
                <StatCard title="Total Properties" value={stats.totalProperties} icon={<PropertyIcon />} />
                <StatCard title="Properties for Rent" value={stats.forRentCount} icon={<PropertyIcon />} />
                <StatCard title="Properties for Sale" value={stats.forSaleCount} icon={<PropertyIcon />} />
                <StatCard title="Total Messages Sent" value={stats.totalMessages} icon={<MessageIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="bg-brand-card rounded-lg shadow-lg p-6 xl:col-span-2">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Property Listings</h2>
                    <div className="overflow-x-auto"><table className="min-w-full"><tbody>{stats.recentProperties.map((p, i) => (<tr key={p.id} className={`border-b ${i === 4 ? 'border-transparent' : 'border-brand-dark'}`}><td className="py-3 pr-4"><p className="font-semibold text-white truncate cursor-pointer hover:text-brand-red" onClick={() => onNavigate('propertyDetail', p)}>{p.title}</p><p className="text-sm text-gray-400">{p.city}, {p.region}</p></td><td className="py-3 px-4 text-sm text-gray-300">{p.agentName}</td><td className="py-3 pl-4 text-right font-semibold text-brand-red">{new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(p.price)}</td></tr>))}</tbody></table></div>
                </div>
                <div className="bg-brand-card rounded-lg shadow-lg p-6"><h2 className="text-xl font-semibold text-white mb-4">Top Agents</h2><ul className="space-y-4">{stats.topAgents.map(a => (<li key={a.id} className="flex items-center justify-between"><p className="text-white font-medium">{a.name}</p><p className="text-gray-300 bg-brand-dark px-2 py-0.5 rounded text-sm">{a.propertyCount} listings</p></li>))}</ul></div>
                <div className="bg-brand-card rounded-lg shadow-lg p-6 xl:col-span-2"><h2 className="text-xl font-semibold text-white mb-4">Recent User Registrations</h2><div className="overflow-x-auto"><table className="min-w-full"><tbody>{stats.recentUsers.map((u, i) => (<tr key={u.id} className={`border-b ${i === 4 ? 'border-transparent' : 'border-brand-dark'}`}><td className="py-3 pr-4"><p className="font-semibold text-white">{u.name}</p><p className="text-sm text-gray-400">{u.email}</p></td><td className="py-3 px-4 text-sm text-gray-300 capitalize">{u.role}</td><td className="py-3 pl-4 text-sm text-right text-gray-400">{u.created_at ? new Date(u.created_at).toLocaleDateString(locale) : 'N/A'}</td></tr>))}</tbody></table></div></div>
                <div className="bg-brand-card rounded-lg shadow-lg p-6"><h2 className="text-xl font-semibold text-white mb-4">Properties by Region</h2><ul className="space-y-3">{stats.propertiesByRegion.map(r => (<li key={r.region} className="flex items-center justify-between text-sm"><p className="text-gray-300">{r.region}</p><p className="text-white font-semibold">{r.count}</p></li>))}</ul></div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-brand-card rounded-lg shadow-lg overflow-hidden animate-fade-in-up">
              <div className="p-6"><h2 className="text-xl font-semibold text-white">{t('adminDashboardPage.userManagement')}</h2></div>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-dark">
                      <thead className="bg-brand-dark/50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableName')}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableRole')}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableJoinedDate')}</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableActions')}</th></tr></thead>
                      <tbody className="bg-brand-card divide-y divide-brand-dark">
                          {allUsers.map(user => (<tr key={user.id} className="hover:bg-brand-dark/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-white">{user.name}</div><div className="text-sm text-gray-400">{user.email}</div></td>
                              <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-500/20 text-red-200' : user.role === 'agent' ? 'bg-blue-500/20 text-blue-200' : 'bg-gray-500/20 text-gray-200'}`}>{getRoleText(user.role)}</span></td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(user.created_at!).toLocaleDateString(locale)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={() => handleDeleteUserClick(user)} className="text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed" disabled={user.role === 'admin' || user.id === currentUser?.id}>{t('adminDashboardPage.delete')}</button></td>
                          </tr>))}
                      </tbody>
                  </table>
              </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="bg-brand-card rounded-lg shadow-lg overflow-hidden animate-fade-in-up">
              <div className="p-6"><h2 className="text-xl font-semibold text-white">{t('adminDashboardPage.propertyManagement')}</h2></div>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-dark">
                      <thead className="bg-brand-dark/50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tablePropertyTitle')}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tablePropertyAgent')}</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboardPage.tablePrice')}</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{t('adminDashboardPage.tableActions')}</th></tr></thead>
                      <tbody className="bg-brand-card divide-y divide-brand-dark">
                          {processedProperties.map(property => (<tr key={property.id} className="hover:bg-brand-dark/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{property.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{property.agentName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-semibold">{new Intl.NumberFormat(locale === 'fr' ? 'fr-CM' : 'en-US', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(property.price)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onNavigate('propertyDetail', property)} className="text-indigo-400 hover:text-indigo-300 mr-4">{t('adminDashboardPage.view')}</button>
                                <button onClick={() => handleDeletePropertyClick(property)} className="text-red-500 hover:text-red-400">{t('adminDashboardPage.delete')}</button>
                              </td>
                          </tr>))}
                      </tbody>
                  </table>
              </div>
          </div>
        )}
      </div>

      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title={t('adminDashboardPage.confirmDeleteTitle')}>
        <div>
          <p className="text-gray-300">{confirmDelete?.type === 'property' ? t('adminDashboardPage.deletePropertyConfirm') : t('adminDashboardPage.deleteUserConfirm')}</p>
          <p className="font-semibold text-white mt-2">{confirmDelete?.name}</p>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={handleConfirmDelete}>{t('common.delete')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-brand-card rounded-lg shadow-lg p-6 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-400 uppercase">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        {icon}
    </div>
);


export default AdminDashboardPage;
