import { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

type UseSpeechToTextOptions = {
  onFinalTranscript?: (transcript: string) => void;
};

// Constants for timing and behavior of the speech recognition lifecycle
const ABORT_TIMEOUT_MS = 250;
const INTERRUPTION_DEBOUNCE_MS = 800;
const START_GRACE_PERIOD_MS = 1500;
const AUTO_RESTART_DELAY_MS = 300;

/**
 * Wraps `react-speech-recognition` with the lifecycle behaviour required by
 * Duality's voice journalling flow.
 *
 * Responsibilities:
 * - Starts speech recognition using South African English (`en-ZA`).
 * - Exposes interim and final transcript state from the browser recogniser.
 * - Emits newly finalised speech without duplicates.
 * - Restarts recognition when supported browsers unexpectedly end a session.
 * - Distinguishes deliberate stops from system interruptions.
 * - Surfaces recoverable speech-recognition errors to the UI.
 *
 * This hook owns browser recognition state only. Transcript assembly and
 * synchronisation with the journal value are handled by
 * `useSpeechToTextController`.
 *
 * @param options Optional callbacks for consuming completed speech.
 * @returns Speech recognition state, capability flags and control functions.
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

  // Browsers may emit the same final transcript multiple times.
  // Forward each completed utterance only once to prevent duplicate
  // journal content.
  useEffect(() => {
    const nextFinalTranscript = finalTranscript.trim();

    if (!nextFinalTranscript || nextFinalTranscript === lastFinalTranscriptRef.current) return;

    lastFinalTranscriptRef.current = nextFinalTranscript;
    onFinalTranscript?.(nextFinalTranscript);
  }, [finalTranscript, onFinalTranscript]);

  // Some browsers end a recognition session before delivering the final transcript.
  // Commit any remaining transcript once before restarting recognition.
  useEffect(() => {
    if (listening || !shouldAutoRestartRef.current) return;

    const pendingTranscript = [transcript, interimTranscript].filter(Boolean).join(' ').trim();

    if (!pendingTranscript || pendingTranscript === lastCommittedTranscriptRef.current) return;

    lastCommittedTranscriptRef.current = pendingTranscript;
    onFinalTranscript?.(pendingTranscript);
  }, [interimTranscript, listening, onFinalTranscript, transcript]);

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

      shouldAutoRestartRef.current = false;
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

  // Some browsers stop recognition after each utterance despite the user
  // remaining in recording mode. Restart listening after a short delay so
  // browser shutdown completes before requesting another session.
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    // If the user is actively recording, the recognizer should be listening.
    if (listening || !shouldAutoRestartRef.current || document.hidden) {
      if (restartTimeoutRef.current !== null) {
        window.clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      return;
    }

    // Re-check runtime state at execution time because user/app state can
    // change during the delay (manual stop, backgrounding, or restart disable).
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
    // Clear any state from a previous recording session.
    setSpeechError(null);
    setWasInterruptedBySystem(false);
    lastCommittedTranscriptRef.current = '';
    isManualStopRef.current = false;
    shouldAutoRestartRef.current = true;
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
    // Mark the stop as intentional before calling the browser API so
    // interruption handlers do not treat it as an unexpected shutdown.
    isManualStopRef.current = true;
    shouldAutoRestartRef.current = false;
    setIsRecording(false);

    // Cancel any pending automatic restart so recording remains stopped.
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
    isRecognitionActive: listening,
    isSupported: browserSupportsSpeechRecognition,
    supportsContinuousListening: browserSupportsContinuousListening,
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
