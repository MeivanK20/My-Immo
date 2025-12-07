import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Home, AlertCircle, CheckCircle } from 'lucide-react';
import { RoutePath, Property } from '../types';
import { supabaseAuthService } from '../services/supabaseAuthService';
import { supabasePropertiesService } from '../services/supabasePropertiesService';
import { useLanguage } from '../services/languageContext';

export const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [regions, setRegions] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    region: '',
    city: '',
    neighborhood: '',
    address: '',
    propertyType: 'house',
    imageUrl: '',
    featured: false,
  });

  // Load current user and regions
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('AddProperty: Loading user data');
        const user = await supabaseAuthService.getCurrentUser();
        console.log('AddProperty: Current user:', user);
        if (!user) {
          console.log('AddProperty: No user, redirecting to login');
          navigate(RoutePath.LOGIN);
          return;
        }
        if (user.role === 'visitor') {
          console.log('AddProperty: User is visitor, redirecting to listings');
          navigate(RoutePath.LISTINGS);
          return;
        }
        setCurrentUser(user);

        // Load regions
        console.log('AddProperty: Loading regions');
        const regionList = await supabasePropertiesService.getRegions();
        console.log('AddProperty: Regions loaded:', regionList);
        setRegions(regionList);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Load cities when region changes
  useEffect(() => {
    const loadCities = async () => {
      if (formData.region) {
        try {
          const cityList = await supabasePropertiesService.getCitiesByRegion(formData.region);
          setCities(cityList);
          setFormData(prev => ({ ...prev, city: '', neighborhood: '' }));
          setNeighborhoods([]);
        } catch (error) {
          console.error('Error loading cities:', error);
        }
      }
    };

    loadCities();
  }, [formData.region]);

  // Load neighborhoods when city changes
  useEffect(() => {
    const loadNeighborhoods = async () => {
      if (formData.city) {
        try {
          const neighborhoodList = await supabasePropertiesService.getNeighborhoodsByCity(formData.city);
          setNeighborhoods(neighborhoodList);
          setFormData(prev => ({ ...prev, neighborhood: '' }));
        } catch (error) {
          console.error('Error loading neighborhoods:', error);
        }
      }
    };

    loadNeighborhoods();
  }, [formData.city]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('addProperty.field_required');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('addProperty.field_required');
    }

    if (!formData.price) {
      newErrors.price = t('addProperty.field_required');
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = t('addProperty.invalid_price');
    }

    if (!formData.beds) {
      newErrors.beds = t('addProperty.field_required');
    } else if (isNaN(Number(formData.beds)) || Number(formData.beds) < 0) {
      newErrors.beds = t('addProperty.invalid_beds');
    }

    if (!formData.baths) {
      newErrors.baths = t('addProperty.field_required');
    } else if (isNaN(Number(formData.baths)) || Number(formData.baths) < 0) {
      newErrors.baths = t('addProperty.invalid_baths');
    }

    if (!formData.sqft) {
      newErrors.sqft = t('addProperty.field_required');
    } else if (isNaN(Number(formData.sqft)) || Number(formData.sqft) <= 0) {
      newErrors.sqft = t('addProperty.invalid_sqft');
    }

    if (!formData.region) {
      newErrors.region = t('addProperty.field_required');
    }

    if (!formData.city) {
      newErrors.city = t('addProperty.field_required');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('addProperty.field_required');
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = t('addProperty.field_required');
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
      const propertyType = formData.propertyType === 'house' ? 'Maison' : 
                          formData.propertyType === 'apartment' ? 'Appartement' :
                          formData.propertyType === 'land' ? 'Terrain' : 'Commercial';

      const newProperty: Partial<Property> = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        sqft: Number(formData.sqft),
        region: formData.region,
        city: formData.city,
        neighborhood: formData.neighborhood || 'N/A',
        address: formData.address,
        tag: propertyType,
        imageUrl: formData.imageUrl,
        featured: formData.featured,
        agentId: currentUser.id,
      };

      await supabasePropertiesService.createProperty(newProperty as Property);

      setSuccessMessage(t('addProperty.success_desc'));
      setTimeout(() => {
        navigate(RoutePath.DASHBOARD);
      }, 2000);
    } catch (error: any) {
      setErrors({ submit: error.message || t('addProperty.error_title') });
      console.error('Property creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!currentUser || (currentUser.role !== 'agent' && currentUser.role !== 'admin')) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Seuls les agents peuvent ajouter des annonces</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {t('addProperty.title')}
          </h1>
          <p className="text-gray-600">
            {t('addProperty.subtitle')}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900">{t('addProperty.success_title')}</h3>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* General Information Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home className="h-5 w-5" />
              {t('addProperty.general_info')}
            </h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addProperty.property_title')} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t('addProperty.property_title_placeholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addProperty.description')} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('addProperty.description_placeholder')}
                  rows={5}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Price, Beds, Baths, Sqft */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProperty.price')} *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProperty.beds')} *
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.beds ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.beds && <p className="text-red-600 text-sm mt-1">{errors.beds}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProperty.baths')} *
                  </label>
                  <input
                    type="number"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.baths ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.baths && <p className="text-red-600 text-sm mt-1">{errors.baths}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProperty.sqft')} *
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.sqft ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.sqft && <p className="text-red-600 text-sm mt-1">{errors.sqft}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('addProperty.location_info')}
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProperty.region')} *
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.region ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une région</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProperty.city')} *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!formData.region}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.region ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Sélectionner une ville</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProperty.neighborhood')}
                  </label>
                  <select
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    disabled={!formData.city}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300 ${
                      !formData.city ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Sélectionner un quartier</option>
                    {neighborhoods.map(neighborhood => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addProperty.address')} *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t('addProperty.address_placeholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('addProperty.property_details')}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addProperty.property_type')}
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="house">{t('addProperty.property_type_house')}</option>
                  <option value="apartment">{t('addProperty.property_type_apartment')}</option>
                  <option value="land">{t('addProperty.property_type_land')}</option>
                  <option value="commercial">{t('addProperty.property_type_commercial')}</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <div>
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    {t('addProperty.featured')}
                  </label>
                  <p className="text-xs text-gray-600">{t('addProperty.featured_desc')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addProperty.image_url')} *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder={t('addProperty.image_url_placeholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.imageUrl && <p className="text-red-600 text-sm mt-1">{errors.imageUrl}</p>}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                    <img
                      src={formData.imageUrl}
                      alt="Property preview"
                      className="max-w-xs h-auto rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload className="h-5 w-5" />
            {isSubmitting ? t('addProperty.publishing') : t('addProperty.submit_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};
