import { useNavigate } from 'react-router-dom';

export default function DeliveryNotePreview() {
  const navigate = useNavigate();

  const items = [
    { desc: 'MacBook Pro 14" M3', qty: 2, unit: 'Each', condition: 'New' },
    { desc: 'USB-C Docking Station', qty: 2, unit: 'Each', condition: 'New' },
    { desc: 'Office Chair – Ergonomic', qty: 5, unit: 'Each', condition: 'New' },
    { desc: 'HDMI Cable 2m', qty: 10, unit: 'Each', condition: 'New' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 font-['Inter',system-ui,sans-serif] pb-16">

      <nav className="fixed top-0 left-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/60 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate('/delivery-note-builder')}
          className="group w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-slate-900 hover:border-emerald-500 transition-all active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="font-bold text-slate-300 text-sm hidden sm:block">Delivery Note Preview</span>
        </div>

        <button className="flex items-center gap-2 bg-emerald-500 text-slate-900 px-5 py-2 rounded-lg font-black text-sm hover:bg-emerald-400 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)]">

          {/* Green header */}
          <div className="bg-slate-800 px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Delivery Note</span>
                </div>
                <h1 className="text-xl font-black text-white">Nexus Solutions Inc.</h1>
                <p className="text-slate-400 text-sm">dispatch@nexus.com · +27 11 000 0000</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-400">DN-2025-001</p>
                <p className="text-xs text-slate-400 mt-1">Date: 20 Apr 2025</p>
                <p className="text-xs text-slate-400">PO Ref: PO-2025-055</p>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="p-6 border-r border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Dispatched From</p>
              <p className="font-bold text-slate-800 text-sm">Nexus Solutions Inc.</p>
              <p className="text-slate-500 text-sm">John Mokoena</p>
              <p className="text-slate-400 text-xs mt-1">12 Industrial Rd, Germiston</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Deliver To</p>
              <p className="font-bold text-slate-800 text-sm">Acme Innovations</p>
              <p className="text-slate-500 text-sm">Sarah Dlamini</p>
              <p className="text-slate-400 text-xs mt-1">456 Corporate Blvd, Rosebank</p>
            </div>
          </div>

          {/* Carrier info bar */}
          <div className="px-8 py-3 bg-emerald-50 border-b border-emerald-100 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-semibold text-emerald-700">Driver: Thabo Nkosi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1" />
              </svg>
              <span className="text-xs font-semibold text-emerald-700">Vehicle: GP 456 789</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-semibold text-emerald-700">ETA: 21 Apr 2025</span>
            </div>
          </div>

          {/* Items */}
          <div className="px-8 py-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Items Dispatched</p>
            <div className="grid grid-cols-12 gap-2 pb-2 border-b border-slate-100">
              <span className="col-span-6 text-[10px] font-bold uppercase tracking-wider text-slate-300">Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Unit</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Condition</span>
            </div>
            {items.map((item, i) => (
              <div key={i} className={`grid grid-cols-12 gap-2 py-3 border-b border-slate-50 items-center ${i % 2 === 0 ? 'bg-slate-50/40' : ''} rounded-lg px-1`}>
                <div className="col-span-6 text-sm text-slate-700 font-medium">{item.desc}</div>
                <div className="col-span-2 text-sm text-slate-600 text-center font-bold">{item.qty}</div>
                <div className="col-span-2 text-sm text-slate-500 text-center">{item.unit}</div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{item.condition}</span>
                </div>
              </div>
            ))}
            <div className="mt-3 flex justify-end">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{items.length} items · {items.reduce((s, i) => s + i.qty, 0)} units total</span>
            </div>
          </div>

          {/* Signature */}
          <div className="mx-8 mb-8 grid grid-cols-2 gap-6 border-t border-slate-100 pt-6">
            {[
              { label: 'Dispatched By', name: 'John Mokoena' },
              { label: 'Received By', name: 'Signature & date' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{s.label}</p>
                <div className={`border-t-2 ${i === 1 ? 'border-dashed border-slate-200' : 'border-slate-300'} pt-2`}>
                  <p className={`text-xs ${i === 1 ? 'text-slate-300' : 'text-slate-500 font-semibold'}`}>{s.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 px-8 py-3 flex justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              <span className="text-xs text-slate-400 font-medium">DocuBuilder</span>
            </div>
            <span className="text-xs text-slate-500">DN-2025-001 · {new Date().toLocaleDateString('en-ZA')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}