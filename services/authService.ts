
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const signUpWithEmail = async (name: string, email: string, password: string, role: 'visitor' | 'agent'): Promise<void> => {
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
    role,
    subscription_plan: role === 'agent' ? 'free' : undefined,
  });

  if (profileError) {
    // Optional: Delete the auth user if profile creation fails to keep things clean
    await supabase.auth.admin.deleteUser(data.user.id);
    throw profileError;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) return null;
  return await getProfile(data.user.id);
};

export const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUserSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116: "exact one row not found"
    console.error('Error fetching profile:', error);
    return null;
  }
  return data as User | null;
};

export const updateProfile = async (user: User, profilePictureFile: File | null = null) => {
    let profilePictureUrl = user.profile_picture_url;

    if (profilePictureFile) {
        const filePath = `${user.id}/${Date.now()}_${profilePictureFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, profilePictureFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        profilePictureUrl = data.publicUrl;
    }

    const profileData = {
        name: user.name,
        phone: user.phone,
        profile_picture_url: profilePictureUrl,
        subscription_plan: user.subscription_plan,
    };
    
    const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
    
    if (error) throw error;
    return data as User;
}

export const sendPasswordResetEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // Redirects back to the app after email link click
    });
    if (error) throw error;
};

export const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
}
