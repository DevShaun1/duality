import { supabase } from '@/lib/supabase';
import type { ReflectionWithInsight } from '../types/reflection';

export async function getReflections(): Promise<ReflectionWithInsight[]> {
  const { data, error } = await supabase
    .from('reflections')
    .select(
      `
      *,
      reflection_insights(id)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((reflection) => {
    const rawInsight = reflection.reflection_insights;
    const insight = Array.isArray(rawInsight) ? rawInsight[0] ?? null : rawInsight ?? null;

    return {
      ...reflection,
      insight,
      hasInsight: Boolean(insight),
    };
  });
}
