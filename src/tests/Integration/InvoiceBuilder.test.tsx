import { useEffect } from 'react';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import InvoiceBuilder from '../../features/invoice/InvoiceBuilder';
import { DocumentProvider } from '../../context/DocumentContext';
import { ThemeProvider, useTheme } from '../../context/Theme Context.tsx';

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

const renderInvoiceBuilderWithThemeControls = (initialTheme: 'light' | 'dark' = 'light') => {
  const ThemeSwitchHarness = () => {
    const { setTheme } = useTheme();

    useEffect(() => {
      setTheme(initialTheme);
    }, [initialTheme, setTheme]);

    return (
      <>
        <button type="button" data-testid="set-light" onClick={() => setTheme('light')}>Set light</button>
        <button type="button" data-testid="set-dark" onClick={() => setTheme('dark')}>Set dark</button>
        <DocumentProvider>
          <InvoiceBuilder />
        </DocumentProvider>
      </>
    );
  };

  return render(
    <MemoryRouter>
      <ThemeProvider>
        <ThemeSwitchHarness />
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('rendering InvoiceBuilder component', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
    cleanup();
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

  test('changing the theme does not change invoice field values or line items', () => {
    const ThemePersistenceHarness = () => {
      const { setTheme } = useTheme();

      return (
        <>
          <button type="button" data-testid="set-light" onClick={() => setTheme('light')}>Set light</button>
          <button type="button" data-testid="set-dark" onClick={() => setTheme('dark')}>Set dark</button>
          <InvoiceBuilder />
        </>
      );
    };

    const { container } = render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <ThemePersistenceHarness />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    const clientNameInput = screen.getByPlaceholderText('e.g. Acme Corp');
    const clientEmailInput = screen.getByPlaceholderText('client@example.com');

    fireEvent.change(clientNameInput, { target: { value: 'Acme Corp' } });
    fireEvent.change(clientEmailInput, { target: { value: 'client@example.com' } });

    expect(clientNameInput).toHaveValue('Acme Corp');
    expect(clientEmailInput).toHaveValue('client@example.com');
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2);

    fireEvent.click(screen.getByTestId('set-dark'));

    expect(screen.getByPlaceholderText('e.g. Acme Corp')).toHaveValue('Acme Corp');
    expect(screen.getByPlaceholderText('client@example.com')).toHaveValue('client@example.com');
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(2);
    expect(container.querySelector('.min-h-screen')).toHaveClass('bg-blue-950', 'text-slate-100');
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

    test("Editing Client Email updates its value", () => {
      renderInvoiceBuilder();

      const ClientEmail = screen.getByPlaceholderText('client@example.com');
      fireEvent.change(ClientEmail, { target: { value: 'client@example.com' } });

      expect(ClientEmail).toHaveValue('client@example.com');
    });

    test("Editing Billing Address updates its value", () => {
      renderInvoiceBuilder();
      
      const BillingAddress = screen.getByPlaceholderText('Street address, City, Country');
      fireEvent.change(BillingAddress ,{target: {value: 'Street address, City, Country'}})
      
      expect(BillingAddress).toHaveValue('Street address, City, Country')
    });

    test('Editing Invoice Number updates its value', () => {
      renderInvoiceBuilder();

      const invoiceNumberInput = screen.getByRole('textbox', { name: /Invoice Number/i });
      fireEvent.change(invoiceNumberInput, { target: { value: 'INV-1001' } });

      expect(invoiceNumberInput).toHaveValue('INV-1001');
    });

  });

  describe('totals calculations', () => {
    test('changing quantity recalculates the subtotal and changing unit price recalculates the subtotal', () => {
      renderInvoiceBuilder();

      const [, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

      fireEvent.change(quantityInput, { target: { value: '2' } });
      fireEvent.change(unitPriceInput, { target: { value: '100' } });

      expect(screen.getAllByText('R 200.00')).toHaveLength(2);
    });

    test('changing tax rate recalculates the tax and the total equals subtotal plus tax', () => {
      renderInvoiceBuilder();

      const [taxInput, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

      fireEvent.change(quantityInput, { target: { value: '2' } });
      fireEvent.change(unitPriceInput, { target: { value: '100' } });
      fireEvent.change(taxInput, { target: { value: '15' } });

      expect(screen.getByText('Tax (15%)')).toBeInTheDocument();
      expect(screen.getByText('R 30.00')).toBeInTheDocument();
      expect(screen.getByText('R 230.00')).toBeInTheDocument();
    });

    test('adding an item with values includes it in the totals and removing an item excludes it from the totals', () => {
      renderInvoiceBuilder();

      fireEvent.click(screen.getByRole('button', { name: /add new item/i }));

      const allSpinButtons = screen.getAllByRole('spinbutton');
      const quantityInput = allSpinButtons[1];
      const unitPriceInput = allSpinButtons[2];
      const secondQuantityInput = allSpinButtons[3];
      const secondUnitPriceInput = allSpinButtons[4];

      fireEvent.change(quantityInput, { target: { value: '2' } });
      fireEvent.change(unitPriceInput, { target: { value: '50' } });
      fireEvent.change(secondQuantityInput, { target: { value: '3' } });
      fireEvent.change(secondUnitPriceInput, { target: { value: '40' } });

      expect(screen.getAllByText('R 220.00')).toHaveLength(2);

      const removeButtons = screen.getAllByRole('button', { name: '✕' });
      fireEvent.click(removeButtons[1]);

      expect(screen.getAllByText('R 100.00')).toHaveLength(2);
    });

    test('zero quantity and zero unit price produce zero amounts and decimal values calculate correctly', () => {
      renderInvoiceBuilder();

      const [, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

      fireEvent.change(quantityInput, { target: { value: '0' } });
      fireEvent.change(unitPriceInput, { target: { value: '0' } });

      expect(screen.getAllByText('R 0.00')).toHaveLength(3);

      fireEvent.change(quantityInput, { target: { value: '1.5' } });
      fireEvent.change(unitPriceInput, { target: { value: '12.5' } });

      expect(screen.getAllByText('R 18.75')).toHaveLength(2);
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