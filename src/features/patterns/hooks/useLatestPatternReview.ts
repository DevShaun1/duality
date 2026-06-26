import { useQuery } from '@tanstack/react-query';
import { getLatestPatternReview } from '../api/getLatestPatternReview';

export function useLatestPatternReview() {
  return useQuery({
    queryKey: ['patterns', 'latest-review'],
    queryFn: getLatestPatternReview,
  });
}
