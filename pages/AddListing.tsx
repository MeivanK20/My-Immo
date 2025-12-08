import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { propertyService } from '../services/propertyService';
import { RoutePath } from '../types';

interface FormState {
  title: string;
  description: string;
  price: string;
  region: string;
  city: string;
  neighborhood: string;
  beds: string;
  baths: string;
  sqft: string;
  tag: string;
}

const regions = ['Littoral', 'Centre', 'Ouest', 'Nord', 'Sud', 'Est', 'Nord-Ouest', 'Sud-Ouest'];
const cities: { [key: string]: string[] } = {
  Littoral: ['Douala', 'Edea', 'Manfe'],
  Centre: ['Yaoundé', 'Soa', 'Atok'],
  Ouest: ['Bafoussam', 'Dschang', 'Foumban'],
  Nord: ['Garoua', 'Ngaoundéré', 'Maroua'],
  Sud: ['Ebolowa', 'Djoum', 'Kribi'],
  Est: ['Bertoua', 'Batouri', 'Yokadouma'],
  'Nord-Ouest': ['Bamenda', 'Kumbo', 'Menchum'],
  'Sud-Ouest': ['Buea', 'Limbé', 'Kumba'],
};

export const AddListing: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    price: '',
    region: '',
    city: '',
    neighborhood: '',
    beds: '0',
    baths: '0',
    sqft: '0',
    tag: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (k: keyof FormState, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (k === 'region') setForm(prev => ({ ...prev, city: '', neighborhood: '' }));
    if (k === 'city') setForm(prev => ({ ...prev, neighborhood: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr: string[] = [];
    Array.from(files).forEach(rawFile => {
      const file = rawFile as File;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          arr.push(reader.result);
          // When last file processed update state
          if (arr.length === files.length) setImages(prev => [...prev, ...arr]);
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const validate = () => {
    if (!form.title.trim()) return 'Le titre est requis.';
    if (!form.price || isNaN(Number(form.price))) return "Le prix est invalide.";
    if (!form.region) return 'La région est requise.';
    if (!form.city) return 'La ville est requise.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) { setError(v); return; }
    // Build property payload for backend
    (async () => {
      try {
        setError('');
        // Get user id from auth context if available
        const userId = user?.id || '';

        const payload: any = {
          agent_id: userId || '',
          title: form.title,
          description: form.description,
          price: Number(form.price),
          region: form.region,
          city: form.city,
          neighborhood: form.neighborhood,
          property_type: form.tag || 'residential',
          bedrooms: Number(form.beds),
          bathrooms: Number(form.baths),
          area: Number(form.sqft),
          images: images,
        };

        await propertyService.createProperty(payload);
        setSuccess('Annonce ajoutée avec succès.');
        setTimeout(() => navigate(RoutePath.LISTINGS), 1200);
      } catch (err: any) {
        console.error('Error creating property', err);
        setError(err?.message || "Erreur lors de la création de l'annonce");
      }
    })();
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ajouter une nouvelle annonce</h2>

        {error && <div className="mb-4 text-sm text-red-700">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input className="mt-1 w-full border px-3 py-2 rounded" value={form.title} onChange={e => handleChange('title', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="mt-1 w-full border px-3 py-2 rounded" rows={4} value={form.description} onChange={e => handleChange('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
              <input className="mt-1 w-full border px-3 py-2 rounded" value={form.price} onChange={e => handleChange('price', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type / Tag</label>
              <input className="mt-1 w-full border px-3 py-2 rounded" value={form.tag} onChange={e => handleChange('tag', e.target.value)} placeholder="Ex: Nouveau, Luxe, Investissement" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Région</label>
              <select value={form.region} onChange={e => handleChange('region', e.target.value)} className="mt-1 w-full border px-3 py-2 rounded">
                <option value="">Sélectionner</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <select value={form.city} onChange={e => handleChange('city', e.target.value)} disabled={!form.region} className="mt-1 w-full border px-3 py-2 rounded">
                <option value="">Sélectionner</option>
                {form.region && cities[form.region]?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quartier</label>
              <input className="mt-1 w-full border px-3 py-2 rounded" value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Chambres</label>
              <input type="number" min={0} className="mt-1 w-full border px-3 py-2 rounded" value={form.beds} onChange={e => handleChange('beds', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Salles de bain</label>
              <input type="number" min={0} className="mt-1 w-full border px-3 py-2 rounded" value={form.baths} onChange={e => handleChange('baths', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Surface (m²)</label>
              <input type="number" min={0} className="mt-1 w-full border px-3 py-2 rounded" value={form.sqft} onChange={e => handleChange('sqft', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Photos</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mt-1" />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {images.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={src} alt={`preview-${idx}`} className="w-full h-28 object-cover rounded" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-primary-600 text-white px-4 py-2 rounded font-semibold">Publier l'annonce</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
