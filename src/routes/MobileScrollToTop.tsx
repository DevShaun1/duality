import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

export function MobileScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isMobileViewport = window.matchMedia(MOBILE_MEDIA_QUERY).matches;

    if (!isMobileViewport) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [location.pathname]);

  return null;
}
