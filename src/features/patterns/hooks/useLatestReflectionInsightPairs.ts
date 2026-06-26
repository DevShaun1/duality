import { useQuery } from '@tanstack/react-query';
import { getLatestReflectionInsightPairs } from '../api/getLatestReflectionInsightPairs';

export function useLatestReflectionInsightPairs() {
  return useQuery({
    queryKey: ['patterns', 'latest-reflection-insight-pairs'],
    queryFn: getLatestReflectionInsightPairs,
  });
}
