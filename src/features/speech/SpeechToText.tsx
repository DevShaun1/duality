import { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechToTextController } from './hooks/useSpeechToTextController';
import { devComponentAttrs } from '@/lib/devtools';

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
  const handleFinalTranscript = useCallback(
    (transcript: string) => {
      const nextValue = `${value} ${transcript}`.trim();
      onChange(nextValue);
    },
    [onChange, value]
  );

  const {
    interimTranscript,
    isListening,
    isSupported,
    supportsContinuousListening,
    handleClear,
    handleStartListening,
    handleStopListening,
    handleTextChange,
  } = useSpeechToTextController({ onFinalTranscript: handleFinalTranscript });

  const liveDisplayText = interimTranscript ? `${value} ${interimTranscript}`.trim() : value;

  useEffect(() => {
    onRecordingControlChange?.({
      isListening,
      stopRecording: handleStopListening,
    });
  }, [isListening, handleStopListening, onRecordingControlChange]);

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isListening ? 'bg-primary' : 'bg-muted-foreground'}`}
          />
          {isListening ? 'Listening' : 'Ready to record'}
        </p>

        <div className="flex gap-2">
          {!isListening ? (
            <Button type="button" onClick={handleStartListening}>
              Start voice input
            </Button>
          ) : (
            <Button type="button" onClick={handleStopListening}>
              Stop
            </Button>
          )}

          <Button type="button" variant="outline" onClick={handleClearTranscript} disabled={!value}>
            Clear
          </Button>
        </div>
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
