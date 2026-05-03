import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import VoterGuidePage from './VoterGuidePage';

// Mock the hooks
vi.mock('../hooks/usePageView', () => ({
  usePageView: vi.fn(),
}));

describe('VoterGuidePage', () => {
  it('renders the page title and subtitle', () => {
    render(
      <BrowserRouter>
        <VoterGuidePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Complete Voter Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Everything you need to know/i)).toBeInTheDocument();
  });

  it('renders the voter journey steps', () => {
    render(
      <BrowserRouter>
        <VoterGuidePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Interactive Voter Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Register/i)).toBeInTheDocument();
  });

  it('renders the election timeline', () => {
    render(
      <BrowserRouter>
        <VoterGuidePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Election Process Timeline/i)).toBeInTheDocument();
    expect(screen.getByText('Announcement')).toBeInTheDocument();
    expect(screen.getAllByText(/Counting/i).length).toBeGreaterThan(0);
  });
});
