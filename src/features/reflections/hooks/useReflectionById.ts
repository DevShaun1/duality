import { useQuery } from '@tanstack/react-query';
import { getReflectionById } from '../api/getReflectionById';

export function useReflectionById(reflectionId?: string) {
  return useQuery({
    queryKey: ['reflections', reflectionId],
    queryFn: () => getReflectionById(reflectionId as string),
    enabled: Boolean(reflectionId),
  });
}