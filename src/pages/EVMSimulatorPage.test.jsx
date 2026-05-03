import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EVMSimulatorPage from './EVMSimulatorPage';
import { VVPAT_DISPLAY_MS } from '../constants';

// Mock useAudio hook
vi.mock('../hooks/useAudio', () => ({
  useAudio: () => ({
    playBeep: vi.fn(),
  }),
}));

describe('EVMSimulatorPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders correctly with candidates', () => {
    render(<EVMSimulatorPage />);
    expect(screen.getByText(/EVM Simulator/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Vote for/i }).length).toBeGreaterThan(0);
  });

  it('casts a vote and shows VVPAT slip', () => {
    render(<EVMSimulatorPage />);
    
    const voteButtons = screen.getAllByRole('button', { name: /Vote for/i });
    fireEvent.click(voteButtons[0]);

    // Slip should be visible
    const slip = screen.getByText(/Verify your vote/i).parentElement.querySelector('.vvpat-slip');
    expect(slip).toBeInTheDocument();
  });

  it('hides VVPAT slip after 7 seconds and shows success message', () => {
    render(<EVMSimulatorPage />);
    
    const voteButtons = screen.getAllByRole('button', { name: /Vote for/i });
    fireEvent.click(voteButtons[0]);

    // Advance time by 7 seconds
    act(() => {
      vi.advanceTimersByTime(VVPAT_DISPLAY_MS);
    });

    // Success message should appear
    expect(screen.getByText(/Vote Cast Successfully/i)).toBeInTheDocument();
    
    // Slip should be hidden
    const slip = screen.getByText(/Verify your vote/i).parentElement.querySelector('.vvpat-slip');
    expect(slip).toHaveClass('hide');
  });

  it('resets the simulator when "Try Again" is clicked', () => {
    render(<EVMSimulatorPage />);
    
    const voteButtons = screen.getAllByRole('button', { name: /Vote for/i });
    fireEvent.click(voteButtons[0]);

    act(() => {
      vi.advanceTimersByTime(VVPAT_DISPLAY_MS);
    });

    const resetButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(resetButton);

    // Should be back to initial state
    expect(screen.queryByText(/Vote Cast Successfully/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Vote for/i })[0]).not.toBeDisabled();
  });
});
