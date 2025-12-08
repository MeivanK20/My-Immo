import supabase, { isSupabaseEnabled } from './supabaseClient';

export interface Region {
  id: string;
  name: string;
  created_at?: string;
}

export interface City {
  id: string;
  region_id: string;
  name: string;
  created_at?: string;
}

export interface Neighborhood {
  id: string;
  city_id: string;
  name: string;
  created_at?: string;
}

export const localityService = {
  // Récupérer toutes les régions
  async getRegions(): Promise<Region[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Récupérer une région par ID
  async getRegionById(id: string): Promise<Region | null> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data || null;
  },

  // Récupérer les villes d'une région
  async getCitiesByRegion(regionId: string): Promise<City[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('region_id', regionId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Récupérer une ville par ID
  async getCityById(id: string): Promise<City | null> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data || null;
  },

  // Récupérer les quartiers d'une ville
  async getNeighborhoodsByCity(cityId: string): Promise<Neighborhood[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('city_id', cityId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Récupérer un quartier par ID
  async getNeighborhoodById(id: string): Promise<Neighborhood | null> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data || null;
  },

  // Récupérer tous les quartiers (sans filtre)
  async getAllNeighborhoods(): Promise<Neighborhood[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Récupérer toutes les villes
  async getAllCities(): Promise<City[]> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Créer une nouvelle région
  async createRegion(name: string): Promise<Region> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('regions')
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer une région par nom
  async getRegionByName(name: string): Promise<Region | null> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .ilike('name', name)
      .limit(1)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }
    return data || null;
  },

  // Get or create region by name
  async getOrCreateRegion(name: string): Promise<Region> {
    const existing = await this.getRegionByName(name);
    if (existing) return existing;
    return this.createRegion(name);
  },

  // Créer une nouvelle ville
  async createCity(regionId: string, name: string): Promise<City> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('cities')
      .insert([{ region_id: regionId, name }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer une ville par nom + region
  async getCityByNameAndRegion(name: string, regionId: string): Promise<City | null> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('region_id', regionId)
      .ilike('name', name)
      .limit(1)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }
    return data || null;
  },

  // Get or create city by region id
  async getOrCreateCity(regionId: string, name: string): Promise<City> {
    const existing = await this.getCityByNameAndRegion(name, regionId);
    if (existing) return existing;
    return this.createCity(regionId, name);
  },

  // Créer un nouveau quartier
  async createNeighborhood(cityId: string, name: string): Promise<Neighborhood> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('neighborhoods')
      .insert([{ city_id: cityId, name }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer un quartier par nom + city
  async getNeighborhoodByNameAndCity(name: string, cityId: string): Promise<Neighborhood | null> {
    if (!isSupabaseEnabled || !supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('city_id', cityId)
      .ilike('name', name)
      .limit(1)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') return null;
      throw error;
    }
    return data || null;
  },

  // Get or create neighborhood by city id
  async getOrCreateNeighborhood(cityId: string, name: string): Promise<Neighborhood> {
    const existing = await this.getNeighborhoodByNameAndCity(name, cityId);
    if (existing) return existing;
    return this.createNeighborhood(cityId, name);
  },
};
