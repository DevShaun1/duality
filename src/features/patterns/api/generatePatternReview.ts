import { supabase } from '@/lib/supabase';
import type { PatternReview } from '../types/patternReview';

type GeneratePatternReviewPayload = {
  reflectionIds: string[];
};

type GeneratePatternReviewResponse = {
  review: PatternReview;
};

export async function generatePatternReview(
  payload: GeneratePatternReviewPayload
): Promise<PatternReview> {
  const { data, error } = await supabase.functions.invoke<GeneratePatternReviewResponse>(
    'generate-pattern-review',
    {
      body: payload,
    }
  );

  if (error) {
    throw error;
  }

  if (!data?.review) {
    throw new Error('No pattern review returned from generation function');
  }

  return data.review;
}
