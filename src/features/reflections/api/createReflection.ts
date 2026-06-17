import { supabase } from '@/lib/supabase';
import type { CreateReflectionInput, Reflection } from '../types/reflection';
import { getCurrentUser } from './getCurrentUser';

export async function createReflection(input: CreateReflectionInput): Promise<Reflection> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('reflections')
    .insert({ ...input, user_id: user.id })
    .select('*')
    .single();

  if (error) throw error;

  return data;
}
