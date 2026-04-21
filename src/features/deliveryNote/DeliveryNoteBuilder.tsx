import { useNavigate } from 'react-router-dom';

export default function DeliveryNoteBuilder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 font-['Inter',system-ui,sans-serif] pb-16">

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/60 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all active:scale-95 border border-slate-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="font-bold text-slate-300 text-sm hidden sm:block">Delivery Note</span>
        </div>

        <button
          onClick={() => navigate('/delivery-note-preview')}
          className="flex items-center gap-2 bg-emerald-500 text-slate-900 px-5 py-2 rounded-lg font-black text-sm hover:bg-emerald-400 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Preview</span>
        </button>
      </nav>

      <div className="max-w-3xl mx-auto pt-24 px-4 space-y-3">

        {/* Page label */}
        <div className="px-1 pb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-0.5">Dispatch</p>
            <h1 className="text-2xl font-black text-white">Delivery Note</h1>
          </div>
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Draft</p>
          </div>
        </div>

        {/* Doc info */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Document Info</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'DN Number', placeholder: 'DN-2025-001' },
              { label: 'Date', placeholder: '', type: 'date' },
              { label: 'PO Reference', placeholder: 'PO-2025-001' },
              { label: 'Invoice Reference', placeholder: 'INV-2025-001' },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">{f.label}</label>
                <input
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-700 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Dispatched From</p>
            <div className="space-y-3">
              {[
                { label: 'Supplier / Business', placeholder: 'Your company name' },
                { label: 'Contact Person', placeholder: 'Full name' },
                { label: 'Phone', placeholder: '+27 000 000 0000', type: 'tel' },
                { label: 'Address', placeholder: 'Warehouse / pickup address' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{f.label}</label>
                  <input
                    type={f.type ?? 'text'}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-700 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Deliver To</p>
            <div className="space-y-3">
              {[
                { label: 'Recipient / Business', placeholder: 'Customer name' },
                { label: 'Contact Person', placeholder: 'Full name' },
                { label: 'Phone', placeholder: '+27 000 000 0000', type: 'tel' },
                { label: 'Delivery Address', placeholder: 'Full delivery address' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{f.label}</label>
                  <input
                    type={f.type ?? 'text'}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-700 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Items Dispatched</p>
            <p className="text-xs text-slate-500 hidden sm:block">Item · Qty · Unit · Condition</p>
          </div>

          <div className="p-5 space-y-3">
            <div className="hidden sm:grid grid-cols-12 gap-3">
              {[['Item Description', 5], ['Quantity', 2], ['Unit', 2], ['Condition', 2]].map(([h, span]) => (
                <span key={h as string} className={`col-span-${span} text-[10px] font-bold uppercase tracking-widest text-slate-500`}>{h}</span>
              ))}
            </div>

            {[1, 2, 3].map((i) => (
              <div key={i} className="group grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 sm:col-span-5">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Item {i}</label>
                  <input
                    type="text"
                    placeholder="Item name or description"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Qty</label>
                  <input type="number" placeholder="0" className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all text-center" />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Unit</label>
                  <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-emerald-500 transition-all">
                    <option className="bg-slate-800">Unit</option>
                    {['Each', 'Box', 'Pallet', 'Kg', 'Litre', 'Set', 'Roll'].map(u => (
                      <option key={u} className="bg-slate-800">{u}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Condition</label>
                  <select className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-emerald-500 transition-all">
                    <option className="bg-slate-800">New</option>
                    <option className="bg-slate-800">Used</option>
                    <option className="bg-slate-800">Refurb</option>
                  </select>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button className="w-7 h-7 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button className="flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors mt-1">
              <span className="w-6 h-6 rounded-md border border-emerald-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Add item
            </button>
          </div>
        </div>

        {/* Carrier + notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Carrier / Driver</p>
            <div className="space-y-3">
              {[
                { label: 'Driver Name', placeholder: 'Full name' },
                { label: 'Vehicle Reg', placeholder: 'e.g. GP 123 456' },
                { label: 'Expected Delivery', placeholder: '', type: 'date' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{f.label}</label>
                  <input type={f.type ?? 'text'} placeholder={f.placeholder} className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Special Instructions</p>
            <textarea
              rows={5}
              placeholder="Handling instructions, temperature requirements, fragile items..."
              className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-all resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}