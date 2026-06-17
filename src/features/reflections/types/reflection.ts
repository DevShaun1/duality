export type Reflection = {
  id: string;
  user_id: string;
  created_at: string;
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

export type CreateReflectionInput = Pick<
  Reflection,
  'sleep_hours' | 'mood' | 'energy' | 'stress' | 'exercised' | 'journal_text'
>;
