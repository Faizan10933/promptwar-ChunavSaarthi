import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MCCCheckerPage from './MCCCheckerPage';
import * as gemini from '../lib/gemini';
import * as firebase from '../lib/firebase';

// Mock the libraries
vi.mock('../lib/gemini', () => ({
  checkMCCViolation: vi.fn().mockResolvedValue({
    is_violation: true,
    section: 'General Conduct',
    explanation: 'Test violation',
    confidence: 'high'
  }),
  isAPIKeyConfigured: vi.fn().mockReturnValue(true),
}));

vi.mock('../lib/firebase', () => ({
  logToFirestore: vi.fn().mockResolvedValue('mock-id'),
  trackEvent: vi.fn(),
  isFirebaseConfigured: vi.fn().mockReturnValue(true),
}));

describe('MCCCheckerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<MCCCheckerPage />);
    expect(screen.getByText(/MCC Violation Checker/i)).toBeInTheDocument();
  });

  it('does not submit when scenario is empty', async () => {
    render(<MCCCheckerPage />);
    const analyzeButton = screen.getByRole('button', { name: /Analyze Scenario/i });
    fireEvent.click(analyzeButton);
    expect(gemini.checkMCCViolation).not.toHaveBeenCalled();
  });

  it('submits a scenario and displays result', async () => {
    render(<MCCCheckerPage />);
    
    const textarea = screen.getByPlaceholderText(/Describe a scenario/i);
    const analyzeButton = screen.getByRole('button', { name: /Analyze Scenario/i });

    fireEvent.change(textarea, { target: { value: 'Candidate giving money' } });
    fireEvent.click(analyzeButton);

    expect(screen.getByText(/Analyzing/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/MCC Violation Detected/i)).toBeInTheDocument();
      expect(screen.getByText('Test violation')).toBeInTheDocument();
    });

    expect(gemini.checkMCCViolation).toHaveBeenCalledWith('Candidate giving money');
    expect(firebase.logToFirestore).toHaveBeenCalled();
  });

  it('loads example when suggestion chip is clicked', () => {
    render(<MCCCheckerPage />);
    
    const suggestion = screen.getAllByRole('button').find(b => b.className === 'suggestion-chip');
    fireEvent.click(suggestion);
    
    const textarea = screen.getByPlaceholderText(/Describe a scenario/i);
    expect(textarea.value).not.toBe('');
  });

  it('handles errors gracefully', async () => {
    vi.mocked(gemini.checkMCCViolation).mockRejectedValueOnce(new Error('Analysis Failed'));
    
    render(<MCCCheckerPage />);
    const textarea = screen.getByPlaceholderText(/Describe a scenario/i);
    fireEvent.change(textarea, { target: { value: 'Fail test' } });
    fireEvent.click(screen.getByRole('button', { name: /Analyze Scenario/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: Analysis Failed/i)).toBeInTheDocument();
    });
  });

  it('displays "No Violation Found" when appropriate', async () => {
    vi.mocked(gemini.checkMCCViolation).mockResolvedValueOnce({
      is_violation: false,
      explanation: 'All good'
    });
    
    render(<MCCCheckerPage />);
    const textarea = screen.getByPlaceholderText(/Describe a scenario/i);
    fireEvent.change(textarea, { target: { value: 'Valid scenario' } });
    fireEvent.click(screen.getByRole('button', { name: /Analyze Scenario/i }));

    await waitFor(() => {
      expect(screen.getByText(/No Violation Found/i)).toBeInTheDocument();
      expect(screen.getByText('All good')).toBeInTheDocument();
    });
  });
});
