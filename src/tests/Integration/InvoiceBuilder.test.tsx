import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useRef, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import InvoiceBuilder from '../../features/invoice/InvoiceBuilder';
import InvoicePreview from '../../features/invoice/InvoicePreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
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

const InvoiceStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="invoice-state">{JSON.stringify(document.invoice)}</output>;
};

const DocumentStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="document-state">{JSON.stringify(document)}</output>;
};

const ItemArrayReferenceObserver = () => {
  const { document } = useDocument();
  const initialItems = useRef(document.invoice.items);
  const initialSnapshot = useRef(JSON.stringify(document.invoice.items));

  return (
    <output data-testid="item-array-reference">
      {JSON.stringify({
        sameReference: initialItems.current === document.invoice.items,
        initialArrayUnchanged: JSON.stringify(initialItems.current) === initialSnapshot.current,
      })}
    </output>
  );
};

const InvoiceFlowHarness = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowPreview((current) => !current)}>
        {showPreview ? 'Return to builder' : 'Open preview'}
      </button>
      {showPreview ? <InvoicePreview /> : <InvoiceBuilder />}
    </>
  );
};

const renderInvoiceBuilderWithState = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          <InvoiceBuilder />
          <InvoiceStateObserver />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const renderWithDocumentState = (children: React.ReactNode) =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          {children}
          <DocumentStateObserver />
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

describe('InvoiceBuilder dataflow', () => {

 describe('initial state', () => {
  test('Client name, email, address, and invoice number start empty', () => {
    const { container } = renderInvoiceBuilder();

    expect(screen.getByPlaceholderText('e.g. Acme Corp')).toHaveValue('');
    expect(screen.getByPlaceholderText('client@example.com')).toHaveValue('');
    expect(screen.getByPlaceholderText('Street address, City, Country')).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /Invoice Number/i })).toHaveValue('');

    const taxInput = screen.getAllByRole('spinbutton')[0];

    expect(container.querySelector('input[type="date"]')).toHaveValue(
      new Date().toISOString().slice(0, 10)
    );
    expect(taxInput).toHaveValue(0);

    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    expect(within(itemRow).getByRole('textbox')).toHaveValue('');
    expect(within(itemRow).getAllByRole('spinbutton')[0]).toHaveValue(1);
    expect(within(itemRow).getAllByRole('spinbutton')[1]).toHaveValue(0);
    expect(screen.getAllByText('R 0.00')).toHaveLength(3);
  });
 });

     describe('Item collection flows', () => {
      test('adding one item appends the defaults and preserves the existing item', () => {
        renderWithDocumentState(
          <>
            <InvoiceBuilder />
            <ItemArrayReferenceObserver />
          </>
        );

        const before = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}');
        fireEvent.click(screen.getByRole('button', { name: /add new item/i }));
        const after = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}');

        expect(after.invoice.items).toHaveLength(before.invoice.items.length + 1);
        expect(after.invoice.items[0]).toEqual(before.invoice.items[0]);
        expect(after.invoice.items[1]).toEqual({ description: '', quantity: 1, unitPrice: 0 });
        expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(3);
        expect(screen.getAllByRole('button', { name: '✕' })).toHaveLength(2);
        expect(JSON.parse(screen.getByTestId('item-array-reference').textContent ?? '{}')).toEqual({
          sameReference: false,
          initialArrayUnchanged: true,
        });
      });

      test('multiple additions create independent items and include entered values in totals', () => {
        renderWithDocumentState(<InvoiceBuilder />);
        const addButton = screen.getByRole('button', { name: /add new item/i });

        fireEvent.click(addButton);
        fireEvent.click(addButton);

        let invoice = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}').invoice;
        expect(invoice.items).toHaveLength(3);
        expect(invoice.items.slice(1)).toEqual([
          { description: '', quantity: 1, unitPrice: 0 },
          { description: '', quantity: 1, unitPrice: 0 },
        ]);

        const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
        fireEvent.change(within(rows[1]).getByRole('textbox'), { target: { value: 'Consulting' } });
        fireEvent.change(within(rows[1]).getAllByRole('spinbutton')[0], { target: { value: '2' } });
        fireEvent.change(within(rows[1]).getAllByRole('spinbutton')[1], { target: { value: '75' } });

        invoice = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}').invoice;
        expect(invoice.items[0]).toEqual({ description: '', quantity: 1, unitPrice: 0 });
        expect(invoice.items[1]).toEqual({ description: 'Consulting', quantity: 2, unitPrice: 75 });
        expect(invoice.items[2]).toEqual({ description: '', quantity: 1, unitPrice: 0 });
        expect(screen.getAllByText('R 150.00')).toHaveLength(2);
        expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4);
        expect(screen.getAllByRole('button', { name: '✕' })).toHaveLength(3);
      });

      test.each([0, 1, 2])('removing item %i removes only that item and preserves other item values', (removeIndex) => {
        renderWithDocumentState(
          <>
            <InvoiceBuilder />
            <ItemArrayReferenceObserver />
          </>
        );

        fireEvent.click(screen.getByRole('button', { name: /add new item/i }));
        fireEvent.click(screen.getByRole('button', { name: /add new item/i }));
        const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
        const itemValues = [
          { description: 'First', quantity: '1', unitPrice: '10' },
          { description: 'Middle', quantity: '2', unitPrice: '20' },
          { description: 'Last', quantity: '3', unitPrice: '30' },
        ];

        rows.forEach((row, index) => {
          fireEvent.change(within(row).getByRole('textbox'), { target: { value: itemValues[index].description } });
          const [quantityInput, unitPriceInput] = within(row).getAllByRole('spinbutton');
          fireEvent.change(quantityInput, { target: { value: itemValues[index].quantity } });
          fireEvent.change(unitPriceInput, { target: { value: itemValues[index].unitPrice } });
        });

        const itemsBeforeRemoval = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}').invoice.items;
        fireEvent.click(screen.getAllByRole('button', { name: '✕' })[removeIndex]);

        const itemsAfterRemoval = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}').invoice.items;
        expect(itemsAfterRemoval).toEqual(itemsBeforeRemoval.filter((_: unknown, index: number) => index !== removeIndex));
        expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(3);
        expect(screen.getAllByRole('button', { name: '✕' })).toHaveLength(2);
        expect(JSON.parse(screen.getByTestId('item-array-reference').textContent ?? '{}').initialArrayUnchanged).toBe(true);
      });

      test('removing every item resets totals and re-adding starts with a fresh default item', () => {
        renderInvoiceBuilderWithState();
        const [taxInput] = screen.getAllByRole('spinbutton');
        fireEvent.change(taxInput, { target: { value: '15' } });
        fireEvent.click(screen.getByRole('button', { name: /add new item/i }));
        fireEvent.click(screen.getByRole('button', { name: /add new item/i }));

        while (screen.queryAllByRole('button', { name: '✕' }).length > 0) {
          fireEvent.click(screen.queryAllByRole('button', { name: '✕' })[0]);
        }

        let invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
        expect(invoice.items).toEqual([]);
        expect(screen.getAllByText('R 0.00')).toHaveLength(3);
        expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(1);
        expect(screen.queryAllByRole('button', { name: '✕' })).toHaveLength(0);

        fireEvent.click(screen.getByRole('button', { name: /add new item/i }));
        const row = within(screen.getByRole('table')).getAllByRole('row')[1];
        expect(within(row).getByRole('textbox')).toHaveValue('');
        expect(within(row).getAllByRole('spinbutton')[0]).toHaveValue(1);
        expect(within(row).getAllByRole('spinbutton')[1]).toHaveValue(0);

        fireEvent.change(within(row).getAllByRole('spinbutton')[0], { target: { value: '2' } });
        fireEvent.change(within(row).getAllByRole('spinbutton')[1], { target: { value: '20' } });
        invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
        expect(invoice.items).toEqual([{ description: '', quantity: 2, unitPrice: 20 }]);
        expect(screen.getByText('R 6.00')).toBeInTheDocument();
        expect(screen.getByText('R 46.00')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: '✕' })).toHaveLength(1);
      });
     });

     describe('Totals dataflow', () => {
      test('a single item with zero tax shows subtotal, zero tax, and total', () => {
        renderInvoiceBuilderWithState();
        const [, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

        fireEvent.change(quantityInput, { target: { value: '2' } });
        fireEvent.change(unitPriceInput, { target: { value: '25' } });

        expect(screen.getByText('Tax (0%)')).toBeInTheDocument();
        expect(screen.getAllByText('R 50.00')).toHaveLength(2);
        expect(screen.getAllByText('R 0.00')).toHaveLength(1);
        expect(JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}').items).toEqual([
          { description: '', quantity: 2, unitPrice: 25 },
        ]);
      });

      test('multiple decimal items calculate and format subtotal, tax, and total to two decimals', () => {
        renderInvoiceBuilderWithState();
        fireEvent.click(screen.getByRole('button', { name: /add new item/i }));
        const [taxInput, firstQuantity, firstPrice, secondQuantity, secondPrice] = screen.getAllByRole('spinbutton');

        fireEvent.change(firstQuantity, { target: { value: '1.5' } });
        fireEvent.change(firstPrice, { target: { value: '12.5' } });
        fireEvent.change(secondQuantity, { target: { value: '2' } });
        fireEvent.change(secondPrice, { target: { value: '10' } });
        fireEvent.change(taxInput, { target: { value: '15.5' } });

        expect(screen.getByText('Tax (15.5%)')).toBeInTheDocument();
        expect(screen.getByText('R 38.75')).toBeInTheDocument();
        expect(screen.getByText('R 6.01')).toBeInTheDocument();
        expect(screen.getByText('R 44.76')).toBeInTheDocument();
        expect(firstQuantity).toHaveValue(1.5);
        expect(firstPrice).toHaveValue(12.5);
        expect(secondQuantity).toHaveValue(2);
        expect(secondPrice).toHaveValue(10);
        expect(taxInput).toHaveValue(15.5);
      });

      test('changing subtotal recalculates tax, changing tax rate recalculates tax again, and inputs remain intact', () => {
        renderInvoiceBuilderWithState();
        const [taxInput, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

        fireEvent.change(quantityInput, { target: { value: '2' } });
        fireEvent.change(unitPriceInput, { target: { value: '50' } });
        fireEvent.change(taxInput, { target: { value: '10' } });
        expect(screen.getByText('R 100.00')).toBeInTheDocument();
        expect(screen.getByText('R 10.00')).toBeInTheDocument();
        expect(screen.getByText('R 110.00')).toBeInTheDocument();

        fireEvent.change(unitPriceInput, { target: { value: '100' } });
        expect(screen.getByText('R 200.00')).toBeInTheDocument();
        expect(screen.getByText('R 20.00')).toBeInTheDocument();
        expect(screen.getByText('R 220.00')).toBeInTheDocument();

        fireEvent.change(taxInput, { target: { value: '20' } });
        expect(screen.getByText('Tax (20%)')).toBeInTheDocument();
        expect(screen.getByText('R 40.00')).toBeInTheDocument();
        expect(screen.getByText('R 240.00')).toBeInTheDocument();
        expect(quantityInput).toHaveValue(2);
        expect(unitPriceInput).toHaveValue(100);
        expect(taxInput).toHaveValue(20);
      });
     });

   describe('Preview and shared-state dataflow', () => {
    test('preview receives edited invoice details, items, and calculated totals; returning preserves builder state', () => {
      renderWithDocumentState(<InvoiceFlowHarness />);
      const clientNameInput = screen.getByPlaceholderText('e.g. Acme Corp');
      const clientEmailInput = screen.getByPlaceholderText('client@example.com');
      const addressInput = screen.getByPlaceholderText('Street address, City, Country');
      const invoiceNumberInput = screen.getByRole('textbox', { name: /Invoice Number/i });
      const dateInput = document.querySelector('input[type="date"]')!;
      const [taxInput, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');
      const itemDescriptionInput = within(
        within(screen.getByRole('table')).getAllByRole('row')[1]
      ).getByRole('textbox');

      fireEvent.change(clientNameInput, { target: { value: 'Northwind Studio' } });
      fireEvent.change(clientEmailInput, { target: { value: 'finance@northwind.test' } });
      fireEvent.change(addressInput, { target: { value: '42 Market Road' } });
      fireEvent.change(invoiceNumberInput, { target: { value: 'INV-2048' } });
      fireEvent.change(dateInput, { target: { value: '2026-10-01' } });
      fireEvent.change(itemDescriptionInput, { target: { value: 'Design services' } });
      fireEvent.change(quantityInput, { target: { value: '2' } });
      fireEvent.change(unitPriceInput, { target: { value: '50' } });
      fireEvent.change(taxInput, { target: { value: '15.5' } });

      const builderSubtotal = screen.getByText('R 100.00');
      const builderTax = screen.getByText('R 15.50');
      const builderTotal = screen.getByText('R 115.50');
      expect(builderSubtotal).toBeInTheDocument();
      expect(builderTax).toBeInTheDocument();
      expect(builderTotal).toBeInTheDocument();
      expect(screen.getByTestId('document-state')).toHaveTextContent('Northwind Studio');

      fireEvent.click(screen.getByRole('button', { name: 'Open preview' }));

      expect(screen.getByText('Northwind Studio')).toBeInTheDocument();
      expect(screen.getByText('finance@northwind.test')).toBeInTheDocument();
      expect(screen.getByText('42 Market Road')).toBeInTheDocument();
      expect(screen.getByText('INV-2048')).toBeInTheDocument();
      expect(screen.getByText('2026-10-01')).toBeInTheDocument();
      const previewTable = screen.getByRole('table');
      expect(within(previewTable).getByText('Design services')).toBeInTheDocument();
      expect(within(previewTable).getByText('2')).toBeInTheDocument();
      expect(within(previewTable).getByText('R 50.00')).toBeInTheDocument();
      expect(within(previewTable).getByText('R 100.00')).toBeInTheDocument();
      expect(screen.getByText('Tax (15.5%)')).toBeInTheDocument();
      expect(screen.getByText('R 15.50')).toBeInTheDocument();
      expect(screen.getByText('R 115.50')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Return to builder' }));

      expect(screen.getByPlaceholderText('e.g. Acme Corp')).toHaveValue('Northwind Studio');
      expect(screen.getByPlaceholderText('client@example.com')).toHaveValue('finance@northwind.test');
      expect(screen.getByPlaceholderText('Street address, City, Country')).toHaveValue('42 Market Road');
      expect(screen.getByRole('textbox', { name: /Invoice Number/i })).toHaveValue('INV-2048');
      expect(document.querySelector('input[type="date"]')).toHaveValue('2026-10-01');
      expect(screen.getByText('R 100.00')).toBeInTheDocument();
      expect(screen.getByText('R 15.50')).toBeInTheDocument();
      expect(screen.getByText('R 115.50')).toBeInTheDocument();
    });

    test('editing invoice data leaves quote, receipt, and other document state unchanged', () => {
      renderWithDocumentState(<InvoiceBuilder />);
      const initialDocument = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}');

      fireEvent.change(screen.getByPlaceholderText('e.g. Acme Corp'), { target: { value: 'Changed Client' } });
      fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '4' } });

      const updatedDocument = JSON.parse(screen.getByTestId('document-state').textContent ?? '{}');
      expect(updatedDocument.invoice.clientName).toBe('Changed Client');
      expect(updatedDocument.invoice.items[0].quantity).toBe(4);
      Object.keys(initialDocument).filter((key) => key !== 'invoice').forEach((key) => {
        expect(updatedDocument[key]).toEqual(initialDocument[key]);
      });
    });

    test('changing theme preserves invoice fields, line items, and calculated totals', () => {
      const ThemeStateHarness = () => {
        const { setTheme } = useTheme();
        return (
          <>
            <button type="button" onClick={() => setTheme('dark')}>Switch to dark theme</button>
            <InvoiceBuilder />
            <InvoiceStateObserver />
          </>
        );
      };

      render(
        <MemoryRouter>
          <ThemeProvider>
            <DocumentProvider>
              <ThemeStateHarness />
            </DocumentProvider>
          </ThemeProvider>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('e.g. Acme Corp'), { target: { value: 'Theme Client' } });
      const [taxInput, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');
      fireEvent.change(quantityInput, { target: { value: '2' } });
      fireEvent.change(unitPriceInput, { target: { value: '50' } });
      fireEvent.change(taxInput, { target: { value: '15' } });

      const invoiceBeforeThemeChange = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
      expect(screen.getByText('R 100.00')).toBeInTheDocument();
      expect(screen.getByText('R 15.00')).toBeInTheDocument();
      expect(screen.getByText('R 115.00')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

      const invoiceAfterThemeChange = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
      expect(invoiceAfterThemeChange).toEqual(invoiceBeforeThemeChange);
      expect(screen.getByPlaceholderText('e.g. Acme Corp')).toHaveValue('Theme Client');
      expect(quantityInput).toHaveValue(2);
      expect(unitPriceInput).toHaveValue(50);
      expect(taxInput).toHaveValue(15);
      expect(screen.getByText('R 100.00')).toBeInTheDocument();
      expect(screen.getByText('R 15.00')).toBeInTheDocument();
      expect(screen.getByText('R 115.00')).toBeInTheDocument();
    });
   });

 describe('Invoice field updates', () => {
  test.each([
    {
      field: 'clientName',
      input: () => screen.getByPlaceholderText('e.g. Acme Corp'),
      value: 'Acme Corporation',
      expectedValue: 'Acme Corporation',
    },
    {
      field: 'clientEmail',
      input: () => screen.getByPlaceholderText('client@example.com'),
      value: 'billing@example.com',
      expectedValue: 'billing@example.com',
    },
    {
      field: 'clientAddress',
      input: () => screen.getByPlaceholderText('Street address, City, Country'),
      value: '10 Main Street, Cape Town',
      expectedValue: '10 Main Street, Cape Town',
    },
    {
      field: 'invoiceNumber',
      input: () => screen.getByRole('textbox', { name: /Invoice Number/i }),
      value: 'INV-1001',
      expectedValue: 'INV-1001',
    },
    {
      field: 'invoiceDate',
      input: () => document.querySelector('input[type="date"]')!,
      value: '2026-10-01',
      expectedValue: '2026-10-01',
    },
    {
      field: 'taxRate',
      input: () => screen.getAllByRole('spinbutton')[0],
      value: '15',
      expectedValue: 15,
    },
  ])('$field updates only its matching invoice property', ({ field, input, value, expectedValue }) => {
    renderInvoiceBuilderWithState();

    const stateElement = screen.getByTestId('invoice-state');
    const initialInvoice = JSON.parse(stateElement.textContent ?? '{}');

    fireEvent.change(input(), { target: { value } });

    const updatedInvoice = JSON.parse(stateElement.textContent ?? '{}');
    expect(updatedInvoice).toEqual({ ...initialInvoice, [field]: expectedValue });
    expect(input()).toHaveValue(expectedValue);
  });
 });

 describe('Line-item updates', () => {
  test.each([
    { itemIndex: 0, field: 'description', value: 'Updated first item', expectedValue: 'Updated first item' },
    { itemIndex: 0, field: 'quantity', value: '7', expectedValue: 7 },
    { itemIndex: 0, field: 'unitPrice', value: '99.5', expectedValue: 99.5 },
    { itemIndex: 1, field: 'description', value: 'Updated second item', expectedValue: 'Updated second item' },
    { itemIndex: 1, field: 'quantity', value: '8', expectedValue: 8 },
    { itemIndex: 1, field: 'unitPrice', value: '149.5', expectedValue: 149.5 },
  ])('editing $field on item $itemIndex changes only that item property', ({ itemIndex, field, value, expectedValue }) => {
    renderInvoiceBuilderWithState();

    fireEvent.click(screen.getByRole('button', { name: /add new item/i }));

    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    const startingItems = [
      { description: 'First item', quantity: '2', unitPrice: '10' },
      { description: 'Second item', quantity: '3', unitPrice: '20' },
    ];

    rows.forEach((row, index) => {
      const [quantityInput, unitPriceInput] = within(row).getAllByRole('spinbutton');
      fireEvent.change(within(row).getByRole('textbox'), {
        target: { value: startingItems[index].description },
      });
      fireEvent.change(quantityInput, { target: { value: startingItems[index].quantity } });
      fireEvent.change(unitPriceInput, { target: { value: startingItems[index].unitPrice } });
    });

    const stateElement = screen.getByTestId('invoice-state');
    const initialInvoice = JSON.parse(stateElement.textContent ?? '{}');
    const selectedRow = rows[itemIndex];
    const targetInput = field === 'description'
      ? within(selectedRow).getByRole('textbox')
      : within(selectedRow).getAllByRole('spinbutton')[field === 'quantity' ? 0 : 1];

    fireEvent.change(targetInput, { target: { value } });

    const updatedInvoice = JSON.parse(stateElement.textContent ?? '{}');
    const expectedInvoice = {
      ...initialInvoice,
      items: initialInvoice.items.map((item: Record<string, unknown>, index: number) =>
        index === itemIndex ? { ...item, [field]: expectedValue } : item
      ),
    };

    expect(updatedInvoice).toEqual(expectedInvoice);
    expect(targetInput).toHaveValue(expectedValue);
  });
 });

 describe('Line-item input parsing', () => {
  test.each([
    { field: 'quantity', inputIndex: 0, value: '4', expectedValue: 4 },
    { field: 'quantity', inputIndex: 0, value: '2.5', expectedValue: 2.5 },
    { field: 'unitPrice', inputIndex: 1, value: '125', expectedValue: 125 },
    { field: 'unitPrice', inputIndex: 1, value: '12.75', expectedValue: 12.75 },
  ])('$field accepts numeric value $value', ({ field, inputIndex, value, expectedValue }) => {
    renderInvoiceBuilderWithState();
    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    const input = within(itemRow).getAllByRole('spinbutton')[inputIndex];

    fireEvent.change(input, { target: { value } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.items[0][field]).toBe(expectedValue);
    expect(input).toHaveValue(expectedValue);
  });

  test.each([
    { field: 'quantity', inputIndex: 0 },
    { field: 'unitPrice', inputIndex: 1 },
  ])('clearing $field stores 0', ({ field, inputIndex }) => {
    renderInvoiceBuilderWithState();
    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    const input = within(itemRow).getAllByRole('spinbutton')[inputIndex];

    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.change(input, { target: { value: '' } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.items[0][field]).toBe(0);
    expect(input).toHaveValue(0);
  });

  test.each([
    { field: 'quantity', inputIndex: 0 },
    { field: 'unitPrice', inputIndex: 1 },
  ])('invalid $field input falls back to 0', ({ field, inputIndex }) => {
    renderInvoiceBuilderWithState();
    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    const input = within(itemRow).getAllByRole('spinbutton')[inputIndex];

    fireEvent.change(input, { target: { value: 'invalid' } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.items[0][field]).toBe(0);
    expect(input).toHaveValue(0);
  });

  test.each([
    { quantity: '0', unitPrice: '25' },
    { quantity: '2', unitPrice: '0' },
  ])('zero input results in a zero line total', ({ quantity, unitPrice }) => {
    renderInvoiceBuilderWithState();
    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    const [quantityInput, unitPriceInput] = within(itemRow).getAllByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: quantity } });
    fireEvent.change(unitPriceInput, { target: { value: unitPrice } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.items[0].quantity * invoice.items[0].unitPrice).toBe(0);
    expect(screen.getAllByText('R 0.00')).toHaveLength(3);
  });

  test.each([
    { field: 'quantity', quantity: '-2', unitPrice: '10', expectedValue: -2 },
    { field: 'unitPrice', quantity: '2', unitPrice: '-10', expectedValue: -10 },
  ])('negative $field is accepted and contributes to the line total', ({ field, quantity, unitPrice, expectedValue }) => {
    renderInvoiceBuilderWithState();
    const itemRow = within(screen.getByRole('table')).getAllByRole('row')[1];
    const [quantityInput, unitPriceInput] = within(itemRow).getAllByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: quantity } });
    fireEvent.change(unitPriceInput, { target: { value: unitPrice } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.items[0][field]).toBe(expectedValue);
    expect(invoice.items[0].quantity * invoice.items[0].unitPrice).toBe(-20);
    expect(screen.getAllByText('R -20.00')).toHaveLength(2);
  });
 });

describe('Invoice field edge cases', () => {
  test.each([
    {
      field: 'clientName',
      input: () => screen.getByPlaceholderText('e.g. Acme Corp'),
    },
    {
      field: 'clientEmail',
      input: () => screen.getByPlaceholderText('client@example.com'),
    },
    {
      field: 'clientAddress',
      input: () => screen.getByPlaceholderText('Street address, City, Country'),
    },
    {
      field: 'invoiceNumber',
      input: () => screen.getByRole('textbox', { name: /Invoice Number/i }),
    },
  ])('clearing $field stores an empty string', ({ field, input }) => {
    renderInvoiceBuilderWithState();

    fireEvent.change(input(), { target: { value: 'temporary value' } });
    fireEvent.change(input(), { target: { value: '' } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice[field]).toBe('');
    expect(input()).toHaveValue('');
  });

  test('clearing the invoice date stores an empty value', () => {
    const { container } = renderInvoiceBuilderWithState();
    const dateInput = container.querySelector('input[type="date"]')!;

    fireEvent.change(dateInput, { target: { value: '2026-10-01' } });
    fireEvent.change(dateInput, { target: { value: '' } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.invoiceDate).toBe('');
    expect(dateInput).toHaveValue('');
  });

  test.each(['0', '', 'invalid'])('tax input %s stores 0', (value) => {
    renderInvoiceBuilderWithState();
    const taxInput = screen.getAllByRole('spinbutton')[0];

    fireEvent.change(taxInput, { target: { value } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.taxRate).toBe(0);
    expect(taxInput).toHaveValue(0);
  });

  test('a decimal tax rate is stored and used to calculate tax and total', () => {
    renderInvoiceBuilderWithState();
    const [taxInput, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.change(unitPriceInput, { target: { value: '100' } });
    fireEvent.change(taxInput, { target: { value: '15.5' } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.taxRate).toBe(15.5);
    expect(screen.getByText('Tax (15.5%)')).toBeInTheDocument();
    expect(screen.getByText('R 31.00')).toBeInTheDocument();
    expect(screen.getByText('R 231.00')).toBeInTheDocument();
  });

  test('negative tax rates are accepted and reduce the total', () => {
    renderInvoiceBuilderWithState();
    const [taxInput, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.change(unitPriceInput, { target: { value: '100' } });
    fireEvent.change(taxInput, { target: { value: '-10' } });

    const invoice = JSON.parse(screen.getByTestId('invoice-state').textContent ?? '{}');
    expect(invoice.taxRate).toBe(-10);
    expect(screen.getByText('Tax (-10%)')).toBeInTheDocument();
    expect(screen.getByText('R -20.00')).toBeInTheDocument();
    expect(screen.getByText('R 180.00')).toBeInTheDocument();
  });
});

});