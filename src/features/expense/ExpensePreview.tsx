import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { exportPDF } from "../../utils/PDF.Generator";

export default function ExpensePreview() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const { document } = useDocument();
  const expense = document.expense;

  const totalAmount = expense.items.reduce((sum, item) => sum + item.amount, 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
  };

  const formatPeriod = (from: string, to: string) => {
    if (!from || !to) return "—";
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return `${fromDate.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })} – ${toDate.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  const categoryColors: Record<string, string> = {
    Travel: "bg-sky-400",
    Meals: "bg-amber-400",
    Accommodation: "bg-indigo-400",
    Fuel: "bg-emerald-400",
    Software: "bg-violet-400",
    Equipment: "bg-pink-400",
    Stationery: "bg-slate-400",
    Other: "bg-gray-400",
  };

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportPDF("expense-section", "expense-claim");
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
    <div className="min-h-screen bg-[#0f172a] font-['Inter',system-ui,sans-serif] pb-16">
      <nav className="fixed top-0 left-0 w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate("/expense-builder")}
          className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white/70 hover:bg-teal-400 hover:text-[#0f172a] transition-all duration-200 active:scale-90"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-teal-400"></div>
          <span className="font-semibold text-white/90 text-sm tracking-tight">Expense Preview</span>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-teal-400 text-[#0f172a] px-5 py-2 rounded-xl font-black text-sm hover:bg-teal-300 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div
          id="expense-section"
          className="bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)]"
          style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        >
          <style>
            {`#expense-section, #expense-section * { color: #0f172a !important; border-color: #cbd5e1 !important; background-color: transparent !important; fill: #0f172a !important; }
            #expense-section { background-color: #ffffff !important; }
            #expense-section .bg-sky-400 { background-color: #38bdf8 !important; }
            #expense-section .bg-amber-400 { background-color: #f59e0b !important; }
            #expense-section .bg-emerald-400 { background-color: #34d399 !important; }
            #expense-section .bg-violet-400 { background-color: #a78bfa !important; }
            #expense-section .bg-slate-400 { background-color: #94a3b8 !important; }`}
          </style>

          {/* Left accent bar + header */}
          <div className="flex">
            <div className="w-2 bg-[#2dd4bf] flex-shrink-0"></div>
            <div className="flex-1 px-8 py-7 flex justify-between items-start">
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">Expense Claim</div>
                <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">{expense.claimantName || "—"}</h1>
                <div className="text-[#64748b] text-sm mt-0.5">
                  {expense.claimantRole || "—"} · {expense.claimantEmail || "—"}
                </div>
                <div className="text-[#94a3b8] text-xs mt-2">
                  Submitted to: <span className="font-semibold text-[#475569]">{expense.submittedTo || "—"}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-1">Claim No.</div>
                <div className="text-xl font-black text-[#0d9488]">{expense.claimNumber || "—"}</div>
                <div className="text-xs text-[#94a3b8] mt-1">{formatPeriod(expense.periodFrom, expense.periodTo)}</div>
                <div className="text-xs text-[#94a3b8]">{new Date().toLocaleDateString("en-ZA")}</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#f1f5f9] mx-8"></div>

          {/* Items */}
          <div className="px-8 py-6">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-5">Itemised Expenses</div>
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 pb-2 border-b border-[#f1f5f9]">
                <span className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-[#cbd5e1]">Date</span>
                <span className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-[#cbd5e1]">Category</span>
                <span className="col-span-6 text-[10px] font-bold uppercase tracking-wider text-[#cbd5e1]">Description</span>
                <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-[#cbd5e1] text-right">Amount</span>
              </div>
              {expense.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 py-3 border-b border-[#f8fafc] items-center">
                  <div className="col-span-1 text-xs text-[#94a3b8] font-medium">{formatDate(item.date)}</div>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${categoryColors[item.category] || "bg-[#cbd5e1]"}`}></div>
                    <span className="text-xs font-semibold text-[#475569]">{item.category || "—"}</span>
                  </div>
                  <div className="col-span-6 text-sm text-[#0f172a]">{item.description || "—"}</div>
                  <div className="col-span-2 text-sm font-bold text-[#0f172a] text-right">R{item.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Total band */}
          <div className="mx-8 mb-6 rounded-2xl border-2 border-[#a5f3fc] bg-[#ecfeff] px-6 py-4 flex justify-between items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-[#0d9488]">Total Claimed</div>
              <div className="text-xs text-[#94a3b8] mt-0.5">
                {expense.items.length} items ·{" "}
                {expense.periodTo ? new Date(expense.periodTo).toLocaleDateString("en-ZA", { month: "long", year: "numeric" }) : "—"}
              </div>
            </div>
            <span className="text-3xl font-black text-[#0d9488]">R{totalAmount.toFixed(2)}</span>
          </div>

          {/* Purpose */}
          <div className="px-8 pb-6">
            <div className="text-[11px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Purpose</div>
            <p className="text-sm text-[#64748b] leading-relaxed">{expense.notes || "No additional notes."}</p>
          </div>

          {/* Signatures */}
          <div className="mx-8 mb-8 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#cbd5e1] mb-6">Claimant Signature</div>
              <div className="border-t-2 border-[#e2e8f0] pt-2">
                <div className="text-xs font-semibold text-[#64748b]">{expense.claimantName || "—"}</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#cbd5e1] mb-6">Authorised By</div>
              <div className="border-t-2 border-dashed border-[#e2e8f0] pt-2">
                <div className="text-xs text-[#cbd5e1]">Signature & date</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              <span className="text-xs text-slate-400 font-medium">DocuBuilder</span>
            </div>
            <span className="text-xs text-slate-300">
              {expense.claimNumber} · {new Date().toLocaleDateString("en-ZA")}
            </span>
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