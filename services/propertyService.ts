// Supabase removed: provide a basic localStorage-backed property service for dev usage
import { localityService } from './localityService';
import { isSupabaseEnabled, supabase } from './supabaseClient';

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  price: number;
  region: string;
  city: string;
  neighborhood: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images?: string[];
  created_at: string;
  updated_at?: string;
}

export const propertyService = {
  // Récupérer toutes les propriétés (localStorage fallback)
  async getAllProperties(): Promise<Property[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Property[];
    }

    try {
      const s = localStorage.getItem('myimmo_properties');
      const arr = s ? JSON.parse(s) as Property[] : [];
      return arr.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
    } catch (e) {
      return [];
    }
  },

  // Récupérer une propriété par ID
  async getPropertyById(id: string): Promise<Property | null> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).limit(1).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Property | null;
    }

    const arr = await propertyService.getAllProperties();
    return arr.find((p) => p.id === id) || null;
  },

  // Récupérer les propriétés d'un agent
  async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('properties').select('*').eq('agent_id', agentId);
      if (error) throw error;
      return (data ?? []) as unknown as Property[];
    }

    const arr = await propertyService.getAllProperties();
    return arr.filter((p) => p.agent_id === agentId);
  },

  // Filtrer les propriétés
  async filterProperties(filters: {
    region?: string;
    city?: string;
    neighborhood?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    minBedrooms?: number;
    maxBedrooms?: number;
  }): Promise<Property[]> {
    if (isSupabaseEnabled && supabase) {
      let query = supabase.from('properties').select('*');
      if (filters.region) query = query.eq('region', filters.region);
      if (filters.city) query = query.eq('city', filters.city);
      if (filters.neighborhood) query = query.eq('neighborhood', filters.neighborhood);
      if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
      if (filters.minPrice) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
      if (filters.minBedrooms) query = query.gte('bedrooms', filters.minBedrooms);
      if (filters.maxBedrooms) query = query.lte('bedrooms', filters.maxBedrooms);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as Property[];
    }

    const arr = await propertyService.getAllProperties();
    return arr.filter((p) => {
      if (filters.region && p.region !== filters.region) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (filters.neighborhood && p.neighborhood !== filters.neighborhood) return false;
      if (filters.propertyType && p.property_type !== filters.propertyType) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.minBedrooms && p.bedrooms < filters.minBedrooms) return false;
      if (filters.maxBedrooms && p.bedrooms > filters.maxBedrooms) return false;
      return true;
    });
  },

  // Créer une nouvelle propriété
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('properties').insert([property]).select().maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Property;
    }

    try {
      const arr = await propertyService.getAllProperties();
      const newProp: Property = {
        ...property,
        id: Math.random().toString(36).slice(2, 9),
        created_at: new Date().toISOString(),
      } as Property;
      arr.unshift(newProp);
      localStorage.setItem('myimmo_properties', JSON.stringify(arr));
      return newProp;
    } catch (e) {
      throw e;
    }
  },

  // Mettre à jour une propriété
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select().maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Property;
    }

    const arr = await propertyService.getAllProperties();
    const idx = arr.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Not found');
    arr[idx] = { ...arr[idx], ...updates, updated_at: new Date().toISOString() } as Property;
    localStorage.setItem('myimmo_properties', JSON.stringify(arr));
    return arr[idx];
  },

  // Supprimer une propriété
  async deleteProperty(id: string): Promise<void> {
    if (isSupabaseEnabled && supabase) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const arr = await propertyService.getAllProperties();
    const filtered = arr.filter((p) => p.id !== id);
    localStorage.setItem('myimmo_properties', JSON.stringify(filtered));
  },

  // Recherche textuelle
  async searchProperties(query: string): Promise<Property[]> {
    const arr = await propertyService.getAllProperties();
    const q = query.toLowerCase();
    return arr.filter((p) => (p.title && p.title.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)));
  },
};
