import type { NavigateFunction } from 'react-router-dom';

import { supabase } from '@/lib/supabase';

export async function signOutAndRedirect(navigate: NavigateFunction) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
    return false;
  }

  navigate('/login', { replace: true });
  return true;
}
