import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ReportBuilder from '../../../features/report/ReportBuilder.tsx';
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

const renderReportBuilder = () =>
  renderWithProviders(<ReportBuilder />);

const ReportStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="report-state">{JSON.stringify(document.report)}</output>;
};

describe('ReportBuilder rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the builder structure and action buttons', () => {
    renderReportBuilder();

    expect(screen.getByText('Report Builder')).toBeInTheDocument();
    expect(screen.getByText('Report Details')).toBeInTheDocument();
    expect(screen.getByText('Prepared By')).toBeInTheDocument();
    expect(screen.getByText('Prepared For')).toBeInTheDocument();
    expect(screen.getByText('Report Entries')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
  });

  test('renders the default report values and theme classes', () => {
    const lightRender = renderReportBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#f8fafc]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderReportBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-slate-900', 'text-slate-100');
  });
});

describe('ReportBuilder data flow', () => {
  afterEach(cleanup);

  test('updates the report document state as fields change', () => {
    renderWithProviders(<><ReportBuilder /><ReportStateObserver /></>);

    fireEvent.change(screen.getByPlaceholderText('e.g. Q2 Financial Summary'), { target: { value: 'Q3 Financial Summary' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. RPT-2025-001'), { target: { value: 'RPT-2025-120' } });
    fireEvent.change(screen.getByPlaceholderText('Your business name'), { target: { value: 'Northstar Studio' } });
    fireEvent.change(screen.getByPlaceholderText('Client or department'), { target: { value: 'Acme Holdings' } });

    const report = JSON.parse(screen.getByTestId('report-state').textContent ?? '{}');
    expect(report).toMatchObject({
      title: 'Q3 Financial Summary',
      reportNumber: 'RPT-2025-120',
      preparedByName: 'Northstar Studio',
      preparedForName: 'Acme Holdings',
    });
  });
});

describe('ReportBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates home and into the preview flow', () => {
    renderReportBuilder();

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/report-preview');

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mockNavigate).toHaveBeenLastCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
