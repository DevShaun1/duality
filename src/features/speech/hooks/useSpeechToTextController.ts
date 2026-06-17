import { useState } from 'react';
import { useSpeechToText } from './useSpeechToText';
import { useLocalStorageDraft } from './useLocalStorageDraft';

type UseSpeechToTextControllerOptions = {
  onFinalTranscript?: (transcript: string) => void;
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
export function useSpeechToTextController({
  onFinalTranscript,
}: UseSpeechToTextControllerOptions = {}) {
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    supportsContinuousListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({ onFinalTranscript });

  const { draft, setDraft, clearDraft } = useLocalStorageDraft(STORAGE_KEY);
  const [listeningBaseText, setListeningBaseText] = useState('');

  const handleTextChange = (nextValue: string) => {
    setDraft(nextValue);
  };

  const handleStartListening = () => {
    setListeningBaseText(draft);
    resetTranscript();
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
    setDraft(joinText(listeningBaseText, transcript));
    setListeningBaseText('');
    resetTranscript();
  };

  const handleClear = () => {
    clearDraft();
    setListeningBaseText('');
    resetTranscript();
  };

  const liveTranscript = transcript || interimTranscript;
  const liveDisplayText = isListening ? joinText(listeningBaseText, liveTranscript) : draft;

  return {
    displayText: draft,
    interimTranscript,
    isListening,
    isSupported,
    liveDisplayText,
    supportsContinuousListening,
    handleClear,
    handleStartListening,
    handleStopListening,
    handleTextChange,
  };
}
