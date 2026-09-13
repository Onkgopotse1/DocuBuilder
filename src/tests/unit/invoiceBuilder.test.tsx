import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import InvoiceBuilder from '../../features/invoice/InvoiceBuilder';
import { DocumentProvider } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
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

describe('InvoiceBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates invoice fields and recalculates totals', () => {
    renderInvoiceBuilder();

    const clientInput = screen.getByPlaceholderText('e.g. Acme Corp');
    const [taxInput, quantityInput, unitPriceInput] = screen.getAllByRole('spinbutton');

    fireEvent.change(clientInput, { target: { value: 'Acme Corp' } });
    fireEvent.change(taxInput, { target: { value: '15' } });
    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.change(unitPriceInput, { target: { value: '100' } });

    expect(clientInput).toHaveValue('Acme Corp');
    expect(screen.getByText('R 200.00')).toBeInTheDocument();
    expect(screen.getByText('R 30.00')).toBeInTheDocument();
    expect(screen.getByText('R 230.00')).toBeInTheDocument();
  });

  it('adds and removes line items', () => {
    renderInvoiceBuilder();

    expect(screen.getAllByRole('row')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /add new item/i }));
    expect(screen.getAllByRole('row')).toHaveLength(3);

    const removeButtons = screen.getAllByRole('button', { name: '✕' });
    fireEvent.click(removeButtons[1]);
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
});