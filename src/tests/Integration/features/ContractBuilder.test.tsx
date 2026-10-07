import { cleanup, fireEvent, screen,} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ContractBuilder from '../../../features/contract/ContractBuilder.tsx';
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

const renderContractBuilder = () =>
  renderWithProviders(<ContractBuilder />);

const ContractStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="contract-state">{JSON.stringify(document.contract)}</output>;
};

describe('ContractBuilder rendering', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the builder layout, form sections, and generate preview action', () => {
    renderContractBuilder();

    expect(screen.getByRole('heading', { name: /ContractBuilder/i })).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contract Configuration' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Basic Information' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Parties' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Financial Terms' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Scope & Deliverables' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate preview/i })).toBeInTheDocument();
  });

  test('renders the default contract values and blank form fields', () => {
    const { container } = renderContractBuilder();

    expect(screen.getByPlaceholderText('Freelance Service Agreement')).toHaveValue('');
    expect(screen.getByPlaceholderText('e.g. South Africa')).toHaveValue('');
    expect(screen.getByPlaceholderText('Client Name / Company')).toHaveValue('');
    expect(screen.getAllByPlaceholderText('Physical Address')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Physical Address')[0]).toHaveValue('');
    expect(screen.getAllByPlaceholderText('Physical Address')[1]).toHaveValue('');
    expect(screen.getByPlaceholderText('Your Name / Company')).toHaveValue('');
    expect(screen.getByPlaceholderText('Describe the project milestones and final deliverables...')).toHaveValue('');

    const dateInputs = container.querySelectorAll('input[type="date"]');
    expect(dateInputs).toHaveLength(1);
    expect(dateInputs[0]).toHaveValue(new Date().toISOString().slice(0, 10));

    const numberInputs = container.querySelectorAll('input[type="number"]');
    expect(numberInputs).toHaveLength(2);
    expect(numberInputs[0]).toHaveValue(0);
    expect(numberInputs[1]).toHaveValue(0);
  });

  test('applies the light and dark theme classes', () => {
    const lightRender = renderContractBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-amber-50', 'text-slate-800');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderContractBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-amber-950', 'text-slate-100');
  });
});

describe('ContractBuilder data flow', () => {
  afterEach(cleanup);

  test('updates the document context as contract fields are edited', () => {
    renderWithProviders(<><ContractBuilder /><ContractStateObserver /></>);

    fireEvent.change(screen.getByPlaceholderText('Freelance Service Agreement'), { target: { value: 'Website Retainer Agreement' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. South Africa'), { target: { value: 'South Africa' } });
    fireEvent.change(screen.getByPlaceholderText('Client Name / Company'), { target: { value: 'Acme Holdings' } });
    fireEvent.change(screen.getAllByPlaceholderText('Physical Address')[0], { target: { value: '10 Main Road, Cape Town' } });
    fireEvent.change(screen.getByPlaceholderText('Your Name / Company'), { target: { value: 'Northstar Studio' } });
    fireEvent.change(screen.getAllByPlaceholderText('Physical Address')[1], { target: { value: '12 River Lane, Johannesburg' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50000' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 50'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Describe the project milestones and final deliverables...'), { target: { value: 'Design, build, and deploy the customer portal.' } });

    const contract = JSON.parse(screen.getByTestId('contract-state').textContent ?? '{}');
    expect(contract).toMatchObject({
      documentTitle: 'Website Retainer Agreement',
      governingLaw: 'South Africa',
      clientName: 'Acme Holdings',
      clientAddress: '10 Main Road, Cape Town',
      contractorName: 'Northstar Studio',
      contractorAddress: '12 River Lane, Johannesburg',
      totalValue: 50000,
      depositPercent: 25,
      scope: 'Design, build, and deploy the customer portal.',
    });
  });

  test('updates the effective date and keeps the contract state in sync', () => {
    const { container } = renderContractBuilder();

    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2026-10-12' } });

    expect(dateInput).toHaveValue('2026-10-12');
    expect(screen.getByPlaceholderText('Freelance Service Agreement')).toHaveValue('');
  });
});

describe('ContractBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates back home and into the contract preview', () => {
    renderContractBuilder();

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/');

    fireEvent.click(screen.getByRole('button', { name: /generate preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/contract-preview');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
