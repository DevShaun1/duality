import { supabase } from '@/lib/supabase';
import type { ReflectionWithInsight } from '../types/reflection';

export async function getReflections(): Promise<ReflectionWithInsight[]> {
  const { data, error } = await supabase
    .from('reflections')
    .select(
      `
      *,
      reflection_insights(
        id,
        reflection_id,
        created_at,
        updated_at,
        summary,
        emotional_tone,
        themes,
        assumptions,
        alternative_perspectives,
        reflection_question
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((reflection) => {
    const insight = Array.isArray(reflection.reflection_insights)
      ? reflection.reflection_insights[0] ?? null
      : null;

    return {
      ...reflection,
      insight,
    };
  });
}
