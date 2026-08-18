import type { CSSProperties } from 'react';

// Varied delay/amplitude per bar gives the waveform an organic, non-uniform pulse.
const WAVE_BARS = [
  { delay: 0, min: 0.35, max: 0.9, duration: 900 },
  { delay: 120, min: 0.3, max: 1, duration: 1100 },
  { delay: 240, min: 0.4, max: 0.75, duration: 950 },
  { delay: 60, min: 0.3, max: 1, duration: 1050 },
  { delay: 180, min: 0.35, max: 0.85, duration: 1000 },
];

/** Renders an animated waveform indicating active voice recording. */
export function SpeechWaveBars() {
  return (
    <div className="flex h-5 flex-1 items-center justify-center gap-1" aria-hidden="true">
      {WAVE_BARS.map((bar, index) => (
        <span
          key={index}
          className="speech-wave-bar w-5 rounded-full bg-primary sm:w-1.5"
          style={
            {
              height: '100%',
              '--speech-wave-delay': `${bar.delay}ms`,
              '--speech-wave-min': bar.min,
              '--speech-wave-max': bar.max,
              '--speech-wave-duration': `${bar.duration}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
