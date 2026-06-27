import { useEffect, useState } from 'react';

const PRIVACY_NOTICE_STORAGE_KEY = 'duality_privacy_notice_accepted';

type UsePrivacyNoticeParams = {
  isAuthenticated: boolean;
  pathname: string;
};

function getCurrentPathname() {
  return window.location.pathname;
}

export function usePrivacyNotice({ isAuthenticated, pathname }: UsePrivacyNoticeParams) {
  const [accepted, setAccepted] = useState(
    () => localStorage.getItem(PRIVACY_NOTICE_STORAGE_KEY) === 'true'
  );
  const [currentPathname, setCurrentPathname] = useState(pathname);

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

  const acceptPrivacyNotice = () => {
    localStorage.setItem(PRIVACY_NOTICE_STORAGE_KEY, 'true');
    setAccepted(true);
  };

  const isPrivacyPage = currentPathname === '/privacy';

  return {
    showPrivacyNotice: isAuthenticated && !accepted && !isPrivacyPage,
    acceptPrivacyNotice,
  };
}
