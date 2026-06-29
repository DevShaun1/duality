import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptPrivacyNotice } from '../api/acceptPrivacyNotice';

export function useAcceptPrivacyNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptPrivacyNotice,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile);
    },
  });
}
