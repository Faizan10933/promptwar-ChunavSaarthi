import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MythBusterPage from './MythBusterPage';
import { ELECTION_MYTHS } from '../constants';

describe('MythBusterPage', () => {
  it('renders all myths', () => {
    render(<MythBusterPage />);
    
    ELECTION_MYTHS.forEach(mythObj => {
      expect(screen.getByText(`"${mythObj.myth}"`)).toBeInTheDocument();
    });
  });

  it('expands a myth when clicked', () => {
    render(<MythBusterPage />);
    
    // The first myth's truth text
    const firstTruth = ELECTION_MYTHS[0].truth;
    
    // Find the container for the first truth text (it exists in DOM but is hidden by CSS or aria)
    const cards = screen.getAllByRole('listitem');
    const firstCard = cards[0];
    
    expect(firstCard).toHaveAttribute('aria-expanded', 'false');
    
    // Click it
    fireEvent.click(firstCard);
    
    // Should be expanded now
    expect(firstCard).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports keyboard interaction', () => {
    render(<MythBusterPage />);
    
    const cards = screen.getAllByRole('listitem');
    const firstCard = cards[0];
    
    expect(firstCard).toHaveAttribute('aria-expanded', 'false');
    
    // Press Enter
    fireEvent.keyDown(firstCard, { key: 'Enter', code: 'Enter' });
    expect(firstCard).toHaveAttribute('aria-expanded', 'true');
    
    // Press Space
    fireEvent.keyDown(firstCard, { key: ' ', code: 'Space' });
    expect(firstCard).toHaveAttribute('aria-expanded', 'false');
  });
});
