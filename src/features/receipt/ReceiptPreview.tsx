import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { useTheme } from "../../context/Theme Context.tsx";
import { exportPDF } from "../../utils/PDF.Generator";
import { pageThemes } from "../../data/pageThemes";

export default function ReceiptPreview() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const pageTheme = pageThemes.receipt;
  const [searchParams, setSearchParams] = useSearchParams();
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const { document } = useDocument();
  const receipt = document.receipt;

  const subtotal = receipt.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (receipt.taxRate / 100);
  const total = subtotal + tax;

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportPDF("receipt-section", "receipt");
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
    <div className={`min-h-screen ${theme === 'dark' ? pageTheme.dark : pageTheme.light} font-sans transition-colors duration-300 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
      <nav className={`fixed top-0 z-50 w-full ${theme === 'dark' ? 'bg-slate-900/70 border-slate-700/50' : 'bg-white/70 border-slate-200/50'} backdrop-blur-xl border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/receipt-builder")}
                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="hidden sm:block border-l border-slate-200 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Review</p>
                <h2 className="text-sm font-bold text-slate-700">{receipt.receiptNumber} • {receipt.customerName}</h2>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-32 pb-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div id="receipt-section" className="lg:col-span-8 bg-[#ffffff] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#e2e8f0] overflow-hidden min-h-[297mm] flex flex-col relative">
            <div className="p-8 sm:p-16">
              <style>{`#receipt-section, #receipt-section * { color: #0f172a !important; border-color: #cbd5e1 !important; background-color: transparent !important; fill: #0f172a !important; }
              #receipt-section { background-color: #ffffff !important; }
              #receipt-section .bg-emerald-600 { background-color: #10b981 !important; color: #ffffff !important; }
              #receipt-section .bg-slate-900 { background-color: #0f172a !important; color: #ffffff !important; }
              #receipt-section .text-slate-400 { color: #94a3b8 !important; }
              #receipt-section .text-slate-700 { color: #334155 !important; }
              #receipt-section .bg-blue-600 { background-color: #2563eb !important; color:#ffffff !important; }`}</style>

              <div className="flex justify-between items-start mb-16">
                <div>
                  <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center text-[#ffffff] font-black text-xl mb-4">N</div>
                  <h1 className="text-2xl font-black tracking-tight">Nexus Solutions Inc.</h1>
                  <p className="text-[#94a3b8] text-xs mt-1">123 Business Blvd, Austin, TX</p>
                  <p className="text-[#94a3b8] text-xs">hello@nexus-solutions.com</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <h2 className="text-4xl font-black text-[#cbd5e1] uppercase tracking-tighter">Receipt</h2>
                  <p className="text-[#64748b] font-bold mt-2"># {receipt.receiptNumber}</p>
                  <div className="mt-4 bg-[#ecfdf5] border-2 border-[#047857] text-[#047857] px-4 py-1.5 rounded-md transform rotate-[-2deg]">
                    <p className="font-black tracking-widest text-lg uppercase">Paid in Full</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-16 py-8 border-y border-[#f8fafc]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Received From</p>
                  <p className="font-bold text-[#0f172a]">{receipt.customerName || "—"}</p>
                  <p className="text-[#64748b] text-sm mt-1">{receipt.customerEmail || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Payment Details</p>
                  <p className="text-sm"><span className="text-[#94a3b8]">Date Paid:</span> <span className="font-bold">{receipt.paymentDate || "—"}</span></p>
                  <p className="text-sm mt-1"><span className="text-[#94a3b8]">Method:</span> <span className="font-bold">{receipt.paymentMethod || "—"}</span></p>
                </div>
              </div>

              <div className="mb-12">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Description</th>
                      <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Qty</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {receipt.items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-6 font-bold text-[#0f172a]">{item.description || "—"}</td>
                        <td className="py-6 text-center text-[#475569]">{item.quantity}</td>
                        <td className="py-6 text-right text-[#0f172a] font-bold font-mono">R {(item.quantity * item.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-8">
                <div className="w-full sm:w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a3b8]">Subtotal</span>
                    <span className="font-bold">R {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a3b8]">Tax ({receipt.taxRate}%)</span>
                    <span className="font-bold">R {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-[#0f172a]">
                    <span className="text-xs font-black uppercase tracking-widest text-[#047857]">Total Paid</span>
                    <span className="text-xl font-black text-[#047857] font-mono">R {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-32 pt-10 border-t border-[#f1f5f9] flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-emerald-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-bold text-[#0f172a]">{receipt.memo || "Thank you for your payment!"}</p>
                <p className="text-[10px] text-[#94a3b8] mt-2">This is a valid receipt of payment.</p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Receipt Ready
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Your payment receipt is formatted and ready. You can email it to your client directly or download a copy for your records.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email to Client
                </button>
                <button
                  onClick={handleExport}
                  className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all"
                >
                  Download PDF
                </button>
              </div>
            </div>
            {exportError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {exportError}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}