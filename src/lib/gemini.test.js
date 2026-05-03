import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatWithSaarthi, checkMCCViolation, isAPIKeyConfigured } from './gemini';

// Mock the environment variables BEFORE module import via vi.mock
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      constructor() {
        this.models = {
          generateContent: vi.fn().mockResolvedValue({
            text: 'Mocked AI Response',
          }),
        };
      }
    },
  };
});

describe('Gemini Library', () => {
  beforeEach(() => {
    // Reset env vars and module state if needed
    vi.clearAllMocks();
  });

  it('checks if API key is configured', () => {
    // VITE_GEMINI_API_KEY is currently set in the build environment
    expect(typeof isAPIKeyConfigured()).toBe('boolean');
  });

  it('chatWithSaarthi returns text response', async () => {
    // Mock the env var internally for the test
    import.meta.env.VITE_GEMINI_API_KEY = 'test_key';
    
    const response = await chatWithSaarthi('Hello');
    expect(response).toBe('Mocked AI Response');
  });

  it('checkMCCViolation parses JSON properly or falls back', async () => {
    import.meta.env.VITE_GEMINI_API_KEY = 'test_key';
    
    const response = await checkMCCViolation('Candidate giving cash');
    // The mocked response is just plain text, so it falls back to the default object
    expect(response).toHaveProperty('is_violation');
    expect(response.is_violation).toBe(false);
    expect(response.explanation).toBe('Mocked AI Response');
  });
});
