import { useQuery } from '@tanstack/react-query';
import { getReflectionInsight } from '../api/getReflectionInsight';

export function useReflectionInsight(reflectionId?: string) {
  return useQuery({
    queryKey: ['reflections', 'insight', reflectionId],
    queryFn: () => getReflectionInsight(reflectionId as string),
    enabled: Boolean(reflectionId),
  });
}