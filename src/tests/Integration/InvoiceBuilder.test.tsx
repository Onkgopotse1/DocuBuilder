import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import InvoiceBuilder from '../../features/invoice/InvoiceBuilder';
import { DocumentProvider } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderInvoiceBuilder = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          <InvoiceBuilder />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

describe('rendering InvoiceBuilder component', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the top navigation bar with back, preview, and download buttons', () => {
    renderInvoiceBuilder();

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('←')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  test('renders the main invoice form', () => {
    renderInvoiceBuilder();
   
   expect(screen.getByText('Client & Invoice Details')).toBeInTheDocument();
   expect(screen.getByText('Client / Company')).toBeInTheDocument();
   expect(screen.getByText('Billing Address')).toBeInTheDocument();
   expect(screen.getByText('Invoice Number')).toBeInTheDocument();
   expect(screen.getByText('Invoice Date')).toBeInTheDocument();
   expect(screen.getByText('Tax Rate (%)')).toBeInTheDocument();
   expect(screen.getByText('Line Items')).toBeInTheDocument();
  });

  test('renders the line items section and controls for each invoice item', () => {
    renderInvoiceBuilder();

    expect(screen.getByText('Line Items')).toBeInTheDocument();

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Description' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Qty' })).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Unit Price' })).toBeInTheDocument();

    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(2);

    const itemRow = rows[1];
    expect(within(itemRow).getByRole('textbox')).toBeInTheDocument();
    expect(within(itemRow).getAllByRole('spinbutton')).toHaveLength(2);
    expect(within(itemRow).getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  test('renders the totals section with its labels and initial values', () => {
    renderInvoiceBuilder();

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Tax (0%)')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getAllByText('R 0.00')).toHaveLength(3);
  });

  test('renders the initial invoice values from the document context', () => {
    const { container } = renderInvoiceBuilder();

    expect(screen.getByPlaceholderText('e.g. Acme Corp')).toHaveValue('');
    expect(screen.getByPlaceholderText('client@example.com')).toHaveValue('');
    expect(screen.getByPlaceholderText('Street address, City, Country')).toHaveValue('');
    expect(container.querySelector('input[type="text"]:not([placeholder])')).toHaveValue('');
    expect(container.querySelector('input[type="date"]')).toHaveValue(
      new Date().toISOString().slice(0, 10)
    );
    expect(container.querySelector('input[type="number"]')).toHaveValue(0);

    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    expect(within(itemRow).getByRole('textbox')).toHaveValue('');
    expect(within(itemRow).getAllByRole('spinbutton')[0]).toHaveValue(1);
    expect(within(itemRow).getAllByRole('spinbutton')[1]).toHaveValue(0);
  });

  test('renders the invoice card with its title, form, items, and totals sections', () => {
    renderInvoiceBuilder();

    expect(screen.getByText('Client & Invoice Details')).toBeInTheDocument();
    expect(screen.getByText('Line Items')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
  });

  test('applies the light theme classes by default', () => {
    const { container } = renderInvoiceBuilder();
    const builder = container.querySelector('.min-h-screen');

    expect(builder).toHaveClass('bg-blue-50', 'text-slate-800');
    expect(screen.getByRole('navigation')).toHaveClass('bg-white/90', 'border-slate-200');
  });

  test('applies the dark theme classes when the dark theme is stored', () => {
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const { container } = renderInvoiceBuilder();
    const builder = container.querySelector('.min-h-screen');

    expect(builder).toHaveClass('bg-blue-950', 'text-slate-100');
    expect(screen.getByRole('navigation')).toHaveClass('bg-blue-950', 'border-slate-700');
  });

});

describe('InvoiceBuilder interaction', () => {
 describe('navigation buttons', () => {

      test('clicking the back button navigates to /', () => {
      mockNavigate.mockClear();
      renderInvoiceBuilder();

      fireEvent.click(screen.getByText('←'));

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('clicking the preview button navigates to /invoice-preview', () => {
      mockNavigate.mockClear();
      renderInvoiceBuilder();

      fireEvent.click(screen.getByRole('button', { name: /preview/i }));

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/invoice-preview');
    });

    test("clicking the download button navigates to /invoice-download", () => {
     mockNavigate.mockClear();
     renderInvoiceBuilder();

     fireEvent.click(screen.getByRole('button', { name: /download/i }));

     expect(mockNavigate).toHaveBeenCalledTimes(1);
     expect(mockNavigate).toHaveBeenCalledWith('/invoice-preview?download=1');
    });

 });

  describe('Invoice fields', () => {
    test('editing the client name updates the field value', () => {
      renderInvoiceBuilder();

      const ClientCompany = screen.getByPlaceholderText('e.g. Acme Corp');
      fireEvent.change(ClientCompany, { target: { value: 'Acme Corp' } });

      expect(ClientCompany).toHaveValue('Acme Corp');
    });

    test("Client Email", () => {
      renderInvoiceBuilder();

      const ClientEmail = screen.getByPlaceholderText('client@example.com');
      fireEvent.change(ClientEmail, { target: { value: 'client@example.com' } });

      expect(ClientEmail).toHaveValue('client@example.com');
    });

  });

  test('adds a new invoice item when the Add New Item button is clicked', () => {
    renderInvoiceBuilder();

    const addItemButton = screen.getByRole('button', { name: /add new item/i });
    expect(addItemButton).toBeVisible();
    expect(addItemButton).toBeEnabled();

    fireEvent.click(addItemButton);

    expect(screen.getAllByRole('table')[0].querySelectorAll('tbody tr')).toHaveLength(2);
  });
});