import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useLocation } from 'react-router-dom';
import InvoicePreview from '../../../features/invoice/InvoicePreview.tsx';
import { useDocument } from '../../../context/DocumentContext.tsx';
import type { Invoice } from '../../../context/DocumentContext.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedInvoice: Invoice = {
  clientName: 'Acme Corporation',
  clientEmail: 'billing@acme.example',
  clientAddress: '42 Market Street, Cape Town',
  invoiceNumber: 'INV-2042',
  invoiceDate: '2026-09-28',
  taxRate: 15,
  items: [
    { description: 'Consulting', quantity: 2, unitPrice: 125 },
    { description: 'Research', quantity: 3, unitPrice: 50 },
  ],
};

const renderPreview = (initialEntries = ['/invoice-preview']) =>
  renderWithProviders(<InvoicePreview />, { route: initialEntries[0] });

const InvoiceSeed = () => {
  const { document, setDocument } = useDocument();

  return (
    <>
      <button
        type="button"
        onClick={() => setDocument({ ...document, invoice: populatedInvoice })}
      >
        Load invoice data
      </button>
      <InvoicePreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('InvoicePreview rendering', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the invoice preview, table headings, and download action', () => {
    renderPreview();

    expect(screen.getByRole('heading', { name: /live invoice preview/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'FLIGHT BRIEF' })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download pdf invoice/i })).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Description' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Unit Price' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
  });

  test('shows N/A placeholders and zero totals for empty invoice details', () => {
    renderPreview();

    expect(screen.getAllByText('N/A')).toHaveLength(4);
    expect(screen.getByText('Tax (0%)')).toBeInTheDocument();
    expect(screen.getAllByText('R 0.00')).toHaveLength(5);
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2);
  });

  test('applies the current light or dark theme to the page and navigation', () => {
    const { container } = renderPreview();
    expect(container.querySelector('.min-h-screen')).toHaveClass('bg-blue-50', 'text-slate-800');
    expect(screen.getByRole('navigation')).toHaveClass('bg-white/90', 'border-slate-200');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderPreview();

    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-blue-950', 'text-slate-100');
    expect(screen.getByRole('navigation')).toHaveClass('bg-slate-900/90', 'border-slate-700');
  });
});

describe('InvoicePreview data flow', () => {
  afterEach(cleanup);

  test('renders invoice fields, line items, and calculated totals from document context', () => {
    renderWithProviders(<InvoiceSeed />);

    fireEvent.click(screen.getByRole('button', { name: 'Load invoice data' }));

    expect(screen.getByText('INV-2042')).toBeInTheDocument();
    expect(screen.getByText('2026-09-28')).toBeInTheDocument();
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('billing@acme.example')).toBeInTheDocument();
    expect(screen.getByText('42 Market Street, Cape Town')).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(within(table).getByText('Consulting')).toBeInTheDocument();
    expect(within(table).getByText('Research')).toBeInTheDocument();
    expect(within(table).getByText('R 125.00')).toBeInTheDocument();
    expect(within(table).getByText('R 250.00')).toBeInTheDocument();
    expect(within(table).getByText('R 50.00')).toBeInTheDocument();
    expect(within(table).getByText('R 150.00')).toBeInTheDocument();

    expect(screen.getByText('Subtotal').parentElement).toHaveTextContent('R 400.00');
    expect(screen.getByText('Tax (15%)').parentElement).toHaveTextContent('R 60.00');
    expect(screen.getByText('Total Due').parentElement).toHaveTextContent('R 460.00');
  });
});

describe('InvoicePreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the invoice builder', async () => {
    renderWithProviders(<><InvoicePreview /><LocationObserver /></>, { route: '/invoice-preview' });

    fireEvent.click(screen.getByRole('button', { name: /back to builder/i }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/invoice-builder'));
  });

  test('exports the invoice section to a PDF when the download button is clicked', async () => {
    renderPreview();

    fireEvent.click(screen.getByRole('button', { name: /download pdf invoice/i }));

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('invoice-section', 'invoice'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/pdf export failed/i)).not.toBeInTheDocument();
  });

  test('shows a readable error when PDF export fails', async () => {
    mockExportPDF.mockRejectedValueOnce(new Error('Canvas unavailable'));
    renderPreview();

    fireEvent.click(screen.getByRole('button', { name: /download pdf invoice/i }));

    expect(await screen.findByText('PDF export failed: Canvas unavailable')).toBeInTheDocument();
  });

  test('automatically exports once for download=1 and removes the query parameter', async () => {
    renderWithProviders(<><InvoicePreview /><LocationObserver /></>, { route: '/invoice-preview?download=1' });

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('invoice-section', 'invoice'));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/invoice-preview'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});