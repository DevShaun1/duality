import { supabase } from '@/lib/supabase';

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User must be logged in.');
  }

  return user;
}
