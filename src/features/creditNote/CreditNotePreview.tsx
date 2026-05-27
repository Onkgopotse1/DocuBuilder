import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { exportPDF } from "../../utils/PDF.Generator";

export default function CreditNotePreview() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const { document } = useDocument();
  const creditNote = document.creditNote;

  const totalAmount = creditNote.items.reduce((sum, item) => sum + item.amount, 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
  };

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportPDF("creditnote-section", "credit-note");
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

  // Build reason display string (including "Other" custom text)
  const reasonText = creditNote.reason === "Other" && creditNote.reasonOtherText
    ? creditNote.reasonOtherText
    : creditNote.reason;

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] pb-16">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-400 z-50"></div>

      <nav className="fixed top-1 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 py-3 flex justify-between items-center z-40 shadow-sm">
        <button
          onClick={() => navigate("/credit-note-builder")}
          className="group w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-rose-400 hover:text-rose-500 transition-all active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Preview</p>
          <p className="text-sm font-black text-slate-800 leading-none mt-0.5">Credit Note</p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2 rounded-xl font-black text-sm hover:bg-rose-600 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-28 px-6">
        <div
          id="creditnote-section"
          className="border-2 border-[#f1f5f9] rounded-3xl overflow-hidden shadow-xl bg-[#ffffff]"
          style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        >
          <style>
            {`#creditnote-section, #creditnote-section * { color: #0f172a !important; border-color: #f1f5f9 !important; background-color: transparent !important; fill: #0f172a !important; }
            #creditnote-section { background-color: #ffffff !important; }
            #creditnote-section .bg-rose-50 { background-color: #fff1f2 !important; }
            #creditnote-section .text-rose-500 { color: #ef4444 !important; }
            #creditnote-section .bg-[#ffe4e6] { background-color: #ffe4e6 !important; }
            #creditnote-section .text-[#dc2626] { color: #dc2626 !important; }`}
          </style>

          {/* Document header */}
          <div className="p-8 border-b-2 border-[#f1f5f9]">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Credit Note
                </div>
                <h1 className="text-xl font-black text-[#0f172a]">{creditNote.issuerName || "—"}</h1>
                <p className="text-[#64748b] text-sm">{creditNote.issuerEmail || "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#dc2626]">{creditNote.creditNoteNumber || "—"}</p>
                <p className="text-xs text-[#94a3b8] mt-1">Issued: {formatDate(creditNote.issueDate)}</p>
                <p className="text-xs text-[#94a3b8]">Ref: {creditNote.originalInvoiceNumber || "—"}</p>
              </div>
            </div>
          </div>

          {/* From/To */}
          <div className="grid grid-cols-2 border-b border-[#f1f5f9]">
            <div className="p-6 border-r border-[#f1f5f9]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#dc2626] mb-2">Credit Issued By</p>
              <p className="font-bold text-[#0f172a] text-sm">{creditNote.issuerName || "—"}</p>
              <p className="text-[#64748b] text-sm">{creditNote.issuerEmail || "—"}</p>
              <p className="text-[#94a3b8] text-xs mt-1">{creditNote.issuerAddress || "—"}</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Issued To</p>
              <p className="font-bold text-[#0f172a] text-sm">{creditNote.clientName || "—"}</p>
              <p className="text-[#64748b] text-sm">{creditNote.clientEmail || "—"}</p>
              <p className="text-[#94a3b8] text-xs mt-1">{creditNote.clientAddress || "—"}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="px-8 py-4 bg-[#ffe4e6] border-b border-[#f1f5f9] flex items-center gap-3">
            <svg className="w-4 h-4 text-[#dc2626] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#475569]">
              <span className="font-bold text-[#0f172a]">Reason:</span> {reasonText || "—"} — {creditNote.additionalDetails || ""}
            </p>
          </div>

          {/* Items */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-12 gap-2 pb-2 border-b border-[#f1f5f9]">
              <span className="col-span-6 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] text-center">Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] text-right">Unit Price</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] text-right">Amount</span>
            </div>
            {creditNote.items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 py-3 border-b border-[#f8fafc] items-center">
                <div className="col-span-6 text-sm text-[#0f172a]">{item.description || "—"}</div>
                <div className="col-span-2 text-sm text-[#475569] text-center">{item.quantity}</div>
                <div className="col-span-2 text-sm text-[#475569] text-right">R{item.unitPrice.toFixed(2)}</div>
                <div className="col-span-2 text-sm font-bold text-[#0f172a] text-right">R{item.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mx-8 mb-8 flex justify-between items-center border-t-2 border-[#0f172a] pt-4">
            <p className="font-black text-[#0f172a]">Total Credit Amount</p>
            <p className="font-black text-[#dc2626] text-2xl">R{totalAmount.toFixed(2)}</p>
          </div>

          <div className="bg-[#f8fafc] border-t border-[#f1f5f9] px-8 py-3 flex justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#fda4af]"></div>
              <span className="text-xs text-[#94a3b8] font-medium">DocuBuilder</span>
            </div>
            <span className="text-xs text-[#94a3b8]">
              {creditNote.creditNoteNumber} · {new Date().toLocaleDateString("en-ZA")}
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