import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ExpensePreview from '../../features/expense/ExpensePreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import type { Expense } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedExpense: Expense = {
  claimantName: 'Jane Smith',
  claimantRole: 'Marketing',
  claimantEmail: 'jane@northstar.example',
  submittedTo: 'Acme Holdings',
  claimNumber: 'EXP-2025-042',
  periodFrom: '2025-08-01',
  periodTo: '2025-08-31',
  items: [
    { date: '2025-08-04', category: 'Travel', description: 'Client site visit', amount: 420 },
    { date: '2025-08-15', category: 'Meals', description: 'Client lunch', amount: 180 },
  ],
  notes: 'Travel and meals for client work.',
};

const renderExpensePreview = (initialEntries = ['/expense-preview']) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <ThemeProvider>
      <DocumentProvider>
        <ExpensePreview />
      </DocumentProvider>
    </ThemeProvider>
  </MemoryRouter>
);

const ExpenseSeed = ({ expense = populatedExpense }: { expense?: Expense }) => {
  const { document, setDocument } = useDocument();
  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, expense })}>Load expense data</button>
      <ExpensePreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('ExpensePreview rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the expense claim document and totals', () => {
    renderExpensePreview();

    expect(screen.getByText('Expense Claim')).toBeInTheDocument();
    expect(screen.getAllByText('John Mokoena')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Sales/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /download pdf/i })[0]).toBeInTheDocument();
    expect(screen.getByText('Total Claimed')).toBeInTheDocument();
  });

  test('applies theme classes', () => {
    const lightRender = renderExpensePreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-slate-50');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderExpensePreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-orange-950');
  });
});

describe('ExpensePreview data flow', () => {
  afterEach(cleanup);

  test('renders the seeded expense data from context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <ExpenseSeed />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load expense data' }));

    expect(screen.getAllByText('Jane Smith')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Marketing/i)[0]).toBeInTheDocument();
    expect(screen.getByText('EXP-2025-042')).toBeInTheDocument();
    expect(screen.getAllByText('Travel')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Client site visit')[0]).toBeInTheDocument();
    expect(screen.getAllByText('R600.00')[0]).toBeInTheDocument();
  });
});

describe('ExpensePreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the builder', async () => {
    render(
      <MemoryRouter initialEntries={['/expense-preview']}>
        <ThemeProvider>
          <DocumentProvider>
            <ExpensePreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/expense-builder'));
  });

  test('exports the expense claim when the PDF button is clicked', async () => {
    renderExpensePreview();

    fireEvent.click(screen.getAllByRole('button', { name: /download pdf/i })[0]);

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('expense-section', 'expense-claim'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});
