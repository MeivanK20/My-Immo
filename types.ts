
export type Page = 'home' | 'listings' | 'propertyDetail' | 'dashboard' | 'addProperty' | 'editProperty' | 'contact' | 'about' | 'termsOfUse' | 'privacyPolicy' | 'messages' | 'login' | 'register' | 'profileSettings' | 'registrationSuccess' | 'adminDashboard' | 'careers' | 'pricing' | 'payment' | 'forgotPassword' | 'resetPassword';

export interface User {
  id: string; // Changed from uid to id
  name: string;
  email: string;
  role: 'visitor' | 'agent' | 'admin';
  subscription_plan?: 'free' | 'premium'; // Changed from subscriptionPlan
  phone?: string;
  profile_picture_url?: string; // Changed from profilePictureUrl
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
  agent_id: string; // Changed from agentUid
  phone?: string;
}

export interface Rating {
  id: string;
  property_id: string; // Changed from propertyId
  agent_id: string; // Changed from agentUid
  visitor_id: string; // Changed from visitorUid
  rating: number; // 1 to 5
  created_at: string; // Changed from timestamp
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
  property_id: string; // Changed from propertyId
  property_title: string; // Changed from propertyTitle
  agent_id: string; // Changed from agentUid
  visitor_name: string; // Changed from visitorName
  visitor_email: string; // Changed from visitorEmail
  visitor_phone: string; // Changed from visitorPhone
  message: string;
  created_at: string; // Changed from timestamp
}