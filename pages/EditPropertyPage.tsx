

import React, { useState, useEffect } from 'react';
import { Property, NavigationFunction, AddCityFunction, AddNeighborhoodFunction } from '../types';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';
import Modal from '../components/common/Modal';

interface EditPropertyPageProps {
  propertyToEdit: Property;
  onEditProperty: (property: Property, newMediaFiles: File[]) => void;
  onNavigate: NavigationFunction;
  locations: { [region: string]: { [city: string]: string[] } };
  onAddCity: AddCityFunction;
  onAddNeighborhood: AddNeighborhoodFunction;
}

const EditPropertyPage: React.FC<EditPropertyPageProps> = ({ propertyToEdit, onEditProperty, onNavigate, locations, onAddCity, onAddNeighborhood }) => {
  const { t } = useLanguage();
  const [propertyData, setPropertyData] = useState({ ...propertyToEdit, phone: propertyToEdit.phone || '' });
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState<{url: string, type: 'image' | 'video'}[]>([]);
  const [isAddCityModalOpen, setAddCityModalOpen] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [isAddNeighborhoodModalOpen, setAddNeighborhoodModalOpen] = useState(false);
  const [newNeighborhoodName, setNewNeighborhoodName] = useState('');

  const regions = Object.keys(locations);

  useEffect(() => {
    setPropertyData({ ...propertyToEdit, phone: propertyToEdit.phone || '' });
    return () => {
        newMediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewMediaFiles(prev => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file: File) => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'video' as 'image' | 'video'
      }));
      setNewMediaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeExistingMedia = (indexToRemove: number) => {
    setPropertyData(prev => ({...prev, media: prev.media.filter((_, index) => index !== indexToRemove)}));
  };
  
  const removeNewMedia = (indexToRemove: number) => {
    URL.revokeObjectURL(newMediaPreviews[indexToRemove].url);
    setNewMediaFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setNewMediaPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPropertyData(prev => ({ ...prev, region: e.target.value, city: '', neighborhood: '' }));
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPropertyData(prev => ({...prev, city: e.target.value, neighborhood: ''}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (propertyData.media.length === 0 && newMediaFiles.length === 0) {
      alert(t('editPropertyPage.alertMinOneMedia'));
      return;
    }
    const updatedProperty = {
      ...propertyData,
      price: parseInt(String(propertyData.price), 10),
      bedrooms: parseInt(String(propertyData.bedrooms), 10),
      bathrooms: parseInt(String(propertyData.bathrooms), 10),
      area: parseInt(String(propertyData.area), 10),
    };
    onEditProperty(updatedProperty, newMediaFiles);
    onNavigate('dashboard');
  };

  const handleAddNewCity = () => {
    if (newCityName.trim() === '' || !propertyData.region) return;
    onAddCity(propertyData.region, newCityName.trim());
    setPropertyData(prev => ({ ...prev, city: newCityName.trim(), neighborhood: '' }));
    setNewCityName('');
    setAddCityModalOpen(false);
  };

  const handleAddNewNeighborhood = () => {
    if (newNeighborhoodName.trim() === '' || !propertyData.city || !propertyData.region) return;
    onAddNeighborhood(propertyData.region, propertyData.city, newNeighborhoodName.trim());
    setPropertyData(prev => ({ ...prev, neighborhood: newNeighborhoodName.trim() }));
    setNewNeighborhoodName('');
    setAddNeighborhoodModalOpen(false);
  };
  
  const citiesForSelectedRegion = propertyData.region ? Object.keys(locations[propertyData.region] || {}) : [];
  const neighborhoodsForSelectedCity = propertyData.city ? (locations[propertyData.region]?.[propertyData.city] || []) : [];

  return (
    <>
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6">{t('editPropertyPage.title')}</h1>
        <form onSubmit={handleSubmit} className="bg-brand-card p-8 rounded-lg shadow-lg space-y-6">
          <Input label={t('addPropertyPage.listingTitle')} name="title" value={propertyData.title} onChange={handleChange} required />
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">{t('addPropertyPage.description')}</label>
            <textarea id="description" name="description" rows={4} value={propertyData.description} onChange={handleChange} className="mt-1 block w-full px-4 py-2 bg-brand-dark border border-brand-card rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-white" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('addPropertyPage.media')}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-dark hover:border-brand-red/50 border-dashed rounded-md transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-brand-card rounded-md font-medium text-brand-red hover:text-brand-red-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-brand-dark focus-within:ring-brand-red"><span>{t('editPropertyPage.addFiles')}</span><input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*,video/mp4,video/quicktime" onChange={handleFileChange} /></label>
                </div>
                <p className="text-xs text-gray-500">{t('editPropertyPage.addMediaHint')}</p>
              </div>
            </div>
              {(propertyData.media.length > 0 || newMediaPreviews.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {propertyData.media.map((item, index) => (
                      <div key={item.url} className="relative group aspect-w-1 aspect-h-1">
                      {item.type === 'image' ? <img src={item.url} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md" /> : <video src={item.url} className="w-full h-full object-cover rounded-md" />}
                      <button type="button" onClick={() => removeExistingMedia(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove media">X</button>
                      </div>
                  ))}
                  {newMediaPreviews.map((item, index) => (
                      <div key={item.url} className="relative group aspect-w-1 aspect-h-1">
                      {item.type === 'image' ? <img src={item.url} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md" /> : <video src={item.url} className="w-full h-full object-cover rounded-md" />}
                      <button type="button" onClick={() => removeNewMedia(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove media">X</button>
                      </div>
                  ))}
                  </div>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label={t('addPropertyPage.price')} name="price" type="number" value={propertyData.price} onChange={handleChange} required />
            <Select label={t('addPropertyPage.listingType')} name="type" value={propertyData.type} onChange={handleChange}><option value="rent">{t('addPropertyPage.rent')}</option><option value="sale">{t('addPropertyPage.sale')}</option></Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label={t('addPropertyPage.bedrooms')} name="bedrooms" type="number" value={propertyData.bedrooms} onChange={handleChange} required />
              <Input label={t('addPropertyPage.bathrooms')} name="bathrooms" type="number" value={propertyData.bathrooms} onChange={handleChange} required />
              <Input label={t('addPropertyPage.area')} name="area" type="number" value={propertyData.area} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select label={t('addPropertyPage.region')} name="region" value={propertyData.region} onChange={handleRegionChange} required><option value="">{t('addPropertyPage.selectRegion')}</option>{regions.map(r => <option key={r} value={r}>{r}</option>)}</Select>
            
            <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Select label={t('addPropertyPage.city')} name="city" value={propertyData.city} onChange={handleCityChange} disabled={!propertyData.region} required>
                      <option value="">{t('addPropertyPage.selectCity')}</option>
                      {citiesForSelectedRegion.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <button type="button" onClick={() => setAddCityModalOpen(true)} disabled={!propertyData.region} className="h-11 w-10 flex-shrink-0 bg-brand-dark/50 text-brand-gray hover:bg-brand-dark rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xl" title={t('addPropertyPage.addNewCity')}>+</button>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Select label={t('addPropertyPage.neighborhood')} name="neighborhood" value={propertyData.neighborhood} onChange={handleChange} disabled={!propertyData.city} required>
                      <option value="">{t('addPropertyPage.selectNeighborhood')}</option>
                      {neighborhoodsForSelectedCity.map((n: string) => <option key={n} value={n}>{n}</option>)}
                  </Select>
                </div>
                <button type="button" onClick={() => setAddNeighborhoodModalOpen(true)} disabled={!propertyData.city} className="h-11 w-10 flex-shrink-0 bg-brand-dark/50 text-brand-gray hover:bg-brand-dark rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xl" title={t('addPropertyPage.addNewNeighborhood')}>+</button>
              </div>
          </div>

          <Input label={t('addPropertyPage.phone')} name="phone" type="tel" value={propertyData.phone} onChange={handleChange} placeholder="6XX XXX XXX" />

          <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="secondary" onClick={() => onNavigate('dashboard')}>{t('addPropertyPage.cancel')}</Button>
              <Button type="submit">{t('editPropertyPage.saveChanges')}</Button>
          </div>
        </form>
      </div>

      <Modal isOpen={isAddCityModalOpen} onClose={() => setAddCityModalOpen(false)} title={t('addPropertyPage.addNewCity')}>
          <div className="space-y-4">
              <p className="text-gray-300">{t('addPropertyPage.region')}: <span className="font-semibold text-white">{propertyData.region}</span></p>
              <Input label={t('addPropertyPage.cityName')} value={newCityName} onChange={(e) => setNewCityName(e.target.value)} placeholder={t('addPropertyPage.cityName')} />
              <div className="flex justify-end gap-4 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setAddCityModalOpen(false)}>{t('addPropertyPage.cancel')}</Button>
                  <Button type="button" onClick={handleAddNewCity}>{t('addPropertyPage.add')}</Button>
              </div>
          </div>
      </Modal>
      <Modal isOpen={isAddNeighborhoodModalOpen} onClose={() => setAddNeighborhoodModalOpen(false)} title={t('addPropertyPage.addNewNeighborhood')}>
          <div className="space-y-4">
              <p className="text-gray-300">{t('addPropertyPage.city')}: <span className="font-semibold text-white">{propertyData.city}</span></p>
              <Input label={t('addPropertyPage.neighborhoodName')} value={newNeighborhoodName} onChange={(e) => setNewNeighborhoodName(e.target.value)} placeholder={t('addPropertyPage.neighborhoodName')} />
              <div className="flex justify-end gap-4 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setAddNeighborhoodModalOpen(false)}>{t('addPropertyPage.cancel')}</Button>
                  <Button type="button" onClick={handleAddNewNeighborhood}>{t('addPropertyPage.add')}</Button>
              </div>
          </div>
      </Modal>
    </>
  );
};

export default EditPropertyPage;