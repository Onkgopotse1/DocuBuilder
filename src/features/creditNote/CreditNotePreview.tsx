import { useNavigate } from 'react-router-dom';

export default function CreditNotePreview() {
  const navigate = useNavigate();

  const items = [
    { desc: 'Web Development – Phase 2 (returned)', qty: 1, price: 3500, amount: 3500 },
    { desc: 'UI/UX Design (overcharge adjustment)', qty: 2, price: 200, amount: 400 },
  ];
  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] pb-16">

      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-400 z-50"></div>

      <nav className="fixed top-1 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 py-3 flex justify-between items-center z-40 shadow-sm">
        <button
          onClick={() => navigate('/credit-note-builder')}
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

        <button className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2 rounded-xl font-black text-sm hover:bg-rose-600 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-28 px-6">
        <div className="border-2 border-slate-100 rounded-3xl overflow-hidden shadow-xl">

          {/* Document header */}
          <div className="p-8 border-b-2 border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Credit Note
                </div>
                <h1 className="text-xl font-black text-slate-800">Nexus Solutions Inc.</h1>
                <p className="text-slate-500 text-sm">billing@nexus.com</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-rose-600">CN-2025-001</p>
                <p className="text-xs text-slate-400 mt-1">Issued: 20 Apr 2025</p>
                <p className="text-xs text-slate-400">Ref: INV-2025-042</p>
              </div>
            </div>
          </div>

          {/* From/To */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="p-6 border-r border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Credit Issued By</p>
              <p className="font-bold text-slate-700 text-sm">Nexus Solutions Inc.</p>
              <p className="text-slate-500 text-sm">billing@nexus.com</p>
              <p className="text-slate-400 text-xs mt-1">123 Business Ave, Sandton</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Issued To</p>
              <p className="font-bold text-slate-700 text-sm">Acme Innovations</p>
              <p className="text-slate-500 text-sm">accounts@acme.com</p>
              <p className="text-slate-400 text-xs mt-1">456 Corporate Blvd, Rosebank</p>
            </div>
          </div>

          {/* Reason */}
          <div className="px-8 py-4 bg-rose-50/50 border-b border-slate-100 flex items-center gap-3">
            <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-600"><span className="font-bold text-slate-700">Reason:</span> Returned goods — partial work not delivered as agreed per contract.</p>
          </div>

          {/* Items */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-12 gap-2 pb-2 border-b border-slate-100">
              <span className="col-span-6 text-[10px] font-bold uppercase tracking-wider text-slate-300">Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-center">Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Unit Price</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Amount</span>
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 py-3 border-b border-slate-50 items-center">
                <div className="col-span-6 text-sm text-slate-700">{item.desc}</div>
                <div className="col-span-2 text-sm text-slate-600 text-center">{item.qty}</div>
                <div className="col-span-2 text-sm text-slate-600 text-right">R{item.price.toFixed(2)}</div>
                <div className="col-span-2 text-sm font-bold text-slate-800 text-right">R{item.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mx-8 mb-8 flex justify-between items-center border-t-2 border-slate-800 pt-4">
            <p className="font-black text-slate-800">Total Credit Amount</p>
            <p className="font-black text-rose-600 text-2xl">R{total.toFixed(2)}</p>
          </div>

          <div className="bg-slate-50 border-t border-slate-100 px-8 py-3 flex justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
              <span className="text-xs text-slate-400 font-medium">DocuBuilder</span>
            </div>
            <span className="text-xs text-slate-300">CN-2025-001 · {new Date().toLocaleDateString('en-ZA')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}