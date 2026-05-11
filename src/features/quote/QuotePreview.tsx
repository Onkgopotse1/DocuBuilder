import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';

export default function QuotePreview() {
  const navigate = useNavigate();
  const { document } = useDocument();
  const quote = document.quote;

  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * 0.15; // Assuming 15% tax rate, can be made configurable later
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900">
      
      {/* --- MATCHED NAVBAR --- */}
      <nav className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/quote-builder')}
                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="hidden sm:block border-l border-slate-200 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Review</p>
                <h2 className="text-sm font-bold text-slate-700">{quote.quoteNumber || "Q-2025-XXXX"} • {quote.clientName || "Client Name"}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- PREVIEW WORKSPACE --- */}
      <main className="max-w-5xl mx-auto pt-32 pb-20 px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: The actual document */}
          <div className="lg:col-span-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden min-h-[297mm] flex flex-col">
            
            {/* Quote Header */}
            <div className="p-8 sm:p-16">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">{(quote.companyName || "C")[0].toUpperCase()}</div>
                  <h1 className="text-2xl font-black tracking-tight">{quote.companyName || "Company Name"}</h1>
                  <p className="text-slate-400 text-xs mt-1">{quote.companyAddress || "Company Address"}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-black text-slate-200 uppercase tracking-tighter">Quote</h2>
                  <p className="text-blue-600 font-bold mt-2"># {quote.quoteNumber || "Q-2025-XXXX"}</p>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-12 mb-16 py-8 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Prepared For</p>
                  <p className="font-bold text-slate-900">{quote.clientName || "Client Name"}</p>
                  <p className="text-slate-500 text-sm mt-1">{quote.clientEmail || "client@example.com"}</p>
                  <p className="text-slate-500 text-sm">{quote.clientAddress || "Client Address"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Date Details</p>
                  <p className="text-sm"><span className="text-slate-400">Issued:</span> <span className="font-bold">{quote.issueDate || "2025-01-01"}</span></p>
                  <p className="text-sm mt-1"><span className="text-slate-400">Expires:</span> <span className="font-bold">{quote.expiryDate || "2025-02-01"}</span></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-12">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                      <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Price</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quote.items.length > 0 ? quote.items.map((item, index) => (
                      <tr key={index} className="group">
                        <td className="py-6 font-bold text-slate-800">{item.description || "Item description"}</td>
                        <td className="py-6 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-6 text-right text-slate-600 font-mono">R {item.unitPrice.toFixed(2)}</td>
                        <td className="py-6 text-right font-bold text-slate-900 font-mono">R {(item.quantity * item.unitPrice).toFixed(2)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">No items added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end pt-8">
                <div className="w-full sm:w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-bold">R {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax (15%)</span>
                    <span className="font-bold">R {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                    <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
                    <span className="text-xl font-black text-blue-600 font-mono">R {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-32 pt-10 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Terms & Conditions</p>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-lg">
                  {quote.terms || "All services subject to standard terms. Payment due within 15 days of acceptance. This quote is valid until expiration date. Thank you for your business."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Action Sidebar */}
          <aside className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Ready to Send
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Your quote is fully drafted and formatted. You can now download the PDF or send it directly to the client.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  Send to Client
                </button>

              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Items</p>
                  <p className="text-xl font-black text-slate-900">{quote.items.length.toString().padStart(2, '0')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Tax</p>
                  <p className="text-xl font-black text-slate-900">15%</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}