import { useNavigate } from 'react-router-dom';

export default function ExpensePreview() {
  const navigate = useNavigate();

  const expenses = [
    { date: '03 Jun', category: 'Travel', desc: 'Uber to client meeting', amount: 185 },
    { date: '05 Jun', category: 'Meals', desc: 'Working lunch with team', amount: 420 },
    { date: '09 Jun', category: 'Fuel', desc: 'Site visit – Midrand', amount: 340 },
    { date: '14 Jun', category: 'Software', desc: 'Figma monthly subscription', amount: 320 },
    { date: '18 Jun', category: 'Stationery', desc: 'Printing & binding', amount: 95 },
  ];

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const catDot: Record<string, string> = {
    Travel: 'bg-sky-400',
    Meals: 'bg-amber-400',
    Fuel: 'bg-emerald-400',
    Software: 'bg-violet-400',
    Stationery: 'bg-slate-400',
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter',system-ui,sans-serif] pb-16">

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate('/expense-builder')}
          className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white/70 hover:bg-teal-400 hover:text-[#0f172a] transition-all duration-200 active:scale-90"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-teal-400"></div>
          <span className="font-semibold text-white/90 text-sm tracking-tight">Expense Preview</span>
        </div>

        <button className="flex items-center gap-2 bg-teal-400 text-[#0f172a] px-5 py-2 rounded-xl font-black text-sm hover:bg-teal-300 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 px-4">

        {/* Document card — white on dark */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)]">

          {/* Left accent bar + header */}
          <div className="flex">
            <div className="w-2 bg-teal-400 flex-shrink-0"></div>
            <div className="flex-1 px-8 py-7 flex justify-between items-start">
              <div>
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Expense Claim</div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">John Mokoena</h1>
                <div className="text-slate-500 text-sm mt-0.5">Sales · john@email.com</div>
                <div className="text-slate-400 text-xs mt-2">Submitted to: <span className="font-semibold text-slate-600">Acme Corp</span></div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Claim No.</div>
                <div className="text-xl font-black text-teal-600">EXP-2025-001</div>
                <div className="text-xs text-slate-400 mt-1">1 Jun – 30 Jun 2025</div>
                <div className="text-xs text-slate-400">{new Date().toLocaleDateString('en-ZA')}</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 mx-8"></div>

          {/* Items */}
          <div className="px-8 py-6">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-5">Itemised Expenses</div>

            <div className="space-y-1">
              {/* Column heads */}
              <div className="grid grid-cols-12 gap-2 pb-2 border-b border-slate-100">
                <span className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">Date</span>
                <span className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">Category</span>
                <span className="col-span-6 text-[10px] font-bold uppercase tracking-wider text-slate-300">Description</span>
                <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 text-right">Amount</span>
              </div>

              {expenses.map((row, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 py-3 border-b border-slate-50 items-center">
                  <div className="col-span-1 text-xs text-slate-400 font-medium">{row.date}</div>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${catDot[row.category] ?? 'bg-slate-300'}`}></div>
                    <span className="text-xs font-semibold text-slate-600">{row.category}</span>
                  </div>
                  <div className="col-span-6 text-sm text-slate-700">{row.desc}</div>
                  <div className="col-span-2 text-sm font-bold text-slate-900 text-right">R{row.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Total band */}
          <div className="mx-8 mb-6 rounded-2xl border-2 border-teal-100 bg-teal-50 px-6 py-4 flex justify-between items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-teal-500">Total Claimed</div>
              <div className="text-xs text-slate-400 mt-0.5">{expenses.length} items · June 2025</div>
            </div>
            <span className="text-3xl font-black text-teal-600">R{total.toFixed(2)}</span>
          </div>

          {/* Purpose */}
          <div className="px-8 pb-6">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Purpose</div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Business-related travel, meals, and software expenses incurred during client engagements and project delivery for the month of June 2025.
            </p>
          </div>

          {/* Signatures */}
          <div className="mx-8 mb-8 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">Claimant Signature</div>
              <div className="border-t-2 border-slate-200 pt-2">
                <div className="text-xs font-semibold text-slate-500">John Mokoena</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">Authorised By</div>
              <div className="border-t-2 border-dashed border-slate-200 pt-2">
                <div className="text-xs text-slate-300">Signature & date</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              <span className="text-xs text-slate-400 font-medium">DocuBuilder</span>
            </div>
            <span className="text-xs text-slate-300">EXP-2025-001 · {new Date().toLocaleDateString('en-ZA')}</span>
          </div>

        </div>
      </div>
    </div>
  );
}