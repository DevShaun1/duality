import { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

type UseSpeechToTextOptions = {
  onFinalTranscript?: (transcript: string) => void;
};

const ABORT_TIMEOUT_MS = 250;
const INTERRUPTION_DEBOUNCE_MS = 800;
const START_GRACE_PERIOD_MS = 1500;
const AUTO_RESTART_DELAY_MS = 300;

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
  const lastCommittedTranscriptRef = useRef('');
  const isManualStopRef = useRef(false);
  const interruptionTimeoutRef = useRef<number | null>(null);
  const ignoreInterruptionUntilRef = useRef(0);
  const shouldAutoRestartRef = useRef(false);
  const restartTimeoutRef = useRef<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [wasInterruptedBySystem, setWasInterruptedBySystem] = useState(false);

  useEffect(() => {
    const nextFinalTranscript = finalTranscript.trim();

    if (!nextFinalTranscript || nextFinalTranscript === lastFinalTranscriptRef.current) return;

    lastFinalTranscriptRef.current = nextFinalTranscript;
    onFinalTranscript?.(nextFinalTranscript);
  }, [finalTranscript, onFinalTranscript]);

  useEffect(() => {
    if (listening || !shouldAutoRestartRef.current) return;

    const pendingTranscript = [transcript, interimTranscript]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (!pendingTranscript || pendingTranscript === lastCommittedTranscriptRef.current) return;

    lastCommittedTranscriptRef.current = pendingTranscript;
    onFinalTranscript?.(pendingTranscript);
  }, [interimTranscript, listening, onFinalTranscript, transcript]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const clearPendingInterruption = () => {
      if (interruptionTimeoutRef.current === null) return;

      window.clearTimeout(interruptionTimeoutRef.current);
      interruptionTimeoutRef.current = null;
    };

    const handleSystemInterruption = () => {
      if (!listening || isManualStopRef.current) return;
      if (Date.now() < ignoreInterruptionUntilRef.current) return;

      shouldAutoRestartRef.current = false;
      setIsRecording(false);
      setWasInterruptedBySystem(true);
      void SpeechRecognition.abortListening();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearPendingInterruption();
        interruptionTimeoutRef.current = window.setTimeout(() => {
          interruptionTimeoutRef.current = null;
          handleSystemInterruption();
        }, INTERRUPTION_DEBOUNCE_MS);
        return;
      }

      clearPendingInterruption();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleSystemInterruption);

    return () => {
      clearPendingInterruption();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleSystemInterruption);
    };
  }, [listening]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    if (listening || !shouldAutoRestartRef.current || document.hidden) {
      if (restartTimeoutRef.current !== null) {
        window.clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      return;
    }

    restartTimeoutRef.current = window.setTimeout(async () => {
      restartTimeoutRef.current = null;

      if (!shouldAutoRestartRef.current || document.hidden || isManualStopRef.current) {
        return;
      }

      try {
        await SpeechRecognition.startListening({
          continuous: browserSupportsContinuousListening,
          interimResults: true,
          language: 'en-ZA',
        });
      } catch {
        setSpeechError('Voice input paused. Tap Start voice input to continue.');
        shouldAutoRestartRef.current = false;
        setIsRecording(false);
      }
    }, AUTO_RESTART_DELAY_MS);

    return () => {
      if (restartTimeoutRef.current !== null) {
        window.clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
    };
  }, [browserSupportsContinuousListening, listening]);

  const startListening = async () => {
    setSpeechError(null);
    setWasInterruptedBySystem(false);
    lastCommittedTranscriptRef.current = '';
    isManualStopRef.current = false;
    shouldAutoRestartRef.current = true;
    setIsRecording(true);
    ignoreInterruptionUntilRef.current = Date.now() + START_GRACE_PERIOD_MS;

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
      shouldAutoRestartRef.current = false;
      setIsRecording(false);
      setSpeechError('Could not start voice input. Please tap Start voice input again.');
    }
  };

  const stopListening = async () => {
    isManualStopRef.current = true;
    shouldAutoRestartRef.current = false;
    setIsRecording(false);

    if (restartTimeoutRef.current !== null) {
      window.clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

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
    isListening: isRecording,
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
