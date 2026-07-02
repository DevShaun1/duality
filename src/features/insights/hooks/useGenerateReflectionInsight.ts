import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateReflectionInsight } from '../api/generateReflectionInsight';
import { insightsQueryKeys } from '../lib/queryKeys';

export function useGenerateReflectionInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateReflectionInsight,
    onSuccess: (_insight, variables) => {
      queryClient.invalidateQueries({ queryKey: insightsQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: insightsQueryKeys.reflection(variables.reflectionId),
      });
      queryClient.invalidateQueries({ queryKey: ['reflections', variables.reflectionId] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
    },
  });
}
