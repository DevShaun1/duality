import { useEffect } from 'react';
import { useSpeechToText } from './useSpeechToText';
import { useLocalStorageDraft } from './useLocalStorageDraft';

type UseSpeechToTextControllerOptions = {
  currentValue: string;
};

const STORAGE_KEY = 'speech-to-text-draft';

const joinText = (left: string, right: string) => {
  const trimmedLeft = left.trimEnd();
  const trimmedRight = right.trim();

  if (!trimmedLeft) return trimmedRight;
  if (!trimmedRight) return trimmedLeft;

  return `${trimmedLeft} ${trimmedRight}`;
};

/**
 * Coordinates the speech to text screen state.
 *
 * Combines speech recognition state with the locally persisted draft so the
 * component can stay focused on rendering.
 *
 * @returns {Object} View state and handlers for the speech to text UI
 */
export function useSpeechToTextController({ currentValue }: UseSpeechToTextControllerOptions) {
  const {
    transcript,
    interimTranscript,
    isListening,
    isRecognitionActive,
    isSupported,
    supportsContinuousListening,
    speechError,
    wasInterruptedBySystem,
    startListening,
    stopListening,
    resetTranscript,
    clearSpeechFeedback,
  } = useSpeechToText();

  const { draft, setDraft, clearDraft } = useLocalStorageDraft(STORAGE_KEY);

  useEffect(() => {
    if (draft !== currentValue) {
      setDraft(currentValue);
    }
  }, [currentValue, draft, setDraft]);

  const handleTextChange = (nextValue: string) => {
    setDraft(nextValue);
  };

  const commitPendingTranscript = () => {
    const pendingTranscript = (transcript || interimTranscript).trim();

    if (!pendingTranscript) {
      return currentValue;
    }

    const nextValue = joinText(currentValue, pendingTranscript);
    setDraft(nextValue);
    resetTranscript();

    return nextValue;
  };

  const handleStartListening = async () => {
    clearSpeechFeedback();
    resetTranscript();
    await startListening();
  };

  const handleStopListening = async () => {
    await stopListening();
    const nextValue = commitPendingTranscript();

    return nextValue;
  };

  const handleClear = () => {
    clearDraft();
    resetTranscript();
  };

  const liveTranscript = transcript || interimTranscript;
  // During recording, show live speech appended to the latest committed value.
  // Fall back to draft when the recogniser pauses (liveTranscript is empty) so the
  // textarea does not revert to listeningBaseText after a mobile utterance ends.
  const liveDisplayText = isListening
    ? (liveTranscript ? joinText(currentValue, liveTranscript) : draft)
    : currentValue;

  return {
    displayText: currentValue,
    interimTranscript,
    isListening,
    isRecognitionActive,
    isSupported,
    liveDisplayText,
    speechError,
    wasInterruptedBySystem,
    supportsContinuousListening,
    handleClear,
    commitPendingTranscript,
    handleStartListening,
    handleStopListening,
    handleTextChange,
  };
}
