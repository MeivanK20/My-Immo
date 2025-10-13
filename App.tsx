import React, { useState } from 'react';
import { Page, User, Property, Media, Message } from './types';
import { mockProperties } from './data/properties';
import { mockUsers } from './data/users';
import { useLanguage } from './contexts/LanguageContext';

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
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);

  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const { t } = useLanguage();

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
        if (user.role === 'admin') {
            handleNavigate('adminDashboard');
        } else if (user.role === 'agent') {
            handleNavigate('dashboard');
        } else {
            handleNavigate('home');
        }
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
      handleNavigate('registrationSuccess', { email: newUser.email });
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
    if(!window.confirm(t('deleteConfirm'))) return;
    
    const propertyToDelete = properties.find(p => p.id === id);
    if (!propertyToDelete) return;
    
    setProperties(prev => prev.filter(p => p.id !== id));
  };
  
  const handleDeleteUser = (uid: string) => {
      if (currentUser?.uid === uid) {
          alert("Vous ne pouvez pas supprimer votre propre compte admin.");
          return;
      }
      if (!window.confirm(t('adminDashboardPage.deleteUserConfirm'))) return;

      // Remove user and their properties
      setAllUsers(prev => prev.filter(u => u.uid !== uid));
      setProperties(prev => prev.filter(p => p.agentUid !== uid));
  };

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      ...messageData,
      timestamp: new Date(),
    };
    setMessages(prev => [newMessage, ...prev]);
  };
  
  const handleUpdateProfile = (updatedUser: User, newProfilePicture: File | null) => {
      if (!currentUser) return;

      let finalUser = { ...updatedUser };

      if (newProfilePicture) {
          finalUser.profilePictureUrl = URL.createObjectURL(newProfilePicture);
      }

      setAllUsers(prevUsers => prevUsers.map(u => u.uid === finalUser.uid ? finalUser : u));
      setCurrentUser(finalUser);
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
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
        const agentProperties = properties.filter(p => p.agentUid === currentUser.uid);
        const agentMessagesCount = messages.filter(m => m.agentUid === currentUser.uid).length;
        return <DashboardPage user={currentUser} properties={agentProperties} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} messageCount={agentMessagesCount} />;
       case 'addProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={handleNavigate} />;
       case 'editProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin') || (currentUser.role !== 'admin' && currentUser.uid !== pageData.agentUid)) { handleNavigate('home'); return null; }
         return <EditPropertyPage propertyToEdit={pageData} onEditProperty={handleEditProperty} onNavigate={handleNavigate} />;
       case 'messages':
          if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
          const myMessages = messages.filter(m => m.agentUid === currentUser.uid);
          return <MessagesPage messages={myMessages} />;
       case 'profileSettings':
          if (!currentUser) { handleNavigate('login'); return null; }
          return <ProfileSettingsPage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onNavigate={handleNavigate} />;
       case 'login':
          return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
       case 'register':
          return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
       case 'registrationSuccess':
          return <RegistrationSuccessPage email={pageData.email} onNavigate={handleNavigate} />;
       case 'adminDashboard':
           if (!currentUser || currentUser.role !== 'admin') { handleNavigate('home'); return null; }
           return <AdminDashboardPage allUsers={allUsers} allProperties={properties} onNavigate={handleNavigate} onDeleteUser={handleDeleteUser} onDeleteProperty={handleDeleteProperty} />;
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