import { AlertTriangle, Loader2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type InsightStaleNoticeProps = {
  onRegenerate: () => void;
  isRegenerating?: boolean;
  error?: string | null;
};

export default function InsightStaleNotice({
  onRegenerate,
  isRegenerating = false,
  error = null,
}: InsightStaleNoticeProps) {
  return (
    <Alert className="border-primary/45 bg-primary/8 p-5 text-foreground shadow-sm shadow-primary/5">
      <div className="flex gap-4">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <AlertTitle className="text-base font-semibold leading-6 text-foreground">
            This reflection has changed since your insight was generated.
          </AlertTitle>
          <AlertDescription className="mt-2 text-sm leading-6 text-muted-foreground">
            Regenerate to align this insight with your latest reflection.
          </AlertDescription>

          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

          <Button
            type="button"
            size="sm"
            className="mt-4"
            onClick={onRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              'Regenerate Insight'
            )}
          </Button>
        </div>
      </div>
    </Alert>
  );
}
