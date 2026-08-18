import { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ABORT_TIMEOUT_MS = 250;
const INTERRUPTION_DEBOUNCE_MS = 800;
const START_GRACE_PERIOD_MS = 1500;

/**
 * Wraps `react-speech-recognition` with the lifecycle behaviour required by
 * Duality's voice journalling flow.
 *
 * Responsibilities:
 * - Starts speech recognition using South African English (`en-ZA`).
 * - Buffers interim and final transcript state from the browser recogniser.
 * - Distinguishes deliberate stops from system interruptions.
 * - Surfaces recoverable speech-recognition errors to the UI.
 *
 * This hook owns browser recognition state only. Transcript assembly and
 * synchronisation with the journal value are handled by
 * `useSpeechToTextController`.
 *
 * @returns Speech recognition state, capability flags and control functions.
 */
export function useSpeechToText() {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const transcriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const isManualStopRef = useRef(false);
  const interruptionTimeoutRef = useRef<number | null>(null);
  const ignoreInterruptionUntilRef = useRef(0);
  const shouldCommitOnEndRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPendingTranscript, setHasPendingTranscript] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [wasInterruptedBySystem, setWasInterruptedBySystem] = useState(false);

  useEffect(() => {
    transcriptRef.current = transcript;
    interimTranscriptRef.current = interimTranscript;
  }, [interimTranscript, transcript]);

  useEffect(() => {
    if (listening || !shouldCommitOnEndRef.current || isManualStopRef.current) return;

    shouldCommitOnEndRef.current = false;
    setIsRecording(false);
    setHasPendingTranscript(true);
  }, [listening]);

  // Browsers can terminate recognition when the page becomes hidden,
  // the device locks or the app moves to the background. Treat these as
  // interruptions rather than intentional user stops.
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

      shouldCommitOnEndRef.current = true;
      setIsRecording(false);
      setWasInterruptedBySystem(true);
      void SpeechRecognition.abortListening();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Debounce tab/background transitions so brief visibility flickers
        // do not tear down an active recording session.
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

  const startListening = async () => {
    // Clear any state from a previous recording session.
    setSpeechError(null);
    setWasInterruptedBySystem(false);
    isManualStopRef.current = false;
    shouldCommitOnEndRef.current = true;
    setHasPendingTranscript(false);
    setIsRecording(true);
    // Ignore transient visibility events that some mobile browsers emit
    // immediately after microphone activation.
    ignoreInterruptionUntilRef.current = Date.now() + START_GRACE_PERIOD_MS;

    // Abort any stale recognition session before starting a new one.
    // The timeout prevents browsers with a hanging abort promise from
    // blocking voice input.
    const abortPromise = SpeechRecognition.abortListening().catch(() => undefined);

    await Promise.race([
      abortPromise,
      new Promise<void>((resolve) => {
        setTimeout(resolve, ABORT_TIMEOUT_MS);
      }),
    ]);

    try {
      await SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: 'en-ZA',
      });
    } catch {
      shouldCommitOnEndRef.current = false;
      setIsRecording(false);
      setSpeechError('Could not start voice input. Please tap Start voice input again.');
    }
  };

  const stopListening = async () => {
    // Mark the stop as intentional before calling the browser API so
    // interruption handlers do not treat it as an unexpected shutdown.
    isManualStopRef.current = true;
    shouldCommitOnEndRef.current = false;
    setHasPendingTranscript(false);
    setIsRecording(false);

    try {
      await SpeechRecognition.stopListening();
    } catch {
      setSpeechError('Could not stop voice input cleanly.');
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  };

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening: isRecording,
    isRecognitionActive: listening,
    hasPendingTranscript,
    isSupported: browserSupportsSpeechRecognition,
    getBufferedTranscript: () =>
      [transcriptRef.current, interimTranscriptRef.current].filter(Boolean).join(' ').trim(),
    speechError,
    wasInterruptedBySystem,
    startListening,
    stopListening,
    resetTranscript,
    // Feedback can be dismissed independently of transcript state so
    // users do not lose captured speech.
    clearSpeechFeedback: () => {
      setSpeechError(null);
      setWasInterruptedBySystem(false);
    },
  };
}
