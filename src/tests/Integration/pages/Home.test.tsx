import { describe, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Home from '../../../pages/Home.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

describe('Home page rendering', () => {
  test('renders the DocuBuilder logo', () => {
    renderWithProviders(<Home />);

    const logo = screen.getByAltText('DocuBuilder');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('doc.png'));
  });

  test('renders the topbar title', () => {
    renderWithProviders(<Home />);

    expect(screen.getByRole('heading', { name: 'DocuBuilder' })).toBeInTheDocument();
  });
});