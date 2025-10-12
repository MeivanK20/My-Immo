export type Page = 'home' | 'listings' | 'propertyDetail' | 'dashboard' | 'addProperty' | 'editProperty' | 'contact' | 'about' | 'termsOfUse' | 'privacyPolicy' | 'messages' | 'login' | 'register' | 'profileSettings';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'visitor' | 'agent';
  phone?: string;
  profilePictureUrl?: string;
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
  agentUid: string;
  phone?: string;
}

// FIX: Changed 'interface' to 'type' for correct function type definition.
export type NavigationFunction = (page: Page, data?: any) => void;

export interface Message {
  id: string;
  propertyId: string;
  propertyTitle: string;
  agentUid: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  message: string;
  timestamp: Date;
}