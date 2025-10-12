import React, { useState, useEffect } from 'react';
import { User, NavigationFunction } from '../types';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileSettingsPageProps {
  currentUser: User;
  onUpdateProfile: (updatedUser: User, newProfilePicture: File | null) => void;
  onNavigate: NavigationFunction;
}

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ currentUser, onUpdateProfile, onNavigate }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUser.profilePictureUrl || null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!profilePicture) {
      setPreview(currentUser.profilePictureUrl || null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePicture);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePicture, currentUser.profilePictureUrl]);

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

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">{t('profileSettingsPage.title')}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
            <p>{t('profileSettingsPage.successMessage')}</p>
          </div>
        )}
        <div className="flex flex-col items-center space-y-4">
          <label htmlFor="profile-picture-upload" className="cursor-pointer group relative">
            <img 
              src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=f87171&color=fff&size=128`} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 group-hover:border-brand-red transition-colors"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity">
              <span className="text-white text-sm opacity-0 group-hover:opacity-100">{t('profileSettingsPage.uploadHint')}</span>
            </div>
          </label>
          <input 
            type="file" 
            id="profile-picture-upload" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange} 
          />
        </div>

        <Input 
          label={t('profileSettingsPage.fullName')} 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <Input 
          label={t('profileSettingsPage.email')} 
          name="email" 
          type="email" 
          value={formData.email} 
          disabled 
          className="bg-gray-100"
        />
        <Input 
          label={t('profileSettingsPage.phone')} 
          name="phone" 
          type="tel"
          value={formData.phone} 
          onChange={handleChange} 
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">{t('profileSettingsPage.saveChanges')}</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
