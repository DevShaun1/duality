import { supabase } from '@/lib/supabase';

export async function getReflections() {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
