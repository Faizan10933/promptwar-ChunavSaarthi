import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AskSaarthiPage from './AskSaarthiPage';
import * as gemini from '../lib/gemini';
import * as firebase from '../lib/firebase';

// Mock the libraries
vi.mock('../lib/gemini', () => ({
  chatWithSaarthi: vi.fn().mockResolvedValue('Mocked Response'),
  isAPIKeyConfigured: vi.fn().mockReturnValue(true),
}));

vi.mock('../lib/firebase', () => ({
  logToFirestore: vi.fn().mockResolvedValue('mock-id'),
  trackEvent: vi.fn(),
  isFirebaseConfigured: vi.fn().mockReturnValue(true),
}));

describe('AskSaarthiPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with welcome message', () => {
    render(<AskSaarthiPage />);
    expect(screen.getByText(/Namaste!/i)).toBeInTheDocument();
  });

  it('sends a message and displays the response', async () => {
    render(<AskSaarthiPage />);
    
    const input = screen.getByPlaceholderText(/Ask anything/i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(input, { target: { value: 'What is EVM?' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('What is EVM?')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Mocked Response')).toBeInTheDocument();
    });

    expect(gemini.chatWithSaarthi).toHaveBeenCalledWith('What is EVM?', expect.any(Array));
  });

  it('handles feedback clicks', async () => {
    render(<AskSaarthiPage />);
    
    // Send a message first to get a response with feedback buttons
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    const helpfulButton = await screen.findByRole('button', { name: /^Helpful$/i });
    fireEvent.click(helpfulButton);

    expect(firebase.logToFirestore).toHaveBeenCalledWith('chat_feedback', expect.objectContaining({
      isHelpful: true
    }));
    expect(screen.getByText(/Thanks for the feedback/i)).toBeInTheDocument();
  });

  it('sends message when suggestion chip is clicked', async () => {
    render(<AskSaarthiPage />);
    
    const suggestion = screen.getAllByRole('button')[0]; // First suggestion chip
    const suggestionText = suggestion.textContent;
    
    fireEvent.click(suggestion);
    
    expect(screen.getByText(suggestionText)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Mocked Response')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(gemini.chatWithSaarthi).mockRejectedValueOnce(new Error('API Failure'));
    
    render(<AskSaarthiPage />);
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(input, { target: { value: 'Error Test' } });
    fireEvent.click(screen.getByRole('button', { name: /Send/i }));

    await waitFor(() => {
      expect(screen.getByText(/⚠️ Error: API Failure/i)).toBeInTheDocument();
    });
  });
});
