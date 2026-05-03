import { renderHook } from '@testing-library/react';
import { useAudio } from './useAudio';
import { describe, it, expect, vi } from 'vitest';

describe('useAudio Hook', () => {
  it('should return a playBeep function', () => {
    const { result } = renderHook(() => useAudio());
    expect(typeof result.current.playBeep).toBe('function');
  });

  it('handles AudioContext gracefully if not available', () => {
    const originalAudioContext = window.AudioContext;
    delete window.AudioContext;
    delete window.webkitAudioContext;

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useAudio());

    // Should not throw, should just console.warn
    expect(() => result.current.playBeep()).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();

    // Restore
    window.AudioContext = originalAudioContext;
    consoleSpy.mockRestore();
  });
});
