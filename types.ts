export type Page = 'home' | 'listings' | 'propertyDetail' | 'dashboard' | 'addProperty' | 'editProperty' | 'contact' | 'about' | 'termsOfUse' | 'privacyPolicy' | 'messages' | 'login' | 'register' | 'profileSettings' | 'registrationSuccess' | 'adminDashboard' | 'pricing' | 'payment' | 'careers';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'visitor' | 'agent' | 'admin';
  subscriptionPlan?: 'free' | 'premium';
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

export interface Job {
  id: string;
  titleKey: string;
  location: string;
  typeKey: string;
  descriptionKey: string;
}

export type NavigationFunction = (page: Page, data?: any, options?: { replace?: boolean }) => void;

export type AddCityFunction = (region: string, cityName: string) => void;
export type AddNeighborhoodFunction = (region: string, city: string, neighborhoodName: string) => void;

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
