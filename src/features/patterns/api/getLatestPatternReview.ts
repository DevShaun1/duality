import { supabase } from '@/lib/supabase';
import type { PatternReview } from '../types/patternReview';

export async function getLatestPatternReview(): Promise<PatternReview | null> {
  const { data, error } = await supabase
    .from('pattern_reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<PatternReview>();

  if (error) {
    throw error;
  }

  return data;
}
