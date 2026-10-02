import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import CreditNotePreview from '../../features/creditNote/CreditNotePreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import type { CreditNote } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedCreditNote: CreditNote = {
  creditNoteNumber: 'CN-2025-077',
  issueDate: '2025-04-20',
  originalInvoiceNumber: 'INV-2025-042',
  originalInvoiceDate: '2025-04-10',
  issuerName: 'Northstar Studio',
  issuerEmail: 'billing@northstar.example',
  issuerAddress: '123 Example Road, Sandton',
  clientName: 'Acme Holdings',
  clientEmail: 'accounts@acme.example',
  clientAddress: '456 Business Way, Rosebank',
  reason: 'Returned goods',
  additionalDetails: 'Partial order not delivered as requested.',
  items: [
    { description: 'Returned hardware', quantity: 1, unitPrice: 3500, amount: 3500 },
    { description: 'Accessory bundle', quantity: 2, unitPrice: 450, amount: 900 },
  ],
};

const renderCreditNotePreview = (initialEntries = ['/credit-note-preview']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <DocumentProvider>
          <CreditNotePreview />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const CreditNoteSeed = ({ creditNote = populatedCreditNote }: { creditNote?: CreditNote }) => {
  const { document, setDocument } = useDocument();
  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, creditNote })}>Load credit note data</button>
      <CreditNotePreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('CreditNotePreview rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the credit note document and actions', () => {
    renderCreditNotePreview();

    expect(screen.getAllByText(/Credit Note/i)).toHaveLength(2);
    expect(screen.getAllByText('Nexus Solutions Inc.')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Issued To')[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /download pdf/i })[0]).toBeInTheDocument();
  });

  test('applies the light and dark themes', () => {
    const lightRender = renderCreditNotePreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#fef2f2]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderCreditNotePreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-indigo-950');
  });
});

describe('CreditNotePreview data flow', () => {
  afterEach(cleanup);

  test('renders the seeded credit note values from context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <CreditNoteSeed />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load credit note data' }));

    expect(screen.getAllByText('Northstar Studio')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Acme Holdings')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Returned goods/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText('Returned hardware')[0]).toBeInTheDocument();
  });
});

describe('CreditNotePreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the builder', async () => {
    render(
      <MemoryRouter initialEntries={['/credit-note-preview']}>
        <ThemeProvider>
          <DocumentProvider>
            <CreditNotePreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/credit-note-builder'));
  });

  test('exports the credit note PDF', async () => {
    renderCreditNotePreview();

    fireEvent.click(screen.getAllByRole('button', { name: /download pdf/i })[0]);

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('creditnote-section', 'credit-note'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});
