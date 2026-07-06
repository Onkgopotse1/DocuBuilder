import { useNavigate } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { useTheme } from "../../context/Theme Context.tsx";
import type { ReportItem } from "../../context/DocumentContext";
import { pageThemes } from "../../data/pageThemes";

export default function ReportBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const report = document.report;
  const pageTheme = pageThemes.Report;

  const updateField = (field: keyof typeof report, value: any) => {
    setDocument((prev) => ({ ...prev, report: { ...prev.report, [field]: value } }));
  };

  const addItem = () => {
    const newItem: ReportItem = { category: "", description: "", amount: 0 };
    setDocument((prev) => ({
      ...prev,
      report: { ...prev.report, items: [...prev.report.items, newItem] },
    }));
  };

  const updateItem = (index: number, field: keyof ReportItem, value: any) => {
    setDocument((prev) => {
      const items = [...prev.report.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, report: { ...prev.report, items } };
    });
  };

  const removeItem = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      report: { ...prev.report, items: prev.report.items.filter((_, i) => i !== index) },
    }));
  };

  const subtotal = report.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (report.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className={`min-h-screen ${isDark ? pageTheme.dark : pageTheme.light} font-['Inter',system-ui,sans-serif] ${isDark ? 'text-slate-100' : 'text-[#1e293b]'} pb-16`}>
      {/* Navbar – uses pageTheme.dark */}
      <nav className={`fixed top-0 left-0 w-full ${isDark ? pageTheme.dark : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} px-5 py-3 flex justify-between items-center z-50 shadow-sm`}>
        <button
          onClick={() => navigate("/")}
          className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} flex items-center justify-center transition-colors active:scale-95`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'} text-sm hidden sm:block`}>Report Builder</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/report-preview")}
            className="bg-violet-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => navigate("/report-preview?download=1")}
            className="bg-violet-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto pt-24 px-4 space-y-4">
        {/* Report Details – uses pageTheme.dark */}
        <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} shadow-sm overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} flex items-center gap-3`}>
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Report Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Report Title</label>
                <input
                  type="text"
                  value={report.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Q2 Financial Summary"
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Report Type</label>
                <select
                  value={report.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100' : 'bg-slate-50/40 border-slate-200 text-slate-700'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                >
                  <option className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'} value="">Select type...</option>
                  <option className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'}>Financial Summary</option>
                  <option className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'}>Sales Report</option>
                  <option className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'}>Expense Report</option>
                  <option className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'}>Project Report</option>
                  <option className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'}>Monthly Overview</option>
                  <option className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'}>Custom</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Report Number</label>
                <input
                  type="text"
                  value={report.reportNumber}
                  onChange={(e) => updateField("reportNumber", e.target.value)}
                  placeholder="e.g. RPT-2025-001"
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Date From</label>
                <input
                  type="date"
                  value={report.dateFrom}
                  onChange={(e) => updateField("dateFrom", e.target.value)}
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Date To</label>
                <input
                  type="date"
                  value={report.dateTo}
                  onChange={(e) => updateField("dateTo", e.target.value)}
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prepared By / For – both use pageTheme.dark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} shadow-sm overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} flex items-center gap-2.5`}>
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'} text-sm`}>Prepared By</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Company / Name</label>
                <input
                  type="text"
                  value={report.preparedByName}
                  onChange={(e) => updateField("preparedByName", e.target.value)}
                  placeholder="Your business name"
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Email</label>
                <input
                  type="email"
                  value={report.preparedByEmail}
                  onChange={(e) => updateField("preparedByEmail", e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
            </div>
          </div>

          <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} shadow-sm overflow-hidden`}>
            <div className={`px-5 py-3.5 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} flex items-center gap-2.5`}>
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'} text-sm`}>Prepared For</h3>
            </div>
            <div className="p-5 space-y-3">
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Client / Name</label>
                <input
                  type="text"
                  value={report.preparedForName}
                  onChange={(e) => updateField("preparedForName", e.target.value)}
                  placeholder="Client or department"
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Email</label>
                <input
                  type="email"
                  value={report.preparedForEmail}
                  onChange={(e) => updateField("preparedForEmail", e.target.value)}
                  placeholder="client@email.com"
                  className={`w-full px-4 py-2.5 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Entries – uses pageTheme.dark */}
        <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} shadow-sm overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" />
                </svg>
              </div>
              <h2 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Report Entries</h2>
            </div>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'} font-medium`}>Category · Description · Amount</span>
          </div>

          <div className="p-6 space-y-3">
            <div className={`grid grid-cols-12 gap-2 px-1 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              <span className="col-span-3 text-[11px] font-bold uppercase tracking-wider">Category</span>
              <span className="col-span-6 text-[11px] font-bold uppercase tracking-wider">Description</span>
              <span className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-right">Amount</span>
            </div>

            {report.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center group">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateItem(idx, "category", e.target.value)}
                    placeholder="Category"
                    className={`w-full px-3 py-2.5 ${isDark ? 'bg-slate-800 border-transparent text-slate-100 placeholder:text-slate-500 focus:bg-slate-800 focus:border-violet-400' : 'bg-slate-50 border-transparent text-slate-800 focus:bg-white focus:border-violet-400'} border rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 transition-all outline-none`}
                  />
                </div>
                <div className="col-span-6">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                    placeholder="Description..."
                    className={`w-full px-3 py-2.5 ${isDark ? 'bg-slate-800 border-transparent text-slate-100 placeholder:text-slate-500 focus:bg-slate-800 focus:border-violet-400' : 'bg-slate-50 border-transparent text-slate-800 focus:bg-white focus:border-violet-400'} border rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 transition-all outline-none`}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(idx, "amount", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`w-full px-3 py-2.5 ${isDark ? 'bg-slate-800 border-transparent text-slate-100 placeholder:text-slate-500 focus:bg-slate-800 focus:border-violet-400' : 'bg-slate-50 border-transparent text-slate-800 focus:bg-white focus:border-violet-400'} border rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 transition-all outline-none text-right`}
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => removeItem(idx)}
                    className={`w-8 h-8 rounded-lg ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-300 hover:text-red-400 hover:bg-red-50'} transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${isDark ? 'text-violet-400 bg-violet-900/30 hover:bg-violet-900/50 border-violet-700' : 'text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-100'} rounded-xl transition-all border mt-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Entry
            </button>
          </div>

          {/* Totals */}
          <div className={`${isDark ? 'bg-slate-800' : 'bg-slate-50/80'} border-t ${isDark ? 'border-slate-700' : 'border-slate-100'} px-6 py-5`}>
            <div className="max-w-xs ml-auto space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Subtotal</span>
                <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>R {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center gap-3">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Tax (%)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={report.taxRate}
                    onChange={(e) => updateField("taxRate", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className={`w-16 px-2 py-1 border ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'} rounded-lg text-sm text-right outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10`}
                  />
                  <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'} w-16 text-right`}>R {tax.toFixed(2)}</span>
                </div>
              </div>
              <div className={`pt-3 border-t ${isDark ? 'border-slate-600' : 'border-slate-200'} flex justify-between items-center`}>
                <span className={`font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Total</span>
                <span className={`font-extrabold ${isDark ? 'text-violet-400' : 'text-violet-700'} text-lg`}>R {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes – uses pageTheme.dark */}
        <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} shadow-sm overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} flex items-center gap-3`}>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Summary / Notes</h2>
          </div>
          <div className="p-6">
            <textarea
              rows={4}
              value={report.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Add any findings, conclusions, or notes for this report..."
              className={`w-full px-4 py-3 border ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50/40 border-slate-200 text-slate-800'} rounded-xl text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none resize-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}