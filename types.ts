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
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  tag: string;
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
  FORGOT_PASSWORD = '/forgot-password',
  LISTINGS = '/listings',
  ADD_LISTING = '/add-listing',
  DASHBOARD = '/dashboard',
  ADMIN_DASHBOARD = '/admin',
  PROFILE = '/profile',
  ABOUT = 'about',
  CAREERS = 'careers',
  TERMS_OF_USE = 'terms',
  PRIVACY_POLICY = 'privacy',
  AUTH_CALLBACK = '/auth/callback',
}