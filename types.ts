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
  LISTINGS = '/listings',
  DASHBOARD = '/dashboard',
  ADMIN_DASHBOARD = '/admin',
  PROFILE = '/profile',
}