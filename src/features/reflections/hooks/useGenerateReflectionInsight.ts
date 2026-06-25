import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateReflectionInsight } from '../api/generateReflectionInsight';

export function useGenerateReflectionInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateReflectionInsight,
    onSuccess: (_insight, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reflections', 'insight'] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'insight', variables.reflectionId] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
    },
  });
}
