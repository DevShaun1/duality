import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type PrivacyTransparencyDialogProps = {
  open: boolean;
  onAccept: () => Promise<void>;
  isAccepting?: boolean;
  hasError?: boolean;
};

export default function PrivacyTransparencyDialog({
  open,
  onAccept,
  isAccepting = false,
  hasError = false,
}: PrivacyTransparencyDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Your trust matters</DialogTitle>
          <DialogDescription>
            Before you start reflecting, here is how Duality handles your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Your reflections are stored securely in your private account.</p>
          <p>
            To generate insights, your reflection text is securely sent to OpenAI for processing.
          </p>
          <p>We do not sell your personal data or use your reflections for advertising.</p>
          <p>Please avoid entering information you would not be comfortable storing digitally.</p>
          <p>
            You can read more in the{' '}
            <a href="/privacy" className="text-primary hover:text-primary/90">
              Privacy Notice
            </a>
            .
          </p>
        </div>

        {hasError && (
          <p className="text-sm text-destructive">
            We could not save your privacy notice acceptance. Please try again.
          </p>
        )}

        <DialogFooter>
          <Button onClick={() => void onAccept()} disabled={isAccepting}>
            {isAccepting ? 'Saving...' : 'I understand'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
