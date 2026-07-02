import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { supabase } from '@/lib/supabase';
import type { ReflectionInsight } from '../types/insight';

type ReflectionInsightRow = ReflectionInsight & {
  reflections: {
    user_id: string;
  };
};

export async function getReflectionInsight(
  reflectionId: string
): Promise<ReflectionInsight | null> {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('reflection_insights')
    .select(
      `
      id,
      reflection_id,
      created_at,
      summary,
      emotional_tone,
      themes,
      assumptions,
      alternative_perspectives,
      reflection_question,
      reflections!inner(user_id)
    `
    )
    .eq('reflection_id', reflectionId)
    .eq('reflections.user_id', user.id)
    .maybeSingle<ReflectionInsightRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    reflection_id: data.reflection_id,
    created_at: data.created_at,
    summary: data.summary,
    emotional_tone: data.emotional_tone,
    themes: data.themes,
    assumptions: data.assumptions,
    alternative_perspectives: data.alternative_perspectives,
    reflection_question: data.reflection_question,
  };
}
