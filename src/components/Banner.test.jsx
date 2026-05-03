import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders warning banner by default', () => {
    render(<Banner message="Warning message" />);
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('renders error banner', () => {
    render(<Banner message="Error message" type="error" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
