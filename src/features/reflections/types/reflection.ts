// Data type representation from Supabase

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
};

export type ReflectionInsight = {
  id: string;
  reflection_id: string;
  created_at: string;
  summary: string;
  emotional_tone: string;
  themes: string[];
  assumptions: string[];
  alternative_perspectives: string[];
  reflection_question: string;
};

export type ReflectionWithInsight = Reflection & {
  insight?: ReflectionInsight | null;
};
