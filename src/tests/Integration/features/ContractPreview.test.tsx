import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useLocation } from 'react-router-dom';
import ContractPreview from '../../../features/contract/ContractPreview.tsx';
import { useDocument } from '../../../context/DocumentContext.tsx';
import type { Contract } from '../../../context/DocumentContext.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

const { mockNavigate, mockExportPDF } = vi.hoisted(() => ({ mockNavigate: vi.fn(), mockExportPDF: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedContract: Contract = {
  documentTitle: 'Website Retainer Agreement',
  effectiveDate: '2026-09-28',
  governingLaw: 'South Africa',
  clientName: 'Acme Holdings',
  clientAddress: '10 Main Road, Cape Town',
  contractorName: 'Northstar Studio',
  contractorAddress: '12 River Lane, Johannesburg',
  totalValue: 50000,
  depositPercent: 25,
  scope: 'Design, build, test, and deploy the customer portal.',
};

const renderContractPreview = () =>
  renderWithProviders(<ContractPreview />);

const ContractSeed = ({ contract = populatedContract }: { contract?: Contract }) => {
  const { document, setDocument } = useDocument();

  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, contract })}>
        Load contract data
      </button>
      <ContractPreview />
    </>
  );
};

describe('ContractPreview rendering', () => {
  beforeEach(() => {
    window.localStorage.removeItem('docubuilder-theme');
  });

  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the legal document layout and default placeholders', () => {
    renderContractPreview();

    expect(screen.getByRole('button', { name: /back to editor/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /download pdf/i })[0]).toBeInTheDocument();
    expect(screen.getByText('Legal Document')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Service Agreement' })).toBeInTheDocument();
    expect(screen.getByText('Scope of Services')).toBeInTheDocument();
    expect(screen.getByText('Payment Terms')).toBeInTheDocument();
    expect(screen.getByText('Governing Law')).toBeInTheDocument();
    expect(screen.getByText('[Client Name]')).toBeInTheDocument();
    expect(screen.getByText('[Contractor Name]')).toBeInTheDocument();
    expect(screen.getByText('[Value]')).toBeInTheDocument();
    expect(screen.getByText('[Deposit]%')).toBeInTheDocument();
  });

  test('shows the light and dark theme classes on the preview page', () => {
    const lightRender = renderContractPreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-amber-50', 'text-slate-800');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderContractPreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-amber-950', 'text-slate-100');
  });
});

describe('ContractPreview data flow', () => {
  afterEach(cleanup);

  test('renders the populated contract values from document context', () => {
    renderWithProviders(<ContractSeed />);

    fireEvent.click(screen.getByRole('button', { name: 'Load contract data' }));

    expect(screen.getByRole('heading', { name: 'Website Retainer Agreement' })).toBeInTheDocument();
    expect(screen.getByText('Acme Holdings')).toBeInTheDocument();
    expect(screen.getByText('Northstar Studio')).toBeInTheDocument();
    expect(screen.getByText('10 Main Road, Cape Town')).toBeInTheDocument();
    expect(screen.getByText('12 River Lane, Johannesburg')).toBeInTheDocument();
    expect(screen.getByText('South Africa')).toBeInTheDocument();
    expect(screen.getByText('Design, build, test, and deploy the customer portal.')).toBeInTheDocument();
    expect(screen.getByText('R 50000.00')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});

describe('ContractPreview integration', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('returns to the contract builder when the back button is clicked', () => {
    renderContractPreview();

    fireEvent.click(screen.getByRole('button', { name: /back to editor/i }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/contract-builder');
  });

  test('exports the contract PDF when the download button is clicked', async () => {
    renderContractPreview();

    fireEvent.click(screen.getAllByRole('button', { name: /download pdf/i })[0]);

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('contract-section', 'contract'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });

  test('shows a readable error when the PDF export fails', async () => {
    mockExportPDF.mockRejectedValueOnce(new Error('Canvas unavailable'));
    renderContractPreview();

    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }));

    expect(await screen.findByText('PDF export failed: Canvas unavailable')).toBeInTheDocument();
  });
});
