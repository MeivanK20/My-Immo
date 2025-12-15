// Supabase removed: use localStorage-backed simple locality service
export interface Region { id: string; name: string; slug?: string; description?: string; lat?: number | null; lng?: number | null; created_at?: string; updated_at?: string }
export interface City { id: string; region_id: string; name: string; slug?: string; description?: string; lat?: number | null; lng?: number | null; created_at?: string; updated_at?: string }
export interface Neighborhood { id: string; city_id: string; name: string; slug?: string; description?: string; lat?: number | null; lng?: number | null; created_at?: string; updated_at?: string }

function read<T>(key: string): T[] {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) as T[] : []; } catch (e) { return []; }
}
function write<T>(key: string, arr: T[]) { try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {} }
function makeId() { return Math.random().toString(36).slice(2, 9); }

import { isSupabaseEnabled, supabase } from './supabaseClient';

export const localityService = {
  async getRegions(): Promise<Region[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('regions').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Region[];
    }
    return read<Region>('myimmo_regions');
  },

  async getRegionById(id: string): Promise<Region | null> { return (await this.getRegions()).find(r => r.id === id) || null; },

  async getCitiesByRegion(regionId: string): Promise<City[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('cities').select('*').eq('region_id', regionId);
      if (error) throw error;
      return (data ?? []) as City[];
    }
    return read<City>('myimmo_cities').filter(c => c.region_id === regionId);
  },

  async getCityById(id: string): Promise<City | null> { return (read<City>('myimmo_cities') as City[]).find(c => c.id === id) || null; },

  async getNeighborhoodsByCity(cityId: string): Promise<Neighborhood[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('neighborhoods').select('*').eq('city_id', cityId);
      if (error) throw error;
      return (data ?? []) as Neighborhood[];
    }
    return read<Neighborhood>('myimmo_neighborhoods').filter(n => n.city_id === cityId);
  },

  async getNeighborhoodById(id: string): Promise<Neighborhood | null> { return (read<Neighborhood>('myimmo_neighborhoods') as Neighborhood[]).find(n => n.id === id) || null; },

  async getAllNeighborhoods(): Promise<Neighborhood[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('neighborhoods').select('*');
      if (error) throw error;
      return (data ?? []) as Neighborhood[];
    }
    return read<Neighborhood>('myimmo_neighborhoods');
  },

  async getAllCities(): Promise<City[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('cities').select('*');
      if (error) throw error;
      return (data ?? []) as City[];
    }
    return read<City>('myimmo_cities');
  },

  async createRegion(name: string, opts?: { slug?: string; description?: string; lat?: number; lng?: number }): Promise<Region> {
    const payload: any = { name };
    if (opts?.slug) payload.slug = opts.slug;
    if (opts?.description) payload.description = opts.description;
    if (opts?.lat !== undefined) payload.lat = opts.lat;
    if (opts?.lng !== undefined) payload.lng = opts.lng;

    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('regions').insert([payload]).select().maybeSingle();
      if (error) throw error;
      return (data ?? null) as Region;
    }
    const regions = read<Region>('myimmo_regions'); const r = { id: makeId(), name, slug: payload.slug, description: payload.description, lat: payload.lat, lng: payload.lng, created_at: new Date().toISOString() }; regions.push(r); write('myimmo_regions', regions); return r;
  },

  async getRegionByName(name: string): Promise<Region | null> { return (read<Region>('myimmo_regions') as Region[]).find(r => r.name.toLowerCase() === name.toLowerCase()) || null; },

  async getOrCreateRegion(name: string): Promise<Region> { const existing = await this.getRegionByName(name); if (existing) return existing; return this.createRegion(name); },

  async createCity(regionId: string, name: string, opts?: { slug?: string; description?: string; lat?: number; lng?: number }): Promise<City> {
    const payload: any = { region_id: regionId, name };
    if (opts?.slug) payload.slug = opts.slug;
    if (opts?.description) payload.description = opts.description;
    if (opts?.lat !== undefined) payload.lat = opts.lat;
    if (opts?.lng !== undefined) payload.lng = opts.lng;

    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('cities').insert([payload]).select().maybeSingle();
      if (error) throw error;
      return (data ?? null) as City;
    }
    const cities = read<City>('myimmo_cities'); const c = { id: makeId(), region_id: regionId, name, slug: payload.slug, description: payload.description, lat: payload.lat, lng: payload.lng, created_at: new Date().toISOString() }; cities.push(c); write('myimmo_cities', cities); return c; },

  async getCityByNameAndRegion(name: string, regionId: string): Promise<City | null> { return (read<City>('myimmo_cities') as City[]).find(c => c.region_id === regionId && c.name.toLowerCase() === name.toLowerCase()) || null; },

  async getOrCreateCity(regionId: string, name: string): Promise<City> { const existing = await this.getCityByNameAndRegion(name, regionId); if (existing) return existing; return this.createCity(regionId, name); },

  async createNeighborhood(cityId: string, name: string, opts?: { slug?: string; description?: string; lat?: number; lng?: number }): Promise<Neighborhood> {
    const payload: any = { city_id: cityId, name };
    if (opts?.slug) payload.slug = opts.slug;
    if (opts?.description) payload.description = opts.description;
    if (opts?.lat !== undefined) payload.lat = opts.lat;
    if (opts?.lng !== undefined) payload.lng = opts.lng;

    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('neighborhoods').insert([payload]).select().maybeSingle();
      if (error) throw error;
      return (data ?? null) as Neighborhood;
    }
    const nbs = read<Neighborhood>('myimmo_neighborhoods'); const n = { id: makeId(), city_id: cityId, name, slug: payload.slug, description: payload.description, lat: payload.lat, lng: payload.lng, created_at: new Date().toISOString() }; nbs.push(n); write('myimmo_neighborhoods', nbs); return n; },

  async getNeighborhoodByNameAndCity(name: string, cityId: string): Promise<Neighborhood | null> { return (read<Neighborhood>('myimmo_neighborhoods') as Neighborhood[]).find(n => n.city_id === cityId && n.name.toLowerCase() === name.toLowerCase()) || null; },

  async getOrCreateNeighborhood(cityId: string, name: string): Promise<Neighborhood> { const existing = await this.getNeighborhoodByNameAndCity(name, cityId); if (existing) return existing; return this.createNeighborhood(cityId, name); },
};
