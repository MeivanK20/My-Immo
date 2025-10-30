import React, { useState, useEffect, useMemo } from 'react';
import { Page, User, Property, Media, Message, Rating } from './types';
import { mockProperties } from './data/properties';
import { mockUsers } from './data/users';
import { locations as staticLocations } from './data/locations';
import { useLanguage } from './contexts/LanguageContext';
import { appwriteService, AppwriteException } from './services/appwriteService';


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

// This regex helps identify ISO date strings in the JSON data.
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

/**
 * A reviver function for JSON.parse. It automatically converts strings
 * that match the ISO date format back into Date objects upon parsing.
 * This is crucial for ensuring timestamps are treated as dates, not strings.
 */
const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && isoDateRegex.test(value)) {
        return new Date(value);
    }
    return value;
};


/**
 * Custom hook for persisting state to localStorage.
 * This is the core of the data persistence strategy. Any state managed by this hook
 * will be automatically saved to the browser's local storage and reloaded on subsequent visits.
 * @param key The key to use in localStorage.
 * @param defaultValue The default value if nothing is found in localStorage.
 * @returns A state and a setter function, similar to useState.
 */
function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const savedItem = localStorage.getItem(key);
            // The dateReviver is used here to correctly rehydrate Date objects from strings.
            if (savedItem) return JSON.parse(savedItem, dateReviver);
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

const DATA_VERSION = 1;

const App: React.FC = () => {
  const [initialHistoryState] = useState(getInitialHistoryState);
  const [history, setHistory] = useState<{ page: Page; data: any; }[]>(initialHistoryState.history);
  const [historyIndex, setHistoryIndex] = useState<number>(initialHistoryState.historyIndex);

  const { page: currentPage, data: pageData } = history[historyIndex];

  // --- DATA PERSISTENCE ---
  // The usePersistentState hook ensures that properties, users, messages, locations, and ratings
  // are saved in the browser's localStorage. This means the data survives page reloads,
  // browser closures, and even application updates, as long as the localStorage is not cleared.
  const [properties, setProperties] = usePersistentState<Property[]>('myImmoProperties', []);
  const [allUsers, setAllUsers] = usePersistentState<User[]>('myImmoUsers', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = usePersistentState<Message[]>('myImmoMessages', []);
  const [dynamicLocations, setDynamicLocations] = usePersistentState('myImmoLocations', staticLocations);
  const [ratings, setRatings] = usePersistentState<Rating[]>('myImmoRatings', []);
  
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const { t } = useLanguage();

  const mergedLocations = useMemo(() => {
    const merged = JSON.parse(JSON.stringify(staticLocations));
    for (const region in dynamicLocations) {
        if (!merged[region]) merged[region] = {};
        for (const city in dynamicLocations[region]) {
            if (!merged[region][city]) merged[region][city] = [];
            const existingNeighborhoods = new Set(merged[region][city]);
            for (const neighborhood of dynamicLocations[region][city]) {
                if (!existingNeighborhoods.has(neighborhood)) merged[region][city].push(neighborhood);
            }
        }
    }
    return merged;
  }, [dynamicLocations]);
  
  // --- DATA PERSISTENCE & MIGRATION ---
  // This effect runs once on startup to ensure user data is persistent across updates.
  // It replaces a simple "isInitialized" flag with a robust versioning system.
  useEffect(() => {
    const storedVersionStr = localStorage.getItem('myImmoDataVersion');
    const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 0;

    if (storedVersion < DATA_VERSION) {
      console.log(`Data migration needed. From v${storedVersion} to v${DATA_VERSION}`);
      
      // --- Migration Logic ---
      // This structure allows for sequential migrations. If a user on v1 updates to v3,
      // the migrations for v2 and v3 will run in order.
      if (storedVersion < 1) {
        // This block handles a fresh install or an upgrade from the unversioned system.
        const isOldInstall = localStorage.getItem('myImmoDataInitialized');
        if (!isOldInstall) {
          // A true fresh install. Populate with mock data.
          console.log("First run detected. Initializing data from mocks.");
          setProperties(mockProperties);
          setAllUsers(mockUsers);
          setDynamicLocations(staticLocations);
          setMessages([]);
          setRatings([]);
        } else {
          // An old install is being updated. Their data is already in localStorage.
          // We just need to stamp the version number without overwriting their valuable data.
          console.log("Existing unversioned installation found. Stamping data version.");
        }
      }
      
      // Example of a future migration from v1 to v2:
      /*
      if (storedVersion < 2) {
        console.log("Migrating data from v1 to v2...");
        // runMigrationToV2();
      }
      */

      // After migration (or initialization), set the new version and clean up old flags.
      localStorage.setItem('myImmoDataVersion', DATA_VERSION.toString());
      localStorage.removeItem('myImmoDataInitialized');
      console.log(`Data migration complete. Now at version ${DATA_VERSION}.`);
    } else {
      console.log(`Data is up to date at version ${storedVersion}.`);
    }
  }, []); // The empty dependency array ensures this runs only once.

  // Refactored score calculation to prevent infinite loops.
  // This effect calculates agent scores and updates the main user list.
  useEffect(() => {
    setAllUsers(currentAllUsers => {
        if (currentAllUsers.length === 0) return currentAllUsers;
        
        let hasChanges = false;
        const updatedUsers = currentAllUsers.map(user => {
            if (user.role !== 'agent') return user;

            const agentProperties = properties.filter(p => p.agentUid === user.uid);
            const agentRatings = ratings.filter(r => r.agentUid === user.uid);
            
            let score = 0;
            if (agentRatings.length > 0) {
                score += agentRatings.reduce((sum, r) => sum + r.rating, 0) / agentRatings.length;
            }
            score += Math.min(agentProperties.length * 0.1, 1);
            if (user.subscriptionPlan === 'premium') score += 1;
            if (user.profilePictureUrl && user.profilePictureUrl.includes('https')) score += 0.25;
            if (user.phone) score += 0.25;

            const finalScore = Math.round(score * 100) / 100;

            let badge: User['badge'] | undefined = undefined;
            if (finalScore >= 5) badge = 'Gold';
            else if (finalScore >= 4) badge = 'Silver';
            else if (finalScore >= 3) badge = 'Bronze';

            const existingScoreRounded = user.score ? Math.round(user.score * 100) / 100 : 0;
            if (existingScoreRounded !== finalScore || user.badge !== badge) {
                hasChanges = true;
                return { ...user, score: finalScore, badge };
            }

            return user;
        });

        // Only update the state if there are actual changes to prevent a loop.
        if (hasChanges) {
            return updatedUsers;
        }

        return currentAllUsers; // Return the original state if no changes occurred.
    });
  }, [properties, ratings, setAllUsers]);

  // This effect syncs the `currentUser` state with the master `allUsers` list.
  // This is separated to avoid dependency cycles.
  useEffect(() => {
    if (currentUser) {
        const updatedCurrentUserInList = allUsers.find(u => u.uid === currentUser.uid);
        // Compare stringified objects to prevent loops from object reference changes.
        if (updatedCurrentUserInList && JSON.stringify(updatedCurrentUserInList) !== JSON.stringify(currentUser)) {
            setCurrentUser(updatedCurrentUserInList);
        }
    }
  }, [allUsers, currentUser]);

  useEffect(() => {
    try {
      sessionStorage.setItem('navigationHistory', JSON.stringify(history));
      sessionStorage.setItem('navigationHistoryIndex', historyIndex.toString());
    } catch (error) {
      console.error("Could not save navigation history to sessionStorage", error);
    }
  }, [history, historyIndex]);

  // --- SESSION PERSISTENCE ---
  // This effect runs on application startup to check if a user is logged into Appwrite.
  useEffect(() => {
    const checkAuth = async () => {
      // Clean up old session persistence method from Firebase implementation
      localStorage.removeItem('currentUser');
      try {
        const appwriteUser = await appwriteService.getCurrentAccount();
        if (appwriteUser) {
          // If a user is logged into Appwrite, find their corresponding data in our local state.
          let localUser = allUsers.find(u => u.uid === appwriteUser.$id);

          if (!localUser) {
            // This can happen if the user signed up (e.g., via OAuth) but their local data was cleared.
            // We create a local representation to ensure the app functions correctly.
            console.log(`Found Appwrite user ${appwriteUser.email} without local data. Creating record.`);
            localUser = {
              uid: appwriteUser.$id,
              name: appwriteUser.name,
              email: appwriteUser.email,
              role: 'visitor', // Default to 'visitor' for safety
            };
            setAllUsers(prev => [...prev, localUser!]);
          }
          setCurrentUser(localUser);
        }
      } catch (error) {
        console.error("Failed to check Appwrite session:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []); // The empty dependency array ensures this runs only once on app startup.


  const handleNavigate = (page: Page, data?: any, options?: { replace?: boolean }) => {
    if (options?.replace) {
      const newHistory = [{ page, data }];
      setHistory(newHistory);
      setHistoryIndex(0);
    } else {
      const currentHistory = history.slice(0, historyIndex + 1);
      const lastEntry = currentHistory[currentHistory.length - 1];
      if (lastEntry.page === page && JSON.stringify(lastEntry.data) === JSON.stringify(data)) return;
      currentHistory.push({ page, data });
      setHistory(currentHistory);
      setHistoryIndex(currentHistory.length - 1);
    }
    window.scrollTo(0, 0);
  };
  
  const handleGoBack = () => { if (historyIndex > 0) setHistoryIndex(prevIndex => prevIndex - 1); };
  const handleGoForward = () => { if (historyIndex < history.length - 1) setHistoryIndex(prevIndex => prevIndex + 1); };
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const handleLogout = async () => {
    try {
        await appwriteService.deleteCurrentSession();
        setCurrentUser(null);
        handleNavigate('home');
    } catch (error) {
        console.error("Failed to logout with Appwrite:", error);
        alert('Logout failed. Please try again.');
    }
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    const appwriteUser = await appwriteService.createEmailSession(email, password);
    let localUser = allUsers.find(u => u.uid === appwriteUser.$id);
    
    if (!localUser) {
        // This case can happen if a user was created via OAuth
        // but is now logging in with email/password (if they set one).
        localUser = {
            uid: appwriteUser.$id,
            name: appwriteUser.name,
            email: appwriteUser.email,
            role: 'visitor', // Default role for safety
        };
        setAllUsers(prev => [...prev, localUser!]);
    }
    
    setCurrentUser(localUser);

    if (localUser.role === 'admin') handleNavigate('adminDashboard', undefined, { replace: true });
    else if (localUser.role === 'agent') handleNavigate('dashboard', undefined, { replace: true });
    else handleNavigate('listings', undefined, { replace: true });
  };
  
  const handleRegister = async (name: string, email: string, password: string, role: 'visitor' | 'agent'): Promise<void> => {
      if(allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new AppwriteException(t('registerPage.errorExists'));
      }
      
      const appwriteUser = await appwriteService.createAccount(email, password, name);
      
      const newUser: User = { uid: appwriteUser.$id, name, email, role };
      if (role === 'agent') newUser.subscriptionPlan = 'free';
      
      setAllUsers(prev => [...prev, newUser]);
      handleNavigate('registrationSuccess', { email: newUser.email });
  };

  const handleGoogleSignIn = () => {
    appwriteService.createGoogleOAuth2Session();
  };


  const handleSearch = (filters: any) => setSearchFilters(filters);
  
  const processMediaFiles = (files: File[]): Media[] => files.map(file => ({ url: URL.createObjectURL(file), type: file.type.startsWith('image/') ? 'image' : 'video' }));

  const handleAddProperty = (propertyData: Omit<Property, 'id' | 'media'>, mediaFiles: File[]) => {
    if (!currentUser) return;
    const newMedia = processMediaFiles(mediaFiles);
    const newProperty: Property = { id: `prop${Date.now()}`, ...propertyData, media: newMedia };
    setProperties(prev => [newProperty, ...prev]);
  };
  
  const handleEditProperty = (updatedProperty: Property, newMediaFiles: File[]) => {
      const newMedia = processMediaFiles(newMediaFiles);
      const finalMedia = [...updatedProperty.media, ...newMedia];
      const finalProperty = { ...updatedProperty, media: finalMedia };
      setProperties(prev => prev.map(p => p.id === updatedProperty.id ? finalProperty : p));
  };
  
  const handleDeleteProperty = (id: string) => setProperties(prev => prev.filter(p => p.id !== id));
  
  const handleDeleteUser = (uid: string) => {
      if (currentUser?.uid === uid) {
          alert(t('adminDashboardPage.cannotDeleteSelf'));
          return;
      }
      setAllUsers(prev => prev.filter(u => u.uid !== uid));
      setProperties(prev => prev.filter(p => p.agentUid !== uid));
  };

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = { id: `msg${Date.now()}`, ...messageData, timestamp: new Date() };
    setMessages(prev => [newMessage, ...prev]);
  };
  
  const handleUpdateProfile = (updatedUser: User, newProfilePicture: File | null) => {
      if (!currentUser) return;
      let finalUser = { ...updatedUser };
      if (newProfilePicture) finalUser.profilePictureUrl = URL.createObjectURL(newProfilePicture);
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
            const updatedRatings = [...prev];
            updatedRatings[existingRatingIndex] = { ...updatedRatings[existingRatingIndex], rating, timestamp: new Date() };
            return updatedRatings;
        } else {
            const newRating: Rating = { id: `rating_${Date.now()}`, propertyId, agentUid, visitorUid: currentUser.uid, rating, timestamp: new Date() };
            return [...prev, newRating];
        }
    });
  };

  const renderPage = () => {
    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div></div>;
    switch (currentPage) {
      case 'listings': return <ListingsPage properties={properties} onNavigate={handleNavigate} initialFilters={searchFilters} user={currentUser} allUsers={allUsers} locations={mergedLocations} />;
      case 'propertyDetail': const agent = allUsers.find(u => u.uid === pageData.agentUid); return <PropertyDetailsPage property={pageData} agent={agent} onSendMessage={handleSendMessage} currentUser={currentUser} onAddRating={handleAddRating} ratings={ratings} />;
      case 'dashboard':
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
        const agentProperties = properties.filter(p => p.agentUid === currentUser.uid);
        const agentMessagesCount = messages.filter(m => m.agentUid === currentUser.uid).length;
        const currentAgentData = allUsers.find(u => u.uid === currentUser.uid);
        return <DashboardPage user={currentAgentData || currentUser} properties={agentProperties} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} messageCount={agentMessagesCount} />;
       case 'addProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('home'); return null; }
         if (currentUser.role === 'agent' && currentUser.subscriptionPlan === 'free' && properties.filter(p => p.agentUid === currentUser.uid).length >= 5) { handleNavigate('pricing'); return null; }
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
       case 'login': return <LoginPage onLogin={handleLogin} onGoogleSignIn={handleGoogleSignIn} onNavigate={handleNavigate} />;
       case 'register': return <RegisterPage onRegister={handleRegister} onGoogleSignIn={handleGoogleSignIn} onNavigate={handleNavigate} />;
       case 'registrationSuccess': return <RegistrationSuccessPage email={pageData.email} onNavigate={handleNavigate} />;
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
