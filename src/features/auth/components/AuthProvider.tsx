import { useEffect, useMemo, useState, type ReactNode } from 'react';
import PrivacyTransparencyDialog from '@/features/auth/components/PrivacyTransparencyDialog';
import { usePrivacyNotice } from '@/features/auth/hooks/usePrivacyNotice';
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

  const { showPrivacyNotice, acceptPrivacyNotice } = usePrivacyNotice({
    isAuthenticated: Boolean(user),
    pathname,
  });

  useEffect(() => {
    const initialiseAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };

    initialiseAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
      <PrivacyTransparencyDialog open={showPrivacyNotice} onAccept={acceptPrivacyNotice} />
    </>
  );
}
