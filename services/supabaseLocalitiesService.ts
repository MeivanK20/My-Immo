import supabase from './supabaseClient';

export const supabaseLocalitiesService = {
  // Try to read from dedicated tables first; fall back to properties table if tables don't exist
  async getRegions(): Promise<string[]> {
    try {
      // Attempt dedicated 'regions' table
      const { data: regionsData, error: regionsErr } = await supabase.from('regions').select('name');
      if (!regionsErr && regionsData) {
        return regionsData.map((r: any) => r.name).filter(Boolean);
      }
    } catch (e) {
      // ignore and fallback
    }

    // Fallback: extract unique regions from properties
    try {
      const { data, error } = await supabase.from('properties').select('region');
      if (error) throw error;
      const uniqueRegions = [...new Set((data || []).map((d: any) => d.region).filter(Boolean))];
      return uniqueRegions as string[];
    } catch (e) {
      console.error('Get regions fallback error:', e);
      return [];
    }
  },

  async getCitiesByRegion(region: string): Promise<string[]> {
    try {
      const { data: citiesData, error: citiesErr } = await supabase.from('cities').select('name').eq('region', region);
      if (!citiesErr && citiesData) {
        return citiesData.map((c: any) => c.name).filter(Boolean);
      }
    } catch (e) {
      // ignore
    }

    // Fallback to properties
    try {
      const { data, error } = await supabase.from('properties').select('city').eq('region', region);
      if (error) throw error;
      const uniqueCities = [...new Set((data || []).map((d: any) => d.city).filter(Boolean))];
      return uniqueCities as string[];
    } catch (e) {
      console.error('Get cities fallback error:', e);
      return [];
    }
  },

  async getNeighborhoodsByCity(city: string): Promise<string[]> {
    try {
      const { data: nData, error: nErr } = await supabase.from('neighborhoods').select('name').eq('city', city);
      if (!nErr && nData) {
        return nData.map((n: any) => n.name).filter(Boolean);
      }
    } catch (e) {
      // ignore
    }

    // Fallback to properties
    try {
      const { data, error } = await supabase.from('properties').select('neighborhood').eq('city', city);
      if (error) throw error;
      const uniqueNeighborhoods = [...new Set((data || []).map((d: any) => d.neighborhood).filter(Boolean))];
      return uniqueNeighborhoods as string[];
    } catch (e) {
      console.error('Get neighborhoods fallback error:', e);
      return [];
    }
  },
};
