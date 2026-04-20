import { useNavigate } from 'react-router-dom';

export default function ReportPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-violet-50/40 font-['Inter',system-ui,sans-serif] text-[#1e293b] pb-16">

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-5 py-3 flex justify-between items-center z-50 shadow-sm">
        <button
          onClick={() => navigate('/report-builder')}
          className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-violet-600 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-sm hidden sm:block">Report Preview</span>
        </div>

        <button className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all active:scale-95 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 px-4">

        {/* Document */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-100">

          {/* Header stripe */}
          <div className="bg-gradient-to-r from-violet-700 to-violet-500 px-8 py-7">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-1">Report</div>
                <h1 className="text-white text-2xl font-extrabold tracking-tight">Q2 Financial Summary</h1>
                <div className="text-violet-200 text-sm mt-1">Financial Summary · RPT-2025-001</div>
              </div>
              <div className="text-right">
                <div className="text-violet-200 text-xs font-medium">Period</div>
                <div className="text-white font-bold text-sm">1 Apr – 30 Jun 2025</div>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="px-8 py-5 border-r border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Prepared By</div>
              <div className="font-bold text-slate-800 text-sm">Nexus Solutions Inc.</div>
              <div className="text-slate-500 text-sm">billing@nexus.com</div>
            </div>
            <div className="px-8 py-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Prepared For</div>
              <div className="font-bold text-slate-800 text-sm">Acme Corp</div>
              <div className="text-slate-500 text-sm">accounts@acme.com</div>
            </div>
          </div>

          {/* Entries table */}
          <div className="px-8 py-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Report Entries</div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-3 pb-2 border-b border-slate-100">
              <span className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Category</span>
              <span className="col-span-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</span>
              <span className="col-span-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Amount</span>
            </div>

            {/* Sample rows */}
            {[
              { cat: 'Revenue', desc: 'Web development services', amount: 'R12,500.00' },
              { cat: 'Revenue', desc: 'UI/UX consulting', amount: 'R4,200.00' },
              { cat: 'Expense', desc: 'Software subscriptions', amount: 'R1,080.00' },
              { cat: 'Expense', desc: 'Office supplies', amount: 'R340.00' },
            ].map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-12 gap-2 px-3 py-3 ${i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'} rounded-lg`}
              >
                <div className="col-span-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.cat === 'Revenue' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {row.cat}
                  </span>
                </div>
                <div className="col-span-6 text-sm text-slate-700">{row.desc}</div>
                <div className="col-span-3 text-sm font-semibold text-slate-800 text-right">{row.amount}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mx-8 mb-6 bg-slate-50 rounded-2xl p-5">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-800">R18,120.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (15%)</span>
                <span className="font-semibold text-slate-800">R2,718.00</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-extrabold text-slate-900">Total</span>
                <span className="font-extrabold text-violet-700 text-xl">R20,838.00</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="px-8 pb-8">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Summary / Notes</div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              Strong revenue growth in Q2 driven by web development services. Expenses remain within budget. Net profit margin of 68% achieved for the quarter.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex justify-between items-center">
            <span className="text-xs text-slate-400">Generated by DocuBuilder</span>
            <span className="text-xs text-slate-400">RPT-2025-001 · {new Date().toLocaleDateString('en-ZA')}</span>
          </div>

        </div>
      </div>
    </div>
  );
}