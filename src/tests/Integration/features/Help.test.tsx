import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useLocation } from 'react-router-dom';
import Settings from '../../../features/settings/Settings.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

function CurrentSearch() {
  const { search } = useLocation();
  return <output data-testid="current-search">{search}</output>;
}

describe('Help panel', () => {
  test('renders getting-started guidance and frequently asked questions', () => {
    renderWithProviders(<Settings />, { route: '/settings?tab=help' });

    expect(screen.getByRole('heading', { name: 'Help & Support' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Getting Started/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Frequently Asked Questions/ })).toBeInTheDocument();
    expect(screen.getByText(/Choose a document type from the Home screen/)).toBeInTheDocument();
    expect(screen.getByText(/Can I edit a document after downloading\?/)).toBeInTheDocument();
  });

  test('navigates to Help when its tab is selected', () => {
    renderWithProviders(
      <>
        <Settings />
        <CurrentSearch />
      </>,
      { route: '/settings?tab=settings' }
    );

    fireEvent.click(screen.getByRole('button', { name: 'help' }));

    expect(screen.getByRole('heading', { name: 'Help & Support' })).toBeInTheDocument();
    expect(screen.getByTestId('current-search')).toHaveTextContent('?tab=help');
  });
});