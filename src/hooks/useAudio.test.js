import { renderHook, act } from '@testing-library/react';
import { useAudio } from './useAudio';
import { describe, it, expect, vi } from 'vitest';

// Mock AudioContext for JSDOM
class MockAudioContext {
  createOscillator() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
    };
  }
  createGain() {
    return {
      connect: vi.fn(),
      gain: { setValueAtTime: vi.fn() },
    };
  }
  close() { return Promise.resolve(); }
  get currentTime() { return 0; }
  get destination() { return {}; }
}

window.AudioContext = MockAudioContext;
window.webkitAudioContext = MockAudioContext;

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

  it('playBeep attempts to play a sound via Web Audio API and cleans up', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAudio());
    
    expect(() => result.current.playBeep()).not.toThrow();
    
    // Advance timers to hit the cleanup logic (stop and close)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
  });

  it('handles playback errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Force an error by mocking AudioContext to throw
    const originalAudioContext = window.AudioContext;
    window.AudioContext = class {
      constructor() { throw new Error('Audio locked'); }
    };

    const { result } = renderHook(() => useAudio());
    result.current.playBeep();
    
    expect(consoleSpy).toHaveBeenLastCalledWith(
      expect.stringContaining('Audio playback failed'),
      'Audio locked'
    );
    
    window.AudioContext = originalAudioContext;
    consoleSpy.mockRestore();
  });
});
