import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import QuoteBuilder from '../../features/quote/QuoteBuilder';
import QuotePreview from '../../features/quote/QuotePreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import type { Quote } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderQuoteBuilder = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          <QuoteBuilder />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const QuoteStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="quote-state">{JSON.stringify(document.quote)}</output>;
};

const QuoteFlowHarness = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowPreview((current) => !current)}>
        {showPreview ? 'Return to builder' : 'Open preview'}
      </button>
      {showPreview ? <QuotePreview /> : <QuoteBuilder />}
    </>
  );
};

describe('QuoteBuilder rendering', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders navigation, quote sections, and primary actions', () => {
    renderQuoteBuilder();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /quotegen/i })).toBeInTheDocument();
    expect(screen.getByText('Drafting Mode')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /live preview/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Your Company' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quote Details' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Client Information' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Line Items' })).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate quote pdf/i })).toBeInTheDocument();
  });

  test('renders default company, client, quote, terms, and line-item values', () => {
    const { container } = renderQuoteBuilder();

    expect(screen.getByPlaceholderText('Company name')).toHaveValue('');
    expect(screen.getByPlaceholderText('hello@nexus-solutions.com')).toHaveValue('');
    expect(screen.getByPlaceholderText('123 Business Blvd, Suite 400, Austin, TX')).toHaveValue('');
    expect(screen.getByPlaceholderText('Quote #')).toHaveValue('');
    expect(screen.getByPlaceholderText('Client Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Client Email')).toHaveValue('');
    expect(screen.getByPlaceholderText('Client Address')).toHaveValue('');
    expect(screen.getByPlaceholderText('All services subject to standard terms.')).toHaveValue('');

    const dateInputs = container.querySelectorAll('input[type="date"]');
    expect(dateInputs).toHaveLength(2);
    expect(dateInputs[0]).toHaveValue(new Date().toISOString().slice(0, 10));
    expect(dateInputs[1]).toHaveValue(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));

    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(within(rows[1]).getByPlaceholderText('Item description')).toHaveValue('');
    expect(within(rows[1]).getAllByRole('spinbutton')[0]).toHaveValue(1);
    expect(within(rows[1]).getAllByRole('spinbutton')[1]).toHaveValue(0);
  });

  test('renders line-item columns and the fixed 15 percent tax summary', () => {
    renderQuoteBuilder();

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Description' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Price (R)' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Total' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quote Summary' })).toBeInTheDocument();
    expect(screen.getByText('Tax (15%)')).toBeInTheDocument();
    expect(screen.getAllByText('R 0.00')).toHaveLength(4);
  });

  test('applies the light and persisted dark theme classes', () => {
    const lightRender = renderQuoteBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-violet-50', 'text-slate-800');
    expect(screen.getByRole('navigation')).toHaveClass('bg-white/70', 'border-slate-200/50');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderQuoteBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-violet-950', 'text-slate-100');
    expect(screen.getByRole('navigation')).toHaveClass('bg-violet-950', 'border-slate-700');
  });
});

describe('QuoteBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates home, to preview, and to the preview download flow', () => {
    renderQuoteBuilder();

    fireEvent.click(screen.getByTitle('Back to Home'));
    expect(mockNavigate).toHaveBeenLastCalledWith('/');

    fireEvent.click(screen.getByRole('button', { name: /live preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/quote-preview');

    fireEvent.click(screen.getByRole('button', { name: /generate quote pdf/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/quote-preview?download=2');
    expect(mockNavigate).toHaveBeenCalledTimes(3);
  });
});

describe('QuoteBuilder data flow', () => {
  afterEach(cleanup);

  test('updates all quote detail fields in document context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <QuoteBuilder />
            <QuoteStateObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Company name'), { target: { value: 'Northstar Studio' } });
    fireEvent.change(screen.getByPlaceholderText('hello@nexus-solutions.com'), { target: { value: 'hello@northstar.example' } });
    fireEvent.change(screen.getByPlaceholderText('123 Business Blvd, Suite 400, Austin, TX'), { target: { value: '8 Harbour Road' } });
    fireEvent.change(screen.getByPlaceholderText('Quote #'), { target: { value: 'Q-2042' } });
    fireEvent.change(screen.getByPlaceholderText('Client Name'), { target: { value: 'Acme Ltd' } });
    fireEvent.change(screen.getByPlaceholderText('Client Email'), { target: { value: 'accounts@acme.example' } });
    fireEvent.change(screen.getByPlaceholderText('Client Address'), { target: { value: '15 Hill Street' } });
    fireEvent.change(screen.getByPlaceholderText('All services subject to standard terms.'), { target: { value: 'Valid for 30 days.' } });

    const quote = JSON.parse(screen.getByTestId('quote-state').textContent ?? '{}') as Quote;
    expect(quote).toMatchObject({
      companyName: 'Northstar Studio',
      companyEmail: 'hello@northstar.example',
      companyAddress: '8 Harbour Road',
      quoteNumber: 'Q-2042',
      clientName: 'Acme Ltd',
      clientEmail: 'accounts@acme.example',
      clientAddress: '15 Hill Street',
      terms: 'Valid for 30 days.',
    });
  });

  test('updates dates and line items and recalculates the fixed-tax totals', () => {
    renderQuoteBuilder();

    const dateInputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
    fireEvent.change(dateInputs[0], { target: { value: '2026-10-01' } });
    fireEvent.change(dateInputs[1], { target: { value: '2026-11-01' } });

    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    fireEvent.change(within(itemRow).getByPlaceholderText('Item description'), { target: { value: 'Design work' } });
    const [quantityInput, priceInput] = within(itemRow).getAllByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.change(priceInput, { target: { value: '100' } });

    expect(screen.getAllByText('R 200.00')).toHaveLength(2);
    expect(screen.getByText('Tax (15%)').parentElement).toHaveTextContent('R 30.00');
    expect(screen.getByText('Total Amount').parentElement).toHaveTextContent('R 230.00');

    const addButton = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addButton);
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(3);

    const secondItemRow = rows[2];
    fireEvent.change(within(secondItemRow).getByPlaceholderText('Item description'), { target: { value: 'Copywriting' } });
    const [secondQuantity, secondPrice] = within(secondItemRow).getAllByRole('spinbutton');
    fireEvent.change(secondQuantity, { target: { value: '3' } });
    fireEvent.change(secondPrice, { target: { value: '40' } });

    expect(screen.getAllByText('R 320.00')).toHaveLength(1);
    expect(screen.getByText('Tax (15%)').parentElement).toHaveTextContent('R 48.00');
    expect(screen.getByText('Total Amount').parentElement).toHaveTextContent('R 368.00');

    fireEvent.click(within(secondItemRow).getByRole('button', { name: '✕' }));
    const remainingRows = within(screen.getByRole('table')).getAllByRole('row');
    expect(remainingRows).toHaveLength(2);
    expect(within(remainingRows[1]).getByText('R 200.00')).toBeInTheDocument();
    expect(screen.getByText('Subtotal').parentElement).toHaveTextContent('R 200.00');
    expect(screen.getByText('Total Amount').parentElement).toHaveTextContent('R 230.00');
  });

  test('preserves builder edits when switching into the quote preview', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <QuoteFlowHarness />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Company name'), { target: { value: 'Northstar Studio' } });
    fireEvent.change(screen.getByPlaceholderText('Quote #'), { target: { value: 'Q-2042' } });
    fireEvent.change(screen.getByPlaceholderText('Client Name'), { target: { value: 'Acme Ltd' } });
    fireEvent.change(screen.getByPlaceholderText('Item description'), { target: { value: 'Design work' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '2' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '100' } });

    fireEvent.click(screen.getByRole('button', { name: 'Open preview' }));

    expect(screen.getByRole('heading', { name: 'Northstar Studio' })).toBeInTheDocument();
    expect(screen.getByText('# Q-2042')).toBeInTheDocument();
    expect(screen.getByText('Acme Ltd')).toBeInTheDocument();
    expect(screen.getByText('Design work')).toBeInTheDocument();
    expect(screen.getByText('R 230.00')).toBeInTheDocument();
  });
});