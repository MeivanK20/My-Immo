# My Immo Setup Guide

## Quick Start

If you see a **404 NOT_FOUND** error when opening the app, your Supabase database tables haven't been created yet. Follow the steps below.

## 🔧 Supabase Database Setup

### Step 1: Create Database Tables

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Log in and open your **my-immo** project

2. **Create Main Tables**
   - Click **SQL Editor** → **New Query**
   - Copy the entire contents of `SUPABASE_SCHEMA.sql` from your project root
   - Paste into the SQL Editor
   - Click **Run** button
   - Wait for success message

3. **Create Locality Tables**
   - Click **New Query** again
   - Copy contents of `sql/localities_schema.sql`
   - Paste and click **Run**

4. **Seed Sample Data**
   - Click **New Query** again
   - Copy contents of `sql/localities_seed.sql`
   - Paste and click **Run**
   - This populates Cameroon regions, cities, and neighborhoods

### Step 2: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** (left sidebar)
2. You should see these tables:
   - `users` - User profiles and accounts
   - `properties` - Real estate listings
   - `regions` - Geographic regions
   - `cities` - Cities within regions
   - `neighborhoods` - Neighborhoods within cities

3. Click on each table to see the data

### Step 3: Test the Application

1. **Development**
   ```bash
   npm run dev
   ```
   - Opens on `http://localhost:3003` (or next available port)

2. **Refresh your browser**
   - The red database warning banner should disappear
   - The app should load without 404 errors

## 🔐 Google OAuth Setup (Optional)

To enable Google sign-in:

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Providers**
   - Click **Google** and enable it

2. **Get OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or use existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web Application)
   - Add authorized JavaScript origins and redirect URIs

3. **Configure Redirect URIs:**
   - Add to Google Cloud Console AND Supabase:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   http://localhost:3002/auth/callback
   http://localhost:3003/auth/callback
   https://yourdomain.com/auth/callback    (for production)
   ```

4. **Copy credentials to Supabase:**
   - In Supabase > Authentication > Providers > Google
   - Paste your Google Client ID and Client Secret
   - Click Save

## 📁 Database Schema

### users table
- `id` - User UUID (from auth)
- `email` - Email address
- `fullName` - Full name
- `role` - 'visitor', 'agent', or 'admin'
- `phone`, `profilePhoto` - Optional profile info
- `createdAt`, `updatedAt` - Timestamps

### properties table
- `id` - Property UUID
- `agentId` - Agent's user ID (references users)
- `title` - Property title
- `price` - Price in XAF
- `address`, `region`, `city`, `neighborhood` - Location
- `beds`, `baths`, `sqft` - Property details
- `imageUrl` - Property image
- `featured` - Is it featured?
- `tag` - Type (house, apartment, land, commercial)
- `createdAt`, `updatedAt` - Timestamps

### regions, cities, neighborhoods tables
- Store location data for filtering
- Used by Add Property form and search

## 🚀 Development Workflow

```bash
# Install dependencies
npm install

# Start development server (auto-refreshes)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🐛 Troubleshooting

### 404 NOT_FOUND error in app
**Cause:** Database tables don't exist  
**Solution:** Run SUPABASE_SCHEMA.sql and localities_schema.sql in SQL Editor

### Can't sign up / Create account error
**Cause:** User table doesn't exist or RLS policies missing  
**Solution:** Make sure SUPABASE_SCHEMA.sql was fully executed

### Google sign-in not working
**Cause:** Redirect URIs not configured for your dev port  
**Solution:** 
1. Check what port dev server is using (shown in terminal)
2. Add `http://localhost:PORT/auth/callback` to:
   - Google Cloud Console (OAuth 2.0 app)
   - Supabase (Authentication > Providers > Google)

### Properties not loading
**Cause:** Either properties table missing or user is not agent/admin  
**Solution:** 
1. Verify properties table exists in Table Editor
2. Sign in with an agent or admin account
3. Check browser DevTools Network tab for actual error

### Images not uploading
**Cause:** Supabase Storage not configured (optional)  
**Solution:** For now, use image URLs instead. Set up Supabase Storage in Dashboard > Storage if needed

## 📚 Useful Files

- `SUPABASE_SCHEMA.sql` - Main database schema (run first!)
- `sql/localities_schema.sql` - Location tables schema
- `sql/localities_seed.sql` - Sample Cameroon locations
- `SUPABASE_SETUP.md` - Detailed setup guide
- `.env` - Contains Supabase credentials

## 🆘 Getting Help

1. **Check the error message** - Usually tells you what's wrong
2. **Look at Browser DevTools** (F12)
   - Console tab shows error details
   - Network tab shows API responses
3. **Check Supabase Dashboard**
   - Verify tables exist in Table Editor
   - Check RLS policies are in place
4. **Read the logs** - Both browser console and terminal

## ✨ Features

- ✅ Authentication (Email + Google OAuth)
- ✅ User profiles with role-based access
- ✅ Real estate listings (properties)
- ✅ Location filtering (regions, cities, neighborhoods)
- ✅ Multi-language support (French/English)
- ✅ Responsive design (Mobile-first)
- ✅ Protected routes (Authentication required)
- ✅ Admin dashboard

## 🔗 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
