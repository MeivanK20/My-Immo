import supabase, { isSupabaseEnabled } from './supabaseClient';
import { localityService } from './localityService';

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
  // Récupérer toutes les propriétés
  async getAllProperties(): Promise<Property[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Récupérer une propriété par ID
  async getPropertyById(id: string): Promise<Property | null> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data || null;
  },

  // Récupérer les propriétés d'un agent
  async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
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
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    let query = supabase.from('properties').select('*');

    if (filters.region) query = query.eq('region', filters.region);
    if (filters.city) query = query.eq('city', filters.city);
    if (filters.neighborhood) query = query.eq('neighborhood', filters.neighborhood);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.minBedrooms) query = query.gte('bedrooms', filters.minBedrooms);
    if (filters.maxBedrooms) query = query.lte('bedrooms', filters.maxBedrooms);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Créer une nouvelle propriété
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    // Ensure region/city/neighborhood exist in locality tables
    try {
      // Normalize names
      const regionName = property.region?.trim();
      const cityName = property.city?.trim();
      const neighborhoodName = property.neighborhood?.trim();

      let regionRecord: any = null;
      let cityRecord: any = null;
      let neighborhoodRecord: any = null;

      if (regionName) {
        regionRecord = await localityService.getOrCreateRegion(regionName);
      }

      if (cityName && regionRecord) {
        cityRecord = await localityService.getOrCreateCity(regionRecord.id, cityName);
      }

      if (neighborhoodName && cityRecord) {
        neighborhoodRecord = await localityService.getOrCreateNeighborhood(cityRecord.id, neighborhoodName);
      }
    } catch (err) {
      // Non-fatal: we still create the property, but log warning
      console.warn('Could not ensure locality records:', err);
    }

    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
          ...property,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour une propriété
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('properties')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer une propriété
  async deleteProperty(id: string): Promise<void> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Recherche textuelle
  async searchProperties(query: string): Promise<Property[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
