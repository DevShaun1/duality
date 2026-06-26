import type { Reflection, ReflectionInsight } from '@/features/reflections/types/reflection';

export type PatternReview = {
  id: string;
  user_id: string;
  created_at: string;
  reflection_ids: string[];
  overview: string;
  recurring_themes: string[];
  emotional_patterns: string[];
  recurring_assumptions: string[];
  signs_of_growth: string[];
  another_side: string;
  reflection_question: string;
};

export type ReflectionInsightPair = {
  reflection: Reflection;
  insight: ReflectionInsight;
};
