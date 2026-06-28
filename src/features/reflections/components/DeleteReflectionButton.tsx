import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { useDeleteReflection } from '../hooks/useDeleteReflection';

type ButtonVariant = ComponentProps<typeof Button>['variant'];
type ButtonSize = ComponentProps<typeof Button>['size'];

type DeleteReflectionButtonProps = {
  reflectionId: string;
  onDeleted?: () => void;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  buttonClassName?: string;
  children?: ReactNode;
};

export function DeleteReflectionButton({
  reflectionId,
  onDeleted,
  buttonVariant = 'outline',
  buttonSize = 'default',
  buttonClassName,
  children,
}: DeleteReflectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteReflectionMutation = useDeleteReflection();

  const handleConfirmDelete = async () => {
    setDeleteError(null);

    try {
      await deleteReflectionMutation.mutateAsync(reflectionId);
      setIsOpen(false);
      toast.success('Reflection deleted successfully.');
      onDeleted?.();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Could not delete reflection.');
    }
  };

  return (
    <div className="space-y-2">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant={buttonVariant} size={buttonSize} className={buttonClassName}>
            {children ?? 'Delete reflection'}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this reflection?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your reflection and its generated insight will be
              removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteReflectionMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={deleteReflectionMutation.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  void handleConfirmDelete();
                }}
              >
                {deleteReflectionMutation.isPending ? 'Deleting...' : 'Delete reflection'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
    </div>
  );
}
