



import React, { useState, useEffect } from 'react';
import { User, NavigationFunction } from '../types';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';
import Modal from '../components/common/Modal';

interface ProfileSettingsPageProps {
  currentUser: User;
  onUpdateProfile: (updatedUser: User, newProfilePicture: File | null) => void;
  onNavigate: NavigationFunction;
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
}

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ currentUser, onUpdateProfile, onNavigate, onUpdatePassword, onDeleteAccount }) => {
  const { t } = useLanguage();
  // Profile state
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUser.profile_picture_url || null);
  const [success, setSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Delete account state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    if (!profilePicture) {
      setPreview(currentUser.profile_picture_url || null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePicture);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePicture, currentUser.profile_picture_url]);

  useEffect(() => {
    setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
    });
    setPreview(currentUser.profile_picture_url || null)
  }, [currentUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      ...formData,
    };
    onUpdateProfile(updatedUser, profilePicture);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordError(t('profileSettingsPage.passwordMismatchError'));
      return;
    }

    setIsPasswordLoading(true);
    try {
      await onUpdatePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(t('profileSettingsPage.incorrectPasswordError'));
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleAccountDeleteConfirm = async () => {
    setDeleteError('');
    if (!deleteConfirmPassword) {
      setDeleteError('Password is required.');
      return;
    }
    setIsDeleteLoading(true);
    try {
      await onDeleteAccount(deleteConfirmPassword);
      // On success, the auth listener in App.tsx will handle the redirect.
    } catch (err: any) {
      setDeleteError(err.message || 'An error occurred.');
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-6">{t('profileSettingsPage.title')}</h1>
      
      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-brand-card p-8 rounded-lg shadow-lg space-y-6">
        {success && (
          <div className="bg-green-500/20 border-l-4 border-green-400 text-green-200 p-4" role="alert">
            <p>{t('profileSettingsPage.successMessage')}</p>
          </div>
        )}
        <div className="flex flex-col items-center space-y-4">
          <label htmlFor="profile-picture-upload" className="cursor-pointer group relative">
            <img 
              src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=ef4444&color=fff&size=128`} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-brand-dark group-hover:border-brand-red transition-colors"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 rounded-full flex flex-col items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <CameraIcon />
                <span className="text-white text-xs mt-1">{t('profileSettingsPage.uploadHint')}</span>
            </div>
          </label>
          <input type="file" id="profile-picture-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <Input label={t('profileSettingsPage.fullName')} name="name" value={formData.name} disabled />
        </div>
        <div>
          <Input label={t('profileSettingsPage.email')} name="email" type="email" value={formData.email} disabled />
          <p className="text-xs text-gray-400 mt-2 px-1">{t('profileSettingsPage.immutableFieldsInfo')}</p>
        </div>
        <Input label={t('profileSettingsPage.phone')} name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        <div className="flex justify-end pt-4">
          <Button type="submit">{t('profileSettingsPage.saveChanges')}</Button>
        </div>
      </form>

       {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="mt-8 bg-brand-card p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-xl font-semibold text-white mb-4">{t('profileSettingsPage.changePasswordTitle')}</h2>
        {passwordSuccess && <div className="bg-green-500/20 text-green-200 p-3 rounded-md">{t('profileSettingsPage.passwordSuccessMessage')}</div>}
        {passwordError && <div className="bg-red-500/20 text-red-400 p-3 rounded-md">{passwordError}</div>}
        <Input label={t('profileSettingsPage.currentPassword')} name="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        <Input label={t('profileSettingsPage.newPassword')} name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <Input label={t('profileSettingsPage.confirmNewPassword')} name="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPasswordLoading}>{isPasswordLoading ? '...' : t('profileSettingsPage.saveChanges')}</Button>
        </div>
      </form>

      {/* Subscription Management */}
      {currentUser.role === 'agent' && (
        <div className="mt-8 bg-brand-card p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">{t('profileSettingsPage.subscriptionTitle')}</h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-300">{t('profileSettingsPage.currentPlan')}: <span className="font-bold text-white capitalize">{currentUser.subscription_plan}</span></p>
            {currentUser.subscription_plan !== 'premium' && (
              <Button onClick={() => onNavigate('pricing')}>{t('profileSettingsPage.upgradePlan')}</Button>
            )}
          </div>
        </div>
      )}

      {/* Become an Agent CTA */}
      {currentUser.role === 'visitor' && (
        <div className="mt-8 bg-brand-card p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-white mb-2">{t('profileSettingsPage.becomeAgentTitle')}</h2>
            <p className="text-gray-300 mb-6">{t('profileSettingsPage.becomeAgentText')}</p>
            <Button onClick={() => onNavigate('pricing')}>{t('profileSettingsPage.viewPlans')}</Button>
        </div>
      )}

      {/* Danger Zone */}
      <div className="mt-8 bg-red-900/20 border border-red-500/30 p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-red-300">{t('profileSettingsPage.dangerZoneTitle')}</h2>
        <p className="text-gray-400 mt-2 mb-6">{t('profileSettingsPage.deleteAccountText')}</p>
        <Button variant="primary" onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">{t('profileSettingsPage.deleteAccount')}</Button>
      </div>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={t('profileSettingsPage.deleteAccountModalTitle')}>
        <div>
          <p className="text-gray-300">{t('profileSettingsPage.deleteAccountModalText')}</p>
          {deleteError && <div className="mt-4 bg-red-500/20 text-red-400 p-3 rounded-md text-sm">{deleteError}</div>}
          <div className="mt-4">
            <Input
              label={t('profileSettingsPage.currentPassword')}
              id="delete-confirm-password"
              type="password"
              value={deleteConfirmPassword}
              onChange={(e) => setDeleteConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleteLoading}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleAccountDeleteConfirm} disabled={isDeleteLoading} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
              {isDeleteLoading ? '...' : t('profileSettingsPage.deleteAccountConfirmButton')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileSettingsPage;