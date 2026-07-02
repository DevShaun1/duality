import { supabase } from '@/lib/supabase';
import type { ReflectionInsight } from '../types/insight';

type GenerateReflectionInsightParams = {
  reflectionId: string;
  reflectionText: string;
  sleepHours: number;
  energy: number;
  mood: number;
  stress: number;
  exercised: boolean;
};

type GenerateReflectionInsightResponse = {
  insight: ReflectionInsight;
};

export async function generateReflectionInsight(
  payload: GenerateReflectionInsightParams
): Promise<ReflectionInsight> {
  const { data, error } = await supabase.functions.invoke<GenerateReflectionInsightResponse>(
    'generate-reflection-analysis',
    {
      body: payload,
    }
  );

  if (error) {
    throw error;
  }

  if (!data?.insight) {
    throw new Error('No insight returned from reflection analysis function');
  }

  return data.insight;
}
