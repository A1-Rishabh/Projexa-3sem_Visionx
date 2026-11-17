import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Real Google OAuth sign-in with Supabase
 */
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
    };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) {
    throw error;
  }

  return { success: true, data };
};

/**
 * Sign in with Email and Password
 */
export const signInWithEmail = async (email, password) => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return { success: true, data };
};

/**
 * Sign up with Email and Password
 */
export const signUpWithEmail = async (email, password, metadata = {}) => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) throw error;
  return { success: true, data };
};

/**
 * Sign out from Supabase
 */
export const signOutSupabase = async () => {
  if (!isSupabaseConfigured()) return { success: true };
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
};

/**
 * Fetch patient profile row from public.profiles
 */
export const getProfile = async (userId) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('Could not fetch user profile from Supabase:', error.message);
    return null;
  }
  return data;
};

/**
 * Update clinical details on profile (intake form)
 */
export const updateProfile = async (userId, updates) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

