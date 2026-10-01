import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TimesheetBuilder from '../../features/timesheet/TimesheetBuilder';
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

const renderTimesheetBuilder = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <DocumentProvider>
          <TimesheetBuilder />
        </DocumentProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

const TimesheetStateObserver = () => {
  const { document } = useDocument();
  return <output data-testid="timesheet-state">{JSON.stringify(document.timesheet)}</output>;
};

describe('TimesheetBuilder rendering', () => {
  beforeEach(() => window.localStorage.removeItem('docubuilder-theme'));
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem('docubuilder-theme');
  });

  test('renders the core form sections and total hours summary', () => {
    renderTimesheetBuilder();

    expect(screen.getByText('Timesheet')).toBeInTheDocument();
    expect(screen.getByText('Employee Info')).toBeInTheDocument();
    expect(screen.getByText('Hours per Day')).toBeInTheDocument();
    expect(screen.getByText('Overtime')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByText('Total Hours')).toBeInTheDocument();
  });

  test('applies the light and dark theme classes', () => {
    const lightRender = renderTimesheetBuilder();
    expect(lightRender.container.querySelector('.min-h-screen')).toHaveClass('bg-[#fdf8f0]');

    cleanup();
    window.localStorage.setItem('docubuilder-theme', 'dark');
    const darkRender = renderTimesheetBuilder();
    expect(darkRender.container.querySelector('.min-h-screen')).toHaveClass('bg-yellow-950', 'text-slate-100');
  });
});

describe('TimesheetBuilder data flow', () => {
  afterEach(cleanup);

  test('updates fields and row values in the timesheet document', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <DocumentProvider>
            <TimesheetBuilder />
            <TimesheetStateObserver />
          </DocumentProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByDisplayValue('John Mokoena');
    fireEvent.change(nameInput, { target: { value: 'Alicia Mokoena' } });
    fireEvent.change(screen.getByDisplayValue('Frontend Developer'), { target: { value: 'Senior Frontend Developer' } });

    const timesheet = JSON.parse(screen.getByTestId('timesheet-state').textContent ?? '{}');
    expect(timesheet).toMatchObject({
      employeeName: 'Alicia Mokoena',
      jobTitle: 'Senior Frontend Developer',
    });
  });
});

describe('TimesheetBuilder integration', () => {
  afterEach(() => {
    cleanup();
    mockNavigate.mockReset();
  });

  test('navigates home and preview', () => {
    renderTimesheetBuilder();

    fireEvent.click(screen.getByRole('button', { name: /preview/i }));
    expect(mockNavigate).toHaveBeenLastCalledWith('/timesheet-preview');

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(mockNavigate).toHaveBeenLastCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
