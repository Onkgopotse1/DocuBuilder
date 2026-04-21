import { useNavigate } from 'react-router-dom';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const rows = [
  { project: 'Project Alpha', color: 'bg-amber-400', hours: [8, 8, 7, 8, 6, 0, 0] },
  { project: 'Admin / Meetings', color: 'bg-slate-300', hours: [0, 0, 1, 0, 2, 0, 0] },
  { project: 'Project Beta', color: 'bg-sky-400', hours: [0, 0, 0, 0, 0, 4, 0] },
];

export default function TimesheetPreview() {
  const navigate = useNavigate();
  const dayTotals = days.map((_, di) => rows.reduce((s, r) => s + r.hours[di], 0));
  const totalHours = dayTotals.reduce((s, h) => s + h, 0);
  const rate = 250;
  const overtimeHours = 4;
  const overtimeRate = 375;
  const regularPay = (totalHours - overtimeHours) * rate;
  const overtimePay = overtimeHours * overtimeRate;
  const total = regularPay + overtimePay;

  return (
    <div className="min-h-screen bg-[#fdf8f0] font-['Inter',system-ui,sans-serif] pb-16">

      <nav className="fixed top-0 left-0 w-full bg-[#fdf8f0]/90 backdrop-blur-md border-b border-amber-200/60 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate('/timesheet-builder')}
          className="group w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-500 hover:text-white transition-all active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-slate-700 text-sm hidden sm:block">Timesheet Preview</span>
        </div>

        <button className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md shadow-amber-500/25 hover:bg-amber-600 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-4xl mx-auto pt-24 px-4">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)] border border-amber-100 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-7 flex justify-between items-start border-b border-amber-100">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-1">Weekly Timesheet</p>
              <h1 className="text-2xl font-black text-slate-800">John Mokoena</h1>
              <p className="text-slate-500 text-sm mt-0.5">Frontend Developer · Engineering</p>
              <p className="text-slate-400 text-xs mt-1">Submitted to: <span className="font-semibold text-slate-500">Jane Smith</span></p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-1">Period</p>
              <p className="text-sm font-bold text-slate-700">9 Jun – 15 Jun 2025</p>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-amber-600 font-medium">Total Hours</p>
                <p className="text-2xl font-black text-amber-600">{totalHours}h</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="px-8 py-6 overflow-x-auto">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Hours Breakdown</p>
            <table className="w-full min-w-[520px]">
              <thead>
                <tr>
                  <th className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3 w-36">Project</th>
                  {days.map(d => (
                    <th key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">{d}</th>
                  ))}
                  <th className="text-center text-[10px] font-bold uppercase tracking-wider text-amber-500 pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const rowTotal = row.hours.reduce((s, h) => s + h, 0);
                  return (
                    <tr key={ri} className="border-t border-slate-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${row.color}`}></div>
                          <span className="text-sm font-semibold text-slate-700">{row.project}</span>
                        </div>
                      </td>
                      {row.hours.map((h, di) => (
                        <td key={di} className="py-3 text-center">
                          <span className={`text-sm font-bold ${h > 0 ? 'text-slate-800' : 'text-slate-200'}`}>
                            {h > 0 ? h : '—'}
                          </span>
                        </td>
                      ))}
                      <td className="py-3 text-center">
                        <span className="text-sm font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">{rowTotal}h</span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-amber-200">
                  <td className="py-3 text-xs font-black uppercase tracking-wider text-slate-500">Daily Total</td>
                  {dayTotals.map((h, di) => (
                    <td key={di} className="py-3 text-center">
                      <span className={`text-sm font-black ${h > 0 ? 'text-amber-600' : 'text-slate-200'}`}>{h > 0 ? `${h}h` : '—'}</span>
                    </td>
                  ))}
                  <td className="py-3 text-center">
                    <span className="text-sm font-black text-amber-700">{totalHours}h</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pay summary */}
          <div className="mx-8 mb-6 bg-amber-50 rounded-2xl border border-amber-200 p-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-amber-600 mb-3">Pay Summary</p>
            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{totalHours - overtimeHours}h regular @ R{rate}/hr</span>
                <span className="font-semibold text-slate-700">R{regularPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{overtimeHours}h overtime @ R{overtimeRate}/hr</span>
                <span className="font-semibold text-slate-700">R{overtimePay.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex justify-between">
                <span className="font-black text-slate-800">Total Earnings</span>
                <span className="font-black text-amber-600 text-lg">R{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mx-8 mb-8 grid grid-cols-2 gap-6">
            {['Employee Signature', 'Manager Approval'].map((label, i) => (
              <div key={i}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{label}</p>
                <div className={`border-t-2 ${i === 0 ? 'border-slate-300' : 'border-dashed border-slate-200'} pt-2`}>
                  <p className="text-xs text-slate-400">{i === 0 ? 'John Mokoena' : 'Signature & date'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50/50 border-t border-amber-100 px-8 py-3 flex justify-between">
            <span className="text-xs text-slate-400 font-medium">DocuBuilder</span>
            <span className="text-xs text-slate-400">{new Date().toLocaleDateString('en-ZA')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}