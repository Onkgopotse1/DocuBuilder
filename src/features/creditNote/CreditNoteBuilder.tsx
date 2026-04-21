import { useNavigate } from 'react-router-dom';

const inputCls = "w-full px-0 py-2 bg-transparent border-b-2 border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-rose-500 transition-colors";
const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1";

export default function CreditNoteBuilder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] text-slate-800 pb-16">

      {/* Thin rose top bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-400 z-50"></div>

      {/* Nav */}
      <nav className="fixed top-1 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-5 py-3 flex justify-between items-center z-40 shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-rose-400 hover:text-rose-500 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">New Document</p>
          <p className="text-sm font-black text-slate-800 leading-none mt-0.5">Credit Note</p>
        </div>

        <button
          onClick={() => navigate('/credit-note-preview')}
          className="flex items-center gap-2 border-2 border-rose-500 text-rose-600 px-5 py-2 rounded-full font-black text-sm hover:bg-rose-500 hover:text-white transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Preview</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-28 px-6 space-y-10">

        {/* Reference block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'Credit Note No.', placeholder: 'CN-2025-001' },
            { label: 'Issue Date', placeholder: '', type: 'date' },
            { label: 'Original Invoice', placeholder: 'INV-2025-042' },
            { label: 'Original Invoice Date', placeholder: '', type: 'date' },
          ].map((f) => (
            <div key={f.label}>
              <label className={labelCls}>{f.label}</label>
              <input type={f.type ?? 'text'} placeholder={f.placeholder} className={inputCls} />
            </div>
          ))}
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">Issued By</p>
            <div className="space-y-5">
              {[
                { label: 'Company Name', placeholder: 'Your business' },
                { label: 'Email', placeholder: 'your@email.com', type: 'email' },
                { label: 'Address', placeholder: 'Street, City, Province' },
              ].map((f) => (
                <div key={f.label}>
                  <label className={labelCls}>{f.label}</label>
                  <input type={f.type ?? 'text'} placeholder={f.placeholder} className={inputCls} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Issued To</p>
            <div className="space-y-5">
              {[
                { label: 'Client Name', placeholder: 'Client or company' },
                { label: 'Email', placeholder: 'client@email.com', type: 'email' },
                { label: 'Address', placeholder: 'Street, City, Province' },
              ].map((f) => (
                <div key={f.label}>
                  <label className={labelCls}>{f.label}</label>
                  <input type={f.type ?? 'text'} placeholder={f.placeholder} className={inputCls} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* Reason */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">Reason for Credit</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Returned goods', 'Overcharge', 'Service not rendered', 'Duplicate invoice', 'Goodwill', 'Other'].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="reason" className="accent-rose-500 w-4 h-4" />
                <span className="text-sm text-slate-600 group-hover:text-rose-600 transition-colors">{r}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <label className={labelCls}>Additional Details</label>
            <textarea
              rows={2}
              placeholder="Describe the reason in more detail..."
              className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-rose-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* Line items */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-5">Credit Items</p>

          <div className="hidden sm:grid grid-cols-12 gap-3 mb-2">
            {[['Description', 6], ['Qty', 2], ['Unit Price', 2], ['Amount', 2]].map(([h, span]) => (
              <span key={h as string} className={`col-span-${span} text-[10px] font-bold uppercase tracking-widest text-slate-300`}>{h}</span>
            ))}
          </div>

          {[1, 2].map((i) => (
            <div key={i} className="group grid grid-cols-12 gap-3 items-end py-3 border-b border-slate-100">
              <div className="col-span-12 sm:col-span-6">
                <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Description</label>
                <input type="text" placeholder="Item being credited..." className={inputCls} />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Qty</label>
                <input type="number" placeholder="1" className={`${inputCls} text-center`} />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Unit Price</label>
                <input type="number" placeholder="0.00" className={`${inputCls} text-right`} />
              </div>
              <div className="col-span-3 sm:col-span-2 flex items-end gap-1">
                <div className="flex-1">
                  <label className="sm:hidden text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Amount</label>
                  <input type="number" placeholder="0.00" className={`${inputCls} text-right`} />
                </div>
                <button className="mb-1.5 w-7 h-7 rounded-lg text-slate-200 hover:text-rose-400 hover:bg-rose-50 transition-all flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button className="flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors mt-4">
            <span className="w-6 h-6 rounded-full border border-rose-300 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            Add item
          </button>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t-2 border-slate-800 pt-4">
          <p className="font-black text-slate-800 text-lg">Total Credit Amount</p>
          <p className="font-black text-rose-600 text-3xl">R0.00</p>
        </div>

      </div>
    </div>
  );
}