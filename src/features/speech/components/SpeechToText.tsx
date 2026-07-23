import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechToTextController } from '../hooks/useSpeechToTextController';
import { devComponentAttrs } from '@/lib/devtools';
import ClearReflectionDialog from './ClearReflectionDialog';

type SpeechToTextProps = {
  value: string;
  onChange: (value: string) => void;
  textareaId?: string;
  textareaName?: string;
  placeholder?: string;
  onRecordingControlChange?: (control: { isListening: boolean; stopRecording: () => void }) => void;
};

/**
 * Provides speech-assisted journal input while keeping the transcript
 * synchronised with the parent-controlled reflection value.
 *
 * Responsibilities:
 * - Displays interim and final speech-recognition results.
 * - Prevents manual edits while recognition is actively updating the transcript.
 * - Preserves pending speech across mobile pauses and system interruptions.
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
    interimTranscript,
    isListening,
    isRecognitionActive,
    isSupported,
    speechError,
    wasInterruptedBySystem,
    liveDisplayText,
    supportsContinuousListening,
    handleClear,
    commitPendingTranscript,
    handleStartListening,
    handleStopListening,
    handleTextChange,
  } = useSpeechToTextController({ currentValue: value });

  const hasCommittedSystemInterruptionRef = useRef(false);
  const hasCommittedUnexpectedStopRef = useRef(false);

  // Some mobile browsers end each recognition session after a pause even though
  // the user is still in listening mode. Re-arm the guard whenever recognition
  // starts again so each completed utterance can be committed exactly once.
  useEffect(() => {
    if (isRecognitionActive) {
      hasCommittedUnexpectedStopRef.current = false;
    }
  }, [isRecognitionActive]);

  // Stopping recognition may flush a final result asynchronously, so wait for
  // the controller to return the complete transcript before updating the form.
  const handleStopRecording = useCallback(async () => {
    const nextValue = await handleStopListening();
    onChange(nextValue);
  }, [handleStopListening, onChange]);

  // Button and parent callbacks must remain synchronous event handlers; the
  // async stop operation is intentionally started without blocking the caller.
  const handleStopRecordingWithoutAwait = useCallback(() => {
    void handleStopRecording();
  }, [handleStopRecording]);

  // Expose only the minimal recording API needed by parent workflows, such as
  // stopping active recognition before submitting or navigating away.
  useEffect(() => {
    onRecordingControlChange?.({
      isListening,
      stopRecording: handleStopRecordingWithoutAwait,
    });
  }, [handleStopRecordingWithoutAwait, isListening, onRecordingControlChange]);

  // On mobile browsers without reliable continuous listening, recognition can stop
  // after a pause without the user pressing Stop. Commit the pending transcript
  // before the controller automatically starts listening for the next utterance.
  useEffect(() => {
    if (!isListening) {
      hasCommittedUnexpectedStopRef.current = false;
      return;
    }

    // If continuous listening is supported, the controller will automatically
    // commit the transcript when recognition stops. If the user manually stopped
    // recording, the transcript is already committed in handleStopRecording.
    if (
      supportsContinuousListening ||
      isRecognitionActive ||
      wasInterruptedBySystem ||
      hasCommittedUnexpectedStopRef.current
    ) {
      return;
    }

    const nextValue = commitPendingTranscript();

    if (nextValue !== value) {
      onChange(nextValue);
    }

    // Prevent repeated renders during the same stopped session from appending
    // the same pending transcript more than once.
    hasCommittedUnexpectedStopRef.current = true;
  }, [
    commitPendingTranscript,
    isListening,
    isRecognitionActive,
    onChange,
    supportsContinuousListening,
    value,
    wasInterruptedBySystem,
  ]);

  // System interruptions such as locking the phone or backgrounding the app can
  // end recognition before the normal stop handler runs. Persist any pending
  // speech once so the user's last phrase is not lost.
  useEffect(() => {
    if (isListening) {
      hasCommittedSystemInterruptionRef.current = false;
      return;
    }

    if (!wasInterruptedBySystem || hasCommittedSystemInterruptionRef.current) {
      return;
    }

    const nextValue = commitPendingTranscript();

    if (nextValue !== value) {
      onChange(nextValue);
    }

    // Keep the interruption commit idempotent until a new listening session starts.
    hasCommittedSystemInterruptionRef.current = true;
  }, [commitPendingTranscript, isListening, onChange, value, wasInterruptedBySystem]);

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
      {!supportsContinuousListening && (
        <p className="rounded-md border border-muted bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
          Continuous listening may not be fully supported. You may need to restart recording
          occasionally.
        </p>
      )}

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isListening ? 'bg-primary' : 'bg-muted-foreground'
              }`}
            />
            {isListening ? 'Listening' : 'Ready to record'}
          </p>

          {!isListening ? (
            <Button type="button" onClick={handleStartListening}>
              Start voice input
            </Button>
          ) : (
            <Button type="button" onClick={handleStopRecordingWithoutAwait}>
              Stop
            </Button>
          )}
        </div>

        <ClearReflectionDialog value={value} handleClearTranscript={handleClearTranscript} />
      </div>

      <Textarea
        id={textareaId}
        name={textareaName}
        className={isListening ? 'opacity-80' : undefined}
        rows={8}
        value={liveDisplayText}
        onChange={(event) => handleTranscriptChange(event.target.value)}
        readOnly={isListening}
        placeholder={placeholder}
      />

      {isListening && (
        <p className="text-xs leading-5 text-muted-foreground">
          While recording, you can listen but not edit. Stop when you're done to make any changes.
        </p>
      )}

      {/* Show a message when the recogniser is waiting for speech after a pause. */}
      {isListening && !interimTranscript && (
        <p className="text-xs leading-5 text-muted-foreground">Listening... waiting for speech.</p>
      )}
    </div>
  );
}
