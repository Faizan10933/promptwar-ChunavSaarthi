import { describe, it, expect, vi } from 'vitest';

// Stub environment to simulate missing config
vi.stubEnv('VITE_FIREBASE_API_KEY', '');

describe('Firebase Library (No Config)', () => {
  it('falls back to mock logging when config is missing', async () => {
    // Isolated import
    const { logToFirestore, trackEvent, isFirebaseConfigured } = await import('./firebase');
    
    expect(isFirebaseConfigured()).toBe(false);
    
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    
    const docId = await logToFirestore('test', { foo: 'bar' });
    expect(docId).toContain('mock-doc-id');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[Mock Firestore]'), expect.any(Object));
    
    trackEvent('test_event', { baz: 'qux' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[Mock Analytics]'), expect.any(Object));
    
    consoleSpy.mockRestore();
  });
});
