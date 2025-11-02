import { User } from '../types';

export const mockUsers: User[] = [
  {
    // FIX: Changed uid to id
    id: 'admin01',
    name: 'Admin MyImmo',
    email: 'admin@immo.cm',
    role: 'admin',
    // FIX: Changed profilePictureUrl to profile_picture_url
    profile_picture_url: 'https://picsum.photos/seed/admin01/200'
  },
  {
    // FIX: Changed uid to id
    id: 'agent01',
    name: 'Ivan Mbaye',
    email: 'ivan.mbaye@immo.cm',
    role: 'agent',
    // FIX: Changed subscriptionPlan to subscription_plan
    subscription_plan: 'premium',
    phone: '655 886 086',
    // FIX: Changed profilePictureUrl to profile_picture_url
    profile_picture_url: 'https://picsum.photos/seed/agent01/200'
  },
  {
    // FIX: Changed uid to id
    id: 'agent02',
    name: 'Jeanne Dupont',
    email: 'jeanne.d@immo.cm',
    role: 'agent',
    // FIX: Changed subscriptionPlan to subscription_plan
    subscription_plan: 'free',
    phone: '699 000 000',
    // FIX: Changed profilePictureUrl to profile_picture_url
    profile_picture_url: 'https://picsum.photos/seed/agent02/200'
  },
  {
    // FIX: Changed uid to id
    id: 'visitor01',
    name: 'Marie Dupont',
    email: 'marie.d@email.com',
    role: 'visitor',
  },
  {
    // FIX: Changed uid to id
    id: 'visitor02',
    name: 'Pierre Martin',
    email: 'pierre.m@email.com',
    role: 'visitor',
  },
];