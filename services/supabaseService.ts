// SupabaseService deprecated
// Supabase integration has been removed from this project. This module provides
// lightweight delegating wrappers to the new `authService` and `propertyService`
// where appropriate.

import authService from './authService';

export const signUp = authService.signUp.bind(authService);
export const signIn = authService.signIn.bind(authService);
export const signOut = authService.signOut.bind(authService);
export const signInWithProvider = authService.signInWithProvider.bind(authService);

export default {
  signUp,
  signIn,
  signOut,
  signInWithProvider,
};
