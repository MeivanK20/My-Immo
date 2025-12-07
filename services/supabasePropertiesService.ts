import { supabase } from './supabaseService';
import { Property } from '../types';
import { supabaseLocalitiesService } from './supabaseLocalitiesService';

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
    return supabaseLocalitiesService.getRegions();
  },

  // Get cities by region
  async getCitiesByRegion(region: string): Promise<string[]> {
    return supabaseLocalitiesService.getCitiesByRegion(region);
  },

  // Get neighborhoods by city
  async getNeighborhoodsByCity(city: string): Promise<string[]> {
    return supabaseLocalitiesService.getNeighborhoodsByCity(city);
  },
};
