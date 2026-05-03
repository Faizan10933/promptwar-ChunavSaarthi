import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders correctly with required links', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>,
    );

    // Hero texts
    expect(screen.getByText(/AI-Powered Election Education Platform/i)).toBeInTheDocument();

    // Primary CTAs should be present (there are multiple links with these names)
    const askLinks = screen.getAllByRole('link', { name: /Ask Saarthi AI/i });
    const mccLinks = screen.getAllByRole('link', { name: /Check MCC Violation/i });

    expect(askLinks.length).toBeGreaterThan(0);
    expect(mccLinks.length).toBeGreaterThan(0);
  });
});
