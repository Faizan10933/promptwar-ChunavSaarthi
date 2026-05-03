import { describe, it, expect, vi } from 'vitest';

// Stub the environment variable to be empty BEFORE importing the module
vi.stubEnv('VITE_GEMINI_API_KEY', '');

describe('Gemini Library (No Key)', () => {
  it('throws error when API key is missing', async () => {
    // We need to re-import the module to see the new env var value
    // but the singleton aiClient might already be initialized if imported elsewhere.
    // In vitest, each test file runs in isolation, so this should work.
    const { chatWithSaarthi, checkMCCViolation } = await import('./gemini');
    
    await expect(chatWithSaarthi('Hello')).rejects.toThrow('API key not configured');
    await expect(checkMCCViolation('Scenario')).rejects.toThrow('API key not configured');
  });
});
