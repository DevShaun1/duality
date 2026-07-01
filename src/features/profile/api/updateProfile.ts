import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { supabase } from '@/lib/supabase';

type UpdateProfileInput = {
  displayName?: string;
  hasSeenReflectionIntro?: boolean;
};

export async function updateProfile(input: UpdateProfileInput) {
  const user = await getCurrentUser();

  const updates: {
    display_name?: string;
    has_seen_reflection_intro?: boolean;
  } = {};

  if (input.displayName !== undefined) {
    updates.display_name = input.displayName;
  }

  if (input.hasSeenReflectionIntro !== undefined) {
    updates.has_seen_reflection_intro = input.hasSeenReflectionIntro;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No profile fields provided for update.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select('id, created_at, display_name, privacy_notice_accepted_at, has_seen_reflection_intro')
    .single();

  if (error) throw error;

  return data;
}
