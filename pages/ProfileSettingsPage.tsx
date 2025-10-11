import React, { useState } from 'react';
import { User, NavigationFunction } from '../types';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

interface ProfileSettingsPageProps {
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
  onNavigate: NavigationFunction;
}

const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ user, onUpdateProfile, onNavigate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    const updatedUser = {
        ...user,
        name,
        email,
        phone,
    };
    
    onUpdateProfile(updatedUser);
    setSuccess('Profil mis à jour avec succès !');
    
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Paramètres du profil</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Informations personnelles</h2>
        <Input 
          label="Nom complet" 
          name="name" 
          type="text"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <Input 
          label="Adresse Email" 
          name="email" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <Input
          label="Numéro de téléphone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="ex: 655123456"
        />

        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 pt-4">Changer le mot de passe</h2>
        <Input 
          label="Nouveau mot de passe" 
          name="password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Laissez vide pour ne pas changer"
        />
        <Input 
          label="Confirmer le nouveau mot de passe" 
          name="confirmPassword" 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => onNavigate(user.role === 'agent' ? 'dashboard' : 'home')}>
            Retour
          </Button>
          <Button type="submit">Sauvegarder les modifications</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;