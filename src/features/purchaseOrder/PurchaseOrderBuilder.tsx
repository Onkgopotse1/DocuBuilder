import { useNavigate } from 'react-router-dom';

export default function PurchaseOrderBuilder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-['Inter',system-ui,sans-serif] text-slate-800 pb-16">

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full bg-white border-b-2 border-blue-600 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-lg border-2 border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 leading-none">Purchase Order</p>
            <p className="text-sm font-black text-slate-800 leading-tight">Builder</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/purchase-order-preview')}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-600/25"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Preview</span>
        </button>
      </nav>

      <div className="max-w-3xl mx-auto pt-24 px-4 space-y-4">

        {/* PO header info */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white">
          <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-4">Purchase Order Details</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'PO Number', placeholder: 'PO-2025-001' },
              { label: 'Issue Date', type: 'date' },
              { label: 'Required By', type: 'date' },
              { label: 'Currency', placeholder: 'ZAR' },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1.5">{f.label}</label>
                <input
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 bg-white/15 border border-white/25 rounded-lg text-white text-sm placeholder:text-blue-200/50 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buyer / Vendor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border-2 border-blue-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Buyer (Us)</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Company Name', placeholder: 'Your business' },
                { label: 'Contact Person', placeholder: 'Full name' },
                { label: 'Email', placeholder: 'your@email.com', type: 'email' },
                { label: 'Billing Address', placeholder: 'Street, City' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{f.label}</label>
                  <input type={f.type ?? 'text'} placeholder={f.placeholder} className="w-full px-3 py-2 bg-[#f0f4ff] border border-blue-100 rounded-lg text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vendor / Supplier</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Vendor Name', placeholder: 'Supplier company' },
                { label: 'Contact Person', placeholder: 'Full name' },
                { label: 'Email', placeholder: 'vendor@email.com', type: 'email' },
                { label: 'Vendor Address', placeholder: 'Street, City' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">{f.label}</label>
                  <input type={f.type ?? 'text'} placeholder={f.placeholder} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Order Items</p>
            <p className="text-xs text-blue-200 hidden sm:block">Description · Qty · Unit Price · Total</p>
          </div>

          <div className="p-6 space-y-3">
            <div className="hidden sm:grid grid-cols-12 gap-3">
              <span className="col-span-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Unit</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Unit Price</span>
            </div>

            {[1, 2, 3].map((i) => (
              <div key={i} className="group grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 sm:col-span-5">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Item {i}</label>
                  <input type="text" placeholder="Item or service description" className="w-full px-3 py-2 bg-[#f0f4ff] border border-blue-100 rounded-lg text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all" />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Qty</label>
                  <input type="number" placeholder="1" className="w-full px-3 py-2 bg-[#f0f4ff] border border-blue-100 rounded-lg text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-center" />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Unit</label>
                  <select className="w-full px-3 py-2 bg-[#f0f4ff] border border-blue-100 rounded-lg text-slate-600 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all">
                    <option>Each</option>
                    {['Box', 'Kg', 'Litre', 'Set', 'Hour', 'Month'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center gap-1">
                  <div className="flex-1">
                    <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Unit Price</label>
                    <input type="number" placeholder="0.00" className="w-full px-3 py-2 bg-[#f0f4ff] border border-blue-100 rounded-lg text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-right" />
                  </div>
                  <button className="w-7 h-7 rounded-lg text-slate-200 hover:text-red-400 hover:bg-red-50 transition-all flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mt-1">
              <span className="w-6 h-6 rounded-lg border-2 border-blue-300 flex items-center justify-center hover:bg-blue-50 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Add item
            </button>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-blue-100 bg-[#f0f4ff] px-6 py-5">
            <div className="max-w-xs ml-auto space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-700">R0.00</span>
              </div>
              <div className="flex justify-between text-sm items-center gap-3">
                <span className="text-slate-500">VAT (%)</span>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="15" className="w-14 px-2 py-1 bg-white border border-blue-200 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400 transition-all" />
                  <span className="font-semibold text-slate-700 w-16 text-right">R0.00</span>
                </div>
              </div>
              <div className="pt-3 border-t-2 border-blue-200 flex justify-between">
                <span className="font-black text-slate-800">Order Total</span>
                <span className="font-black text-blue-600 text-xl">R0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms + notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Payment Terms</p>
            <div className="space-y-2">
              {['30 days net', '14 days net', 'COD', 'Upfront', '50% deposit', 'Custom'].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="terms" className="accent-blue-600 w-4 h-4" />
                  <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Notes / Terms</p>
            <textarea
              rows={6}
              placeholder="Delivery instructions, special terms, or additional notes..."
              className="w-full px-3 py-2.5 bg-[#f0f4ff] border border-blue-100 rounded-xl text-slate-700 text-sm placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}