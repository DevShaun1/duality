import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generatePatternReview } from '../api/generatePatternReview';

export function useGeneratePatternReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generatePatternReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patterns', 'latest-review'] });
      queryClient.invalidateQueries({ queryKey: ['patterns', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['patterns', 'latest-reflection-insight-pairs'] });
    },
  });
}
