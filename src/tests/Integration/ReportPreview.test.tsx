import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ReportPreview from '../../features/report/ReportPreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import type { Report } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedReport: Report = {
  title: 'Q3 Financial Summary',
  type: 'Financial Summary',
  reportNumber: 'RPT-2025-120',
  dateFrom: '2025-07-01',
  dateTo: '2025-09-30',
  preparedByName: 'Northstar Studio',
  preparedByEmail: 'billing@northstar.example',
  preparedForName: 'Acme Holdings',
  preparedForEmail: 'accounts@acme.example',
  items: [
    { category: 'Revenue', description: 'Website retainer', amount: 25000 },
    { category: 'Expense', description: 'Tooling', amount: 4800 },
  ],
  taxRate: 15,
  notes: 'Project revenue increased over the quarter.',
};

const renderReportPreview = (initialEntries = ['/report-preview']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <DocumentProvider>
          <ReportPreview />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const ReportSeed = ({ report = populatedReport }: { report?: Report }) => {
  const { document, setDocument } = useDocument();

  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, report })}>Load report data</button>
      <ReportPreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('ReportPreview rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the report preview and summary sections', () => {
    renderReportPreview();

    expect(screen.getByText('Report Preview')).toBeInTheDocument();
    expect(screen.getByText('Q2 Financial Summary')).toBeInTheDocument();
    expect(screen.getByText('Prepared By')).toBeInTheDocument();
    expect(screen.getByText('Prepared For')).toBeInTheDocument();
    expect(screen.getByText('Report Entries')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /download pdf/i })[0]).toBeInTheDocument();
  });

  test('applies the light and dark themes', () => {
    const lightRender = renderReportPreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#f8fafc]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderReportPreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-slate-900');
  });
});

describe('ReportPreview data flow', () => {
  afterEach(cleanup);

  test('renders the content from document context', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <ReportSeed />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load report data' }));

    expect(screen.getByText('Q3 Financial Summary')).toBeInTheDocument();
    expect(screen.getByText('Northstar Studio')).toBeInTheDocument();
    expect(screen.getByText('Acme Holdings')).toBeInTheDocument();
    expect(screen.getByText('Website retainer')).toBeInTheDocument();
    expect(screen.getByText('Tooling')).toBeInTheDocument();
    expect(screen.getByText('Project revenue increased over the quarter.')).toBeInTheDocument();
  });
});

describe('ReportPreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the builder', async () => {
    render(
      <MemoryRouter initialEntries={['/report-preview']}>
        <ThemeProvider>
          <DocumentProvider>
            <ReportPreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/report-builder'));
  });

  test('exports the report when the PDF button is clicked', async () => {
    renderReportPreview();

    fireEvent.click(screen.getAllByRole('button', { name: /download pdf/i })[0]);

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('report-section', 'report'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});
