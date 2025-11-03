

import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, Property, Message, Rating, Media } from './types';
import { useLanguage } from './contexts/LanguageContext';
import * as authService from './services/authService';
import { supabase } from './lib/supabase';

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
import CareersPage from './pages/CareersPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DataErrorBanner from './components/common/DataErrorBanner';

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

// Type for the structured locations data used by the UI
type LocationData = {
    [region: string]: {
        [city: string]: string[];
    };
};

// Types for the flat data structure coming from Supabase
type RegionDB = { id: number; name: string };
type CityDB = { id: number; name: string; region_id: number };
type NeighborhoodDB = { id: number; name: string; city_id: number };


const App: React.FC = () => {
  const [history, setHistory] = usePersistentState<{ page: Page; data: any }[]>('myImmoHistory', [{ page: 'home', data: null }]);
  const [historyIndex, setHistoryIndex] = usePersistentState<number>('myImmoHistoryIndex', 0);
  
  const validHistoryIndex = Math.max(0, Math.min(historyIndex, history.length - 1));
  const { page: currentPage, data: pageData } = history[validHistoryIndex];

  const [properties, setProperties] = useState<Property[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [locations, setLocations] = useState<LocationData>({});
  
  // States to hold the raw database data for lookups
  const [dbRegions, setDbRegions] = useState<RegionDB[]>([]);
  const [dbCities, setDbCities] = useState<CityDB[]>([]);

  const [authLoading, setAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({});
  const { t } = useLanguage();

  const isLoading = authLoading || isDataLoading;

  const handleNavigate = useCallback((page: Page, data?: any, options?: { replace?: boolean }) => {
    if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }

    const newHistoryState = { page, data };
    if (options?.replace) {
      setHistory([newHistoryState]);
      setHistoryIndex(0);
    } else {
      const newHistory = history.slice(0, validHistoryIndex + 1);
      newHistory.push(newHistoryState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    window.scrollTo(0, 0);
  }, [history, validHistoryIndex, setHistory, setHistoryIndex]);

  const fetchLocations = useCallback(async () => {
    try {
        const { data: regions, error: regionsError } = await supabase.from('regions').select('*');
        if (regionsError) throw regionsError;

        const { data: cities, error: citiesError } = await supabase.from('cities').select('*');
        if (citiesError) throw citiesError;

        const { data: neighborhoods, error: neighborhoodsError } = await supabase.from('neighborhoods').select('*');
        if (neighborhoodsError) throw neighborhoodsError;
        
        setDbRegions(regions);
        setDbCities(cities);

        // Transform flat data into the nested structure required by the UI
        const structuredLocations: LocationData = {};
        for (const region of regions) {
            structuredLocations[region.name] = {};
            const regionCities = cities.filter(c => c.region_id === region.id);
            for (const city of regionCities) {
                const cityNeighborhoods = neighborhoods
                    .filter(n => n.city_id === city.id)
                    .map(n => n.name);
                structuredLocations[region.name][city.name] = cityNeighborhoods;
            }
        }
        setLocations(structuredLocations);
    } catch (error: any) {
        console.error("Failed to fetch locations:", error);
        setDataError(error.message || String(error));
    }
  }, []);

  const fetchData = useCallback(async (user: User | null) => {
    setIsDataLoading(true);
    setDataError(null);
    try {
        await fetchLocations(); // Fetch locations first
        const [propertiesRes, profilesRes, ratingsRes] = await Promise.all([
            supabase.from('properties').select('*'),
            supabase.from('profiles').select('*'),
            supabase.from('ratings').select('*')
        ]);

        if (propertiesRes.error) throw propertiesRes.error;
        if (profilesRes.error) throw profilesRes.error;
        if (ratingsRes.error) throw ratingsRes.error;

        setProperties(propertiesRes.data as Property[] || []);
        setAllUsers(profilesRes.data as User[] || []);
        setRatings(ratingsRes.data as Rating[] || []);
        
        if(user && (user.role === 'agent' || user.role === 'admin')) {
            const { data: messagesData, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('agent_id', user.id);
            
            if (messagesError) throw messagesError;
            setMessages(messagesData as Message[] || []);
        } else {
            setMessages([]);
        }

    } catch (error: any) {
        console.error("Failed to fetch data:", error);
        setDataError(error.message || String(error));
    } finally {
        setIsDataLoading(false);
    }
  }, [fetchLocations]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
          setCurrentUser(null);
          if (event === 'SIGNED_OUT') {
              setProperties([]);
              setAllUsers([]);
              setMessages([]);
              setRatings([]);
              handleNavigate('home', undefined, { replace: true });
          }
      } else {
          let userProfile = await authService.getProfile(session.user.id);
          
          if (!userProfile || !userProfile.role) {
              console.log("Profile missing or incomplete for active session, attempting to repair...");
              userProfile = await authService.createOrUpdateProfileForProvider(session.user);
          }

          setCurrentUser(userProfile);

          if (event === 'PASSWORD_RECOVERY') {
              handleNavigate('resetPassword');
          }
      }
      
      setAuthLoading(false); 
    });
    
    return () => subscription.unsubscribe();
  }, [handleNavigate]);

  useEffect(() => {
    if (!authLoading) {
        fetchData(currentUser);
    }
  }, [authLoading, currentUser, fetchData]);
  
  useEffect(() => {
    if (isLoading) {
        return;
    }

    const authPages: Page[] = ['login', 'register', 'forgotPassword', 'resetPassword', 'registrationSuccess'];
    const protectedPages: Page[] = ['dashboard', 'addProperty', 'editProperty', 'messages', 'profileSettings', 'adminDashboard', 'pricing', 'payment'];

    const isOnAuthPage = authPages.includes(currentPage);
    const isOnProtectedPage = protectedPages.includes(currentPage);

    if (currentUser && isOnAuthPage) {
        if (currentUser.role === 'admin') {
            handleNavigate('adminDashboard', undefined, { replace: true });
        } else if (currentUser.role === 'agent') {
            handleNavigate('dashboard', undefined, { replace: true });
        } else {
            handleNavigate('listings', undefined, { replace: true });
        }
    }

    if (!currentUser && isOnProtectedPage) {
        handleNavigate('login', undefined, { replace: true });
    }

  }, [currentUser, currentPage, isLoading, handleNavigate]);


  const handleLogout = () => authService.signOut();
  const handleLogin = async (email: string, password: string): Promise<void> => {
    await authService.signInWithEmail(email, password);
  };
  const handleGoogleLogin = () => authService.signInWithGoogle();
  const handleRegister = (name: string, email: string, password: string, phone: string, role: 'visitor' | 'agent'): Promise<void> => {
    return authService.signUpWithEmail(name, email, password, phone, role).then(() => {
        handleNavigate('registrationSuccess', { email });
    });
  };

  const handleAddProperty = async (propertyData: Omit<Property, 'id' | 'media' | 'agent_id'>, mediaFiles: File[]) => {
    if (!currentUser) return;
    setIsDataLoading(true);
    try {
        const mediaUrls: Media[] = [];
        for (const file of mediaFiles) {
            const filePath = `public/${currentUser.id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage.from('property-media').upload(filePath, file);

            if (uploadError) throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
            
            const { data } = supabase.storage.from('property-media').getPublicUrl(filePath);
            mediaUrls.push({ url: data.publicUrl, type: file.type.startsWith('image/') ? 'image' : 'video' });
        }

        const newProperty = { ...propertyData, media: mediaUrls, agent_id: currentUser.id };
        const { error: insertError } = await supabase.from('properties').insert([newProperty]);
        
        if (insertError) throw new Error(`Failed to save property: ${insertError.message}`);
        
        await fetchData(currentUser);
        handleNavigate('dashboard');

    } catch (error) {
        console.error("Error in handleAddProperty:", error);
        setDataError(String(error));
    } finally {
        setIsDataLoading(false);
    }
  };
  
  const handleEditProperty = async (updatedProperty: Property, newMediaFiles: File[]) => {
    const newMedia: Media[] = [];
    for (const file of newMediaFiles) {
        const filePath = `public/${updatedProperty.agent_id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('property-media').upload(filePath, file);
        if (uploadError) continue;
        const { data } = supabase.storage.from('property-media').getPublicUrl(filePath);
        newMedia.push({ url: data.publicUrl, type: file.type.startsWith('image/') ? 'image' : 'video' });
    }
    
    const finalMedia = [...updatedProperty.media, ...newMedia];
    const finalProperty = { ...updatedProperty, media: finalMedia };

    const { error } = await supabase.from('properties').update(finalProperty).eq('id', finalProperty.id);
    if (error) console.error('Error updating property', error);
    else await fetchData(currentUser);
  };
  
  const handleDeleteProperty = async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) console.error('Error deleting property', error);
    else await fetchData(currentUser);
  };
  
  const handleSendMessage = async (messageData: Omit<Message, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('messages').insert([messageData]);
    if (error) console.error('Error sending message', error);
    else await fetchData(currentUser);
  };
  
  const handleUpdateProfile = async (updatedUser: User, newProfilePicture: File | null) => {
      try {
        const data = await authService.updateProfile(updatedUser, newProfilePicture);
        setCurrentUser(data);
        await fetchData(data);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
  };
  
  const handleSuccessfulPayment = async () => {
    if (currentUser) {
        await authService.updateProfile({ ...currentUser, subscription_plan: 'premium' });
        const updatedProfile = await authService.getProfile(currentUser.id);
        setCurrentUser(updatedProfile);
        handleNavigate('dashboard', undefined, { replace: true });
    }
  };
  
  const handleDeleteUser = (uid: string) => alert(t('adminDashboardPage.deleteUserNotImplemented'));

  const handleAddCity = async (region: string, cityName: string) => {
    const regionObj = dbRegions.find(r => r.name === region);
    if (!regionObj) return;

    const { error } = await supabase.from('cities').insert({ name: cityName, region_id: regionObj.id });
    if (error) {
        console.error("Error adding city:", error);
        setDataError(error.message);
    } else {
        await fetchLocations(); // Refresh locations from DB
    }
  };

  const handleAddNeighborhood = async (region: string, city: string, neighborhoodName: string) => {
    const cityObj = dbCities.find(c => c.name === city && dbRegions.find(r => r.id === c.region_id)?.name === region);
    if (!cityObj) return;

    const { error } = await supabase.from('neighborhoods').insert({ name: neighborhoodName, city_id: cityObj.id });
    if (error) {
        console.error("Error adding neighborhood:", error);
        setDataError(error.message);
    } else {
        await fetchLocations(); // Refresh locations from DB
    }
  };

  const handleGoBack = () => { if (validHistoryIndex > 0) setHistoryIndex(prevIndex => prevIndex - 1); };
  const handleGoForward = () => { if (validHistoryIndex < history.length - 1) setHistoryIndex(prevIndex => prevIndex + 1); };
  const canGoBack = validHistoryIndex > 0;
  const canGoForward = validHistoryIndex < history.length - 1;
  const handleSearch = (filters: any) => setSearchFilters(filters);

  const renderPage = () => {
    if (isLoading) {
       return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div></div>;
    }
    switch (currentPage) {
      case 'listings': return <ListingsPage properties={properties} onNavigate={handleNavigate} initialFilters={searchFilters} user={currentUser} allUsers={allUsers} locations={locations} />;
      case 'propertyDetail': {
        const propertyId = pageData?.id;
        const freshProperty = properties.find(p => p.id === propertyId);
        if (!freshProperty) {
            handleNavigate('home', undefined, { replace: true });
            return null;
        }
        return <PropertyDetailsPage property={freshProperty} agent={allUsers.find(u => u.id === freshProperty.agent_id)} onSendMessage={handleSendMessage} currentUser={currentUser} onAddRating={()=>{}} ratings={ratings} />;
      }
      case 'dashboard':
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { return null; }
        const agentProperties = properties.filter(p => p.agent_id === currentUser.id);
        const agentMessages = messages.filter(m => m.agent_id === currentUser.id);
        return <DashboardPage currentUser={currentUser} properties={agentProperties} messages={agentMessages} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} onLogout={handleLogout} />;
       case 'addProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { return null; }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={handleNavigate} locations={locations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
       case 'editProperty': {
         const propertyId = pageData?.id;
         const freshPropertyToEdit = properties.find(p => p.id === propertyId);
         if (!freshPropertyToEdit) {
           handleNavigate('home', undefined, { replace: true });
           return null;
         }
         if (!currentUser || (currentUser.role !== 'admin' && currentUser.id !== freshPropertyToEdit.agent_id)) { 
           return null; 
         }
         return <EditPropertyPage propertyToEdit={freshPropertyToEdit} onEditProperty={handleEditProperty} onNavigate={handleNavigate} locations={locations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
       }
       case 'messages':
          if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { return null; }
          return <MessagesPage messages={messages} />;
       case 'profileSettings':
          if (!currentUser) { return null; }
          return <ProfileSettingsPage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onNavigate={handleNavigate} />;
       case 'login': return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
       case 'register': return <RegisterPage onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
       case 'registrationSuccess': return <RegistrationSuccessPage email={pageData.email} onNavigate={handleNavigate} />;
       case 'adminDashboard':
           if (!currentUser || currentUser.role !== 'admin') { return null; }
           return <AdminDashboardPage allUsers={allUsers} allProperties={properties} onNavigate={handleNavigate} onDeleteUser={handleDeleteUser} onDeleteProperty={handleDeleteProperty} />;
       case 'careers': return <CareersPage />;
       case 'contact': return <ContactPage />;
       case 'about': return <AboutPage />;
       case 'termsOfUse': return <TermsOfUsePage onNavigate={handleNavigate} />;
       case 'privacyPolicy': return <PrivacyPolicyPage onNavigate={handleNavigate} />;
       case 'pricing':
        if (!currentUser || currentUser.role !== 'agent') { return null; }
        return <PricingPage currentUser={currentUser} onNavigateToPayment={() => handleNavigate('payment')} />;
      case 'payment':
        if (!currentUser || currentUser.role !== 'agent' || currentUser.subscription_plan === 'premium') { return null; }
        return <PaymentPage currentUser={currentUser} onSuccessfulPayment={handleSuccessfulPayment} onNavigate={handleNavigate} />;
      case 'forgotPassword':
        return <ForgotPasswordPage onNavigate={handleNavigate} onForgotPassword={authService.sendPasswordResetEmail} />;
      case 'resetPassword':
        return <ResetPasswordPage onNavigate={handleNavigate} onResetPassword={authService.updatePassword} />;
      case 'home': default:
        return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} user={currentUser} allUsers={allUsers} locations={locations} />;
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
        <main className="flex-grow">
          {dataError ? (
            <DataErrorBanner error={dataError} onRetry={() => fetchData(currentUser)} />
          ) : (
            <div className="animate-fade-in-up" key={currentPage + validHistoryIndex}>
              {renderPage()}
            </div>
          )}
        </main>
        <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
