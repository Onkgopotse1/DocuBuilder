import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ReceiptPreview from '../../features/receipt/ReceiptPreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import type { Receipt } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedReceipt: Receipt = {
  customerName: 'Acme Holdings',
  customerEmail: 'billing@acme.example',
  receiptNumber: 'RCT-2005',
  paymentDate: '2026-09-28',
  paymentMethod: 'Credit Card',
  memo: 'Thank you for your prompt payment.',
  taxRate: 15,
  items: [{ description: 'Design retainer', quantity: 2, unitPrice: 1200 }],
};

const renderReceiptPreview = (initialEntries = ['/receipt-preview']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <DocumentProvider>
          <ReceiptPreview />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const ReceiptSeed = ({ receipt = populatedReceipt }: { receipt?: Receipt }) => {
  const { document, setDocument } = useDocument();

  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, receipt })}>Load receipt data</button>
      <ReceiptPreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('ReceiptPreview rendering', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the receipt preview layout and default content', () => {
    renderReceiptPreview();

    expect(screen.getByText('Receipt')).toBeInTheDocument();
    expect(screen.getByText('Paid in Full')).toBeInTheDocument();
    expect(screen.getByText('BrightWave Marketing')).toBeInTheDocument();
    expect(screen.getByText('contact@brightwave.com')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /download pdf/i })[0]).toBeInTheDocument();
    expect(screen.getByText('Receipt Ready')).toBeInTheDocument();
  });

  test('applies the light and dark themes', () => {
    const lightRender = renderReceiptPreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-gradient-to-br', 'from-emerald-50/50');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderReceiptPreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-emerald-950');
  });
});

describe('ReceiptPreview data flow', () => {
  afterEach(cleanup);

  test('renders the populated receipt values from context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <ReceiptSeed />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load receipt data' }));

    expect(screen.getByText('Acme Holdings')).toBeInTheDocument();
    expect(screen.getByText('billing@acme.example')).toBeInTheDocument();
    expect(screen.getByText('# RCT-2005')).toBeInTheDocument();
    expect(screen.getByText('Design retainer')).toBeInTheDocument();
    expect(screen.getAllByText('R 2400.00')[0]).toBeInTheDocument();
    expect(screen.getAllByText('R 2760.00')[0]).toBeInTheDocument();
  });
});

describe('ReceiptPreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the builder', async () => {
    render(
      <MemoryRouter initialEntries={['/receipt-preview']}>
        <ThemeProvider>
          <DocumentProvider>
            <ReceiptPreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/receipt-builder'));
  });

  test('exports the receipt section when the PDF button is clicked', async () => {
    renderReceiptPreview();

    fireEvent.click(screen.getAllByRole('button', { name: /download pdf/i })[0]);

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('receipt-section', 'receipt'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});
