import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ExpenseBuilder from '../../../features/expense/ExpenseBuilder.tsx';
import { useDocument } from '../../../context/DocumentContext.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderExpenseBuilder = () =>
  renderWithProviders(<ExpenseBuilder />);

const ExpenseStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="expense-state">{JSON.stringify(document.expense)}</output>;
};

describe('ExpenseBuilder rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the claim layout and primary sections', () => {
    renderExpenseBuilder();

    expect(screen.getByText('New Expense Claim')).toBeInTheDocument();
    expect(screen.getByText('Claimant')).toBeInTheDocument();
    expect(screen.getByText('Claim Info')).toBeInTheDocument();
    expect(screen.getByText('Expense Items')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
  });

  test('applies light and dark theme classes', () => {
    const lightRender = renderExpenseBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-slate-50');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderExpenseBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-orange-950');
  });
});

describe('ExpenseBuilder data flow', () => {
  afterEach(cleanup);

  test('updates the expense state when claimant and item values change', () => {
    renderWithProviders(<><ExpenseBuilder /><ExpenseStateObserver /></>);

    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Jane Smith' } });
    fireEvent.change(textboxes[1], { target: { value: 'Marketing' } });
    fireEvent.change(screen.getByPlaceholderText('EXP-2025-001'), { target: { value: 'EXP-2025-042' } });

    const expense = JSON.parse(screen.getByTestId('expense-state').textContent ?? '{}');
    expect(expense).toMatchObject({
      claimantName: 'Jane Smith',
      claimantRole: 'Marketing',
      claimNumber: 'EXP-2025-042',
    });
  });
});

describe('ExpenseBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates to the expense preview and home', () => {
    renderExpenseBuilder();

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/expense-preview');

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mockNavigate).toHaveBeenLastCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
