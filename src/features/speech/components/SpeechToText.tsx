import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechToTextController } from '../hooks/useSpeechToTextController';
import { devComponentAttrs } from '@/lib/devtools';
import ClearReflectionDialog from './ClearReflectionDialog';
import { RecordingIndicator } from './RecordingIndicator';

type SpeechToTextProps = {
  value: string;
  onChange: (value: string) => void;
  textareaId?: string;
  textareaName?: string;
  placeholder?: string;
  onRecordingControlChange?: (control: {
    isListening: boolean;
    stopRecording: () => Promise<void>;
  }) => void;
};

/**
 * Provides speech-assisted journal input while keeping the transcript
 * synchronised with the parent-controlled reflection value.
 *
 * Responsibilities:
 * - Commits buffered speech after recording stops.
 * - Exposes recording controls for parent submission and navigation workflows.
 * - Falls back to typed input when speech recognition is unsupported.
 * - Allows the transcript and internal recognition buffers to be reset together.
 *
 * The speech-recognition lifecycle and transcript assembly are owned by
 * `useSpeechToTextController`.
 */
export function SpeechToText({
  value,
  onChange,
  textareaId = 'reflection',
  textareaName = 'journalText',
  placeholder = 'Start speaking about your day...',
  onRecordingControlChange,
}: SpeechToTextProps) {
  const {
    isListening,
    hasPendingTranscript,
    isSupported,
    speechError,
    wasInterruptedBySystem,
    handleClear,
    handleStartListening,
    handleStopListening,
    handleCancelListening,
    handleTextChange,
  } = useSpeechToTextController({ currentValue: value });

  // Stopping recognition may flush a final result asynchronously, so wait for
  // the controller to return the complete transcript before updating the form.
  const handleStopRecording = useCallback(async () => {
    const nextValue = await handleStopListening();
    onChange(nextValue);
  }, [handleStopListening, onChange]);

  // Button and parent callbacks must remain synchronous event handlers; the
  // async stop operation is intentionally started without blocking the caller.
  // Expose only the minimal recording API needed by parent workflows, such as
  // stopping active recognition before submitting or navigating away.
  useEffect(() => {
    onRecordingControlChange?.({
      isListening,
      stopRecording: handleStopRecording,
    });
  }, [handleStopRecording, isListening, onRecordingControlChange]);

  useEffect(() => {
    if (!hasPendingTranscript) {
      return;
    }

    void handleStopRecording();
  }, [handleStopRecording, hasPendingTranscript]);

  // Discards the in-progress recording instead of appending it to the journal.
  const handleCancelRecording = () => {
    void handleCancelListening();
  };

  // Clear both the controller's internal transcript buffers and the parent form
  // value so stale speech cannot reappear when recognition starts again.
  const handleClearTranscript = () => {
    handleClear();
    onChange('');
  };

  // Keep manually edited text aligned with the controller's base transcript;
  // future speech results are appended to this updated value.
  const handleTranscriptChange = (nextValue: string) => {
    handleTextChange(nextValue);
    onChange(nextValue);
  };

  // If the browser doesn't support speech recognition, render a standard textarea
  if (!isSupported) {
    return (
      <div className="space-y-2" {...devComponentAttrs('SpeechToText')}>
        <Textarea
          id={textareaId}
          name={textareaName}
          rows={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        <p className="text-xs leading-5 text-muted-foreground">
          Speech recognition is not supported in this browser. You can still type your reflection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {wasInterruptedBySystem && (
        <p className="rounded-md border border-muted bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
          Recording paused when your phone locked or the app moved to the background. Tap Start
          voice input to continue.
        </p>
      )}

      {speechError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
          {speechError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!isListening ? (
          <Button type="button" onClick={handleStartListening}>
            Start voice input
          </Button>
        ) : (
          <RecordingIndicator
            onCancel={handleCancelRecording}
            onStop={() => void handleStopRecording()}
          />
        )}

        <ClearReflectionDialog value={value} handleClearTranscript={handleClearTranscript} />
      </div>

      <Textarea
        id={textareaId}
        name={textareaName}
        rows={8}
        value={value}
        onChange={(event) => handleTranscriptChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
