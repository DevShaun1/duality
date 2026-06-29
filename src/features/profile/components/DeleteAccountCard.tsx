import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteAccount } from '@/features/profile/hooks/useDeleteAccount';
import { supabase } from '@/lib/supabase';

type DeleteAccountCardProps = {
  className?: string;
};

const DELETE_CONFIRMATION_TEXT = 'DELETE';

export default function DeleteAccountCard({ className }: DeleteAccountCardProps) {
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isConfirmed = confirmationText === DELETE_CONFIRMATION_TEXT;
  const isDeleting = deleteAccount.isPending;

  function resetDialogState() {
    setConfirmationText('');
    setDeleteError(null);
  }

  function handleOpenChange(open: boolean) {
    setIsDialogOpen(open);

    if (!open) {
      resetDialogState();
    }
  }

  async function handleDeleteAccount() {
    if (!isConfirmed || isDeleting) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteAccount.mutateAsync();
      await supabase.auth.signOut({ scope: 'local' });
      setIsDialogOpen(false);
      navigate('/login', { replace: true });
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Something went wrong while deleting your account.'
      );
    }
  }

  return (
    <Card className={`border-destructive/30 bg-destructive/5 ${className}`}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="rounded-full bg-destructive/10 p-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
          </span>

          <div className="space-y-1">
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Permanently delete your account and all of your reflections. This cannot be undone.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="ml-10">
        <AlertDialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account, reflections, and generated insights. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2">
              <Label htmlFor="delete-account-confirmation">
                Type <span className="font-semibold">DELETE</span> to confirm.
              </Label>
              <Input
                id="delete-account-confirmation"
                value={confirmationText}
                onChange={(event) => setConfirmationText(event.target.value)}
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>

            {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  disabled={!isConfirmed || isDeleting}
                  onClick={handleDeleteAccount}
                >
                  {isDeleting ? 'Deleting...' : 'Delete account'}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
