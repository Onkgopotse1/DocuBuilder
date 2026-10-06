import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PurchaseOrderBuilder from '../../features/purchaseOrder/PurchaseOrderBuilder';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderPurchaseOrderBuilder = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          <PurchaseOrderBuilder />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const PurchaseOrderStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="purchase-order-state">{JSON.stringify(document.purchaseOrder)}</output>;
};

describe('PurchaseOrderBuilder rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the purchase order header and parties', () => {
    renderPurchaseOrderBuilder();

    expect(screen.getByText('Purchase Order')).toBeInTheDocument();
    expect(screen.getByText('Builder')).toBeInTheDocument();
    expect(screen.getByText('Buyer (Us)')).toBeInTheDocument();
    expect(screen.getByText('Vendor / Supplier')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
  });

  test('applies the light and dark theme classes', () => {
    const lightRender = renderPurchaseOrderBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#f0f4ff]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderPurchaseOrderBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-indigo-950');
  });
});

describe('PurchaseOrderBuilder data flow', () => {
  afterEach(cleanup);

  test('updates the PO values and stores them in context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <PurchaseOrderBuilder />
            <PurchaseOrderStateObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('PO-2025-001'), { target: { value: 'PO-2025-090' } });
    fireEvent.change(screen.getByPlaceholderText('Your business'), { target: { value: 'Northstar Studio' } });
    fireEvent.change(screen.getByPlaceholderText('Supplier company'), { target: { value: 'Alpha Supply' } });

    const po = JSON.parse(screen.getByTestId('purchase-order-state').textContent ?? '{}');
    expect(po).toMatchObject({
      poNumber: 'PO-2025-090',
      buyerCompany: 'Northstar Studio',
      vendorName: 'Alpha Supply',
    });
  });
});

describe('PurchaseOrderBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates to the preview and back home', () => {
    renderPurchaseOrderBuilder();

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/purchase-order-preview');

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mockNavigate).toHaveBeenLastCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
