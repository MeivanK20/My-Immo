import React, { useState, useEffect, useMemo } from 'react';
import { Page, User, Property, Media, Message, Rating } from './types';
import { mockProperties } from './data/properties';
import { mockUsers } from './data/users';
import { locations as staticLocations } from './data/locations';
import { useLanguage } from './contexts/LanguageContext';
import { api, AppwriteException } from './lib/appwrite';


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
      const userInList = allUsers.find(u => u.uid === currentUser.uid);
      if (userInList && JSON.stringify(userInList) !== JSON.stringify(currentUser)) {
        setCurrentUser(userInList);
      }
    }
  }, [allUsers, currentUser]);

  // Session Management
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const appwriteUser = await api.getCurrentAccount();
        if (appwriteUser) {
          // Use function form of setState to avoid dependency on allUsers
          setAllUsers(prevUsers => {
            let userInDb = prevUsers.find(u => u.email === appwriteUser.email);
            if (userInDb) {
              setCurrentUser(userInDb);
              return prevUsers; // No change to the list
            } else {
              // This is a new user (e.g., from Google Sign-In)
              console.log("New user detected from session, adding to list:", appwriteUser.name);
              const newUser: User = {
                uid: appwriteUser.$id,
                name: appwriteUser.name,
                email: appwriteUser.email,
                role: 'visitor', // Default role for new sign-ups
                subscriptionPlan: 'free',
                phone: appwriteUser.phone || '',
                profilePictureUrl: '',
                score: 0,
                badge: undefined,
              };
              setCurrentUser(newUser); // Set the new user as current
              return [...prevUsers, newUser]; // Add them to the master list
            }
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Session check failed", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []); // Empty dependency array to run only once on mount.

  // Navigation Logic
  const navigate = (page: Page, data: any = null, options: { replace?: boolean } = {}) => {
    const newState = { page, data };
    if (options.replace) {
      setHistory(prev => [...prev.slice(0, historyIndex), newState]);
    } else {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    sessionStorage.setItem('navigationHistory', JSON.stringify(history));
    sessionStorage.setItem('navigationHistoryIndex', historyIndex.toString());
  }, [history, historyIndex]);

  // Auth Handlers
  const onLogin = async (email: string, password: string) => {
    const appwriteUser = await api.createEmailSession(email, password);
    const userInDb = allUsers.find(u => u.email === appwriteUser.email);
    
    if (userInDb) {
      setCurrentUser(userInDb);
    } else {
      // This is a critical recovery step. If a user is authenticated by Appwrite
      // but not found in our local user list (e.g., localStorage was cleared),
      // we should re-create them in our local state to avoid locking them out.
      console.warn("User authenticated with Appwrite but not found in local state. Re-creating user profile.", appwriteUser.email);
      const newUser: User = {
        uid: appwriteUser.$id,
        name: appwriteUser.name,
        email: appwriteUser.email,
        role: 'visitor', // Default role for recovered users
        subscriptionPlan: 'free',
        phone: appwriteUser.phone || '',
        profilePictureUrl: '',
        score: 0,
        badge: undefined,
      };
      // Add the recovered user to the master list and set them as current
      setAllUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }

    navigate('home', null, { replace: true });
  };
  
  const onGoogleSignIn = () => {
    try {
      api.createGoogleOAuth2Session();
    } catch (error) {
      console.error("Google Sign In failed to initiate", error);
    }
  };

  const onRegister = async (name: string, email: string, password: string, role: 'visitor' | 'agent') => {
    const appwriteUser = await api.createAccount(email, password, name);
    const newUser: User = {
      uid: appwriteUser.$id,
      name: appwriteUser.name,
      email: appwriteUser.email,
      role: role,
      subscriptionPlan: 'free',
      phone: '',
      profilePictureUrl: '',
    };
    setAllUsers(prev => [...prev, newUser]);
    navigate('registrationSuccess', { email: newUser.email });
  };

  const onLogout = async () => {
    await api.deleteCurrentSession();
    setCurrentUser(null);
    navigate('home', null, { replace: true });
  };
  
  const onUpdateProfile = (updatedUser: User, newProfilePicture: File | null) => {
    // In a real app, you would upload the newProfilePicture file to storage
    // and get a URL, then update the user object with that URL.
    // For this mock, we'll just update the user data.
    console.log("Updating profile for:", updatedUser.name);
    console.log("New picture file:", newProfilePicture?.name);

    setAllUsers(prev => prev.map(u => u.uid === updatedUser.uid ? updatedUser : u));
  };
  
  const onSuccessfulPayment = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, subscriptionPlan: 'premium' as const };
       setAllUsers(prev => prev.map(u => u.uid === updatedUser.uid ? updatedUser : u));
    }
    navigate('pricing'); // Or a success page
  };


  // Property Handlers
  const handleAddProperty = (propertyData: Omit<Property, 'id' | 'media'>, mediaFiles: File[]) => {
    console.log("Adding property", propertyData.title, "with", mediaFiles.length, "files");
    const newProperty: Property = {
      ...propertyData,
      id: `prop${Date.now()}`,
      media: mediaFiles.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file), // Note: This URL is temporary
      })),
    };
    setProperties(prev => [newProperty, ...prev]);
  };
  
  const handleEditProperty = (updatedProperty: Property, newMediaFiles: File[]) => {
      console.log("Editing property", updatedProperty.title, "with", newMediaFiles.length, "new files");
      const newMedia: Media[] = newMediaFiles.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(file),
      }));

      const finalProperty = {
          ...updatedProperty,
          media: [...updatedProperty.media, ...newMedia],
      };

      setProperties(prev => prev.map(p => p.id === finalProperty.id ? finalProperty : p));
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  // Message Handler
  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg${Date.now()}`,
      timestamp: new Date(),
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  // Location Handlers
  const handleAddCity = (region: string, cityName: string) => {
    setDynamicLocations((prev: any) => {
      const newLocations = JSON.parse(JSON.stringify(prev));
      if (!newLocations[region]) newLocations[region] = {};
      if (!newLocations[region][cityName]) {
          newLocations[region][cityName] = [];
      }
      return newLocations;
    });
  };
  
  const handleAddNeighborhood = (region: string, city: string, neighborhoodName: string) => {
      setDynamicLocations((prev: any) => {
        const newLocations = JSON.parse(JSON.stringify(prev));
        if (newLocations[region]?.[city] && !newLocations[region][city].includes(neighborhoodName)) {
           newLocations[region][city].push(neighborhoodName);
        }
        return newLocations;
      });
  };

  // Rating Handler
  const handleAddRating = (propertyId: string, agentUid: string, rating: number) => {
    if (!currentUser) return;
    const existingRatingIndex = ratings.findIndex(r => r.propertyId === propertyId && r.visitorUid === currentUser.uid);
    const newRating: Rating = {
      id: `rating${Date.now()}`,
      propertyId,
      agentUid,
      visitorUid: currentUser.uid,
      rating,
      timestamp: new Date(),
    };
    if (existingRatingIndex > -1) {
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[existingRatingIndex] = newRating;
        return newRatings;
      });
    } else {
      setRatings(prev => [...prev, newRating]);
    }
  };

  // Admin Handlers
  const handleDeleteUser = (uid: string) => {
    const adminUser = allUsers.find(u => u.uid === uid && u.role === 'admin');
    if (adminUser && allUsers.filter(u => u.role === 'admin').length <= 1) {
      alert(t('adminDashboardPage.cannotDeleteSelf'));
      return;
    }
    setAllUsers(prev => prev.filter(u => u.uid !== uid));
    // Also delete their properties
    setProperties(prev => prev.filter(p => p.agentUid !== uid));
  };


  if (loading && !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-dark">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage properties={properties} onNavigate={navigate} onSearch={setSearchFilters} user={currentUser} allUsers={allUsers} locations={mergedLocations}/>;
      case 'listings':
        return <ListingsPage properties={properties} onNavigate={navigate} initialFilters={searchFilters} user={currentUser} allUsers={allUsers} locations={mergedLocations} />;
      case 'propertyDetail':
        const agent = allUsers.find(u => u.uid === (pageData as Property).agentUid);
        return <PropertyDetailsPage property={pageData as Property} agent={agent} onSendMessage={handleSendMessage} currentUser={currentUser} onAddRating={handleAddRating} ratings={ratings} />;
      case 'dashboard':
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { navigate('home'); return null; }
        const agentProperties = properties.filter(p => p.agentUid === currentUser.uid);
        const messageCount = messages.filter(m => m.agentUid === currentUser.uid).length;
        return <DashboardPage user={currentUser} properties={agentProperties} onNavigate={navigate} onDeleteProperty={handleDeleteProperty} messageCount={messageCount}/>;
      case 'addProperty':
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { navigate('home'); return null; }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={navigate} locations={mergedLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
      case 'editProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { navigate('home'); return null; }
        return <EditPropertyPage propertyToEdit={pageData as Property} onEditProperty={handleEditProperty} onNavigate={navigate} locations={mergedLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      case 'termsOfUse':
        return <TermsOfUsePage onNavigate={navigate} />;
      case 'privacyPolicy':
        return <PrivacyPolicyPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onLogin={onLogin} onGoogleSignIn={onGoogleSignIn} onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onRegister={onRegister} onGoogleSignIn={onGoogleSignIn} onNavigate={navigate} />;
      case 'messages':
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { navigate('home'); return null; }
        const agentMessages = messages.filter(m => m.agentUid === currentUser.uid);
        return <MessagesPage messages={agentMessages} />;
      case 'profileSettings':
        if (!currentUser) { navigate('login'); return null; }
        return <ProfileSettingsPage currentUser={currentUser} onUpdateProfile={onUpdateProfile} onNavigate={navigate}/>;
      case 'registrationSuccess':
        return <RegistrationSuccessPage email={(pageData as any)?.email} onNavigate={navigate} />;
      case 'adminDashboard':
        if (!currentUser || currentUser.role !== 'admin') { navigate('home'); return null; }
        return <AdminDashboardPage allUsers={allUsers} allProperties={properties} onNavigate={navigate} onDeleteUser={handleDeleteUser} onDeleteProperty={handleDeleteProperty} />;
       case 'pricing':
        if (!currentUser || currentUser.role !== 'agent') { navigate('home'); return null; }
        return <PricingPage currentUser={currentUser} onNavigateToPayment={() => navigate('payment')} />;
      case 'payment':
        if (!currentUser || currentUser.role !== 'agent') { navigate('pricing'); return null; }
        return <PaymentPage currentUser={currentUser} onSuccessfulPayment={onSuccessfulPayment} onNavigate={navigate} />;
      case 'careers':
        return <CareersPage />;
      default:
        return <HomePage properties={properties} onNavigate={navigate} onSearch={setSearchFilters} user={currentUser} allUsers={allUsers} locations={mergedLocations} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        user={currentUser} 
        onNavigate={navigate} 
        onLogout={onLogout}
        onGoBack={goBack}
        onGoForward={goForward}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate}/>
    </div>
  );
};

export default App;
