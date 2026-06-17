import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { supabase } from '@/lib/supabase';

type UpdateProfileInput = {
  displayName: string;
};

export async function updateProfile(input: UpdateProfileInput) {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: input.displayName,
    })
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) throw error;

  return data;
}
