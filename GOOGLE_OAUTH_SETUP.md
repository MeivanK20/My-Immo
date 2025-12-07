# Google OAuth Integration Guide

## Overview
Google OAuth has been integrated into the My Immo application. Users can now sign in and sign up using their Google accounts.

## Setup Instructions

### Step 1: Configure Google OAuth in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **Authentication** → **Providers**

2. **Enable Google Provider**
   - Click on "Google" provider
   - Toggle "Enable Sign-in with Google"
   - You'll need:
     - **Client ID**: From Google Cloud Console
     - **Client Secret**: From Google Cloud Console

### Step 2: Get Google OAuth Credentials

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the **Google+ API**

2. **Create OAuth 2.0 Credentials**
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Add authorized redirect URIs:
     ```
     https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback?provider=google
     http://localhost:3000/auth/callback (for local development)
     http://localhost:3001/auth/callback (for Vite dev)
     ```
   - Copy the **Client ID** and **Client Secret**

3. **Add to Supabase**
   - Paste the Client ID and Client Secret in the Google provider settings
   - Save changes

### Step 3: Configure Redirect URL in Your App

The redirect URL is already configured in the code to use:
```
${window.location.origin}/auth/callback
```

This automatically adapts to:
- Local development: `http://localhost:3000/auth/callback` or `http://localhost:3001/auth/callback`
- Production: `https://your-domain.com/auth/callback`

## How It Works

### Sign In Flow
1. User clicks **"Se connecter avec Google"** button on Login page
2. Redirected to Google sign-in
3. User authenticates with Google account
4. Redirected back to `/auth/callback`
5. App creates/retrieves user profile in Supabase
6. User redirected to appropriate dashboard (Listings, Dashboard, or Admin Panel)

### Sign Up Flow
1. User clicks **"S'inscrire avec Google"** button on Signup page
2. Same OAuth flow as sign-in
3. If first-time user, profile automatically created with:
   - Email from Google account
   - Full name from Google account
   - Role: "visitor" (default)
   - Can upgrade to agent from profile settings

## Code Structure

### New Files Created
- `pages/AuthCallback.tsx` - Handles OAuth redirect callback
- Translations added for Google buttons in `services/translations.ts`

### Updated Files
- `services/supabaseAuthService.ts`:
  - `signInWithGoogle()` - Initiates Google sign-in
  - `signUpWithGoogle()` - Initiates Google sign-up
  - `handleOAuthCallback()` - Processes OAuth response and creates user profile

- `pages/Login.tsx`:
  - Added Google sign-in button
  - Added divider line between email/password and OAuth buttons

- `pages/Signup.tsx`:
  - Added Google sign-up button
  - Added divider line

- `App.tsx`:
  - Added `/auth/callback` route

- `types.ts`:
  - Added `AUTH_CALLBACK` route path

## Translations

French (FR):
```typescript
login: {
  google_signin: 'Se connecter avec Google',
  or_divider: 'OU',
}
signup: {
  google_signup: "S'inscrire avec Google",
  or_divider: 'OU',
}
```

English (EN):
```typescript
login: {
  google_signin: 'Sign in with Google',
  or_divider: 'OR',
}
signup: {
  google_signup: 'Sign up with Google',
  or_divider: 'OR',
}
```

## User Profile Management

### First-Time Google Sign-In
When a user signs in with Google for the first time:
1. Supabase checks if user profile exists
2. If not found (PGRST116 error), creates new profile with:
   - Auto-populated name from Google account
   - Default role: "visitor"
   - Email verified (from Google)

### Later Updates
Users can update their profile by:
1. Going to Profile page
2. Editing their information
3. Changing role from "visitor" to "agent" (requires company details)

## Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution**: Make sure the redirect URIs in Google Cloud Console exactly match:
```
https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback?provider=google
```

### Issue: Google button doesn't appear
**Solution**: Check that:
1. Google provider is enabled in Supabase
2. Client ID and Secret are correctly configured
3. Browser cache is cleared

### Issue: User not redirected after signing in
**Solution**: 
1. Check browser console for errors
2. Verify AuthCallback.tsx route is properly registered in App.tsx
3. Check that session is properly set in Supabase

### Issue: User profile not created
**Solution**:
1. Ensure RLS policies on users table allow inserts
2. Check Supabase logs for profile creation errors
3. Verify users table exists with correct schema

## Testing in Development

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Go to Login page**
   ```
   http://localhost:3001/login
   ```

3. **Click "Se connecter avec Google"**

4. **Sign in with your Google account**

5. **Should be redirected to `/auth/callback` and then to appropriate dashboard**

## Production Checklist

- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Redirect URIs added to Google Cloud Console
- [ ] Client ID and Secret added to Supabase
- [ ] Production domain added to Google OAuth redirect URIs
- [ ] Email verification configured in Supabase (if needed)
- [ ] Users table RLS policies reviewed and tested
- [ ] Error handling and user feedback tested

## Security Considerations

1. **Client ID**: Public, safe to expose in frontend
2. **Client Secret**: Keep in Supabase only, never expose
3. **Tokens**: Handled by Supabase, not stored in localStorage
4. **RLS Policies**: Ensure users can only access their own profiles

## References

- [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Best Practices](https://oauth.net/2/)
