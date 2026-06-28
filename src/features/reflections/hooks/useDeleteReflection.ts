import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReflection } from '../api/deleteReflection';

export function useDeleteReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReflection,
    onSuccess: (_, reflectionId) => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'insight'] });
      queryClient.removeQueries({ queryKey: ['reflections', reflectionId] });
      queryClient.removeQueries({ queryKey: ['reflections', 'insight', reflectionId] });
    },
  });
}
