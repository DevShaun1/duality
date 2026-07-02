import { useQuery } from '@tanstack/react-query';
import { getReflectionInsight } from '../api/getReflectionInsight';
import { insightsQueryKeys } from '../lib/queryKeys';

export function useReflectionInsight(reflectionId?: string) {
  return useQuery({
    queryKey: insightsQueryKeys.reflection(reflectionId),
    queryFn: () => getReflectionInsight(reflectionId as string),
    enabled: Boolean(reflectionId),
  });
}
