import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User, Briefcase, Building2, Check, Chrome } from 'lucide-react';
import { UserRole, RoutePath } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { useLanguage } from '../services/languageContext';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'visitor' as UserRole,
    agencyName: '',
    agencyLicense: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue,
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (formData.role === 'agent') {
      if (!formData.agencyName.trim()) {
        newErrors.agencyName = 'Le nom de l\'agence est requis';
      }
      if (!formData.agencyLicense.trim()) {
        newErrors.agencyLicense = 'Le numéro de licence est requis';
      }
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newUser = await supabaseAuthService.signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
        formData.role === 'agent' ? formData.agencyName : undefined,
        formData.role === 'agent' ? formData.agencyLicense : undefined
      );

      setSuccessMessage('Inscription réussie! Redirection en cours...');
      
      // Dispatch auth change event
      window.dispatchEvent(new CustomEvent('authChange', { detail: { user: newUser } }));

      setTimeout(() => {
        if (newUser.role === 'admin') {
          navigate(RoutePath.ADMIN_DASHBOARD);
        } else if (newUser.role === 'agent') {
          navigate(RoutePath.DASHBOARD);
        } else {
          navigate(RoutePath.LISTINGS);
        }
      }, 800);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Une erreur est survenue lors de l\'inscription' });
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsSubmitting(true);
      await supabaseAuthService.signUpWithGoogle();
    } catch (error: any) {
      setErrors({ submit: 'Erreur lors de l\'inscription avec Google' });
      console.error('Google sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Logo and Title - Above form */}
      <div className="mb-8 text-center">
        <img 
          src="https://i.imgur.com/M1bNYA1.png" 
          alt="My Immo" 
          className="mx-auto h-16 w-auto mb-3" 
        />
        <h1 className="text-2xl font-bold text-gray-900">My Immo</h1>
      </div>

      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {t('signup.title')}
          </h2>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('signup.full_name')}
              </label>
              <div className="absolute left-3 top-10 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className={`appearance-none relative block w-full px-3 py-3 pl-10 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Jean Dupont"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('signup.email')}
              </label>
              <div className="absolute left-3 top-10 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none relative block w-full px-3 py-3 pl-10 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="jean@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('signup.password')}
              </label>
              <div className="absolute left-3 top-10 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none relative block w-full px-3 py-3 pl-10 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('signup.confirm_password')}
              </label>
              <div className="absolute left-3 top-10 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`appearance-none relative block w-full px-3 py-3 pl-10 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Role Selection - Below fields */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">{t('signup.role')}</label>
            <div className="flex flex-col gap-3">
              {/* Visitor Role */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: formData.role === 'visitor' ? '#14b8a6' : '#e5e7eb',
                  backgroundColor: formData.role === 'visitor' ? '#f0fdfa' : '#ffffff'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="visitor"
                  checked={formData.role === 'visitor'}
                  onChange={() => handleRoleChange('visitor')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-4 flex items-center gap-3">
                  <User size={20} className={formData.role === 'visitor' ? 'text-primary-600' : 'text-gray-400'} />
                  <div>
                    <span className={`text-sm font-medium ${formData.role === 'visitor' ? 'text-primary-700' : 'text-gray-700'}`}>
                      Visiteur
                    </span>
                    <p className="text-xs text-gray-500">Rechercher et consulter des biens</p>
                  </div>
                </div>
              </label>

              {/* Agent Role */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: formData.role === 'agent' ? '#14b8a6' : '#e5e7eb',
                  backgroundColor: formData.role === 'agent' ? '#f0fdfa' : '#ffffff'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="agent"
                  checked={formData.role === 'agent'}
                  onChange={() => handleRoleChange('agent')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-4 flex items-center gap-3">
                  <Briefcase size={20} className={formData.role === 'agent' ? 'text-primary-600' : 'text-gray-400'} />
                  <div>
                    <span className={`text-sm font-medium ${formData.role === 'agent' ? 'text-primary-700' : 'text-gray-700'}`}>
                      Agent / Agence
                    </span>
                    <p className="text-xs text-gray-500">Publier et gérer des annonces</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Agent-specific fields */}
          {formData.role === 'agent' && (
            <div className="space-y-4 bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={18} className="text-primary-600" />
                Informations d'agence
              </h3>
              
              <div className="relative">
                <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('signup.company_name')}
                </label>
                <input
                  id="agencyName"
                  name="agencyName"
                  type="text"
                  required={formData.role === 'agent'}
                  className={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all ${
                    errors.agencyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Agence Immobilière ABC"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                />
                {errors.agencyName && <p className="mt-1 text-sm text-red-600">{errors.agencyName}</p>}
              </div>

              <div className="relative">
                <label htmlFor="agencyLicense" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('signup.license_number')}
                </label>
                <input
                  id="agencyLicense"
                  name="agencyLicense"
                  type="text"
                  required={formData.role === 'agent'}
                  className={`appearance-none relative block w-full px-3 py-3 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all ${
                    errors.agencyLicense ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="CM-1234-5678"
                  value={formData.agencyLicense}
                  onChange={handleInputChange}
                />
                {errors.agencyLicense && <p className="mt-1 text-sm text-red-600">{errors.agencyLicense}</p>}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
            />
            <label htmlFor="acceptTerms" className="ml-3 block text-sm text-gray-700">
              J'accepte les{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                politique de confidentialité
              </a>
            </label>
          </div>
          {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRight className="h-5 w-5 text-primary-500 group-hover:text-primary-400 transition-colors" />
              </span>
              {isSubmitting ? 'Inscription en cours...' : t('signup.signup_btn')}
            </button>
          </div>

          {errors.submit && <p className="text-center text-sm text-red-600">{errors.submit}</p>}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('signup.or_divider')}</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="h-5 w-5 mr-2 text-red-500" />
              {t('signup.google_signup')}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            <Link 
              to={RoutePath.LOGIN}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('signup.login_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
