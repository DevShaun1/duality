import { supabase } from '@/lib/supabase';
import type { ReflectionInsightPair } from '../types/patternReview';
import type { Reflection, ReflectionInsight } from '@/features/reflections/types/reflection';

type ReflectionWithInsightRelation = Reflection & {
  reflection_insights: ReflectionInsight[] | ReflectionInsight | null;
};

export async function getLatestReflectionInsightPairs(): Promise<ReflectionInsightPair[]> {
  const { data, error } = await supabase
    .from('reflections')
    .select(
      `
      *,
      reflection_insights (
        id,
        reflection_id,
        created_at,
        summary,
        emotional_tone,
        themes,
        assumptions,
        alternative_perspectives,
        reflection_question
      )
    `
    )
    .order('reflection_date', { ascending: false })
    .limit(12)
    .overrideTypes<ReflectionWithInsightRelation[]>();

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => {
      const rawInsight = row.reflection_insights;
      const insight = Array.isArray(rawInsight) ? (rawInsight[0] ?? null) : (rawInsight ?? null);

      if (!insight) {
        return null;
      }

      const reflection: Reflection = {
        id: row.id,
        user_id: row.user_id,
        created_at: row.created_at,
        reflection_date: row.reflection_date,
        sleep_hours: row.sleep_hours,
        mood: row.mood,
        energy: row.energy,
        stress: row.stress,
        exercised: row.exercised,
        journal_text: row.journal_text,
        insight_stale: row.insight_stale,
      };

      return {
        reflection,
        insight,
      };
    })
    .filter((item): item is ReflectionInsightPair => Boolean(item))
    .slice(0, 3);
}
