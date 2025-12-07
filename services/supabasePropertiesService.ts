import { supabase } from './supabaseService';
import { Property } from '../types';

export const supabasePropertiesService = {
  // Get all properties
  async getProperties(filters?: {
    region?: string;
    city?: string;
    neighborhood?: string;
  }): Promise<Property[]> {
    try {
      let query = supabase.from('properties').select('*');

      if (filters?.region) {
        query = query.eq('region', filters.region);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.neighborhood) {
        query = query.eq('neighborhood', filters.neighborhood);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get properties error:', error);
      return [];
    }
  },

  // Get featured properties
  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get featured properties error:', error);
      return [];
    }
  },

  // Get property by ID
  async getProperty(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data || null;
    } catch (error) {
      console.error('Get property error:', error);
      return null;
    }
  },

  // Create property
  async createProperty(property: Omit<Property, 'id'>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([property])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Create property error:', error);
      throw error;
    }
  },

  // Update property
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Update property error:', error);
      throw error;
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Delete property error:', error);
      throw error;
    }
  },

  // Get agent properties
  async getAgentProperties(agentId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agentId', agentId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get agent properties error:', error);
      return [];
    }
  },

  // Get unique regions
  async getRegions(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('region');

      if (error) throw error;

      const uniqueRegions = [...new Set(data?.map(item => item.region).filter(Boolean))] as string[];
      return uniqueRegions;
    } catch (error) {
      console.error('Get regions error:', error);
      return [];
    }
  },

  // Get cities by region
  async getCitiesByRegion(region: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('city')
        .eq('region', region);

      if (error) throw error;

      const uniqueCities = [...new Set(data?.map(item => item.city).filter(Boolean))] as string[];
      return uniqueCities;
    } catch (error) {
      console.error('Get cities error:', error);
      return [];
    }
  },

  // Get neighborhoods by city
  async getNeighborhoodsByCity(city: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('neighborhood')
        .eq('city', city);

      if (error) throw error;

      const uniqueNeighborhoods = [...new Set(data?.map(item => item.neighborhood).filter(Boolean))] as string[];
      return uniqueNeighborhoods;
    } catch (error) {
      console.error('Get neighborhoods error:', error);
      return [];
    }
  },
};
