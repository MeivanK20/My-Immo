# 🚀 Configuration Supabase pour My Immo

## 📋 Étapes de configuration

### 1. **Créer les tables dans Supabase**
- Allez dans votre [Supabase Dashboard](https://supabase.com)
- Cliquez sur **SQL Editor**
- Copiez tout le contenu de `SUPABASE_SCHEMA.sql`
- Collez-le et exécutez

### 2. **Variables d'environnement**
Le fichier `.env` est déjà configuré avec :
```
VITE_SUPABASE_URL=https://qxjrylsttlwythcczxwp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. **Structure des services**

#### `services/supabaseService.ts`
- Initialise le client Supabase
- Point d'accès unique pour toutes les opérations

#### `services/supabaseAuthService.ts`
- `signup()` - Créer un nouvel utilisateur
- `signin()` - Connecter un utilisateur
- `signout()` - Déconnecter
- `getCurrentUser()` - Récupérer l'utilisateur actuel
- `updateUserProfile()` - Mettre à jour le profil
- `deleteAccount()` - Supprimer un compte

#### `services/supabasePropertiesService.ts`
- `getProperties()` - Récupérer les propriétés avec filtres
- `getFeaturedProperties()` - Propriétés à la une
- `getProperty()` - Une propriété par ID
- `createProperty()` - Créer une propriété
- `updateProperty()` - Modifier une propriété
- `deleteProperty()` - Supprimer une propriété
- `getAgentProperties()` - Propriétés d'un agent
- `getRegions()`, `getCitiesByRegion()`, `getNeighborhoodsByCity()` - Filtres de localisation

## 🔐 Sécurité - Row Level Security (RLS)

Tous les accès aux tables sont contrôlés par RLS :

| Table | Permissions |
|-------|-------------|
| **users** | Chacun voit son profil, admins voient tous |
| **properties** | Tout le monde peut lire, agents/admins peuvent créer |
| **messages** | Participants seulement |
| **conversations** | Participants seulement |

## 💾 Données de test

Pour ajouter des données de test, vous pouvez :

### 1. **Via l'interface Supabase** (le plus simple)
- Allez dans votre dashboard
- Sélectionnez la table `properties`
- Cliquez sur **Insert Row**
- Remplissez les données

### 2. **Via SQL**
```sql
INSERT INTO properties (
  agentId, title, price, address, region, city, neighborhood,
  beds, baths, sqft, imageUrl, featured, tag
) VALUES (
  'user-uuid-here', 
  'Maison moderne à Yaoundé',
  150000000,
  '123 Avenue Kennedy',
  'Centre',
  'Yaoundé',
  'Quartier Général',
  4, 2, 250,
  'https://example.com/image.jpg',
  TRUE,
  'A la une'
);
```

## 🔗 Intégration dans les pages

Les pages sont déjà converties pour utiliser Supabase :

- ✅ `pages/Login.tsx` → `supabaseAuthService.signin()`
- ✅ `pages/Signup.tsx` → `supabaseAuthService.signup()`
- ⏳ `pages/Home.tsx` → À mettre à jour avec `supabasePropertiesService.getFeaturedProperties()`
- ⏳ `pages/Listings.tsx` → À mettre à jour avec `supabasePropertiesService.getProperties()`

## 🆘 Dépannage

### "404 not found" erreurs
→ Les tables n'existent pas. Exécutez `SUPABASE_SCHEMA.sql`

### "Permission denied" erreurs
→ Vérifiez les RLS policies. Assurez-vous que l'utilisateur est authentifié.

### Propriétés ne s'affichent pas
→ Vérifiez que les `agentId` existent dans la table `users`

## 📧 Support
Pour toute question, consultez la [documentation Supabase](https://supabase.com/docs)
