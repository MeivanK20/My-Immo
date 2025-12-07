export type UserRole = 'visitor' | 'agent' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  profilePhoto?: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  region: string;
  city: string;
  neighborhood: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  tag: string;
  description?: string;
  featured?: boolean;
  agentId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum RoutePath {
  HOME = '/',
  LOGIN = '/login',
  SIGNUP = '/signup',
  PASSWORD_RESET = '/password-reset',
  LISTINGS = '/listings',
  DASHBOARD = '/dashboard',
  ADD_PROPERTY = '/add-property',
  ADMIN_DASHBOARD = '/admin',
  PROFILE = '/profile',
  ABOUT = '/about',
  CONTACT = '/contact',
  CAREERS = '/careers',
  TERMS = '/terms',
  PRIVACY = '/privacy',
  AUTH_CALLBACK = '/auth/callback',
}