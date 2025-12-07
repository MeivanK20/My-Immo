import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthCallback } from './pages/AuthCallback';
import { Listings } from './pages/Listings';
import { AddProperty } from './pages/AddProperty';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Careers } from './pages/Careers';
import { TermsOfUse } from './pages/TermsOfUse';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AIChat } from './components/AIChat';
import { RoutePath } from './types';
import authService from './services/authService';
import { LanguageProvider, useLanguage } from './services/languageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.imgur.com/M1bNYA1.png" 
              alt="My Immo Logo" 
              className="h-8 w-auto bg-white rounded-md p-1" 
            />
            <h3 className="text-xl font-bold">My Immo</h3>
          </div>
          <ul className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <li><a href={RoutePath.ABOUT} className="hover:text-white">{t('footer.about')}</a></li>
            <li><a href={RoutePath.CONTACT} className="hover:text-white">{t('footer.contact')}</a></li>
            <li><a href={RoutePath.CAREERS} className="hover:text-white">{t('footer.careers')}</a></li>
            <li><a href={RoutePath.TERMS} className="hover:text-white">{t('footer.terms')}</a></li>
            <li><a href={RoutePath.PRIVACY} className="hover:text-white">{t('footer.privacy')}</a></li>
          </ul>
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
  React.useEffect(() => {
    // Ensure test users are seeded for development/testing
    try {
      authService.seedTestUsers();
    } catch (e) {
      // ignore
    }
  }, []);
  return (
    <LanguageProvider>
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
              <Route path={RoutePath.LISTINGS} element={<Listings />} />
              <Route path={RoutePath.ADD_PROPERTY} element={<AddProperty />} />
              <Route path={RoutePath.DASHBOARD} element={<Dashboard />} />
              <Route path={RoutePath.ADMIN_DASHBOARD} element={<AdminDashboard />} />
              <Route path={RoutePath.PROFILE} element={<Profile />} />
              <Route path={RoutePath.ABOUT} element={<About />} />
              <Route path={RoutePath.CONTACT} element={<Contact />} />
              <Route path={RoutePath.CAREERS} element={<Careers />} />
              <Route path={RoutePath.TERMS} element={<TermsOfUse />} />
              <Route path={RoutePath.PRIVACY} element={<PrivacyPolicy />} />
            </Routes>
          </main>
          <Footer />
          <AIChat />
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;