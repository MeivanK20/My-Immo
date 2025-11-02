export type Page = 'home' | 'listings' | 'propertyDetail' | 'dashboard' | 'addProperty' | 'editProperty' | 'contact' | 'about' | 'termsOfUse' | 'privacyPolicy' | 'messages' | 'login' | 'register' | 'profileSettings' | 'registrationSuccess' | 'adminDashboard' | 'pricing' | 'payment' | 'careers' | 'appwriteDemo' | 'forgotPassword' | 'resetPassword';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'visitor' | 'agent' | 'admin';
  subscriptionPlan?: 'free' | 'premium';
  phone?: string;
  profilePictureUrl?: string;
  // Rewards system fields
  score?: number;
  badge?: 'Bronze' | 'Silver' | 'Gold';
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

export interface Rating {
  id: string;
  propertyId: string;
  agentUid: string;
  visitorUid: string;
  rating: number; // 1 to 5
  timestamp: Date;
}

export interface Job {
  id: string;
  titleKey: string;
  location: string;
  typeKey: string;
  descriptionKey: string;
}

export interface Todo {
  $id: string;
  task: string;
  isComplete: boolean;
  userId: string;
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