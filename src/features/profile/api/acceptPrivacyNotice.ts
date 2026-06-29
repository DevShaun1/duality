import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { supabase } from '@/lib/supabase';
import type { Profile } from '../types/profile';

export async function acceptPrivacyNotice(): Promise<Profile> {
  await getCurrentUser();

  const { data, error } = await supabase.rpc('accept_privacy_notice');

  if (error) throw error;
  if (!data) {
    throw new Error('Could not save privacy notice acceptance.');
  }

  return data;
}
