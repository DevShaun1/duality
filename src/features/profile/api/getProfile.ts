import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import type { Profile } from '../types/profile';

export async function getProfile(): Promise<Profile> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, created_at, display_name, privacy_notice_accepted_at')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  return data;
}