import { User } from '../types';

export const mockUsers: User[] = [
  {
    uid: 'admin01',
    name: 'Admin MyImmo',
    email: 'admin@immo.cm',
    role: 'admin',
    profilePictureUrl: 'https://picsum.photos/seed/admin01/200'
  },
  {
    uid: 'agent01',
    name: 'Ivan Mbaye',
    email: 'ivan.mbaye@immo.cm',
    role: 'agent',
    subscriptionPlan: 'premium',
    phone: '655 886 086',
    profilePictureUrl: 'https://picsum.photos/seed/agent01/200'
  },
  {
    uid: 'agent02',
    name: 'Jeanne Dupont',
    email: 'jeanne.d@immo.cm',
    role: 'agent',
    subscriptionPlan: 'free',
    phone: '699 000 000',
    profilePictureUrl: 'https://picsum.photos/seed/agent02/200'
  },
  {
    uid: 'visitor01',
    name: 'Marie Dupont',
    email: 'marie.d@email.com',
    role: 'visitor',
  },
  {
    uid: 'visitor02',
    name: 'Pierre Martin',
    email: 'pierre.m@email.com',
    role: 'visitor',
  },
];