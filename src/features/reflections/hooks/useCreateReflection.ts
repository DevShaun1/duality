import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReflection } from "../api/createReflection";

export function useCreateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReflection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reflections"],
      });
      queryClient.invalidateQueries({
        queryKey: ['reflections', 'today'],
      });
      queryClient.invalidateQueries({ queryKey: ['reflections', 'insight'] });
    },
  });
}