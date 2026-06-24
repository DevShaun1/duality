import { useQuery } from '@tanstack/react-query';
import { getReflectionInsight } from '../api/getReflectionInsight';

export function useReflectionInsight() {
  return useQuery({
    queryKey: ['reflections', 'insight'],
    queryFn: getReflectionInsight,
  });
}