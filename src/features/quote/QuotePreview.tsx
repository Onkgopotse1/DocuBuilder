import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocument } from '../../context/DocumentContext';
import { useTheme } from "../../context/Theme Context.tsx";
import { exportPDF } from "../../utils/PDF.Generator";
import { calculateTotals, QUOTE_TAX_RATE_PERCENT } from "../../utils/calculateTotals";
import { pageThemes } from "../../data/pageThemes";

export default function QuotePreview() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const pageTheme = pageThemes.quote;

  //-----this code calculates the subtotal, tax, and total amounts for the quote based on the items provided in the document context-----------------
  const { document } = useDocument();
  const quote = document.quote;

  const { subtotal, tax, total } = calculateTotals(
    quote.items,
    (item) => item.quantity * item.unitPrice,
    QUOTE_TAX_RATE_PERCENT
  );
  //---------------------

//-----this function is responsible for exporting the quote as a PDF when the download button is clicked-----------------
   const handleExport = async () => {
     setExportError(null);
     try {
       await exportPDF("quote-section", "quote"); // "invoice" is the name of the file that will be downloaded
     } catch (error) {
       const message = error instanceof Error ? error.message : String(error);
       setExportError(`PDF export failed: ${message}`);
     }
   };
//---------------------

//-----this code is  responsible for making the download button in QuoteBuilder work-----------------
  const [searchParams, setSearchParams] = useSearchParams();       // ← read URL params
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);   // ← prevent double call

    // Auto-download when ?download=1 is present (once)
  useEffect(() => {
    const shouldAutoDownload = searchParams.get("download") === "2";
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
    <div className={`min-h-screen ${theme === 'dark' ? pageTheme.dark : pageTheme.light} font-sans transition-colors duration-300`} style={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>
      
      {/* --- MATCHED NAVBAR --- */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-xl" style={{ backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.7)', borderBottom: theme === 'dark' ? '1px solid rgba(51,65,85,0.7)' : '1px solid rgba(226,232,240,0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/quote-builder')}
                className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 shadow-sm active:scale-90"
                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e6eef7' }}
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
                <div className="hidden sm:block pl-4" style={{ borderLeft: '1px solid #e6edf3' }}>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Document Review</p>
                <h2 className="text-sm font-bold" style={{ color: '#334155' }}>{quote.quoteNumber || "Q-2025-XXXX"} • {quote.clientName || "Client Name"}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors" style={{ color: '#475569', backgroundColor: 'transparent' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
                <button className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                  onClick={handleExport}
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', boxShadow: '0 10px 20px -8px rgba(37,99,235,0.4)' }}>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
        {exportError ? (
            <div className="mt-4 rounded-2xl px-4 py-3 text-sm" style={{ border: '1px solid #fecaca', backgroundColor: '#fff1f2', color: '#991b1b' }}>
              {exportError}
            </div>
          ) : null}
      </nav>
       

       
      {/* --- PREVIEW WORKSPACE --- */}
      <main id="quote-section" className="max-w-5xl mx-auto pt-32 pb-20 px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: The actual document */}
          <div  className="lg:col-span-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden min-h-[297mm] flex flex-col" style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' }}>
            
            {/* Quote Header */}
            <div className="p-8 sm:p-16">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>{(quote.companyName || "C")[0].toUpperCase()}</div>
                  <h1 className="text-2xl font-black tracking-tight">{quote.companyName || "Company Name"}</h1>
                  <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>{quote.companyAddress || "Company Address"}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: '#cbd5e1' }}>Quote</h2>
                  <p className="font-bold mt-2" style={{ color: '#2563eb' }}># {quote.quoteNumber || "Q-2025-XXXX"}</p>
                </div>
              </div>

              {/* Grid Info */}
                <div className="grid grid-cols-2 gap-12 mb-16 py-8" style={{ borderTop: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc' }}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Prepared For</p>
                  <p className="font-bold" style={{ color: '#0f172a' }}>{quote.clientName || "Client Name"}</p>
                  <p className="text-sm mt-1" style={{ color: '#64748b' }}>{quote.clientEmail || "client@example.com"}</p>
                  <p className="text-sm" style={{ color: '#64748b' }}>{quote.clientAddress || "Client Address"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Date Details</p>
                  <p className="text-sm"><span style={{ color: '#94a3b8' }}>Issued:</span> <span className="font-bold">{quote.issueDate || "2025-01-01"}</span></p>
                  <p className="text-sm mt-1"><span style={{ color: '#94a3b8' }}>Expires:</span> <span className="font-bold">{quote.expiryDate || "2025-02-01"}</span></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-12">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #0f172a' }}>
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Description</th>
                      <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Qty</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Unit Price</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: '1px solid #f8fafc' }}>
                    {quote.items.length > 0 ? quote.items.map((item, index) => (
                      <tr key={index} className="group">
                        <td className="py-6 font-bold" style={{ color: '#0f172a' }}>{item.description || "Item description"}</td>
                        <td className="py-6 text-center" style={{ color: '#475569' }}>{item.quantity}</td>
                        <td className="py-6 text-right font-mono" style={{ color: '#475569' }}>R {item.unitPrice.toFixed(2)}</td>
                        <td className="py-6 text-right font-bold font-mono" style={{ color: '#0f172a' }}>R {(item.quantity * item.unitPrice).toFixed(2)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center" style={{ color: '#94a3b8' }}>No items added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
                  <div className="flex justify-end pt-8">
                <div className="w-full sm:w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#94a3b8' }}>Subtotal</span>
                    <span className="font-bold">R {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#94a3b8' }}>Tax (15%)</span>
                    <span className="font-bold">R {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4" style={{ borderTop: '2px solid #0f172a' }}>
                    <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
                    <span className="text-xl font-black font-mono" style={{ color: '#2563eb' }}>R {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-32 pt-10" style={{ borderTop: '1px solid #f1f5f9' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#94a3b8' }}>Terms & Conditions</p>
                <p className="text-[10px] leading-relaxed max-w-lg" style={{ color: '#94a3b8' }}>
                  {quote.terms || "All services subject to standard terms. Payment due within 15 days of acceptance. This quote is valid until expiration date. Thank you for your business."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Action Sidebar */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#0f172a', color: '#ffffff', boxShadow: '0 10px 30px rgba(15,23,42,0.12)' }}>
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#94a3b8' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981', display: 'inline-block' }}></span>
                Ready to Send
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                Your quote is fully drafted and formatted. You can now download the PDF or send it directly to the client.
              </p>
              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                  Send to Client
                </button>

              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e6eef3' }}>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>Items</p>
                  <p className="text-xl font-black" style={{ color: '#0f172a' }}>{quote.items.length.toString().padStart(2, '0')}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>Tax</p>
                  <p className="text-xl font-black" style={{ color: '#0f172a' }}>15%</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}