import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useLocation } from 'react-router-dom';
import PurchaseOrderPreview from '../../../features/purchaseOrder/PurchaseOrderPreview.tsx';
import { useDocument } from '../../../context/DocumentContext.tsx';
import type { PurchaseOrder } from '../../../context/DocumentContext.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedPurchaseOrder: PurchaseOrder = {
  poNumber: 'PO-2025-090',
  issueDate: '2025-09-01',
  requiredBy: '2025-09-20',
  currency: 'ZAR',
  buyerCompany: 'Northstar Studio',
  buyerContact: 'Jane Smith',
  buyerEmail: 'procurement@northstar.example',
  buyerAddress: '123 Example Road, Sandton',
  vendorName: 'Alpha Supply',
  vendorContact: 'Michael Lee',
  vendorEmail: 'sales@alphasupply.co.za',
  vendorAddress: '99 Supplier Park, Midrand',
  items: [
    { description: 'Monitor 27"', quantity: 2, unit: 'Each', unitPrice: 5000, total: 10000 },
    { description: 'USB-C cable', quantity: 5, unit: 'Each', unitPrice: 180, total: 900 },
  ],
  vatRate: 15,
  paymentTerms: '30 days net',
  notes: 'Please reference PO-2025-090 on invoice.',
};

const renderPurchaseOrderPreview = (initialEntries = ['/purchase-order-preview']) =>
  renderWithProviders(<PurchaseOrderPreview />, { route: initialEntries[0] });

const PurchaseOrderSeed = ({ purchaseOrder = populatedPurchaseOrder }: { purchaseOrder?: PurchaseOrder }) => {
  const { document, setDocument } = useDocument();
  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, purchaseOrder })}>Load purchase order data</button>
      <PurchaseOrderPreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('PurchaseOrderPreview rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the PO document header and totals', () => {
    renderPurchaseOrderPreview();

    expect(screen.getByText('Purchase Order')).toBeInTheDocument();
    expect(screen.getAllByText('Nexus Solutions Inc.')[0]).toBeInTheDocument();
    expect(screen.getAllByText('TechSupply Co.')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /download pdf/i })[0]).toBeInTheDocument();
  });

  test('applies the light and dark themes', () => {
    const lightRender = renderPurchaseOrderPreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#f0f4ff]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderPurchaseOrderPreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-indigo-950');
  });
});

describe('PurchaseOrderPreview data flow', () => {
  afterEach(cleanup);

  test('renders the seeded purchase order data from context', () => {
    renderWithProviders(<PurchaseOrderSeed />);

    fireEvent.click(screen.getByRole('button', { name: 'Load purchase order data' }));

    expect(screen.getAllByText('Northstar Studio')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Alpha Supply')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Monitor 27"')[0]).toBeInTheDocument();
    expect(screen.getByText(/Please reference PO-2025-090 on invoice\./i)).toBeInTheDocument();
  });
});

describe('PurchaseOrderPreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the builder', async () => {
    renderWithProviders(<><PurchaseOrderPreview /><LocationObserver /></>, { route: '/purchase-order-preview' });

    fireEvent.click(screen.getAllByRole('button')[0]);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/purchase-order-builder'));
  });

  test('exports the purchase order PDF', async () => {
    renderPurchaseOrderPreview();

    fireEvent.click(screen.getAllByRole('button', { name: /download pdf/i })[0]);

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('purchaseorder-section', 'purchase-order'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});
