import { useEffect, useMemo, useState, type ReactNode } from 'react';
import PrivacyTransparencyDialog from '@/features/auth/components/PrivacyTransparencyDialog';
import { usePrivacyNotice } from '@/features/auth/hooks/usePrivacyNotice';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from '../context/authContext';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = session?.user ?? null;
  const pathname = window.location.pathname;
  const { data: profile } = useGetProfile({ enabled: Boolean(user) });

  const {
    showPrivacyNotice,
    acceptPrivacyNotice,
    isAcceptingPrivacyNotice,
    acceptPrivacyNoticeError,
  } = usePrivacyNotice({
    isAuthenticated: Boolean(user),
    privacyNoticeAcceptedAt: profile?.privacy_notice_accepted_at,
    pathname,
  });

  useEffect(() => {
    const initialiseAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        await supabase.auth.signOut({ scope: 'local' });
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(data.session);
      setIsLoading(false);
    };

    initialiseAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoggedIn: Boolean(session),
      isLoading,
    }),
    [session, isLoading]
  );

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      <PrivacyTransparencyDialog
        open={showPrivacyNotice}
        onAccept={acceptPrivacyNotice}
        isAccepting={isAcceptingPrivacyNotice}
        hasError={Boolean(acceptPrivacyNoticeError)}
      />
    </>
  );
}
