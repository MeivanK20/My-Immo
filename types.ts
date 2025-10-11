export type Page = 'home' | 'listings' | 'propertyDetail' | 'dashboard' | 'addProperty' | 'editProperty' | 'contact' | 'about' | 'termsOfUse' | 'privacyPolicy' | 'profileSettings';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'visitor' | 'agent';
}

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface Property {
  id:string;
  title: string;
  description: string;
  price: number;
  type: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  media: Media[];
  location: string;
  city: string;
  region: string;
  neighborhood: string;
  agentId: string;
}

export type NavigationFunction = (page: Page, data?: any) => void;