import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReflection } from '../api/updateReflection';

type UpdateReflectionVariables = {
  reflectionId: string;
  values: Parameters<typeof updateReflection>[1];
};

export function useUpdateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reflectionId, values }: UpdateReflectionVariables) =>
      updateReflection(reflectionId, values),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'insight'] });
    },
  });
}
