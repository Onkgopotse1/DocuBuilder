import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Settings from '../../../features/settings/Settings.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

describe('Settings page', () => {
  describe('Rendering', () => {
    test('renders preferences and the available controls', () => {
      renderWithProviders(<Settings />, { route: '/settings' });

      expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument();
      expect(screen.getByText('Choose light or dark mode')).toBeInTheDocument();
      expect(screen.getByText('Default Currency')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Preferences' })).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    test('allows selecting a default currency', () => {
      renderWithProviders(<Settings />, { route: '/settings?tab=settings' });

      const currencySelect = screen.getByRole('combobox');
      expect(currencySelect).toHaveValue('ZAR');

      fireEvent.change(currencySelect, { target: { value: 'USD' } });

      expect(currencySelect).toHaveValue('USD');
    });
  });
});