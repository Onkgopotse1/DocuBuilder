import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { exportPDF } from "../../utils/PDF.Generator";

export default function InvoicePreview() {
const navigate = useNavigate();

//-----this code calculates the subtotal, tax, and total amounts for the invoice based on the items and tax rate provided in the document context-----------------
  const { document } = useDocument();
  const invoice = document.invoice;

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;
//---------------------

//-----this function is responsible for exporting the invoice as a PDF when the download button is clicked-----------------
  const handleExport = async () => {
    setExportError(null);
    try {
      await exportPDF("invoice-section", "invoice"); // "invoice" is the name of the file that will be downloaded
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setExportError(`PDF export failed: ${message}`);
    }
  };
//---------------------

//-----this code is  responsible for making the download button in InvoiceBuilder work-----------------

  const [searchParams, setSearchParams] = useSearchParams();       // ← read URL params
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);   // ← prevent double call

    // Auto-download when ?download=1 is present (once)
  useEffect(() => {
    const shouldAutoDownload = searchParams.get("download") === "1";
    if (shouldAutoDownload && !isAutoExporting) {
      setIsAutoExporting(true);
      handleExport().finally(() => {
        // Remove the query parameter without reloading the page
        setSearchParams({}, { replace: true });
        setIsAutoExporting(false);
      });
    }
  }, [searchParams]);
  //-------------------------------


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-['Inter',system-ui,-apple-system,sans-serif] py-8 px-4 sm:px-6 text-slate-800">
      <div className="max-w-4xl mx-auto pt-20">
        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-50 shadow-sm">
          <div className="flex gap-3">
            <button onClick={() => navigate("/invoice-builder")} className="flex items-center justify-center px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm gap-2">
              <span>←</span>
              <span>Back to Builder</span>
            </button>
          </div>
        </nav>

        <div id="invoice-section" className="rounded-3xl shadow-2xl p-6 md:p-10 border-2" style={{ backgroundColor: "#ffffff", color: "#0f172a", borderColor: "#cbd5e1", boxShadow: "0 25px 50px -12px rgba(148,163,184,0.5)" }}>
          <h2 className="text-lg font-semibold flex items-center gap-2 pb-4 mb-8 uppercase tracking-wider" style={{ color: "#6b7280", borderBottomWidth: 2, borderBottomStyle: 'solid', borderBottomColor: '#cbd5e1' }}>🔍 Live Invoice Preview</h2>

          <div className="invoice-document" style={{ backgroundColor: "#ffffff", color: "#0f172a" }}>
            <div className="preview-header flex justify-between items-start mb-10 flex-wrap gap-6">
              <div className="brand">
                <h2 className="text-3xl font-black tracking-tight" style={{ color: "#0f172a" }}>FLIGHT BRIEF</h2>
                <div className="text-sm font-medium mt-1" style={{ color: "#2563eb" }}>Professional Services</div>
              </div>
              <div className="invoice-meta text-right space-y-1">
                <div className="text-sm" style={{ color: "#64748b" }}>Invoice Number</div>
                <div className="text-lg font-bold" style={{ color: "#0f172a" }}>{invoice.invoiceNumber || "N/A"}</div>
                <div className="text-sm mt-3" style={{ color: "#64748b" }}>Date Issued</div>
                <div className="font-semibold" style={{ color: "#0f172a" }}>{invoice.invoiceDate || "N/A"}</div>
              </div>
            </div>

            <div className="client-section mb-10 p-6 rounded-2xl border-2" style={{ backgroundColor: "#f8fafc", borderColor: "#cbd5e1" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#64748b" }}>Billed To</div>
              <div className="text-lg font-bold" style={{ color: "#0f172a" }}>{invoice.clientName || "N/A"}</div>
              <div className="mt-1" style={{ color: "#475569" }}>{invoice.clientEmail || "N/A"}</div>
              <div className="mt-1 leading-relaxed" style={{ color: "#475569" }}>{invoice.clientAddress || "N/A"}</div>
            </div>

            <div className="overflow-hidden rounded-2xl border-2 mb-8 shadow-md" style={{ borderColor: "#cbd5e1" }}>
              <table className="w-full text-left">
                <thead className="text-sm font-bold" style={{ background: "linear-gradient(to right, #1e293b, #0f172a)", color: "#ffffff", borderBottomWidth: 2, borderBottomStyle: 'solid', borderBottomColor: '#cbd5e1' }}>
                  <tr>
                    <th className="py-5 px-6">Description</th>
                    <th className="py-5 px-6 w-24 text-center">Qty</th>
                    <th className="py-5 px-6 w-32 text-right">Unit Price</th>
                    <th className="py-5 px-6 w-32 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, i) => (
                    <tr key={i} className="transition-colors duration-200 hover:shadow-sm" style={{ backgroundColor: "transparent", borderTop: "1px solid #cbd5e1" }}>
                      <td className="py-5 px-6 font-medium text-base" style={{ color: "#1e293b" }}>{item.description}</td>
                      <td className="py-5 px-6 text-center font-semibold text-base" style={{ color: "#475569" }}>{item.quantity}</td>
                      <td className="py-5 px-6 text-right font-semibold text-base" style={{ color: "#475569" }}>R {item.unitPrice.toFixed(2)}</td>
                      <td className="py-5 px-6 text-right font-bold text-base" style={{ color: "#1e293b" }}>R {(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between px-6" style={{ color: "#475569" }}>
                  <span>Subtotal</span>
                  <span className="font-semibold" style={{ color: "#0f172a" }}>R {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between px-6" style={{ color: "#475569" }}>
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span className="font-semibold" style={{ color: "#0f172a" }}>R {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-6 rounded-2xl mt-4" style={{ backgroundColor: '#f8fafc', borderWidth: 2, borderStyle: 'solid', borderColor: '#cbd5e1' }}>
                  <span className="text-lg font-bold" style={{ color: "#0f172a" }}>Total Due</span>
                  <span className="text-2xl font-black" style={{ color: "#2563eb" }}>R {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-sm text-center pt-6" style={{ color: "#94a3b8", borderTop: "2px solid #cbd5e1" }}>
              <p>Thank you for your business. Payment is due within 30 days.</p>
            </div>
          </div>

          <button onClick={handleExport} className="py-4 px-6 rounded-2xl font-semibold text-base w-full mt-8 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2" style={{ backgroundColor: "#0f172a", color: "#ffffff", boxShadow: "0 20px 25px -5px rgba(15,23,42,0.3), 0 8px 10px -6px rgba(15,23,42,0.3)" }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download PDF Invoice
          </button>
          {exportError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {exportError}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}