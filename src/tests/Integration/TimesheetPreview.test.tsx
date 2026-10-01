import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import TimesheetPreview from '../../features/timesheet/TimesheetPreview';
import { DocumentProvider, useDocument } from '../../context/DocumentContext';
import type { Timesheet } from '../../context/DocumentContext';
import { ThemeProvider } from '../../context/Theme Context.tsx';

const { mockExportPDF } = vi.hoisted(() => ({ mockExportPDF: vi.fn() }));

vi.mock('../../utils/PDF.Generator', () => ({
  exportPDF: mockExportPDF,
}));

const populatedTimesheet: Timesheet = {
  employeeName: 'Alicia Mokoena',
  jobTitle: 'Senior Frontend Developer',
  department: 'Engineering',
  submittedTo: 'Jane Smith',
  weekStarting: '2025-06-09',
  weekEnding: '2025-06-15',
  hourlyRate: 300,
  rows: [
    { projectName: 'Project Alpha', hours: [8, 8, 7, 8, 6, 0, 0] },
    { projectName: 'Admin', hours: [0, 0, 1, 0, 2, 0, 0] },
  ],
  overtimeHours: 4,
  overtimeRate: 450,
  notes: 'Extra work for launch prep.',
};

const renderTimesheetPreview = (initialEntries = ['/timesheet-preview']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <DocumentProvider>
          <TimesheetPreview />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const TimesheetSeed = ({ timesheet = populatedTimesheet }: { timesheet?: Timesheet }) => {
  const { document, setDocument } = useDocument();
  return (
    <>
      <button type="button" onClick={() => setDocument({ ...document, timesheet })}>Load timesheet data</button>
      <TimesheetPreview />
    </>
  );
};

const LocationObserver = () => {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
};

describe('TimesheetPreview rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the weekly summary and document header', () => {
    renderTimesheetPreview();

    expect(screen.getByText('Weekly Timesheet')).toBeInTheDocument();
    expect(screen.getAllByText('John Mokoena')[0]).toBeInTheDocument();
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText('Total Hours')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /download pdf/i })[0]).toBeInTheDocument();
  });

  test('applies theme classes', () => {
    const lightRender = renderTimesheetPreview();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#fdf8f0]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderTimesheetPreview();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-yellow-950');
  });
});

describe('TimesheetPreview data flow', () => {
  afterEach(cleanup);

  test('renders the seeded timesheet data into the preview', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <TimesheetSeed />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Load timesheet data' }));

    expect(screen.getAllByText('Alicia Mokoena')[0]).toBeInTheDocument();
    expect(screen.getByText(/Senior Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getAllByText('Project Alpha')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Admin')[0]).toBeInTheDocument();
    expect(screen.getByText('Extra work for launch prep.')).toBeInTheDocument();
  });
});

describe('TimesheetPreview integration', () => {
  beforeEach(() => {
    mockExportPDF.mockReset();
    mockExportPDF.mockResolvedValue(undefined);
  });

  afterEach(cleanup);

  test('navigates back to the builder', async () => {
    render(
      <MemoryRouter initialEntries={['/timesheet-preview']}>
        <ThemeProvider>
          <DocumentProvider>
            <TimesheetPreview />
            <LocationObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button')[0]);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/timesheet-builder'));
  });

  test('exports the timesheet section when the PDF button is clicked', async () => {
    renderTimesheetPreview();

    fireEvent.click(screen.getAllByRole('button', { name: /download pdf/i })[0]);

    await waitFor(() => expect(mockExportPDF).toHaveBeenCalledWith('timesheet-section', 'timesheet'));
    expect(mockExportPDF).toHaveBeenCalledTimes(1);
  });
});
