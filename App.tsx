import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Page, User, Property, Media, Message, Rating } from './types';
import { mockProperties } from './data/properties';
import { mockUsers } from './data/users';
import { locations as staticLocations } from './data/locations';
import { useLanguage } from './contexts/LanguageContext';
import { authService } from './services/authService';
import { AppwriteException } from './lib/appwrite';

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
import ConnectionErrorBanner from './components/common/ConnectionErrorBanner';
import AppwriteDemoPage from './pages/AppwriteDemoPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const DATA_VERSION = 1;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && isoDateRegex.test(value)) return new Date(value);
  return value;
};

function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved, dateReviver);
    } catch (err) { console.error(`Parsing ${key} failed`, err); }
    return defaultValue;
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } 
    catch (err) { console.error(`Saving ${key} failed`, err); }
  }, [key, state]);
  return [state, setState];
}

const getInitialHistoryState = (params: URLSearchParams) => {
    const userId = params.get('userId');
    const secret = params.get('secret');

    if (userId && secret) {
        return { history: [{ page: 'resetPassword' as Page, data: { userId, secret } }], historyIndex: 0 };
    }

    try {
      const savedHistory = sessionStorage.getItem('navigationHistory');
      const savedIndex = sessionStorage.getItem('navigationHistoryIndex');
      if (savedHistory && savedIndex !== null) {
        const parsedHistory = JSON.parse(savedHistory);
        const parsedIndex = parseInt(savedIndex, 10);
        if (Array.isArray(parsedHistory) && parsedIndex >= 0 && parsedIndex < parsedHistory.length) {
          return { history: parsedHistory, historyIndex: parsedIndex };
        }
      }
    } catch { sessionStorage.clear(); }
    return { history: [{ page: 'home' as Page, data: null }], historyIndex: 0 };
};

const usePrevious = <T,>(value: T): T | undefined => {
    // FIX: Explicitly pass `undefined` to useRef to satisfy the expectation of one argument.
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => { ref.current = value; });
    return ref.current;
}

const App: React.FC = () => {
  const [initialHistory] = useState(() => getInitialHistoryState(new URLSearchParams(window.location.search)));
  const [history, setHistory] = useState<{ page: Page; data: any }[]>(initialHistory.history);
  const [historyIndex, setHistoryIndex] = useState<number>(initialHistory.historyIndex);
  const { page: currentPage, data: pageData } = history[historyIndex];

  const [properties, setProperties] = usePersistentState<Property[]>('myImmoProperties', []);
  const [allUsers, setAllUsers] = usePersistentState<User[]>('myImmoUsers', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = usePersistentState<Message[]>('myImmoMessages', []);
  const [dynamicLocations, setDynamicLocations] = usePersistentState('myImmoLocations', staticLocations);
  const [ratings, setRatings] = usePersistentState<Rating[]>('myImmoRatings', []);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [searchFilters, setSearchFilters] = useState({});
  const { t, locale } = useLanguage();
  const prevUser = usePrevious(currentUser);

  const mergedLocations = useMemo(() => { /* ... (no changes) ... */ return staticLocations; }, [dynamicLocations]);

  useEffect(() => { /* ... (no changes) ... */ }, []);
  useEffect(() => { /* ... (no changes) ... */ }, [properties, ratings]);
  useEffect(()=>{ if(currentUser){ const u = allUsers.find(u=>u.uid===currentUser.uid); if(u) setCurrentUser(u); } }, [allUsers, currentUser]);

  const navigate = useCallback((page: Page, data: any = null, opts: { replace?: boolean } = {}) => {
    const newState = { page, data };
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    // Clean up password reset params from URL on any navigation
    if (currentSearch.includes('userId') && currentSearch.includes('secret')) {
        window.history.replaceState({}, document.title, currentPath);
    }

    if (opts.replace) {
      setHistory(h => {
          const newHistory = [...h.slice(0, historyIndex), newState];
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
      });
    } else {
      const newHistory = [...history.slice(0, historyIndex + 1), newState];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    window.scrollTo(0, 0);
  }, [history, historyIndex]);

  const checkSession = useCallback(async () => {
    setIsInitialCheckDone(false); setConnectionError(null);
    try {
      const appUser = await authService.getCurrentAccount();
      if(appUser){
        const userInState = allUsers.find(u=>u.email===appUser.email);
        if(userInState){ setCurrentUser(userInState); }
        else {
          const newU:User={ uid:appUser.$id, name:appUser.name, email:appUser.email, role:'visitor', subscriptionPlan:'free', phone:appUser.phone||'', profilePictureUrl:'', score:0, badge:undefined };
          setAllUsers(prev=>[...prev,newU]); setCurrentUser(newU);
        }
      } else { setCurrentUser(null); }
    } catch(err:any){ 
        console.error(err); 
        if (err.message?.includes('Failed to fetch')) {
            const hostname = window.location.hostname;
            const errorDetails = locale === 'fr' ? `Veuillez vérifier dans votre console Appwrite > Platforms, et vous assurer que le nom d'hôte '${hostname}' est ajouté.` : `Please check your Appwrite project console > Platforms, and ensure the hostname '${hostname}' is added.`;
            setConnectionError(`${t('failedToFetchError')} ${errorDetails}`);
        } else { setConnectionError(err.message||'Session check failed'); }
        setCurrentUser(null); 
    }
    finally{ setIsInitialCheckDone(true); }
  }, [t, locale, allUsers, setAllUsers]);

  useEffect(()=>{ if (initialHistory.history[0].page !== 'resetPassword') { checkSession(); } else { setIsInitialCheckDone(true); } }, [retryTrigger, checkSession, initialHistory]);
  
  // Effect for post-login redirection
  useEffect(() => {
    if (isInitialCheckDone && !prevUser && currentUser) {
      if (currentUser.role === 'agent' || currentUser.role === 'admin') {
        navigate('dashboard', null, { replace: true });
      } else {
        navigate('listings', null, { replace: true });
      }
    }
  }, [currentUser, prevUser, isInitialCheckDone, navigate]);

  const goBack=()=>{ if(historyIndex>0)setHistoryIndex(historyIndex-1); };
  const goForward=()=>{ if(historyIndex<history.length-1)setHistoryIndex(historyIndex+1); };
  useEffect(()=>{ sessionStorage.setItem('navigationHistory',JSON.stringify(history)); sessionStorage.setItem('navigationHistoryIndex',historyIndex.toString()); },[history,historyIndex]);
  
  const onLogin = async (email: string, password: string) => {
    await authService.createEmailSession(email, password);
    await checkSession();
  };

  const onGoogleSignIn=()=>authService.createGoogleOAuth2Session();
  const onRegister=async(name:string,email:string,password:string,role:'visitor'|'agent')=>{
    const appUser=await authService.createAccount(email,password,name);
    const newU:User={uid:appUser.$id,name:appUser.name,email:appUser.email,role,subscriptionPlan:'free',phone:'',profilePictureUrl:''};
    setAllUsers(prev=>[...prev,newU]); navigate('registrationSuccess',{email:newU.email});
  };
  const onLogout=async()=>{ 
    try { await authService.deleteCurrentSession(); } catch (e) { console.error("Logout failed on server.", e); } 
    finally { setCurrentUser(null); navigate('home',null,{replace:true}); }
  };

  const handleAddProperty = (p: Omit<Property, 'id' | 'media'>, files: File[]) => { const np: Property = { ...p, id: `prop${Date.now()}`, media: files.map((f): Media => ({ type: f.type.startsWith('image/') ? 'image' : 'video', url: URL.createObjectURL(f) })) }; setProperties(prev => [np, ...prev]); };
  const handleEditProperty = (p: Property, files: File[]) => { const newMedia: Media[] = files.map((f): Media => ({ type: f.type.startsWith('image/') ? 'image' : 'video', url: URL.createObjectURL(f) })); setProperties(prev => prev.map(prop => prop.id === p.id ? { ...p, media: [...p.media, ...newMedia] } : prop)); };
  const handleDeleteProperty=(id:string)=>setProperties(prev=>prev.filter(p=>p.id!==id));
  const handleSendMessage=(m:Omit<Message,'id'|'timestamp'>)=>{ const newM:Message={...m,id:`msg${Date.now()}`,timestamp:new Date()}; setMessages(prev=>[newM,...prev]); };
  const handleAddRating=(pid:string,agentUid:string,rating:number)=>{ if(!currentUser)return; const idx=ratings.findIndex(r=>r.propertyId===pid && r.visitorUid===currentUser.uid); const newR:Rating={id:`rating${Date.now()}`,propertyId:pid,agentUid,visitorUid:currentUser.uid,rating,timestamp:new Date()}; if(idx>-1){ setRatings(prev=>{const arr=[...prev];arr[idx]=newR;return arr;}); } else setRatings(prev=>[...prev,newR]); };
  const handleAddCity=(r:string,c:string)=>setDynamicLocations(prev=>{const n=JSON.parse(JSON.stringify(prev)); if(!n[r])n[r]={}; if(!n[r][c])n[r][c]=[]; return n; });
  const handleAddNeighborhood=(r:string,c:string,nn:string)=>setDynamicLocations(prev=>{const n=JSON.parse(JSON.stringify(prev)); if(n[r]?.[c]&&!n[r][c].includes(nn))n[r][c].push(nn); return n; });
  const handleDeleteUser=(uid:string)=>{ const a=allUsers.find(u=>u.uid===uid && u.role==='admin'); if(a && allUsers.filter(u=>u.role==='admin').length<=1){ alert(t('adminDashboardPage.cannotDeleteSelf')); return; } setAllUsers(prev=>prev.filter(u=>u.uid!==uid)); setProperties(prev=>prev.filter(p=>p.agentUid!==uid)); };
  const onUpdateProfile=(u:User,f:File|null)=>{ setAllUsers(prev=>prev.map(user=>user.uid===u.uid?u:user)); };
  const onSuccessfulPayment=()=>{ if(currentUser){ const u={...currentUser,subscriptionPlan:'premium' as const}; setAllUsers(prev=>prev.map(user=>user.uid===u.uid?u:user)); } navigate('pricing'); };

  const renderPage=()=>{
    const guestOnlyPages: Page[] = ['login', 'register', 'registrationSuccess', 'forgotPassword', 'resetPassword'];
    const protectedPages: Partial<Record<Page, Array<User['role']>>> = {
        dashboard: ['agent', 'admin'], addProperty: ['agent', 'admin'], editProperty: ['agent', 'admin'],
        messages: ['agent', 'admin'], profileSettings: ['visitor', 'agent', 'admin'], adminDashboard: ['admin'],
        pricing: ['agent', 'admin'], payment: ['agent', 'admin'], appwriteDemo: ['visitor', 'agent', 'admin'],
    };

    if (!isInitialCheckDone) {
      return <div className="flex justify-center items-center h-screen bg-brand-dark"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-red"/></div>;
    }

    if (currentUser && guestOnlyPages.includes(currentPage) && currentPage !== 'resetPassword') {
        const target = (currentUser.role === 'agent' || currentUser.role === 'admin') ? 'dashboard' : 'listings';
        navigate(target, null, { replace: true }); return null;
    }

    if (!currentUser && currentPage in protectedPages) {
        navigate('login', null, { replace: true }); return null;
    }

    if (currentUser && currentPage in protectedPages && !protectedPages[currentPage]?.includes(currentUser.role)) {
        navigate('home', null, { replace: true }); return null;
    }

    switch(currentPage){
      case 'home': return <HomePage properties={properties} onNavigate={navigate} onSearch={setSearchFilters} user={currentUser} allUsers={allUsers} locations={mergedLocations}/>;
      case 'listings': return <ListingsPage properties={properties} onNavigate={navigate} initialFilters={searchFilters} user={currentUser} allUsers={allUsers} locations={mergedLocations}/>;
      case 'propertyDetail': return <PropertyDetailsPage property={pageData as Property} agent={allUsers.find(u=>u.uid===(pageData as Property).agentUid)} onSendMessage={handleSendMessage} currentUser={currentUser} onAddRating={handleAddRating} ratings={ratings}/>;
      case 'login': return <LoginPage onLogin={onLogin} onGoogleSignIn={onGoogleSignIn} onNavigate={navigate}/>;
      case 'register': return <RegisterPage onRegister={onRegister} onGoogleSignIn={onGoogleSignIn} onNavigate={navigate}/>;
      case 'registrationSuccess': return <RegistrationSuccessPage email={(pageData as any)?.email} onNavigate={navigate}/>;
      case 'forgotPassword': return <ForgotPasswordPage onNavigate={navigate} />;
      case 'resetPassword': return <ResetPasswordPage onNavigate={navigate} urlParams={pageData} />;

      case 'dashboard': return <DashboardPage currentUser={currentUser!} properties={properties} messages={messages} onNavigate={navigate} onDeleteProperty={handleDeleteProperty} onLogout={onLogout} />;
      case 'addProperty': return <AddPropertyPage user={currentUser!} onAddProperty={handleAddProperty} onNavigate={navigate} locations={mergedLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood}/>;
      case 'editProperty': return <EditPropertyPage propertyToEdit={pageData as Property} onEditProperty={handleEditProperty} onNavigate={navigate} locations={mergedLocations} onAddCity={handleAddCity} onAddNeighborhood={handleAddNeighborhood}/>;
      case 'messages': return <MessagesPage messages={messages.filter(m=>m.agentUid===currentUser!.uid)}/>;
      case 'profileSettings': return <ProfileSettingsPage currentUser={currentUser!} onUpdateProfile={onUpdateProfile} onNavigate={navigate}/>;
      case 'adminDashboard': return <AdminDashboardPage allUsers={allUsers} allProperties={properties} onNavigate={navigate} onDeleteUser={handleDeleteUser} onDeleteProperty={handleDeleteProperty}/>;
      case 'pricing': return <PricingPage currentUser={currentUser!} onNavigateToPayment={()=>navigate('payment')}/>;
      case 'payment': return <PaymentPage currentUser={currentUser!} onSuccessfulPayment={onSuccessfulPayment} onNavigate={navigate}/>;
      case 'appwriteDemo': return <AppwriteDemoPage currentUser={currentUser!} />;
      
      case 'contact': return <ContactPage/>;
      case 'about': return <AboutPage/>;
      case 'termsOfUse': return <TermsOfUsePage onNavigate={navigate}/>;
      case 'privacyPolicy': return <PrivacyPolicyPage onNavigate={navigate}/>;
      case 'careers': return <CareersPage/>;

      default: navigate('home', null, { replace: true }); return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={currentUser} onNavigate={navigate} onLogout={onLogout} onGoBack={goBack} onGoForward={goForward} canGoBack={historyIndex>0} canGoForward={historyIndex<history.length-1}/>
      {connectionError && <ConnectionErrorBanner message={connectionError} onRetry={()=>setRetryTrigger(t=>t+1)}/>}
      <main className="flex-grow">{renderPage()}</main>
      <Footer onNavigate={navigate}/>
    </div>
  );
};

export default App;