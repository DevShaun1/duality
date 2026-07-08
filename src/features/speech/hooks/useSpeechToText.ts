import { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

type UseSpeechToTextOptions = {
  onFinalTranscript?: (transcript: string) => void;
};

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

  useEffect(() => {
    const nextFinalTranscript = finalTranscript.trim();

    if (!nextFinalTranscript || nextFinalTranscript === lastFinalTranscriptRef.current) return;

    lastFinalTranscriptRef.current = nextFinalTranscript;
    onFinalTranscript?.(nextFinalTranscript);
  }, [finalTranscript, onFinalTranscript]);

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-ZA',
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening: listening,
    isSupported: browserSupportsSpeechRecognition,
    supportsContinuousListening: browserSupportsContinuousListening,
    startListening,
    stopListening,
    resetTranscript,
  };
}
