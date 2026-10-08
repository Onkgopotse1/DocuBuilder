import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useLocation } from 'react-router-dom';
import Settings from '../../../features/settings/Settings.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

function CurrentSearch() {
  const { search } = useLocation();
  return <output data-testid="current-search">{search}</output>;
}

describe('About panel', () => {
  test('renders product version, description, and technology stack', () => {
    renderWithProviders(<Settings />, { route: '/settings?tab=about' });

    expect(screen.getByRole('heading', { name: 'About DocuBuilder' })).toBeInTheDocument();
    expect(screen.getByText('DocuBuilder v2.0')).toBeInTheDocument();
    expect(screen.getByText('Version:').parentElement).toHaveTextContent('2.0.0');
    expect(screen.getByText('Built with:').parentElement).toHaveTextContent(
      'React, TypeScript, Tailwind CSS, html2canvas, jsPDF'
    );
    expect(screen.getByText(/A complete document toolkit for professionals/)).toBeInTheDocument();
  });

  test('navigates to About when its tab is selected', () => {
    renderWithProviders(
      <>
        <Settings />
        <CurrentSearch />
      </>,
      { route: '/settings?tab=settings' }
    );

    fireEvent.click(screen.getByRole('button', { name: 'about' }));

    expect(screen.getByRole('heading', { name: 'About DocuBuilder' })).toBeInTheDocument();
    expect(screen.getByTestId('current-search')).toHaveTextContent('?tab=about');
  });
});