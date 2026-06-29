import { supabase } from '@/lib/supabase';

type DeleteAccountResponse = {
  success: boolean;
};

export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke<DeleteAccountResponse>('delete-account', {
    body: {
      confirmation: 'DELETE',
    },
  });

  if (error) {
    throw error;
  }
}
