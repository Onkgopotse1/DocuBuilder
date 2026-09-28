import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import QuotePreview from '../../features/quote/QuotePreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import type { Quote } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedQuote: Quote = {
  companyName: 'Northstar Studio',
  companyEmail: 'hello@northstar.example',
  companyAddress: '8 Harbour Road, Cape Town',
  quoteNumber: 'Q-2042',
  issueDate: '2026-09-28',
  expiryDate: '2026-10-28',
  clientName: 'Acme Ltd',
  clientEmail: 'accounts@acme.example',
  clientAddress: '15 Hill Street, Johannesburg',
  items: [
    { description: 'Design work', quantity: 2, unitPrice: 125 },
    { description: 'Copywriting', quantity: 3, unitPrice: 50 },
  ],
  terms: 'Valid for 30 days.',
};

const renderQuotePreview = (initialEntries = ['/quote-preview']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <DocumentProvider>
          <QuotePreview />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const QuoteSeed = ({ quote = populatedQuote }: { quote?: Quote }) => {
  const { document, setDocument } = useDocument();

  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, quote })}>
        Load quote data
      </button>
      <QuotePreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('QuotePreview rendering', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders quote navigation, document, action sidebar, and quick stats', () => {
    renderQuotePreview();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Document Review')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quote' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ready to Send' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quick Stats' })).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Description' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Unit Price' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Total' })).toBeInTheDocument();
  });

  test('renders fallback content and totals for the default quote', () => {
    renderQuotePreview();

    expect(screen.getByRole('heading', { name: 'Company Name' })).toBeInTheDocument();
    expect(screen.getByText('# Q-2025-XXXX')).toBeInTheDocument();
    expect(screen.getByText('Client Name')).toBeInTheDocument();
    expect(screen.getByText('client@example.com')).toBeInTheDocument();
    expect(screen.getByText('Company Address')).toBeInTheDocument();
    expect(screen.getByText('Client Address')).toBeInTheDocument();
    expect(screen.getByText('All services subject to standard terms. Payment due within 15 days of acceptance. This quote is valid until expiration date. Thank you for your business.')).toBeInTheDocument();
    expect(screen.getByText('Subtotal').parentElement).toHaveTextContent('R 0.00');
    expect(screen.getByText('Tax (15%)').parentElement).toHaveTextContent('R 0.00');
    expect(screen.getByText('Total Amount').parentElement).toHaveTextContent('R 0.00');
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  test('shows an empty-items message when a quote has no line items', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <QuoteSeed quote={{ ...populatedQuote, items: [] }} />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load quote data' }));

    expect(screen.getByText('No items added yet')).toBeInTheDocument();
    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('Subtotal').parentElement).toHaveTextContent('R 0.00');
    expect(screen.getByText('Tax (15%)').parentElement).toHaveTextContent('R 0.00');
    expect(screen.getByText('Total Amount').parentElement).toHaveTextContent('R 0.00');
  });

  test('applies persisted light and dark quote page themes', () => {
    const lightRender = renderQuotePreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-violet-50');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderQuotePreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-violet-950');
    expect(screen.getByRole('navigation')).toHaveStyle({ backgroundColor: 'rgba(15,23,42,0.85)' });
  });
});

describe('QuotePreview data flow', () => {
  afterEach(cleanup);

  test('renders quote fields, line items, 15 percent tax, and calculated totals from context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <QuoteSeed />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load quote data' }));

    expect(screen.getByRole('heading', { name: 'Northstar Studio' })).toBeInTheDocument();
    expect(screen.getByText('8 Harbour Road, Cape Town')).toBeInTheDocument();
    expect(screen.getByText('# Q-2042')).toBeInTheDocument();
    expect(screen.getByText('Acme Ltd')).toBeInTheDocument();
    expect(screen.getByText('accounts@acme.example')).toBeInTheDocument();
    expect(screen.getByText('15 Hill Street, Johannesburg')).toBeInTheDocument();
    expect(screen.getByText('Issued:').parentElement).toHaveTextContent('2026-09-28');
    expect(screen.getByText('Expires:').parentElement).toHaveTextContent('2026-10-28');
    expect(screen.getByText('Valid for 30 days.')).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(within(table).getByText('Design work')).toBeInTheDocument();
    expect(within(table).getByText('Copywriting')).toBeInTheDocument();
    expect(within(table).getByText('R 125.00')).toBeInTheDocument();
    expect(within(table).getByText('R 250.00')).toBeInTheDocument();
    expect(within(table).getByText('R 50.00')).toBeInTheDocument();
    expect(within(table).getByText('R 150.00')).toBeInTheDocument();
    expect(screen.getByText('Subtotal').parentElement).toHaveTextContent('R 400.00');
    expect(screen.getByText('Tax (15%)').parentElement).toHaveTextContent('R 60.00');
    expect(screen.getByText('Total Amount').parentElement).toHaveTextContent('R 460.00');
    expect(screen.getByText('02')).toBeInTheDocument();
  });
});

describe('QuotePreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the quote builder', async () => {
    render(
      <MemoryRouter initialEntries={['/quote-preview']}>
        <ThemeProvider>
          <DocumentProvider>
            <QuotePreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/quote-builder'));
  });

  test('exports the quote section when the PDF download button is clicked', async () => {
    renderQuotePreview();

    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }));

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('quote-section', 'quote'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/pdf export failed/i)).not.toBeInTheDocument();
  });

  test('shows an error when quote PDF export rejects', async () => {
    mockExportPDF.mockRejectedValueOnce(new Error('Canvas unavailable'));
    renderQuotePreview();

    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }));

    expect(await screen.findByText('PDF export failed: Canvas unavailable')).toBeInTheDocument();
  });

  test('automatically exports once for download=2 and removes the query parameter', async () => {
    render(
      <MemoryRouter initialEntries={['/quote-preview?download=2']}>
        <ThemeProvider>
          <DocumentProvider>
            <QuotePreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('quote-section', 'quote'));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/quote-preview'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });

  test('does not auto-export for the invoice download query value', async () => {
    render(
      <MemoryRouter initialEntries={['/quote-preview?download=1']}>
        <ThemeProvider>
          <DocumentProvider>
            <QuotePreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(mockExportPDF).not.toHaveBeenCalled();
    expect(screen.getByTestId('location')).toHaveTextContent('/quote-preview?download=1');
  });
});