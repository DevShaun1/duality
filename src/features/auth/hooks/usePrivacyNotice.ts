import { useEffect, useState } from 'react';
import { useAcceptPrivacyNotice } from '@/features/profile/hooks/useAcceptPrivacyNotice';

type UsePrivacyNoticeParams = {
  isAuthenticated: boolean;
  privacyNoticeAcceptedAt?: string | null;
  pathname: string;
};

function getCurrentPathname() {
  return window.location.pathname;
}

export function usePrivacyNotice({
  isAuthenticated,
  privacyNoticeAcceptedAt,
  pathname,
}: UsePrivacyNoticeParams) {
  const [currentPathname, setCurrentPathname] = useState(pathname);
  const acceptPrivacyNoticeMutation = useAcceptPrivacyNotice();

  // Update currentPathname when the user navigates to a new page
  // This is necessary because the usePrivacyNotice hook is used in the AuthProvider component,
  // which is mounted at the root of the app and does not re-render on route changes.
  useEffect(() => {
    const updatePathname = () => {
      setCurrentPathname(getCurrentPathname());
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushState(...args) {
      originalPushState.apply(this, args);
      updatePathname();
    };

    window.history.replaceState = function replaceState(...args) {
      originalReplaceState.apply(this, args);
      updatePathname();
    };

    window.addEventListener('popstate', updatePathname);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', updatePathname);
    };
  }, []);

  const acceptPrivacyNotice = async () => {
    if (!isAuthenticated) {
      return;
    }

    await acceptPrivacyNoticeMutation.mutateAsync();
  };

  const isPrivacyPage = currentPathname === '/privacy';

  return {
    showPrivacyNotice: isAuthenticated && privacyNoticeAcceptedAt === null && !isPrivacyPage,
    acceptPrivacyNotice,
    isAcceptingPrivacyNotice: acceptPrivacyNoticeMutation.isPending,
    acceptPrivacyNoticeError: acceptPrivacyNoticeMutation.error,
  };
}
