import React, { useState } from 'react';
import { Page, User, Property, Media, Message } from './types';
import { mockProperties } from './data/properties';
import { mockUsers } from './data/users';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);

  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  const handleNavigate = (page: Page, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handleLogin = (email: string): User | null => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        setCurrentUser(user);
        handleNavigate(user.role === 'agent' ? 'dashboard' : 'home');
        return user;
    }
    return null;
  };

  const handleRegister = (name: string, email: string, role: 'visitor' | 'agent'): User | null => {
      if(allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return null; // User already exists
      }
      const newUser: User = {
          uid: `user${Date.now()}`,
          name,
          email,
          role,
      };
      setAllUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      handleNavigate(newUser.role === 'agent' ? 'dashboard' : 'home');
      return newUser;
  };

  const handleSearch = (filters: any) => setSearchFilters(filters);
  
  const processMediaFiles = (files: File[]): Media[] => {
    return files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
  };

  const handleAddProperty = (propertyData: Omit<Property, 'id' | 'media'>, mediaFiles: File[]) => {
    if (!currentUser) return;
    
    const newMedia = processMediaFiles(mediaFiles);
    const newProperty: Property = {
      id: `prop${Date.now()}`,
      ...propertyData,
      media: newMedia,
    };
    
    setProperties(prev => [newProperty, ...prev]);
  };
  
  const handleEditProperty = (updatedProperty: Property, newMediaFiles: File[]) => {
      const newMedia = processMediaFiles(newMediaFiles);
      const finalMedia = [...updatedProperty.media, ...newMedia];
      
      const finalProperty = { ...updatedProperty, media: finalMedia };
      setProperties(prev => prev.map(p => p.id === updatedProperty.id ? finalProperty : p));
  };
  
  const handleDeleteProperty = (id: string) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer cette propriété ?")) return;
    
    const propertyToDelete = properties.find(p => p.id === id);
    if (!propertyToDelete) return;
    
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      ...messageData,
      timestamp: new Date(),
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const renderPage = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div></div>;
    }
    switch (currentPage) {
      case 'listings':
        return <ListingsPage properties={properties} onNavigate={handleNavigate} initialFilters={searchFilters} />;
      case 'propertyDetail':
        const agent = allUsers.find(u => u.uid === pageData.agentUid);
        return <PropertyDetailsPage property={pageData} agent={agent} onSendMessage={handleSendMessage} currentUser={currentUser} />;
      case 'dashboard':
        if (!currentUser || currentUser.role !== 'agent') { handleNavigate('home'); return null; }
        const agentProperties = properties.filter(p => p.agentUid === currentUser.uid);
        const agentMessagesCount = messages.filter(m => m.agentUid === currentUser.uid).length;
        return <DashboardPage user={currentUser} properties={agentProperties} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} messageCount={agentMessagesCount} />;
       case 'addProperty':
         if (!currentUser || currentUser.role !== 'agent') { handleNavigate('home'); return null; }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={handleNavigate} />;
       case 'editProperty':
         if (!currentUser || currentUser.role !== 'agent' || currentUser.uid !== pageData.agentUid) { handleNavigate('home'); return null; }
         return <EditPropertyPage propertyToEdit={pageData} onEditProperty={handleEditProperty} onNavigate={handleNavigate} />;
       case 'messages':
          if (!currentUser || currentUser.role !== 'agent') { handleNavigate('home'); return null; }
          const myMessages = messages.filter(m => m.agentUid === currentUser.uid);
          return <MessagesPage messages={myMessages} />;
       case 'login':
          return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
       case 'register':
          return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
       case 'contact': return <ContactPage />;
       case 'about': return <AboutPage />;
       case 'termsOfUse': return <TermsOfUsePage />;
       case 'privacyPolicy': return <PrivacyPolicyPage />;
      case 'home': default:
        return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
        <Header 
          user={currentUser} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
        />
        <main className="flex-grow">{renderPage()}</main>
        <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;