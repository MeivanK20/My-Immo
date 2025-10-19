
import React, { useState, useEffect } from 'react';
import { Page, User, Property, Media, Message } from './types';
import { mockProperties } from './data/properties';
import { mockUsers } from './data/users';
import { locations } from './data/locations';
import { useLanguage } from './contexts/LanguageContext';
import { onAuthObserver, signOutUser } from './services/auth';
import { User as FirebaseUser } from 'firebase/auth';

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
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';

const App: React.FC = () => {
  const [history, setHistory] = useState<{ page: Page; data: any; }[]>([{ page: 'home', data: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const { page: currentPage, data: pageData } = history[historyIndex];

  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const { t } = useLanguage();

  const initializeLocations = () => {
    try {
      const savedLocations = localStorage.getItem('myImmoLocations');
      if (savedLocations) {
        return JSON.parse(savedLocations);
      }
    } catch (error) {
      console.error("Could not parse locations from localStorage", error);
    }
    localStorage.setItem('myImmoLocations', JSON.stringify(locations));
    return locations;
  };

  const [dynamicLocations, setDynamicLocations] = useState(initializeLocations);

  useEffect(() => {
    const unsubscribe = onAuthObserver((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Find if user already exists in our mock user list
        let appUser = allUsers.find(u => u.uid === firebaseUser.uid);
        
        // If user does not exist (e.g., first time Google sign-in), create them
        if (!appUser) {
          appUser = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            role: 'visitor', // Default role for new sign-ups
            profilePictureUrl: firebaseUser.photoURL || undefined,
          };
          setAllUsers(prev => [...prev, appUser!]);
        }
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [allUsers]);

  // Redirect user after successful login/registration
  useEffect(() => {
    if (currentUser && (currentPage === 'login' || currentPage === 'register' || currentPage === 'registrationSuccess')) {
      handlePostAuth(currentUser);
    }
  }, [currentUser, currentPage]);

  const handleNavigate = (page: Page, data?: any, options?: { replace?: boolean }) => {
    if (options?.replace) {
      const newHistory = [{ page, data }];
      setHistory(newHistory);
      setHistoryIndex(0);
    } else {
      const currentHistory = history.slice(0, historyIndex + 1);
      
      const lastEntry = currentHistory[currentHistory.length - 1];
      if (lastEntry.page === page && JSON.stringify(lastEntry.data) === JSON.stringify(data)) {
          return;
      }
  
      currentHistory.push({ page, data });
      setHistory(currentHistory);
      setHistoryIndex(currentHistory.length - 1);
    }
    window.scrollTo(0, 0);
  };
  
  const handleGoBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const handleLogout = () => {
    signOutUser().then(() => {
        handleNavigate('home');
    });
  };
  
  const handlePostAuth = (user: User) => {
    if (user.role === 'admin') {
        handleNavigate('adminDashboard', undefined, { replace: true });
    } else if (user.role === 'agent') {
        handleNavigate('dashboard', undefined, { replace: true });
    } else {
        handleNavigate('listings', undefined, { replace: true });
    }
  };

  const handleSuccessfulRegistration = (email: string) => {
      handleNavigate('registrationSuccess', { email });
  };
  
  const handleAddNewRegisteredUser = (firebaseUser: FirebaseUser, role: 'visitor' | 'agent') => {
      const newUser: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email || '',
          role,
          subscriptionPlan: role === 'agent' ? 'free' : undefined,
      };
      setAllUsers(prev => [...prev, newUser]);
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

  const handleUpgradePlan = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, subscriptionPlan: 'premium' as const };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.uid === currentUser.uid ? updatedUser : u));
    handleNavigate('dashboard');
  };

  const handleAddCity = (regionName: string, cityName: string) => {
    if (!regionName || !cityName.trim()) return;
    const trimmedCityName = cityName.trim();

    const newLocations = JSON.parse(JSON.stringify(dynamicLocations));
    const region = newLocations[regionName as keyof typeof newLocations];

    if (region && !region.hasOwnProperty(trimmedCityName)) {
        region[trimmedCityName] = [];
        setDynamicLocations(newLocations);
        localStorage.setItem('myImmoLocations', JSON.stringify(newLocations));
    }
  };

  const handleAddNeighborhood = (regionName: string, cityName: string, neighborhoodName: string) => {
    if (!regionName || !cityName || !neighborhoodName.trim()) return;
    const trimmedNeighborhoodName = neighborhoodName.trim();

    const newLocations = JSON.parse(JSON.stringify(dynamicLocations));
    const city = newLocations[regionName as keyof typeof newLocations]?.[cityName];

    if (city && !city.includes(trimmedNeighborhoodName)) {
        city.push(trimmedNeighborhoodName);
        setDynamicLocations(newLocations);
        localStorage.setItem('myImmoLocations', JSON.stringify(newLocations));
    }
  };

  const renderPage = () => {
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
         if (currentUser.role === 'agent' && currentUser.subscriptionPlan === 'free' && properties.filter(p => p.agentUid === currentUser.uid).length >= 1) {
             handleNavigate('pricing');
             return null;
         }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={handleNavigate} locations={dynamicLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
       case 'editProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin') || (currentUser.role !== 'admin' && currentUser.uid !== pageData.agentUid)) { handleNavigate('home'); return null; }
         return <EditPropertyPage propertyToEdit={pageData} onEditProperty={handleEditProperty} onNavigate={handleNavigate} locations={dynamicLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
       case 'messages':
          if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
          const myMessages = messages.filter(m => m.agentUid === currentUser.uid);
          return <MessagesPage messages={myMessages} />;
       case 'profileSettings':
          if (!currentUser) { handleNavigate('login'); return null; }
          return <ProfileSettingsPage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onNavigate={handleNavigate} />;
       case 'login':
          return <LoginPage onPostAuth={handlePostAuth} onNavigate={handleNavigate} />;
       case 'register':
          return <RegisterPage onSuccessfulRegistration={handleSuccessfulRegistration} onNewUser={handleAddNewRegisteredUser} onNavigate={handleNavigate} />;
       case 'registrationSuccess':
          return <RegistrationSuccessPage email={pageData.email} onNavigate={handleNavigate} />;
       case 'adminDashboard':
           if (!currentUser || currentUser.role !== 'admin') { handleNavigate('home'); return null; }
           return <AdminDashboardPage allUsers={allUsers} allProperties={properties} onNavigate={handleNavigate} onDeleteUser={handleDeleteUser} onDeleteProperty={handleDeleteProperty} />;
       case 'pricing':
          if (!currentUser || currentUser.role !== 'agent') { handleNavigate('home'); return null; }
          return <PricingPage currentUser={currentUser} onNavigateToPayment={() => handleNavigate('payment')} />;
       case 'payment':
          if (!currentUser || currentUser.role !== 'agent') { handleNavigate('home'); return null; }
          return <PaymentPage onSuccessfulPayment={handleUpgradePlan} onNavigate={handleNavigate} />;
       case 'contact': return <ContactPage />;
       case 'about': return <AboutPage />;
       case 'termsOfUse': return <TermsOfUsePage />;
       case 'privacyPolicy': return <PrivacyPolicyPage />;
      case 'home': default:
        return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} />;
    }
  };
  
  if (isInitializing) {
      return (
        <div className="flex justify-center items-center h-screen bg-brand-dark">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div>
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-dark text-gray-200">
        <Header 
          user={currentUser} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
        <main className="flex-grow animate-fade-in-up" key={currentPage + historyIndex}>{renderPage()}</main>
        <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
