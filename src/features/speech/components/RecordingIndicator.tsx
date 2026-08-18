import { Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpeechWaveBars } from './SpeechWaveBars';

type RecordingIndicatorProps = {
  onCancel: () => void;
  onStop: () => void;
};

/** Shows that voice recording is active and exposes cancel/stop controls. */
export function RecordingIndicator({ onCancel, onStop }: RecordingIndicatorProps) {
  return (
    <div
      className="flex h-[30px] flex-1 items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-1 sm:gap-3"
      role="status"
      aria-live="polite"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
        onClick={onCancel}
        aria-label="Cancel recording"
      >
        <X />
      </Button>

      <SpeechWaveBars />

      <p className="hidden shrink-0 text-sm font-medium text-primary sm:block">Recording…</p>

      <Button
        type="button"
        size="icon-xs"
        className="shrink-0 rounded-full"
        onClick={onStop}
        aria-label="Stop recording"
      >
        <Square className="fill-current" />
      </Button>
    </div>
  );
}
