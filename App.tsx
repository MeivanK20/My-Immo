// Fix: Implement the main App component. This file was empty, causing it to not be a module.
import React, { useState } from 'react';
import { Page, User, Property } from './types';
import { properties as initialProperties } from './data/properties';
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
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import Modal from './components/common/Modal';
import Input from './components/common/Input';
import Button from './components/common/Button';

// Hardcoded users since we can't add a users.ts file
const users: User[] = [
    { id: 'agent-1', name: 'Alice Agent', email: 'alice@immo.com', role: 'agent', phone: '611223344' },
    { id: 'agent-2', name: 'Bob Broker', email: 'bob@immo.com', role: 'agent', phone: '655667788' },
    { id: 'visitor-1', name: 'Charlie Client', email: 'charlie@mail.com', role: 'visitor', phone: '699887766' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);

  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchFilters, setSearchFilters] = useState({});

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<'visitor' | 'agent'>('visitor');
  const [registerError, setRegisterError] = useState('');

  const handleNavigate: (page: Page, data?: any) => void = (page, data) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);
  };

  const closeLoginModal = () => {
    setShowLogin(false);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  }

  const closeRegisterModal = () => {
    setShowRegister(false);
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterRole('visitor');
    setRegisterError('');
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === loginEmail);
    if (user) { // In a real app, you'd check the password
        setCurrentUser(user);
        closeLoginModal();
    } else {
        setLoginError("Aucun utilisateur trouvé avec cet email.");
    }
  }

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('home');
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (users.some(u => u.email === registerEmail)) {
        setRegisterError("Un utilisateur avec cet email existe déjà.");
        return;
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name: registerName,
        email: registerEmail,
        role: registerRole,
    };
    users.push(newUser); 
    setCurrentUser(newUser);
    closeRegisterModal();
  }
  
  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  }
  
  const handleAddProperty = (propertyData: Omit<Property, 'id'>) => {
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      ...propertyData
    };
    setProperties(prev => [newProperty, ...prev]);
  };
  
  const handleEditProperty = (updatedProperty: Property) => {
      setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };
  
  const handleDeleteProperty = (id: string) => {
      setProperties(prev => prev.filter(p => p.id !== id));
  };
  
  const handleUpdateProfile = (updatedUser: User) => {
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
    }
    setCurrentUser(updatedUser);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'listings':
        return <ListingsPage properties={properties} onNavigate={handleNavigate} initialFilters={searchFilters} />;
      case 'propertyDetail':
        const agent = users.find(u => u.id === pageData.agentId);
        return <PropertyDetailsPage property={pageData} agent={agent} />;
      case 'dashboard':
        if (!currentUser || currentUser.role !== 'agent') {
            handleNavigate('home');
            return null;
        }
        return <DashboardPage user={currentUser} properties={properties} onNavigate={handleNavigate} onDeleteProperty={handleDeleteProperty} />;
       case 'addProperty':
         if (!currentUser || currentUser.role !== 'agent') {
            handleNavigate('home');
            return null;
        }
        return <AddPropertyPage user={currentUser} onAddProperty={handleAddProperty} onNavigate={handleNavigate} />;
       case 'editProperty':
         if (!currentUser || currentUser.role !== 'agent' || currentUser.id !== pageData.agentId) {
            handleNavigate('home');
            return null;
         }
         return <EditPropertyPage propertyToEdit={pageData} onEditProperty={handleEditProperty} onNavigate={handleNavigate} />;
       case 'contact':
        return <ContactPage />;
       case 'about':
        return <AboutPage />;
       case 'termsOfUse':
        return <TermsOfUsePage />;
       case 'privacyPolicy':
        return <PrivacyPolicyPage />;
      case 'profileSettings':
        if (!currentUser) {
          handleNavigate('home');
          return null;
        }
        return <ProfileSettingsPage user={currentUser} onUpdateProfile={handleUpdateProfile} onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <HomePage properties={properties} onNavigate={handleNavigate} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
        <Header 
            user={currentUser} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout}
            onShowLogin={() => setShowLogin(true)}
            onShowRegister={() => setShowRegister(true)}
        />
        <main className="flex-grow">
            {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />

        <Modal 
            isOpen={showLogin}
            onClose={closeLoginModal}
            title="Connexion"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            <Input label="Mot de passe" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <Button type="submit" className="w-full">Se connecter</Button>
            <p className="text-sm text-center">
              Pas de compte?{' '}
              <button type="button" className="font-semibold text-brand-red hover:underline" onClick={() => { closeLoginModal(); setShowRegister(true); }}>
                Inscrivez-vous
              </button>
            </p>
          </form>
        </Modal>

        <Modal 
            isOpen={showRegister}
            onClose={closeRegisterModal}
            title="Créer un compte"
        >
          <form onSubmit={handleRegister} className="space-y-6">
            <Input label="Nom complet" type="text" value={registerName} onChange={e => setRegisterName(e.target.value)} required />
            <Input label="Email" type="email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
            <Input label="Mot de passe" type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Je suis un</label>
              <div className="flex rounded-md shadow-sm">
                <button 
                    type="button" 
                    onClick={() => setRegisterRole('visitor')}
                    className={`px-4 py-2 text-sm font-medium border-t border-b border-l rounded-l-md w-1/2 focus:outline-none transition-colors duration-200 ${registerRole === 'visitor' ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                >
                    Visiteur
                </button>
                <button 
                    type="button" 
                    onClick={() => setRegisterRole('agent')}
                    className={`px-4 py-2 text-sm font-medium border rounded-r-md w-1/2 focus:outline-none transition-colors duration-200 ${registerRole === 'agent' ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                >
                    Agent / Propriétaire
                </button>
              </div>
            </div>
            {registerError && <p className="text-red-500 text-sm -mt-2">{registerError}</p>}
            <Button type="submit" className="w-full">S'inscrire</Button>
            <p className="text-sm text-center">
              Déjà un compte?{' '}
              <button type="button" className="font-semibold text-brand-red hover:underline" onClick={() => { closeRegisterModal(); setShowLogin(true); }}>
                Connectez-vous
              </button>
            </p>
          </form>
        </Modal>
    </div>
  );
};

export default App;