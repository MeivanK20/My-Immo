// Supabase removed: simple fallbacks for localities (return empty lists)
export const supabaseLocalitiesService = {
  async getRegions(): Promise<string[]> { return []; },
  async getCitiesByRegion(_region: string): Promise<string[]> { return []; },
  async getNeighborhoodsByCity(_city: string): Promise<string[]> { return []; },
};
