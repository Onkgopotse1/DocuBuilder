import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useLocation } from 'react-router-dom';
import DeliveryNotePreview from '../../../features/deliveryNote/DeliveryNotePreview.tsx';
import { useDocument } from '../../../context/DocumentContext.tsx';
import type { DeliveryNote } from '../../../context/DocumentContext.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedDeliveryNote: DeliveryNote = {
  dnNumber: 'DN-2025-090',
  date: '2025-09-01',
  poReference: 'PO-2025-090',
  invoiceReference: 'INV-2025-090',
  dispatchedFromCompany: 'Northstar Logistics',
  dispatchedFromContact: 'Alex Morgan',
  dispatchedFromPhone: '+27 11 555 0100',
  dispatchedFromAddress: '12 Example Road, Johannesburg',
  deliverToCompany: 'Acme Distribution',
  deliverToContact: 'Jamie Lee',
  deliverToPhone: '+27 11 555 0200',
  deliverToAddress: '99 Warehouse Lane, Sandton',
  items: [
    { description: 'Steel brackets', quantity: 4, unit: 'Box', condition: 'New' },
    { description: 'Packing material', quantity: 2, unit: 'Roll', condition: 'Used' },
  ],
  driverName: 'Taylor Reed',
  vehicleReg: 'GP 123 456',
  eta: '2025-09-02',
  instructions: 'Keep the shipment dry and call on arrival.',
};

const DeliveryNoteSeed = () => {
  const { document, setDocument } = useDocument();
  return (
    <>
      <button
        type="button"
        onClick={() => setDocument({ ...document, deliveryNote: populatedDeliveryNote })}
      >
        Load delivery note data
      </button>
      <DeliveryNotePreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('DeliveryNotePreview rendering', () => {
  afterEach(cleanup);

  test('renders the delivery note document and its default item summary', () => {
    renderWithProviders(<DeliveryNotePreview />);

    expect(screen.getByText('Delivery Note Preview')).toBeInTheDocument();
    expect(screen.getAllByText('Nexus Solutions Inc.')[0]).toBeInTheDocument();
    expect(screen.getByText('Steel brackets (box of 50)')).toBeInTheDocument();
    expect(screen.getByText('2 items · 3 units total')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument();
  });
});

describe('DeliveryNotePreview data flow', () => {
  afterEach(cleanup);

  test('renders delivery details, items, totals, and instructions from shared state', () => {
    renderWithProviders(<DeliveryNoteSeed />);

    fireEvent.click(screen.getByRole('button', { name: 'Load delivery note data' }));

    expect(screen.getAllByText('Northstar Logistics')[0]).toBeInTheDocument();
    expect(screen.getByText('Acme Distribution')).toBeInTheDocument();
    expect(screen.getByText('Driver: Taylor Reed')).toBeInTheDocument();
    expect(screen.getByText('Vehicle: GP 123 456')).toBeInTheDocument();
    expect(screen.getByText('Steel brackets')).toBeInTheDocument();
    expect(screen.getByText('Packing material')).toBeInTheDocument();
    expect(screen.getByText('2 items · 6 units total')).toBeInTheDocument();
    expect(screen.getByText('Keep the shipment dry and call on arrival.')).toBeInTheDocument();
  });
});

describe('DeliveryNotePreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the delivery note builder', async () => {
    renderWithProviders(<><DeliveryNotePreview /><LocationObserver /></>, { route: '/delivery-note-preview' });

    fireEvent.click(screen.getAllByRole('button')[0]);

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/delivery-note-builder'));
  });

  test('exports the delivery note PDF', async () => {
    renderWithProviders(<DeliveryNotePreview />);

    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }));

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('deliverynote-section', 'delivery-note'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});