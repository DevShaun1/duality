import { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

type UseSpeechToTextOptions = {
  onFinalTranscript?: (transcript: string) => void;
};

const ABORT_TIMEOUT_MS = 250;

/**
 * Hook for Web Speech API integration with React
 * Provides real-time speech-to-text transcription with browser compatibility checks
 *
 * Supports continuous listening mode and multiple language configurations.
 * Currently configured for South African English (en-ZA).
 *
 * @returns {Object} Speech recognition state and control methods
 * @returns {string} transcript - The finalized transcript text from completed speech
 * @returns {string} interimTranscript - Real-time text currently being spoken
 * @returns {string} finalTranscript - The most recent completed utterance
 * @returns {boolean} isListening - Whether the speech recognizer is actively listening
 * @returns {boolean} isSupported - Whether the browser supports Web Speech API
 * @returns {boolean} supportsContinuousListening - Whether continuous listening is supported
 * @returns {Function} startListening - Begin capturing speech (continuous mode enabled)
 * @returns {Function} stopListening - Stop capturing speech
 * @returns {Function} resetTranscript - Clear all transcript text
 *
 * @example
 * const { transcript, isListening, startListening, stopListening } = useSpeechToText();
 */
export function useSpeechToText({ onFinalTranscript }: UseSpeechToTextOptions = {}) {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
  } = useSpeechRecognition();

  const lastFinalTranscriptRef = useRef('');
  const isManualStopRef = useRef(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [wasInterruptedBySystem, setWasInterruptedBySystem] = useState(false);

  useEffect(() => {
    const nextFinalTranscript = finalTranscript.trim();

    if (!nextFinalTranscript || nextFinalTranscript === lastFinalTranscriptRef.current) return;

    lastFinalTranscriptRef.current = nextFinalTranscript;
    onFinalTranscript?.(nextFinalTranscript);
  }, [finalTranscript, onFinalTranscript]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const handleSystemInterruption = () => {
      if (!listening || isManualStopRef.current) return;

      setWasInterruptedBySystem(true);
      void SpeechRecognition.abortListening();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSystemInterruption();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleSystemInterruption);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleSystemInterruption);
    };
  }, [listening]);

  const startListening = async () => {
    setSpeechError(null);
    setWasInterruptedBySystem(false);
    isManualStopRef.current = false;

    const abortPromise = SpeechRecognition.abortListening().catch(() => undefined);

    await Promise.race([
      abortPromise,
      new Promise<void>((resolve) => {
        setTimeout(resolve, ABORT_TIMEOUT_MS);
      }),
    ]);

    try {
      await SpeechRecognition.startListening({
        continuous: browserSupportsContinuousListening,
        interimResults: true,
        language: 'en-ZA',
      });
    } catch {
      setSpeechError('Could not start voice input. Please tap Start voice input again.');
    }
  };

  const stopListening = async () => {
    isManualStopRef.current = true;

    try {
      await SpeechRecognition.stopListening();
    } catch {
      setSpeechError('Could not stop voice input cleanly.');
    }
  };

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening: listening,
    isSupported: browserSupportsSpeechRecognition,
    supportsContinuousListening: browserSupportsContinuousListening,
    speechError,
    wasInterruptedBySystem,
    startListening,
    stopListening,
    resetTranscript,
    clearSpeechFeedback: () => {
      setSpeechError(null);
      setWasInterruptedBySystem(false);
    },
  };
}
