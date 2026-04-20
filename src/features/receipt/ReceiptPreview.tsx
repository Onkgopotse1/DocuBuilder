import { useNavigate } from 'react-router-dom';

export default function ReceiptPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/receipt-builder')}
                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="hidden sm:block border-l border-slate-200 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Review</p>
                <h2 className="text-sm font-bold text-slate-700">RCT-1002 • Nexus Solutions</h2>
              </div>
            </div>

            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </nav>

      {/* --- PREVIEW WORKSPACE --- */}
      <main className="max-w-5xl mx-auto pt-32 pb-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: The Document */}
          <div className="lg:col-span-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden min-h-[297mm] flex flex-col relative">
            
            {/* The Document Content */}
            <div className="p-8 sm:p-16">
              
              <div className="flex justify-between items-start mb-16">
                <div>
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl mb-4">N</div>
                  <h1 className="text-2xl font-black tracking-tight">Nexus Solutions Inc.</h1>
                  <p className="text-slate-400 text-xs mt-1">123 Business Blvd, Austin, TX</p>
                  <p className="text-slate-400 text-xs">hello@nexus-solutions.com</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <h2 className="text-4xl font-black text-slate-200 uppercase tracking-tighter">Receipt</h2>
                  <p className="text-slate-500 font-bold mt-2"># RCT-1002</p>
                  
                  {/* PAID BADGE */}
                  <div className="mt-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 px-4 py-1.5 rounded-md transform rotate-[-2deg]">
                    <p className="font-black tracking-widest text-lg uppercase">Paid in Full</p>
                  </div>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-12 mb-16 py-8 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Received From</p>
                  <p className="font-bold text-slate-900">BrightWave Marketing</p>
                  <p className="text-slate-500 text-sm mt-1">contact@brightwave.com</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Payment Details</p>
                  <p className="text-sm"><span className="text-slate-400">Date Paid:</span> <span className="font-bold">2026-04-20</span></p>
                  <p className="text-sm mt-1"><span className="text-slate-400">Method:</span> <span className="font-bold">EFT / Bank Transfer</span></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-12">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                      <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="group">
                      <td className="py-6 font-bold text-slate-800">Invoice INV-2026-089 Final Payment</td>
                      <td className="py-6 text-center text-slate-600">1</td>
                      <td className="py-6 text-right text-slate-900 font-bold font-mono">R 15,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end pt-8">
                <div className="w-full sm:w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-bold">R 15,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax (15%)</span>
                    <span className="font-bold">R 2,250.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Total Paid</span>
                    <span className="text-xl font-black text-emerald-600 font-mono">R 17,250.00</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-32 pt-10 border-t border-slate-100 flex flex-col items-center text-center">
                <svg className="w-8 h-8 text-emerald-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-bold text-slate-700">Thank you for your payment!</p>
                <p className="text-[10px] text-slate-400 mt-2">This is a valid receipt of payment.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Action Sidebar */}
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
                <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all">
                  Download PDF
                </button>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
