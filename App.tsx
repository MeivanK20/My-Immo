import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import { PasswordReset } from './pages/PasswordReset';
import { Listings } from './pages/Listings';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Careers } from './pages/Careers';
import { TermsOfUse } from './pages/TermsOfUse';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import AddListing from './pages/AddListing';
import { AIChat } from './components/AIChat';
import { RoutePath } from './types';
import { AuthProvider } from './services/authContext';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://i.imgur.com/M1bNYA1.png" 
              alt="My Immo Logo" 
              className="h-8 w-auto bg-white rounded-md p-1" 
            />
            <h3 className="text-xl font-bold">My Immo</h3>
          </div>
          
          {/* Links */}
          <ul className="flex flex-wrap gap-6 text-gray-400 text-sm justify-center md:justify-end">
            <li><a href={`/${RoutePath.ABOUT}`} className="hover:text-white">À propos</a></li>
            <li><a href={`/${RoutePath.CAREERS}`} className="hover:text-white">Carrières</a></li>
            <li><a href={`/${RoutePath.TERMS_OF_USE}`} className="hover:text-white">Conditions d'utilisation</a></li>
            <li><a href={`/${RoutePath.PRIVACY_POLICY}`} className="hover:text-white">Politique de confidentialité</a></li>
          </ul>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} My Immo Cameroun. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path={RoutePath.HOME} element={<Home />} />
            <Route path={RoutePath.LOGIN} element={<Login />} />
            <Route path={RoutePath.SIGNUP} element={<Signup />} />
            <Route path={RoutePath.AUTH_CALLBACK} element={<AuthCallback />} />
            <Route path={RoutePath.FORGOT_PASSWORD} element={<PasswordReset />} />
            <Route path={RoutePath.LISTINGS} element={<Listings />} />
            <Route path={RoutePath.ADD_LISTING} element={<AddListing />} />
            <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
            <Route path={RoutePath.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={RoutePath.PROFILE} element={<Profile />} />
            <Route path={RoutePath.ABOUT} element={<About />} />
            <Route path={RoutePath.CAREERS} element={<Careers />} />
            <Route path={RoutePath.TERMS_OF_USE} element={<TermsOfUse />} />
            <Route path={RoutePath.PRIVACY_POLICY} element={<PrivacyPolicy />} />
            {/* Catch-all to avoid 404 on OAuth callback or unknown client routes */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <AIChat />
      </div>
      </Router>
    </AuthProvider>
  );
};

export default App;