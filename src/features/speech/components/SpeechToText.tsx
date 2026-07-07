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
 * SpeechToText Component
 *
 * A React component for capturing voice-to-text journal entries using Web Speech API.
 * Provides a user interface for starting/stopping speech recognition, displaying real-time
 * transcription, and clearing entries.
 *
 * Browser Support:
 * - Chrome, Edge, and modern browsers with Web Speech API support
 * - Falls back to unsupported message for older browsers or Safari
 *
 * Features:
 * - Real-time speech capture with visual listening indicator
 * - Display of both interim (currently being spoken) and final transcript text
 * - Editable textarea (read-only while listening, editable when stopped)
 * - Browser compatibility warnings for limited continuous listening support
 * - Clear button to reset all transcript data
 *
 * @returns {JSX.Element} The rendered Voice Journal interface
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

  const handleStopRecording = useCallback(async () => {
    const nextValue = await handleStopListening();
    onChange(nextValue);
  }, [handleStopListening, onChange]);

  const handleStopRecordingWithoutAwait = useCallback(() => {
    void handleStopRecording();
  }, [handleStopRecording]);

  useEffect(() => {
    onRecordingControlChange?.({
      isListening,
      stopRecording: handleStopRecordingWithoutAwait,
    });
  }, [handleStopRecordingWithoutAwait, isListening, onRecordingControlChange]);

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

    hasCommittedSystemInterruptionRef.current = true;
  }, [commitPendingTranscript, isListening, onChange, value, wasInterruptedBySystem]);

  const handleClearTranscript = () => {
    handleClear();
    onChange('');
  };

  const handleTranscriptChange = (nextValue: string) => {
    handleTextChange(nextValue);
    onChange(nextValue);
  };

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
              className={`h-2.5 w-2.5 rounded-full ${isListening ? 'bg-primary' : 'bg-muted-foreground'}`}
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

      {isListening && !interimTranscript && (
        <p className="text-xs leading-5 text-muted-foreground">Listening... waiting for speech.</p>
      )}
    </div>
  );
}
