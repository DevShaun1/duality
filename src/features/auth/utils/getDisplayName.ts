import type { User } from '@supabase/supabase-js';

export function getDisplayName(user: User | null): string {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'there'
  );
}
