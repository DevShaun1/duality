import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);