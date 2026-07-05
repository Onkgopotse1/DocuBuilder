import { useNavigate } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { useTheme } from "../../context/Theme Context.tsx";
import type { TimesheetRow } from "../../context/DocumentContext";
import { pageThemes } from "../../data/pageThemes";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TimesheetBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const { theme } = useTheme();
  const timesheet = document.timesheet;
  const pageTheme = pageThemes.Timesheet;

  const updateField = (field: keyof typeof timesheet, value: any) => {
    setDocument((prev) => ({ ...prev, timesheet: { ...prev.timesheet, [field]: value } }));
  };

  const updateRow = (index: number, field: keyof TimesheetRow, value: any) => {
    setDocument((prev) => {
      const rows = [...prev.timesheet.rows];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, timesheet: { ...prev.timesheet, rows } };
    });
  };

  const addRow = () => {
    const newRow: TimesheetRow = { projectName: "", hours: [0, 0, 0, 0, 0, 0, 0] };
    setDocument((prev) => ({
      ...prev,
      timesheet: { ...prev.timesheet, rows: [...prev.timesheet.rows, newRow] },
    }));
  };

  const removeRow = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      timesheet: { ...prev.timesheet, rows: prev.timesheet.rows.filter((_, i) => i !== index) },
    }));
  };

  // Calculate daily totals
  const dailyTotals = days.map((_, dayIdx) =>
    timesheet.rows.reduce((sum, row) => sum + (row.hours[dayIdx] || 0), 0)
  );
  const totalHours = dailyTotals.reduce((a, b) => a + b, 0) + timesheet.overtimeHours;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? pageTheme.dark : pageTheme.light} font-['Inter',system-ui,sans-serif] ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} pb-16`}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full bg-[#fdf8f0]/90 backdrop-blur-md border-b border-amber-200/60 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-200 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-slate-700 text-sm hidden sm:block">Timesheet Builder</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/timesheet-preview")}
            className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md shadow-amber-500/25 hover:bg-amber-600 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => navigate("/timesheet-preview?download=1")}
            className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md shadow-amber-500/25 hover:bg-amber-600 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto pt-24 px-4 space-y-5">
        {/* Header */}
        <div className="flex items-end justify-between px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Weekly</p>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Timesheet</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Total Hours</p>
            <p className="text-2xl font-black text-amber-500">{totalHours}h</p>
          </div>
        </div>

        {/* Employee details */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
          <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-4">Employee Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Full Name</label>
              <input
                type="text"
                value={timesheet.employeeName}
                onChange={(e) => updateField("employeeName", e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Job Title / Role</label>
              <input
                type="text"
                value={timesheet.jobTitle}
                onChange={(e) => updateField("jobTitle", e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Department</label>
              <input
                type="text"
                value={timesheet.department}
                onChange={(e) => updateField("department", e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Submitted To</label>
              <input
                type="text"
                value={timesheet.submittedTo}
                onChange={(e) => updateField("submittedTo", e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Week Starting</label>
              <input
                type="date"
                value={timesheet.weekStarting}
                onChange={(e) => updateField("weekStarting", e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Week Ending</label>
              <input
                type="date"
                value={timesheet.weekEnding}
                onChange={(e) => updateField("weekEnding", e.target.value)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Hourly Rate (R)</label>
              <input
                type="number"
                value={timesheet.hourlyRate}
                onChange={(e) => updateField("hourlyRate", parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Hour grid */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-widest text-amber-500">Hours per Day</p>
            <p className="text-xs text-slate-400">Enter hours worked each day</p>
          </div>

          <div className="p-6 space-y-3">
            {/* Day column headers */}
            <div className="grid grid-cols-8 gap-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Project</div>
              {days.map((d) => (
                <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">{d}</div>
              ))}
            </div>

            {timesheet.rows.map((row, rowIdx) => {
              // Choose a color for the dot based on index (same as original)
              const colors = ["bg-amber-400", "bg-slate-300", "bg-sky-400"];
              const dotColor = colors[rowIdx % colors.length];
              const rowTotal = row.hours.reduce((a, b) => a + b, 0);
              return (
                <div key={rowIdx} className="grid grid-cols-8 gap-2 items-center group">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`}></div>
                    <input
                      type="text"
                      value={row.projectName}
                      onChange={(e) => updateRow(rowIdx, "projectName", e.target.value)}
                      className="w-full text-xs font-semibold text-slate-600 bg-transparent focus:outline-none border-b border-transparent focus:border-amber-300 transition-colors pb-0.5 truncate"
                    />
                  </div>
                  {row.hours.map((hour, dayIdx) => (
                    <input
                      key={dayIdx}
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={hour}
                      onChange={(e) => {
                        const newHours = [...row.hours];
                        newHours[dayIdx] = parseFloat(e.target.value) || 0;
                        updateRow(rowIdx, "hours", newHours);
                      }}
                      className="text-center px-1 py-2 bg-amber-50/60 border border-amber-100 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all placeholder:text-slate-200 w-full"
                    />
                  ))}
                </div>
              );
            })}

            {/* Add row button */}
            <button
              onClick={addRow}
              className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors mt-1"
            >
              <span className="w-6 h-6 rounded-lg border border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Add project row
            </button>

            {/* Day totals */}
            <div className="grid grid-cols-8 gap-2 pt-3 border-t border-amber-100">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">Daily Total</div>
              {dailyTotals.map((total, idx) => (
                <div key={idx} className="text-center text-sm font-black text-amber-600 bg-amber-50 rounded-lg py-1.5">
                  {total}h
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overtime + notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-4">Overtime</p>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Overtime Hours</label>
                <input
                  type="number"
                  value={timesheet.overtimeHours}
                  onChange={(e) => updateField("overtimeHours", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">OT Rate (R/hr)</label>
                <input
                  type="number"
                  value={timesheet.overtimeRate}
                  onChange={(e) => updateField("overtimeRate", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-4">Notes</p>
            <textarea
              rows={4}
              value={timesheet.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Public holidays, sick days, leave taken..."
              className="w-full px-4 py-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all resize-none placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}