import { useNavigate } from 'react-router-dom';

export default function ReceiptBuilder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/50 font-sans text-slate-800 pb-12">
      
      {/* --- FLOATING NAVBAR --- */}
      <div className="pt-6 px-4 sm:px-6 mb-8 z-50 sticky top-0">
        <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white shadow-sm rounded-3xl px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors active:scale-95"
              onClick={() => navigate('/')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Receipt Studio
              </h1>
            </div>
          </div>

          <button
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
            onClick={() => navigate('/receipt-preview')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>
        </nav>
      </div>

      {/* --- BENTO BOX WORKSPACE --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Customer & Items (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Customer Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">👤</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Customer Details</h2>
                  <p className="text-xs font-medium text-slate-400">Who is this receipt for?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Full Name / Company</label>
                  <input type="text" defaultValue="BrightWave Marketing" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                  <input type="email" defaultValue="contact@brightwave.com" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
              </div>
            </div>

            {/* Line Items Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/80">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">📦</div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Payment Items</h2>
                    <p className="text-xs font-medium text-slate-400">Services or products paid for</p>
                  </div>
                </div>
                <button type="button" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
                  + Add Row
                </button>
              </div>

              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-widest text-left">
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 w-20 text-center">Qty</th>
                      <th className="py-3 px-4 w-32 text-right">Price (R)</th>
                      <th className="py-3 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="bg-white shadow-sm border border-slate-100 rounded-xl group">
                      <td className="p-2">
                        <input type="text" defaultValue="Web Development Retainer" className="w-full px-3 py-2 bg-transparent outline-none font-medium" />
                      </td>
                      <td className="p-2">
                        <input type="number" defaultValue="1" className="w-full px-2 py-2 bg-slate-50 rounded-lg text-center outline-none" />
                      </td>
                      <td className="p-2">
                        <input type="number" defaultValue="15000" className="w-full px-3 py-2 bg-slate-50 rounded-lg text-right outline-none font-mono" />
                      </td>
                      <td className="p-2 text-center">
                        <button className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Memo */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Receipt Note / Memo</label>
                <textarea rows="2" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" defaultValue="Thank you for your prompt payment!"></textarea>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings & Totals (Span 4) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Receipt Settings */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-emerald-400">⚙️</span> Receipt Config
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Receipt Number</label>
                  <input type="text" defaultValue="RCT-1002" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl outline-none text-white focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Payment</label>
                  <input type="date" defaultValue="2026-04-20" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl outline-none text-white focus:border-emerald-500 transition-colors [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Method</label>
                  <select className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl outline-none text-white focus:border-emerald-500 transition-colors appearance-none">
                    <option>EFT / Bank Transfer</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                    <option>PayPal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/80">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Amount Received</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono">R 15,000.00</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500 pb-4 border-b border-slate-100">
                  <span>Tax (15%)</span>
                  <span className="font-mono">R 2,250.00</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-sm font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">R 17,250.00</span>
                </div>
              </div>

            </div>

          </div>
        </form>
      </main>
    </div>
  );
}