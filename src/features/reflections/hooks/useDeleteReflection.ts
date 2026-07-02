import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insightsQueryKeys } from '@/features/insights/lib/queryKeys';
import { deleteReflection } from '../api/deleteReflection';

export function useDeleteReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReflection,
    onSuccess: (_, reflectionId) => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'today'] });
      queryClient.invalidateQueries({ queryKey: insightsQueryKeys.all });
      queryClient.removeQueries({ queryKey: ['reflections', reflectionId] });
      queryClient.removeQueries({ queryKey: insightsQueryKeys.reflection(reflectionId) });
    },
  });
}
