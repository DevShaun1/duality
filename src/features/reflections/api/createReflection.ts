import { supabase } from '@/lib/supabase';
import type { Reflection } from '../types/reflection';
import { getCurrentUser } from '../../auth/api/getCurrentUser';
import type { ReflectionFormValues } from '../schemas/reflectionSchema';

export async function createReflection(values: ReflectionFormValues): Promise<Reflection> {
  const user = await getCurrentUser();

  const payload = {
    sleep_hours: values.sleepHours,
    energy: values.energy,
    mood: values.mood,
    stress: values.stress,
    exercised: values.exercise,
    journal_text: values.journalText,
  };

  const { data, error } = await supabase
    .from('reflections')
    .insert({ ...payload, user_id: user.id })
    .select('*')
    .single();

  if (error) throw error;

  return data;
}
