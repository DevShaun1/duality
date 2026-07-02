import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insightsQueryKeys } from '@/features/insights/lib/queryKeys';
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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'today'] });
      queryClient.invalidateQueries({
        queryKey: insightsQueryKeys.reflection(variables.reflectionId),
      });
    },
  });
}
