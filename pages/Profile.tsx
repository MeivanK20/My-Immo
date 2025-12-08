import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar, Shield, Trash2, Save, X, Phone, Lock, Briefcase, Upload, Camera } from 'lucide-react';
import { RoutePath } from '../types';
import { useAuth } from '../services/authContext';
import authService from '../services/authService';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBecomeAgentModal, setShowBecomeAgentModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(currentUser?.profilePhoto);
  const [tempPhoto, setTempPhoto] = useState<string | undefined>(undefined);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  if (!currentUser) {
    navigate(RoutePath.LOGIN);
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Veuillez sélectionner une image' }));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'La photo ne doit pas dépasser 2MB' }));
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoData = event.target?.result as string;
        setTempPhoto(photoData);
        setIsPhotoChanged(true);
        setErrors(prev => ({ ...prev, photo: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async () => {
    if (tempPhoto) {
      setProfilePhoto(tempPhoto);
      
      // Update profile via Supabase
      try {
        await authService.updateUserProfile(currentUser.id, { profilePhoto: tempPhoto });
        setProfilePhoto(tempPhoto);
        setSuccessMessage('Photo de profil mise à jour avec succès!');
        // refresh the page or user state
        setTimeout(() => window.location.reload(), 900);
      } catch (err) {
        setErrors(prev => ({ ...prev, photo: 'Impossible de mettre à jour la photo' }));
      }
    }
  };

  const handleCancelPhotoUpload = () => {
    setTempPhoto(undefined);
    setIsPhotoChanged(false);
    setErrors(prev => ({ ...prev, photo: '' }));
  };

  const handleRemovePhoto = async () => {
    try {
      await authService.updateUserProfile(currentUser.id, { profilePhoto: null });
      setProfilePhoto(undefined);
      setSuccessMessage('Photo de profil supprimée');
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setErrors(prev => ({ ...prev, photo: 'Impossible de supprimer la photo' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }

    return newErrors;
  };

  const handleSaveProfile = async () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await authService.updateUserProfile(currentUser.id, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      setIsEditing(false);
      setSuccessMessage('Profil mis à jour avec succès!');
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setErrors({ submit: 'Impossible de mettre à jour le profil' });
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    (async () => {
      try {
        await authService.deleteAccount(currentUser.id);
        await authService.signOut();
      } catch (err) {
        console.error('Delete account failed', err);
      } finally {
        navigate(RoutePath.HOME);
      }
    })();
  };

  const handleChangePassword = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Veuillez entrer votre mot de passe actuel';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Veuillez entrer un nouveau mot de passe';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await authService.changePassword(passwordData.newPassword);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Mot de passe mis à jour avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ currentPassword: 'Impossible de changer le mot de passe' });
    }
  };

  const handleBecomeAgent = async () => {
    try {
      await authService.updateUserProfile(currentUser.id, { role: 'agent' });
      setShowBecomeAgentModal(false);
      setSuccessMessage('Vous êtes maintenant Agent Immobilier!');
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setErrors({ submit: 'Impossible de devenir agent pour le moment' });
    }
  };

  const getRoleLabel = () => {
    switch (currentUser.role) {
      case 'agent':
        return 'Agent Immobilier';
      case 'admin':
        return 'Administrateur';
      case 'visitor':
        return 'Visiteur';
      default:
        return currentUser.role;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et paramètres de compte</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.photo && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{errors.photo}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
            <div className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {tempPhoto ? (
                    <img 
                      src={tempPhoto} 
                      alt="Profile Preview" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white opacity-75"
                    />
                  ) : profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center font-bold text-2xl text-primary-600">
                      {currentUser.fullName
                        .split(' ')
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                  <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-100 shadow-lg transition-colors">
                    <Camera size={16} className="text-primary-600" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentUser.fullName}</h2>
                  <p className="text-primary-100">{getRoleLabel()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {isPhotoChanged && (
                  <>
                    <button
                      onClick={handleSavePhoto}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Save size={14} />
                      Enregistrer
                    </button>
                    <button
                      onClick={handleCancelPhotoUpload}
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Annuler
                    </button>
                  </>
                )}
                {profilePhoto && !isPhotoChanged && (
                  <button
                    onClick={handleRemovePhoto}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Info Section */}
            <div className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <UserIcon size={18} />
                  Nom complet
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.fullName}</p>
                )}
                {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={18} />
                  Adresse email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.email}</p>
                )}
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={18} />
                  Numéro de téléphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+237 6XX XXX XXX"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <p className="text-gray-900">{currentUser.phone || 'Non fourni'}</p>
                )}
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Role Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Shield size={18} />
                  Rôle
                </label>
                <p className="text-gray-900">{getRoleLabel()}</p>
              </div>

              {/* Account Creation Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={18} />
                  Membre depuis
                </label>
                <p className="text-gray-900">{formatDate(currentUser.createdAt)}</p>
              </div>

              {/* Divider */}
              <hr className="my-6" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Save size={18} />
                      Modifier mon profil
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Lock size={18} />
                      Changer le mot de passe
                    </button>
                    {currentUser.role === 'visitor' && (
                      <button
                        onClick={() => setShowBecomeAgentModal(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Briefcase size={18} />
                        Devenir Agent
                      </button>
                    )}
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <Trash2 size={18} />
                      Supprimer mon compte
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Save size={18} />
                      Enregistrer
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                    >
                      <X size={18} />
                      Annuler
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Informations de compte</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Vos données sont stockées de manière sécurisée</li>
            <li>• Vous pouvez modifier vos informations à tout moment</li>
            <li>• La suppression de compte est permanente et irréversible</li>
          </ul>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Supprimer mon compte</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte? Cette action est permanente et irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Changer mon mot de passe</h3>
            
            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Changer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Become Agent Modal */}
      {showBecomeAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Devenir Agent Immobilier</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir passer au statut d'Agent Immobilier? Vous pourrez alors publier et gérer des annonces.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBecomeAgentModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleBecomeAgent}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Devenir Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

