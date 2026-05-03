/**
 * @fileoverview Custom hook for playing audio tones via the Web Audio API.
 * Used by the EVM simulator to play the voting confirmation beep.
 * @module hooks/useAudio
 */

import { useCallback } from 'react';
import { EVM_BEEP_FREQUENCY, EVM_BEEP_DURATION_MS, EVM_BEEP_VOLUME } from '../constants';

/**
 * Custom hook that provides a function to play an audio beep tone.
 * Uses the Web Audio API for cross-browser audio synthesis.
 *
 * @param {Object} [options] - Audio configuration options.
 * @param {number} [options.frequency=800] - Frequency in Hz.
 * @param {number} [options.duration=2000] - Duration in milliseconds.
 * @param {number} [options.volume=0.3] - Volume from 0.0 to 1.0.
 * @returns {{ playBeep: () => void }} Object containing the playBeep function.
 *
 * @example
 * const { playBeep } = useAudio({ frequency: 800, duration: 2000 });
 * playBeep(); // Plays an 800Hz tone for 2 seconds
 */
export function useAudio(options = {}) {
  const {
    frequency = EVM_BEEP_FREQUENCY,
    duration = EVM_BEEP_DURATION_MS,
    volume = EVM_BEEP_VOLUME,
  } = options;

  const playBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        ctx.close();
      }, duration);
    } catch (_error) {
      // Silently fail — audio is not critical to the voting simulation
      console.warn('Audio playback failed:', _error.message);
    }
  }, [frequency, duration, volume]);

  return { playBeep };
}
