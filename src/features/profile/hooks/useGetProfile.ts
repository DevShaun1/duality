import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/getProfile';

type UseGetProfileOptions = {
  enabled?: boolean;
};

export function useGetProfile(options: UseGetProfileOptions = {}) {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: options.enabled,
  });
}
