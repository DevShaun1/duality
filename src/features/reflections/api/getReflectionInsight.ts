import { getCurrentUser } from '@/features/auth/api/getCurrentUser';
import { supabase } from '@/lib/supabase';
import type { ReflectionInsight } from '../types/reflection';

type ReflectionInsightRow = ReflectionInsight & {
  reflections: {
    user_id: string;
  };
};

export async function getReflectionInsight(): Promise<ReflectionInsight | null> {
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
    .eq('reflections.user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<ReflectionInsightRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const { reflections: _reflection, ...insight } = data;

  return insight;
}