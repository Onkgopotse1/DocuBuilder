import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CreditNoteBuilder from '../../features/creditNote/CreditNoteBuilder';
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

const renderCreditNoteBuilder = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          <CreditNoteBuilder />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const CreditNoteStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="creditnote-state">{JSON.stringify(document.creditNote)}</output>;
};

describe('CreditNoteBuilder rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the main credit note sections and actions', () => {
    renderCreditNoteBuilder();

    expect(screen.getByText('Credit Note')).toBeInTheDocument();
    expect(screen.getByText('Issued By')).toBeInTheDocument();
    expect(screen.getByText('Issued To')).toBeInTheDocument();
    expect(screen.getByText('Reason for Credit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
  });

  test('applies the light and dark themes', () => {
    const lightRender = renderCreditNoteBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#fef2f2]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderCreditNoteBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-indigo-950');
  });
});

describe('CreditNoteBuilder data flow', () => {
  afterEach(cleanup);

  test('updates the credit note fields in context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <CreditNoteBuilder />
            <CreditNoteStateObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('CN-2025-001'), { target: { value: 'CN-2025-077' } });
    fireEvent.change(screen.getByPlaceholderText('Your business'), { target: { value: 'Northstar Studio' } });
    fireEvent.change(screen.getByPlaceholderText('Client or company'), { target: { value: 'Acme Holdings' } });

    const creditNote = JSON.parse(screen.getByTestId('creditnote-state').textContent ?? '{}');
    expect(creditNote).toMatchObject({
      creditNoteNumber: 'CN-2025-077',
      issuerName: 'Northstar Studio',
      clientName: 'Acme Holdings',
    });
  });
});

describe('CreditNoteBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates to preview and home', () => {
    renderCreditNoteBuilder();

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/credit-note-preview');

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mockNavigate).toHaveBeenLastCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
