import React, { useState, useEffect, useMemo } from 'react';
import { Page, User, Property, Media, Message, Rating } from './types';
import { mockProperties } from './data/properties';
import { mockUsers } from './data/users';
import { locations as staticLocations } from './data/locations';
import { useLanguage } from './contexts/LanguageContext';
import { User as FirebaseUser } from "firebase/auth";
import { handleGoogleRedirectResult } from './services/authService';


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
import CareersPage from './pages/CareersPage';

const getInitialHistoryState = () => {
  try {
    const savedHistory = sessionStorage.getItem('navigationHistory');
    const savedHistoryIndex = sessionStorage.getItem('navigationHistoryIndex');
    if (savedHistory && savedHistoryIndex !== null) {
      const parsedHistory = JSON.parse(savedHistory);
      const parsedIndex = parseInt(savedHistoryIndex, 10);
      if (Array.isArray(parsedHistory) && !isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < parsedHistory.length && parsedHistory.length > 0) {
        return {
          history: parsedHistory,
          historyIndex: parsedIndex,
        };
      }
    }
  } catch (error) {
    console.error("Could not parse navigation history from sessionStorage", error);
    sessionStorage.removeItem('navigationHistory');
    sessionStorage.removeItem('navigationHistoryIndex');
  }
  return {
    history: [{ page: 'home', data: null }],
    historyIndex: 0,
  };
};

function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const savedItem = localStorage.getItem(key);
            if (savedItem) return JSON.parse(savedItem);
        } catch (error) {
            console.error(`Could not parse ${key} from localStorage`, error);
        }
        return defaultValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Could not save ${key} to localStorage`, error);
        }
    }, [key, state]);

    return [state, setState];
}

const App: React.FC = () => {
  const [initialHistoryState] = useState(getInitialHistoryState);
  const [history, setHistory] = useState<{ page: Page; data: any; }[]>(initialHistoryState.history);
  const [historyIndex, setHistoryIndex] = useState<number>(initialHistoryState.historyIndex);

  const { page: currentPage, data: pageData } = history[historyIndex];

  const [properties, setProperties] = usePersistentState<Property[]>('myImmoProperties', []);
  const [allUsers, setAllUsers] = usePersistentState<User[]>('myImmoUsers', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = usePersistentState<Message[]>('myImmoMessages', []);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const { t } = useLanguage();
  
  const [dynamicLocations, setDynamicLocations] = usePersistentState('myImmoLocations', staticLocations);
  const [ratings, setRatings] = usePersistentState<Rating[]>('myImmoRatings', []);

  const mergedLocations = useMemo(() => {
    // Deep merge static locations with dynamic locations from localStorage
    const merged = JSON.parse(JSON.stringify(staticLocations));

    for (const region in dynamicLocations) {
        if (!merged[region]) {
            merged[region] = {}; // A new region was added by the user
        }
        for (const city in dynamicLocations[region]) {
            if (!merged[region][city]) {
                merged[region][city] = []; // A new city was added by the user
            }
            const existingNeighborhoods = new Set(merged[region][city]);
            for (const neighborhood of dynamicLocations[region][city]) {
                if (!existingNeighborhoods.has(neighborhood)) {
                    merged[region][city].push(neighborhood);
                }
            }
        }
    }
    return merged;
  }, [dynamicLocations]);
  
   // One-time data initialization
  useEffect(() => {
    const isInitialized = localStorage.getItem('myImmoDataInitialized');
    if (!isInitialized) {
        console.log("First run: Initializing data from mocks.");
        setProperties(mockProperties);
        setAllUsers(mockUsers);
        setDynamicLocations(staticLocations);
        setMessages([]);
        setRatings([]);
        localStorage.setItem('myImmoDataInitialized', 'true');
    }
  }, []);

  const handleGoogleLogin = (firebaseUser: FirebaseUser) => {
    const email = firebaseUser.email;
    if (!email) {
      console.error("Google sign-in did not provide an email.");
      return;
    }

    let user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      const newUser: User = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'New User',
        email: email,
        role: 'visitor',
        profilePictureUrl: firebaseUser.photoURL || undefined,
      };
      setAllUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
    
    handleNavigate('listings', undefined, { replace: true });
  };
  
  // Recalculate scores and badges whenever users, properties, or ratings change
  useEffect(() => {
    const calculateScores = () => {
        if (allUsers.length === 0) return;

        let hasChanges = false;
        const updatedUsers = allUsers.map(user => {
            if (user.role !== 'agent') {
                return user; // Return original object if not an agent
            }

            const agentProperties = properties.filter(p => p.agentUid === user.uid);
            const agentRatings = ratings.filter(r => r.agentUid === user.uid);
            
            let score = 0;
  
            // 1. Average Rating (up to 5 points)
            if (agentRatings.length > 0) {
                const totalRating = agentRatings.reduce((sum, r) => sum + r.rating, 0);
                score += totalRating / agentRatings.length;
            }
  
            // 2. Property Count Bonus (up to 1 point)
            score += Math.min(agentProperties.length * 0.1, 1);
            
            // 3. Premium Bonus (1 point)
            if (user.subscriptionPlan === 'premium') {
                score += 1;
            }
  
            // 4. Profile Completeness (up to 0.5 points)
            if (user.profilePictureUrl && user.profilePictureUrl.includes('https')) score += 0.25;
            if (user.phone) score += 0.25;

            const finalScore = Math.round(score * 100) / 100;
  
            let badge: User['badge'] | undefined = undefined;
            if (finalScore >= 5) {
                badge = 'Gold';
            } else if (finalScore >= 4) {
                badge = 'Silver';
            } else if (finalScore >= 3) {
                badge = 'Bronze';
            }

            // Check if there are any actual changes
            const existingScoreRounded = user.score ? Math.round(user.score * 100) / 100 : 0;
            if (existingScoreRounded !== finalScore || user.badge !== badge) {
                hasChanges = true;
                return { ...user, score: finalScore, badge };
            }

            return user; // Return original object reference if no changes
        });

        if (hasChanges) {
            setAllUsers(updatedUsers);
            if (currentUser?.role === 'agent') {
                const updatedCurrentUser = updatedUsers.find(u => u.uid === currentUser.uid);
                if (updatedCurrentUser) {
                     setCurrentUser(updatedCurrentUser);
                }
            }
        }
    };
  
    calculateScores();
  }, [allUsers, properties, ratings]);

  useEffect(() => {
    try {
      sessionStorage.setItem('navigationHistory', JSON.stringify(history));
      sessionStorage.setItem('navigationHistoryIndex', historyIndex.toString());
    } catch (error) {
      console.error("Could not save navigation history to sessionStorage", error);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUserJson = localStorage.getItem('currentUser');
      if (savedUserJson) {
        try {
          const savedUser = JSON.parse(savedUserJson);
          setCurrentUser(savedUser);
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
          localStorage.removeItem('currentUser');
        }
      }
      
      try {
        const userFromRedirect = await handleGoogleRedirectResult();
        if (userFromRedirect) {
          handleGoogleLogin(userFromRedirect);
        }
      } catch(error) {
        console.error("Error handling Google redirect:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

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
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handleLogin = (email: string): User | null => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.role === 'admin') {
            handleNavigate('adminDashboard', undefined, { replace: true });
        } else if (user.role === 'agent') {
            handleNavigate('dashboard', undefined, { replace: true });
        } else {
            handleNavigate('listings', undefined, { replace: true });
        }
        return user;
    }
    return null;
  };

  const handleRegister = (name: string, email: string, role: 'visitor' | 'agent'): User | null => {
      if(allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return null;
      }
      const newUser: User = {
          uid: `user${Date.now()}`,
          name,
          email,
          role,
      };
      if (role === 'agent') {
        newUser.subscriptionPlan = 'free';
      }
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
    const propertyToDelete = properties.find(p => p.id === id);
    if (!propertyToDelete) return;
    
    setProperties(prev => prev.filter(p => p.id !== id));
  };
  
  const handleDeleteUser = (uid: string) => {
      if (currentUser?.uid === uid) {
          alert(t('adminDashboardPage.cannotDeleteSelf'));
          return;
      }
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
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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
    }
  };

  const handleAddRating = (propertyId: string, agentUid: string, rating: number) => {
    if (!currentUser) return;
    
    setRatings(prev => {
        const existingRatingIndex = prev.findIndex(r => r.propertyId === propertyId && r.visitorUid === currentUser.uid);
        if (existingRatingIndex > -1) {
            // Update existing rating
            const updatedRatings = [...prev];
            updatedRatings[existingRatingIndex] = { ...updatedRatings[existingRatingIndex], rating, timestamp: new Date() };
            return updatedRatings;
        } else {
            // Add new rating
            const newRating: Rating = {
                id: `rating_${Date.now()}`,
                propertyId,
                agentUid,
                visitorUid: currentUser.uid,
                rating,
                timestamp: new Date()
            };
            return [...prev, newRating];
        }
    });
  };

  const renderPage = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div></div>;
    }
    switch (currentPage) {
      case 'listings':
        return <ListingsPage properties={properties} onNavigate={handleNavigate} initialFilters={searchFilters} user={currentUser} allUsers={allUsers} locations={mergedLocations} />;
      case 'propertyDetail':
        const agent = allUsers.find(u => u.uid === pageData.agentUid);
        return <PropertyDetailsPage property={pageData} agent={agent} onSendMessage={handleSendMessage} currentUser={currentUser} onAddRating={handleAddRating} ratings={ratings} />;
      case 'dashboard':
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
        const agentProperties = properties.filter(p => p.agentUid === currentUser.uid);
        const agentMessagesCount = messages.filter(m => m.agentUid === currentUser.uid).length;
        const currentAgentData = allUsers.find(u => u.uid === currentUser.uid); // Get user with updated score/badge
        return <DashboardPage user={currentAgentData || currentUser} properties={agentProperties} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} messageCount={agentMessagesCount} />;
       case 'addProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
         if (currentUser.role === 'agent' && currentUser.subscriptionPlan === 'free' && properties.filter(p => p.agentUid === currentUser.uid).length >= 5) {
             handleNavigate('pricing');
             return null;
         }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={handleNavigate} locations={mergedLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
       case 'editProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin') || (currentUser.role !== 'admin' && currentUser.uid !== pageData.agentUid)) { handleNavigate('home'); return null; }
         return <EditPropertyPage propertyToEdit={pageData} onEditProperty={handleEditProperty} onNavigate={handleNavigate} locations={mergedLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
       case 'messages':
          if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
          const myMessages = messages.filter(m => m.agentUid === currentUser.uid);
          return <MessagesPage messages={myMessages} />;
       case 'profileSettings':
          if (!currentUser) { handleNavigate('login'); return null; }
          return <ProfileSettingsPage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onNavigate={handleNavigate} />;
       case 'login':
          return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
       case 'register':
          return <RegisterPage onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
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
          return <PaymentPage currentUser={currentUser} onSuccessfulPayment={handleUpgradePlan} onNavigate={handleNavigate} />;
       case 'careers': return <CareersPage />;
       case 'contact': return <ContactPage />;
       case 'about': return <AboutPage />;
       case 'termsOfUse': return <TermsOfUsePage onNavigate={handleNavigate} />;
       case 'privacyPolicy': return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'home': default:
        return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} user={currentUser} allUsers={allUsers} locations={mergedLocations} />;
    }
  };

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