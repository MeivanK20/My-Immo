

import { supabase } from '../lib/supabase';
import { User } from '../types';

export const signUpWithEmail = async (name: string, email: string, password: string, phone: string, role: 'visitor' | 'agent'): Promise<void> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed.');

  // Create a corresponding profile in the 'profiles' table
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    name,
    email,
    phone,
    role,
    subscription_plan: role === 'agent' ? 'free' : undefined,
    score: 0,
    badge: 'Bronze'
  });

  if (profileError) {
    // Note: In a production environment with admin rights, you'd want to delete the orphaned auth user.
    console.error("Failed to create profile, but user was created in auth. Manual cleanup might be required for user ID:", data.user.id);
    throw profileError;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
};

export const signInWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) throw error;
};

export const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getProfile = async (id: string): Promise<User | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
        console.error('Error fetching profile:', error);
        throw error;
    }
    return data;
};

export const createOrUpdateProfileForProvider = async (authUser: any): Promise<User> => {
    const existingProfile = await getProfile(authUser.id);
    
    if (existingProfile) return existingProfile;

    const roleFromStorage = localStorage.getItem('signUpRole') as 'visitor' | 'agent' | null;
    localStorage.removeItem('signUpRole'); 

    const newProfileData = {
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || 'New User',
        email: authUser.email,
        profile_picture_url: authUser.user_metadata?.avatar_url,
        role: roleFromStorage || 'visitor',
        subscription_plan: roleFromStorage === 'agent' ? 'free' : undefined,
        score: 0,
        badge: 'Bronze'
    };

    const { data, error } = await supabase.from('profiles').upsert(newProfileData).select().single();

    if (error) throw error;
    if (!data) throw new Error("Could not create or update profile.");

    return data;
}

export const updateProfile = async (updatedUser: User, newProfilePicture: File | null = null): Promise<User> => {
    let profilePictureUrl = updatedUser.profile_picture_url;

    if (newProfilePicture) {
        const filePath = `avatars/${updatedUser.id}/${Date.now()}-${newProfilePicture.name}`;
        const { error: uploadError } = await supabase.storage.from('profile-pictures').upload(filePath, newProfilePicture, {
            upsert: true,
        });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
        profilePictureUrl = urlData.publicUrl;
    }
    
    const profileUpdate: Partial<User> = {
        name: updatedUser.name,
        phone: updatedUser.phone,
        profile_picture_url: profilePictureUrl,
        subscription_plan: updatedUser.subscription_plan,
        role: updatedUser.role, // Allow role to be updated
    };

    const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', updatedUser.id)
        .select()
        .single();

    if (error) throw error;
    if (!data) throw new Error("Profile update failed.");
    
    return data as User;
};


export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
};

export const updatePassword = async (password: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
};
