import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AskSaarthiPage from './AskSaarthiPage';
import * as gemini from '../lib/gemini';
import * as firebase from '../lib/firebase';

// Mock the libraries
vi.mock('../lib/gemini');
vi.mock('../lib/firebase');

describe('AskSaarthiPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    gemini.isAPIKeyConfigured.mockReturnValue(true);
    gemini.chatWithSaarthi.mockResolvedValue('Mocked Response');
    firebase.logToFirestore.mockResolvedValue('mock-id');
  });

  it('renders correctly with welcome message', () => {
    render(<AskSaarthiPage />);
    expect(screen.getByText(/Namaste!/)).toBeInTheDocument();
  });

  it('sends a message and displays the response', async () => {
    render(<AskSaarthiPage />);
    const input = screen.getByPlaceholderText(/Ask anything/);
    const sendButton = screen.getByText('Send');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'What is NOTA?' } });
      fireEvent.click(sendButton);
    });

    expect(screen.getByText('What is NOTA?')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Mocked Response')).toBeInTheDocument();
    });
  });

  it('handles feedback clicks', async () => {
    render(<AskSaarthiPage />);
    
    // Send a message first so we have an assistant reply to give feedback on
    const input = screen.getByPlaceholderText(/Ask anything/);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hi' } });
      fireEvent.click(screen.getByText('Send'));
    });

    await waitFor(() => screen.getByText('Mocked Response'));

    const helpfulBtn = screen.getByLabelText('Helpful');
    await act(async () => {
      fireEvent.click(helpfulBtn);
    });

    expect(firebase.logToFirestore).toHaveBeenCalledWith('chat_feedback', expect.any(Object));
    expect(screen.getByText('Thanks for the feedback!')).toBeInTheDocument();
  });

  it('sends message when suggestion chip is clicked', async () => {
    render(<AskSaarthiPage />);
    const suggestionText = 'What is the Model Code of Conduct?';
    const suggestion = screen.getByText(suggestionText);

    await act(async () => {
      fireEvent.click(suggestion);
    });

    expect(screen.getByText(suggestionText)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Mocked Response')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    gemini.chatWithSaarthi.mockRejectedValue(new Error('API Failure'));
    render(<AskSaarthiPage />);
    
    const input = screen.getByPlaceholderText(/Ask anything/);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Error test' } });
      fireEvent.click(screen.getByText('Send'));
    });

    await waitFor(() => {
      expect(screen.getByText(/⚠️ Error: API Failure/)).toBeInTheDocument();
    });
  });
});
