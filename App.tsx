

import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, Property, Message, Rating, Media } from './types';
import { locations as staticLocations } from './data/locations';
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

const getInitialHistoryState = () => ({
  history: [{ page: 'home' as Page, data: null }],
  historyIndex: 0,
});

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

  const [properties, setProperties] = useState<Property[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [dynamicLocations, setDynamicLocations] = usePersistentState('myImmoLocations', staticLocations);
  
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({});
  const { t } = useLanguage();

  const handleNavigate = useCallback((page: Page, data?: any, options?: { replace?: boolean }) => {
    // Clean the URL hash if it contains auth tokens from OAuth redirect
    if (window.location.hash.includes('access_token')) {
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }

    const newHistoryState = { page, data };
    if (options?.replace) {
      setHistory([newHistoryState]);
      setHistoryIndex(0);
    } else {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newHistoryState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    window.scrollTo(0, 0);
  }, [history, historyIndex]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setDataError(null);
    try {
        const [propertiesRes, profilesRes, messagesRes, ratingsRes] = await Promise.all([
            supabase.from('properties').select('*'),
            supabase.from('profiles').select('*'),
            supabase.from('messages').select('*'),
            supabase.from('ratings').select('*')
        ]);

        if (propertiesRes.error) throw propertiesRes.error;
        if (profilesRes.error) throw profilesRes.error;
        if (messagesRes.error) throw messagesRes.error;
        if (ratingsRes.error) throw ratingsRes.error;

        setProperties(propertiesRes.data as Property[] || []);
        setAllUsers(profilesRes.data as User[] || []);
        setMessages(messagesRes.data as Message[] || []);
        setRatings(ratingsRes.data as Rating[] || []);

    } catch (error: any) {
        console.error("Failed to fetch data:", error);
        setDataError(error.message);
    } finally {
        setIsLoading(false);
    }
  }, []);

  // Effect for handling authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        let userProfile: User | null = null;
        if (session?.user) {
            userProfile = await authService.getProfile(session.user.id);
            // Handle first-time OAuth login where a profile might be missing or incomplete
            if (event === 'SIGNED_IN' && (!userProfile || !userProfile.role)) {
                userProfile = await authService.createOrUpdateProfileForProvider(session.user);
                if (userProfile) {
                    handleNavigate('listings', undefined, { replace: true });
                }
            }
        }
        
        setCurrentUser(userProfile);
        setAuthLoading(false); // Authentication check is complete

        if (event === 'SIGNED_OUT') {
            setProperties([]);
            setAllUsers([]);
            setMessages([]);
            setRatings([]);
            handleNavigate('home', undefined, { replace: true });
        } else if (event === 'PASSWORD_RECOVERY') {
            handleNavigate('resetPassword');
        }
    });
    
    return () => subscription.unsubscribe();
  }, [handleNavigate]);

  // Effect for fetching data after authentication is resolved
  useEffect(() => {
    if (!authLoading) {
        fetchData();
    }
  }, [authLoading, fetchData]);

  const handleLogout = () => authService.signOut();

  const handleLogin = (email: string, password: string): Promise<void> => {
    return authService.signInWithEmail(email, password).then(user => {
      if (user) {
        if (user.role === 'admin') handleNavigate('adminDashboard', undefined, { replace: true });
        else if (user.role === 'agent') handleNavigate('dashboard', undefined, { replace: true });
        else handleNavigate('listings', undefined, { replace: true });
      }
    });
  };
  
  const handleGoogleLogin = () => authService.signInWithGoogle();

  const handleRegister = (name: string, email: string, password: string, role: 'visitor' | 'agent'): Promise<void> => {
    return authService.signUpWithEmail(name, email, password, role).then(() => {
        handleNavigate('registrationSuccess', { email });
    });
  };

  const handleAddProperty = async (propertyData: Omit<Property, 'id' | 'media'>, mediaFiles: File[]) => {
    if (!currentUser) return;
    const mediaUrls: Media[] = [];
    for (const file of mediaFiles) {
        const filePath = `public/${currentUser.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('property-media').upload(filePath, file);
        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
        }
        const { data } = supabase.storage.from('property-media').getPublicUrl(filePath);
        mediaUrls.push({ url: data.publicUrl, type: file.type.startsWith('image/') ? 'image' : 'video' });
    }
    
    const newProperty = { ...propertyData, media: mediaUrls, agent_id: currentUser.id };
    const { error } = await supabase.from('properties').insert([newProperty]);
    if (error) console.error('Error adding property', error);
    else await fetchData();
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
    else await fetchData();
  };
  
  const handleDeleteProperty = async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) console.error('Error deleting property', error);
    else await fetchData();
  };
  
  const handleSendMessage = async (messageData: Omit<Message, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('messages').insert([messageData]);
    if (error) console.error('Error sending message', error);
    else await fetchData();
  };
  
  const handleUpdateProfile = async (updatedUser: User, newProfilePicture: File | null) => {
      try {
        const data = await authService.updateProfile(updatedUser, newProfilePicture);
        setCurrentUser(data);
        await fetchData();
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
  
  const handleDeleteUser = (uid: string) => {
    alert(t('adminDashboardPage.deleteUserNotImplemented'));
  };

  // Other handlers
  const handleGoBack = () => { if (historyIndex > 0) setHistoryIndex(prevIndex => prevIndex - 1); };
  const handleGoForward = () => { if (historyIndex < history.length - 1) setHistoryIndex(prevIndex => prevIndex + 1); };
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const handleSearch = (filters: any) => setSearchFilters(filters);
  const addCity = (r:string, c:string) => {}; // Placeholder
  const addNeighborhood = (r:string, c:string, n:string) => {}; // Placeholder

  const renderPage = () => {
    if (authLoading || (isLoading && !dataError)) {
       return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red"></div></div>;
    }
    switch (currentPage) {
      case 'listings': return <ListingsPage properties={properties} onNavigate={handleNavigate} initialFilters={searchFilters} user={currentUser} allUsers={allUsers} locations={staticLocations} />;
      case 'propertyDetail':
        if (!pageData || !properties.find(p => p.id === pageData.id)) {
          handleNavigate('home', undefined, { replace: true });
          return null;
        }
        return <PropertyDetailsPage property={pageData} agent={allUsers.find(u => u.id === pageData.agent_id)} onSendMessage={handleSendMessage} currentUser={currentUser} onAddRating={()=>{}} ratings={ratings} />;
      case 'dashboard':
        if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('login', undefined, { replace: true }); return null; }
        const agentProperties = properties.filter(p => p.agent_id === currentUser.id);
        const agentMessages = messages.filter(m => m.agent_id === currentUser.id);
        return <DashboardPage currentUser={currentUser} properties={agentProperties} messages={agentMessages} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} onLogout={handleLogout} />;
       case 'addProperty':
         if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('login', undefined, { replace: true }); return null; }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={handleNavigate} locations={staticLocations} onAddCity={addCity} onAddNeighborhood={addNeighborhood} />;
       case 'editProperty':
         if (!pageData || !properties.find(p => p.id === pageData.id) || !currentUser || (currentUser.role !== 'admin' && currentUser.id !== pageData.agent_id)) { 
           handleNavigate('home', undefined, { replace: true }); 
           return null; 
         }
         return <EditPropertyPage propertyToEdit={pageData} onEditProperty={handleEditProperty} onNavigate={handleNavigate} locations={staticLocations} onAddCity={addCity} onAddNeighborhood={addNeighborhood} />;
       case 'messages':
          if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) { handleNavigate('login', undefined, { replace: true }); return null; }
          const myMessages = messages.filter(m => m.agent_id === currentUser.id);
          return <MessagesPage messages={myMessages} />;
       case 'profileSettings':
          if (!currentUser) { handleNavigate('login', undefined, { replace: true }); return null; }
          return <ProfileSettingsPage currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onNavigate={handleNavigate} />;
       case 'login': return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
       case 'register': return <RegisterPage onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
       case 'registrationSuccess': return <RegistrationSuccessPage email={pageData.email} onNavigate={handleNavigate} />;
       case 'adminDashboard':
           if (!currentUser || currentUser.role !== 'admin') { handleNavigate('home', undefined, { replace: true }); return null; }
           return <AdminDashboardPage allUsers={allUsers} allProperties={properties} onNavigate={handleNavigate} onDeleteUser={handleDeleteUser} onDeleteProperty={handleDeleteProperty} />;
       case 'careers': return <CareersPage />;
       case 'contact': return <ContactPage />;
       case 'about': return <AboutPage />;
       case 'termsOfUse': return <TermsOfUsePage onNavigate={handleNavigate} />;
       case 'privacyPolicy': return <PrivacyPolicyPage onNavigate={handleNavigate} />;
       case 'pricing':
        if (!currentUser || currentUser.role !== 'agent') { handleNavigate('login', undefined, { replace: true }); return null; }
        return <PricingPage currentUser={currentUser} onNavigateToPayment={() => handleNavigate('payment')} />;
      case 'payment':
        if (!currentUser || currentUser.role !== 'agent' || currentUser.subscription_plan === 'premium') { handleNavigate('home', undefined, { replace: true }); return null; }
        return <PaymentPage currentUser={currentUser} onSuccessfulPayment={handleSuccessfulPayment} onNavigate={handleNavigate} />;
      case 'forgotPassword':
        return <ForgotPasswordPage onNavigate={handleNavigate} onForgotPassword={authService.sendPasswordResetEmail} />;
      case 'resetPassword':
        return <ResetPasswordPage onNavigate={handleNavigate} onResetPassword={authService.updatePassword} />;
      case 'home': default:
        return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} user={currentUser} allUsers={allUsers} locations={staticLocations} />;
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
            <DataErrorBanner error={dataError} onRetry={fetchData} />
          ) : (
            <div className="animate-fade-in-up" key={currentPage + historyIndex}>
              {renderPage()}
            </div>
          )}
        </main>
        <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;