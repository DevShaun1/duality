import { useQuery } from '@tanstack/react-query';
import { getTodaysReflection } from '../api/getTodaysReflection';

export function useTodaysReflection() {
  return useQuery({
    queryKey: ['reflections'],
    queryFn: getTodaysReflection,
  });
}
