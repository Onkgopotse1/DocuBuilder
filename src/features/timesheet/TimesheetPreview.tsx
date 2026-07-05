import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { useTheme } from "../../context/Theme Context.tsx";
import { exportPDF } from "../../utils/PDF.Generator";
import { pageThemes } from "../../data/pageThemes";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TimesheetPreview() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const pageTheme = pageThemes.Timesheet;
  const [searchParams, setSearchParams] = useSearchParams();
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const { document } = useDocument();
  const timesheet = document.timesheet;

  const dailyTotals = days.map((_, dayIdx) =>
    timesheet.rows.reduce((sum, row) => sum + (row.hours[dayIdx] || 0), 0)
  );
  const totalRegularHours = dailyTotals.reduce((a, b) => a + b, 0);
  const totalHours = totalRegularHours + timesheet.overtimeHours;
  const regularPay = (totalRegularHours - timesheet.overtimeHours) * timesheet.hourlyRate;
  const overtimePay = timesheet.overtimeHours * timesheet.overtimeRate;
  const totalEarnings = regularPay + overtimePay;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportPDF("timesheet-section", "timesheet");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setExportError(`PDF export failed: ${message}`);
    }
  };

  useEffect(() => {
    const shouldAutoDownload = searchParams.get("download") === "1";
    if (shouldAutoDownload && !isAutoExporting) {
      setIsAutoExporting(true);
      handleExport().finally(() => {
        setSearchParams({}, { replace: true });
        setIsAutoExporting(false);
      });
    }
  }, [searchParams]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? pageTheme.dark : pageTheme.light} font-['Inter',system-ui,sans-serif] pb-16 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
      <nav className="fixed top-0 left-0 w-full bg-[#fdf8f0]/90 backdrop-blur-md border-b border-amber-200/60 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate("/timesheet-builder")}
          className="group w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-500 hover:text-white transition-all active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-slate-700 text-sm hidden sm:block">Timesheet Preview</span>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md shadow-amber-500/25 hover:bg-amber-600 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-4xl mx-auto pt-24 px-4">
        <div
          id="timesheet-section"
          className="bg-[#ffffff] rounded-3xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)] border border-[#f0abfc] overflow-hidden"
          style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        >
          <style>
            {`#timesheet-section, #timesheet-section * { color: #0f172a !important; border-color: #cbd5e1 !important; background-color: transparent !important; fill: #0f172a !important; }
            #timesheet-section { background-color: #ffffff !important; }
            #timesheet-section .bg-amber-100 { background-color: #fef3c7 !important; }
            #timesheet-section .bg-amber-500 { background-color: #f59e0b !important; color: #ffffff !important; }
            #timesheet-section .text-amber-600 { color: #d97706 !important; }
            #timesheet-section .bg-[#f59e0b] { background-color: #f59e0b !important; }`}
          </style>

          {/* Header */}
          <div className="px-8 py-7 flex justify-between items-start border-b border-[#fcd34d]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#d97706] mb-1">Weekly Timesheet</p>
              <h1 className="text-2xl font-black text-[#0f172a]">{timesheet.employeeName || "—"}</h1>
              <p className="text-[#64748b] text-sm mt-0.5">
                {timesheet.jobTitle || "—"} · {timesheet.department || "—"}
              </p>
              <p className="text-[#94a3b8] text-xs mt-1">
                Submitted to: <span className="font-semibold text-[#64748b]">{timesheet.submittedTo || "—"}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#d97706] mb-1">Period</p>
              <p className="text-sm font-bold text-[#0f172a]">
                {formatDate(timesheet.weekStarting)} – {formatDate(timesheet.weekEnding)}
              </p>
              <div className="mt-3 bg-[#ffedd5] border border-[#fcd34d] rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-[#d97706] font-medium">Total Hours</p>
                <p className="text-2xl font-black text-[#d97706]">{totalHours}h</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="px-8 py-6 overflow-x-auto">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-4">Hours Breakdown</p>
            <table className="w-full min-w-[520px]">
              <thead>
                <tr>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] pb-3 w-36">Project</th>
                  {days.map((d) => (
                    <th key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] pb-3">
                      {d}
                    </th>
                  ))}
                  <th className="text-center text-[10px] font-bold uppercase tracking-wider text-[#d97706] pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {timesheet.rows.map((row, ri) => {
                  const rowTotal = row.hours.reduce((s, h) => s + h, 0);
                  const colorClasses = [
                    "bg-[#f59e0b]",
                    "bg-[#cbd5e1]",
                    "bg-[#38bdf8]",
                    "bg-[#a78bfa]",
                    "bg-[#34d399]",
                  ];
                  const dotColor = colorClasses[ri % colorClasses.length];
                  return (
                    <tr key={ri} className="border-t border-[#f8fafc]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                          <span className="text-sm font-semibold text-[#0f172a]">{row.projectName || "—"}</span>
                        </div>
                      </td>
                      {row.hours.map((h, di) => (
                        <td key={di} className="py-3 text-center">
                          <span className={`text-sm font-bold ${h > 0 ? "text-[#0f172a]" : "text-[#e2e8f0]"}`}>
                            {h > 0 ? h : "—"}
                          </span>
                        </td>
                      ))}
                      <td className="py-3 text-center">
                        <span className="text-sm font-black text-[#d97706] bg-[#ffedd5] px-2 py-0.5 rounded-lg">
                          {rowTotal}h
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-[#fcd34d]">
                  <td className="py-3 text-xs font-black uppercase tracking-wider text-[#64748b]">Daily Total</td>
                  {dailyTotals.map((h, di) => (
                    <td key={di} className="py-3 text-center">
                      <span className={`text-sm font-black ${h > 0 ? "text-[#d97706]" : "text-[#e2e8f0]"}`}>
                        {h > 0 ? `${h}h` : "—"}
                      </span>
                    </td>
                  ))}
                  <td className="py-3 text-center">
                    <span className="text-sm font-black text-[#b45309]">{totalRegularHours}h</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pay summary */}
          <div className="mx-8 mb-6 bg-[#ffedd5] rounded-2xl border border-[#fcd34d] p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-[#d97706] mb-3">Pay Summary</p>
            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">
                  {totalRegularHours - timesheet.overtimeHours}h regular @ R{timesheet.hourlyRate}/hr
                </span>
                <span className="font-semibold text-[#334155]">R{regularPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">{timesheet.overtimeHours}h overtime @ R{timesheet.overtimeRate}/hr</span>
                <span className="font-semibold text-[#334155]">R{overtimePay.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#fcd34d] flex justify-between">
                <span className="font-black text-[#0f172a]">Total Earnings</span>
                <span className="font-black text-[#d97706] text-lg">R{totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mx-8 mb-8 grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-6">Employee Signature</p>
              <div className="border-t-2 border-[#cbd5e1] pt-2">
                <p className="text-xs text-[#94a3b8]">{timesheet.employeeName || "—"}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-6">Manager Approval</p>
              <div className="border-t-2 border-dashed border-[#e2e8f0] pt-2">
                <p className="text-xs text-[#94a3b8]">Signature & date</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {timesheet.notes && (
            <div className="px-8 pb-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Notes</p>
              <p className="text-sm text-[#64748b] leading-relaxed bg-[#f8fafc] rounded-xl px-4 py-3 border border-[#f1f5f9]">
                {timesheet.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="bg-[#ffedd5] border-t border-[#fcd34d] px-8 py-3 flex justify-between">
            <span className="text-xs text-[#94a3b8] font-medium">DocuBuilder</span>
            <span className="text-xs text-[#94a3b8]">{new Date().toLocaleDateString("en-ZA")}</span>
          </div>
        </div>

        {exportError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {exportError}
          </div>
        )}
      </div>
    </div>
  );
}