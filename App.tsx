import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, Property, Message, Rating, Media, Advertisement, Job } from './types';
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
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DataErrorBanner from './components/common/DataErrorBanner';
import { User as SupabaseUser } from '@supabase/supabase-js';

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

interface HistoryState {
  stack: { page: Page; data: any }[];
  index: number;
}

const App: React.FC = () => {
  // History and Navigation State
  const [historyState, setHistoryState] = usePersistentState<HistoryState>(
    'myImmoHistoryState',
    {
      stack: [{ page: 'home', data: null }],
      index: 0,
    }
  );
  const { stack: history, index: historyIndex } = historyState;
  const validHistoryIndex = Math.max(0, Math.min(historyIndex, history.length - 1));
  const { page: currentPage, data: pageData } = history[validHistoryIndex] || { page: 'home', data: null };


  // Core States for Sequential Loading
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // From 'profiles' table
  const [isLoading, setIsLoading] = useState(true); // Single, unified loading state

  // Application Data States
  const [properties, setProperties] = useState<Property[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [locations, setLocations] = useState<LocationData>({});
  const [dbRegions, setDbRegions] = useState<RegionDB[]>([]);
  const [dbCities, setDbCities] = useState<CityDB[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({});
  const { t } = useLanguage();
  const isAppView = /wv\)|WebView/i.test(navigator.userAgent);
  
  const handleNavigate = useCallback((page: Page, data?: any, options?: { replace?: boolean }) => {
    if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);

    const newHistoryEntry = { page, data };

    setHistoryState(prevState => {
        const { stack, index } = prevState;
        const validIndex = Math.max(0, Math.min(index, stack.length - 1));

        if (options?.replace) {
            const newStack = [newHistoryEntry];
            return {
                stack: newStack,
                index: 0
            };
        } else {
            const newStack = stack.slice(0, validIndex + 1);
            newStack.push(newHistoryEntry);
            return {
                stack: newStack,
                index: newStack.length - 1
            };
        }
    });
  }, [setHistoryState]);

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
        throw error;
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        const currentAuthUser = session?.user || null;
        setAuthUser(currentAuthUser);

        if (!currentAuthUser) {
            setCurrentUser(null);
            setIsLoading(false);
        }
        if (event === 'PASSWORD_RECOVERY') {
            handleNavigate('resetPassword');
        }
    });

    return () => subscription.unsubscribe();
  }, [handleNavigate]);

  useEffect(() => {
    if (!authUser) {
      setCurrentUser(null);
      return;
    }

    const fetchAndSetProfile = async () => {
      try {
        setDataError(null);
        let userProfile = await authService.getProfile(authUser.id);

        if (!userProfile || !userProfile.role) {
          console.log("Profile missing or incomplete for active session, attempting to repair...");
          userProfile = await authService.createOrUpdateProfileForProvider(authUser);
        }
        setCurrentUser(userProfile);
      } catch (error: any) {
        console.error("Caught error while fetching profile:", error);
        setDataError(error.message || 'Failed to fetch user profile.');
        setCurrentUser(null);
        authService.signOut();
      }
    };

    fetchAndSetProfile();
  }, [authUser]);

  useEffect(() => {
    const clearData = () => {
        setProperties([]); setAllUsers([]); setMessages([]); setRatings([]);
        setLocations({}); setDbRegions([]); setDbCities([]); setAdvertisements([]); setJobs([]);
    };

    if (!currentUser) {
        clearData();
        if (!authUser) {
             setIsLoading(false);
        }
        return;
    }

    const loadAppData = async () => {
        setDataError(null);
        try {
            await fetchLocations();
            const [propertiesRes, profilesRes, ratingsRes, adsRes, jobsRes] = await Promise.all([
                supabase.from('properties').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('*'),
                supabase.from('ratings').select('*'),
                supabase.from('advertisements').select('*').eq('is_active', true),
                supabase.from('jobs').select('*').eq('is_active', true)
            ]);

            if (propertiesRes.error) throw propertiesRes.error;
            if (profilesRes.error) throw profilesRes.error;
            if (ratingsRes.error) throw ratingsRes.error;
            if (adsRes.error) throw adsRes.error;
            if (jobsRes.error) throw jobsRes.error;

            setProperties(propertiesRes.data as Property[] || []);
            setAllUsers(profilesRes.data as User[] || []);
            setRatings(ratingsRes.data as Rating[] || []);
            setAdvertisements(adsRes.data as Advertisement[] || []);
            setJobs(jobsRes.data as Job[] || []);
            
            if (currentUser.role === 'agent' || currentUser.role === 'admin') {
                const { data: messagesData, error: messagesError } = await supabase
                    .from('messages').select('*').eq('agent_id', currentUser.id);
                if (messagesError) throw messagesError;
                setMessages(messagesData as Message[] || []);
            } else {
                setMessages([]);
            }
        } catch (error: any) {
            console.error("Failed to fetch data:", error);
            setDataError(error.message || String(error));
        } finally {
            setIsLoading(false);
        }
    };

    loadAppData();
  }, [currentUser, fetchLocations, authUser]);

  useEffect(() => {
    if (isLoading) return;

    const authPages: Page[] = ['login', 'register', 'forgotPassword', 'resetPassword', 'registrationSuccess'];
    const userRequiredPages: Page[] = ['profileSettings', 'pricing']; 
    const agentRequiredPages: Page[] = ['dashboard', 'addProperty', 'editProperty', 'messages'];
    const adminRequiredPages: Page[] = ['adminDashboard'];
    const protectedPages = [...userRequiredPages, ...agentRequiredPages, ...adminRequiredPages];

    if (currentUser && authPages.includes(currentPage)) {
        handleNavigate('home', null, { replace: true });
    } else if (!currentUser && protectedPages.includes(currentPage)) {
        handleNavigate('login', null, { replace: true });
    } else if (currentUser?.role === 'visitor' && (agentRequiredPages.includes(currentPage) || adminRequiredPages.includes(currentPage))) {
        handleNavigate('home', null, { replace: true });
    } else if (currentUser?.role === 'agent' && adminRequiredPages.includes(currentPage)) {
        handleNavigate('dashboard', null, { replace: true });
    }
  }, [isLoading, currentUser, currentPage, handleNavigate]);

  const goBack = useCallback(() => { historyIndex > 0 && setHistoryState(p => ({ ...p, index: p.index - 1 })); }, [historyIndex, setHistoryState]);
  const goForward = useCallback(() => { historyIndex < history.length - 1 && setHistoryState(p => ({ ...p, index: p.index + 1 })); }, [historyIndex, history.length, setHistoryState]);
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const retryDataFetch = useCallback(() => { setIsLoading(true); setDataError(null); }, []);

  // Handlers
  const handleLogin = async (email, password) => await authService.signInWithEmail(email, password);
  const handleGoogleLogin = async () => await authService.signInWithGoogle();
  const handleRegister = async (name, email, password, phone, role) => {
    await authService.signUpWithEmail(name, email, password, phone, role);
    handleNavigate('registrationSuccess', { email });
  };
  const handleLogout = useCallback(async () => {
    await authService.signOut();
    localStorage.removeItem('myImmoHistoryState');
    window.location.href = '/';
  }, []);
  const handleForgotPassword = async (email) => await authService.sendPasswordResetEmail(email);
  const handleResetPassword = async (password) => await supabase.auth.updateUser({ password });
  const handleUpdateProfile = async (updatedUser, pic) => {
    const p = await authService.updateProfile(updatedUser, pic);
    setCurrentUser(p); setAllUsers(prev => prev.map(u => u.id === p.id ? p : u));
  };
  const handleUpdatePassword = async (current, newPass) => await authService.updatePassword(currentUser!.email, current, newPass);
  const handleDeleteAccount = async (password) => await authService.deleteAccount(currentUser!.email, password);
  const handleSearch = (filters) => { setSearchFilters(filters); };

  const handleAddProperty = async (propertyData, mediaFiles) => {
    if (!currentUser) return;
    const media = await Promise.all(mediaFiles.map(async file => {
      const path = `${currentUser.id}/${Date.now()}-${file.name}`;
      await supabase.storage.from('properties-media').upload(path, file);
      const { data: { publicUrl } } = supabase.storage.from('properties-media').getPublicUrl(path);
      return { type: file.type.startsWith('image/') ? 'image' : 'video', url: publicUrl };
    }));
    const { data } = await supabase.from('properties').insert([{ ...propertyData, agent_id: currentUser.id, media }]).select().single();
    if (data) setProperties(p => [data, ...p]);
  };
  
  const handleEditProperty = async (updatedProperty, newMediaFiles) => {
    if (!currentUser) return;
    const newMedia = await Promise.all(newMediaFiles.map(async file => {
      const path = `${currentUser.id}/${Date.now()}-${file.name}`;
      await supabase.storage.from('properties-media').upload(path, file);
      const { data: { publicUrl } } = supabase.storage.from('properties-media').getPublicUrl(path);
      return { type: file.type.startsWith('image/') ? 'image' : 'video', url: publicUrl };
    }));
    const finalMedia = [...updatedProperty.media, ...newMedia];
    const { data } = await supabase.from('properties').update({ ...updatedProperty, media: finalMedia }).eq('id', updatedProperty.id).select().single();
    if (data) setProperties(p => p.map(prop => prop.id === data.id ? data : prop));
  };
  
  const handleDeleteProperty = async (id) => {
    await supabase.from('properties').delete().eq('id', id);
    setProperties(p => p.filter(prop => prop.id !== id));
  };
  
  const handleSendMessage = async (msg) => { await supabase.from('messages').insert([msg]); };
  
  const handleAddRating = async (propId, agentId, rating) => {
    if (!currentUser) return;
    const { data } = await supabase.from('ratings').upsert({ property_id: propId, agent_id: agentId, visitor_id: currentUser.id, rating }, { onConflict: 'property_id,visitor_id' }).select().single();
    if(data) setRatings(r => [...r.filter(rate => rate.id !== data.id), data]);
  };
  
  const handleAddCity = async (region, city) => {
    const reg = dbRegions.find(r => r.name === region);
    if(reg) { await supabase.from('cities').insert({ name: city, region_id: reg.id }); fetchLocations(); }
  };
  const handleAddNeighborhood = async (region, city, hood) => {
    const c = dbCities.find(ci => ci.name === city);
    if(c) { await supabase.from('neighborhoods').insert({ name: hood, city_id: c.id }); fetchLocations(); }
  };
  const handleDeleteUser = async (id) => {
    if(currentUser?.id === id) { alert("Cannot delete self."); return; }
    await supabase.rpc('delete_user_and_data', { user_id_to_delete: id });
    setAllUsers(u => u.filter(user => user.id !== id));
  };
  const handleSelectFreePlan = async () => {
    if(currentUser?.role === 'visitor') await handleUpdateProfile({ ...currentUser, role: 'agent', subscription_plan: 'free' }, null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} user={currentUser} allUsers={allUsers} locations={locations} />;
      case 'listings': return <ListingsPage properties={properties} onNavigate={handleNavigate} initialFilters={searchFilters} user={currentUser} allUsers={allUsers} locations={locations} advertisements={advertisements} />;
      case 'propertyDetail': return <PropertyDetailsPage property={pageData} agent={allUsers.find(u => u.id === pageData.agent_id)} onSendMessage={handleSendMessage} currentUser={currentUser} onAddRating={handleAddRating} ratings={ratings} />;
      case 'dashboard': return <DashboardPage currentUser={currentUser!} properties={properties.filter(p => p.agent_id === currentUser?.id)} messages={messages} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} />;
      case 'addProperty': return <AddPropertyPage user={currentUser!} onAddProperty={handleAddProperty} onNavigate={handleNavigate} locations={locations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
      case 'editProperty': return <EditPropertyPage propertyToEdit={pageData} onEditProperty={handleEditProperty} onNavigate={handleNavigate} locations={locations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood} />;
      case 'contact': return <ContactPage />;
      case 'about': return <AboutPage />;
      case 'termsOfUse': return <TermsOfUsePage onNavigate={handleNavigate} />;
      case 'privacyPolicy': return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'messages': return <MessagesPage messages={messages} />;
      case 'login': return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
      case 'register': return <RegisterPage onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
      case 'profileSettings': return <ProfileSettingsPage currentUser={currentUser!} onUpdateProfile={handleUpdateProfile} onNavigate={handleNavigate} onUpdatePassword={handleUpdatePassword} onDeleteAccount={handleDeleteAccount} />;
      case 'registrationSuccess': return <RegistrationSuccessPage email={pageData.email} onNavigate={handleNavigate} />;
      case 'adminDashboard': return <AdminDashboardPage onNavigate={handleNavigate} allUsers={allUsers} allProperties={properties} onDeleteUser={handleDeleteUser} onDeleteProperty={handleDeleteProperty} />;
      case 'careers': return <CareersPage jobs={jobs} />;
      case 'pricing': return <PricingPage currentUser={currentUser!} onSelectFreePlan={handleSelectFreePlan} />;
      case 'forgotPassword': return <ForgotPasswordPage onNavigate={handleNavigate} onForgotPassword={handleForgotPassword} />;
      case 'resetPassword': return <ResetPasswordPage onNavigate={handleNavigate} onResetPassword={handleResetPassword} />;
      default: return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} user={currentUser} allUsers={allUsers} locations={locations} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-dark">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        user={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onGoBack={goBack}
        onGoForward={goForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        currentPage={currentPage}
      />
      <main className="flex-grow">
        {dataError ? <DataErrorBanner error={dataError} onRetry={retryDataFetch} /> : renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} variant={isAppView ? 'simplified' : 'normal'} />
    </div>
  );
};

export default App;
