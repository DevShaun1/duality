import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { supabase } from '@/lib/supabase';
import type { Reflection } from '../types/reflection';

export async function getReflectionById(reflectionId: string): Promise<Reflection | null> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('id', reflectionId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}