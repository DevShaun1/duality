import { useEffect, useState } from 'react';
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
  const [listeningBaseText, setListeningBaseText] = useState('');

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
    setListeningBaseText(currentValue);
    resetTranscript();
    await startListening();
  };

  const handleStopListening = async () => {
    await stopListening();
    const nextValue = commitPendingTranscript();
    setListeningBaseText('');

    return nextValue;
  };

  const handleClear = () => {
    clearDraft();
    setListeningBaseText('');
    resetTranscript();
  };

  const liveTranscript = transcript || interimTranscript;
  const liveDisplayText = isListening ? joinText(listeningBaseText, liveTranscript) : currentValue;

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
