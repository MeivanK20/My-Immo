
import { Property } from '../types';

export const mockProperties: Property[] = [
  {
    id: 'prop1',
    title: 'Villa de Luxe à Bastos',
    description: 'Une magnifique villa avec piscine et grand jardin, située dans le quartier résidentiel de Bastos à Yaoundé. Parfait pour une famille cherchant confort et sécurité.',
    price: 350000000,
    type: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    area: 600,
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/prop1/800/600' },
      { type: 'image', url: 'https://picsum.photos/seed/prop1-2/800/600' },
    ],
    location: 'Yaoundé',
    city: 'Yaoundé',
    region: 'Centre',
    neighborhood: 'Bastos',
    // FIX: Changed agentUid to agent_id to match the Property type.
    agent_id: 'agent01',
    phone: '655 886 086'
  },
  {
    id: 'prop2',
    title: 'Appartement Moderne à Bonapriso',
    description: 'Superbe appartement de 3 pièces au coeur de Bonapriso, Douala. Proche de toutes commodités, avec une vue imprenable sur la ville. Entièrement meublé.',
    price: 450000,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/prop2/800/600' },
      { type: 'image', url: 'https://picsum.photos/seed/prop2-2/800/600' },
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ],
    location: 'Douala',
    city: 'Douala',
    region: 'Littoral',
    neighborhood: 'Bonapriso',
    // FIX: Changed agentUid to agent_id to match the Property type.
    agent_id: 'agent01',
    phone: '699 123 456'
  },
  {
    id: 'prop3',
    title: 'Maison Familiale à Mvan',
    description: 'Grande maison familiale avec 4 chambres, un grand salon et une cour arrière. Idéalement située à Mvan, facile d\'accès.',
    price: 150000,
    type: 'rent',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/prop3/800/600' }
    ],
    location: 'Yaoundé',
    city: 'Yaoundé',
    region: 'Centre',
    neighborhood: 'Mvan',
    // FIX: Changed agentUid to agent_id to match the Property type.
    agent_id: 'agent01',
    phone: '677 789 012'
  },
  {
    id: 'prop4',
    title: 'Terrain Titré à Limbe',
    description: 'Vaste terrain titré de 1000m² avec vue sur la mer, situé dans un quartier en plein développement à Limbe. Opportunité d\'investissement unique.',
    price: 25000000,
    type: 'sale',
    bedrooms: 0,
    bathrooms: 0,
    area: 1000,
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/prop4/800/600' }
    ],
    location: 'Limbe',
    city: 'Limbe',
    region: 'Sud-Ouest',
    neighborhood: 'Down Beach',
    // FIX: Changed agentUid to agent_id to match the Property type.
    agent_id: 'agent01',
  },
   {
    id: 'prop5',
    title: 'Studio Meublé à Akwa',
    description: 'Studio moderne et entièrement équipé au centre des affaires d\'Akwa, Douala. Idéal pour jeune professionnel ou étudiant.',
    price: 120000,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/prop5/800/600' }
    ],
    location: 'Douala',
    city: 'Douala',
    region: 'Littoral',
    neighborhood: 'Akwa',
    // FIX: Changed agentUid to agent_id to match the Property type.
    agent_id: 'agent01',
    phone: '650 112 233'
  },
  {
    id: 'prop6',
    title: 'Villa Duplex à Bafoussam',
    description: 'Charmante villa duplex de 6 pièces à vendre dans la ville de Bafoussam, quartier Tamdja. Construction récente avec des matériaux de qualité.',
    price: 85000000,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    area: 400,
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/prop6/800/600' }
    ],
    location: 'Bafoussam',
    city: 'Bafoussam',
    region: 'Ouest',
    neighborhood: 'Tamdja',
    // FIX: Changed agentUid to agent_id to match the Property type.
    agent_id: 'agent01',
  }
];