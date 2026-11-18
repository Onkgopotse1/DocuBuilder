import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { useLocation } from 'react-router-dom';
import DeliveryNoteBuilder from '../../../features/deliveryNote/DeliveryNoteBuilder.tsx';
import { useDocument } from '../../../context/DocumentContext.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

const DeliveryNoteStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="delivery-note-state">{JSON.stringify(document.deliveryNote)}</output>;
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('DeliveryNoteBuilder rendering', () => {
  afterEach(cleanup);

  test('renders document details, dispatched items, carrier fields, and navigation actions', () => {
    renderWithProviders(<DeliveryNoteBuilder />);

    expect(screen.getByRole('heading', { name: 'Delivery Note' })).toBeInTheDocument();
    expect(screen.getByText('Document Info')).toBeInTheDocument();
    expect(screen.getByText('Dispatched From')).toBeInTheDocument();
    expect(screen.getByText('Deliver To')).toBeInTheDocument();
    expect(screen.getByText('Items Dispatched')).toBeInTheDocument();
    expect(screen.getByText('Carrier / Driver')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });
});

describe('DeliveryNoteBuilder data flow', () => {
  afterEach(cleanup);

  test('updates delivery details and item fields in shared document state', () => {
    renderWithProviders(<><DeliveryNoteBuilder /><DeliveryNoteStateObserver /></>);

    fireEvent.change(screen.getByPlaceholderText('DN-2025-001'), { target: { value: 'DN-2025-090' } });
    fireEvent.change(screen.getByPlaceholderText('Customer name'), { target: { value: 'Northstar Logistics' } });
    fireEvent.change(screen.getAllByPlaceholderText('Full name')[0], { target: { value: 'Alex Morgan' } });
    fireEvent.change(screen.getAllByPlaceholderText('Item name or description')[0], { target: { value: 'Steel brackets' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '4' } });
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'Pallet' } });
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'Used' } });

    const deliveryNote = JSON.parse(screen.getByTestId('delivery-note-state').textContent ?? '{}');
    expect(deliveryNote).toMatchObject({
      dnNumber: 'DN-2025-090',
      deliverToCompany: 'Northstar Logistics',
      dispatchedFromContact: 'Alex Morgan',
    });
    expect(deliveryNote.items[0]).toEqual({
      description: 'Steel brackets',
      quantity: 4,
      unit: 'Pallet',
      condition: 'Used',
    });
  });

  test('adds a new item and stores its default values', async () => {
    renderWithProviders(<><DeliveryNoteBuilder /><DeliveryNoteStateObserver /></>);

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));

    await waitFor(() => {
      const deliveryNote = JSON.parse(screen.getByTestId('delivery-note-state').textContent ?? '{}');
      expect(deliveryNote.items).toHaveLength(3);
      expect(deliveryNote.items[2]).toEqual({ description: '', quantity: 1, unit: 'Each', condition: 'New' });
    });
  });
});

describe('DeliveryNoteBuilder integration', () => {
  afterEach(cleanup);

  test('navigates to preview and download routes', async () => {
    renderWithProviders(<><DeliveryNoteBuilder /><LocationObserver /></>);

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/delivery-note-preview'));

    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/delivery-note-preview?download=1'));
  });
});