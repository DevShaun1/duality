// Data type representation from Supabase
import type { ReflectionInsight } from '@/features/insights/types/insight';

export type Reflection = {
  id: string;
  user_id: string;
  created_at: string;
  reflection_date: string;
  sleep_hours: number;
  mood: number;
  energy: number;
  stress: number;
  exercised: boolean;
  journal_text: string;
  insight_stale: boolean;
};

export type ReflectionWithInsight = Reflection & {
  insight?: ReflectionInsight | null;
  hasInsight: boolean;
};

export type { ReflectionInsight };
