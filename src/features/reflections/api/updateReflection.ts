import { supabase } from '@/lib/supabase';
import type { ReflectionFormValues } from '../schemas/reflectionSchema';

export async function updateReflection(reflectionId: string, values: ReflectionFormValues) {
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
    .update(payload)
    .eq('id', reflectionId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
