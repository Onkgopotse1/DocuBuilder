import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ReceiptBuilder from '../../features/receipt/ReceiptBuilder';
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

const renderReceiptBuilder = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          <ReceiptBuilder />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const ReceiptStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="receipt-state">{JSON.stringify(document.receipt)}</output>;
};

describe('ReceiptBuilder rendering', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the builder shell, sections, and primary actions', () => {
    renderReceiptBuilder();

    expect(screen.getByText('Receipt Studio')).toBeInTheDocument();
    expect(screen.getByText('Customer Details')).toBeInTheDocument();
    expect(screen.getByText('Payment Items')).toBeInTheDocument();
    expect(screen.getByText('Receipt Config')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByText('Amount Received')).toBeInTheDocument();
  });

  test('renders the default receipt values and payment state', () => {
    renderReceiptBuilder();

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes[0]).toHaveValue('BrightWave Marketing');
    expect(textboxes[1]).toHaveValue('contact@brightwave.com');
    expect(screen.getByDisplayValue('RCT-1002')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Thank you for your prompt payment!')).toBeInTheDocument();
    expect(screen.getByDisplayValue('EFT / Bank Transfer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15')).toBeInTheDocument();
    expect(screen.getByText('R 15000.00')).toBeInTheDocument();
  });

  test('applies the light and dark theme classes', () => {
    const lightRender = renderReceiptBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-gradient-to-br', 'from-emerald-50/50', 'via-slate-50', 'to-teal-50/50');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderReceiptBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-emerald-950', 'text-slate-100');
  });
});

describe('ReceiptBuilder data flow', () => {
  afterEach(cleanup);

  test('updates the document context as receipt fields are edited', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <ReceiptBuilder />
            <ReceiptStateObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Acme Holdings' } });
    fireEvent.change(textboxes[1], { target: { value: 'billing@acme.example' } });
    fireEvent.change(screen.getByDisplayValue('RCT-1002'), { target: { value: 'RCT-2005' } });
    fireEvent.change(screen.getByDisplayValue('Thank you for your prompt payment!'), { target: { value: 'Thank you for the payment.' } });

    const receipt = JSON.parse(screen.getByTestId('receipt-state').textContent ?? '{}');
    expect(receipt).toMatchObject({
      customerName: 'Acme Holdings',
      customerEmail: 'billing@acme.example',
      receiptNumber: 'RCT-2005',
      memo: 'Thank you for the payment.',
    });
  });
});

describe('ReceiptBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates home and to the receipt preview', () => {
    renderReceiptBuilder();

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/receipt-preview');

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mockNavigate).toHaveBeenLastCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
