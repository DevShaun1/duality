import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { supabase } from '@/lib/supabase';

export async function deleteReflection(reflectionId: string): Promise<void> {
  const user = await getCurrentUser();

  const { error: insightDeleteError } = await supabase
    .from('reflection_insights')
    .delete()
    .eq('reflection_id', reflectionId);

  if (insightDeleteError) {
    throw insightDeleteError;
  }

  const { error } = await supabase
    .from('reflections')
    .delete()
    .eq('id', reflectionId)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }
}
