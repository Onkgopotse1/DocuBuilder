import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { useTheme } from '../../context/Theme Context.tsx';
import { pageThemes } from '../../data/pageThemes';

export default function ContractBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const { theme } = useTheme();
  const contract = document.contract;
  const pageTheme = pageThemes.contract;
  const isDark = theme === 'dark';

  const updateField = (field: keyof typeof contract, value: any) => {
    setDocument((prev) => ({
      ...prev,
      contract: { ...prev.contract, [field]: value },
    }));
  };

  return (
    <div className={`min-h-screen ${isDark ? pageTheme.dark : pageTheme.light} font-sans ${isDark ? 'text-slate-100' : 'text-slate-800'} flex flex-col`}>
      <header className={`sticky top-0 z-50 w-full ${isDark ? pageTheme.dark : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-slate-700' : 'border-slate-200/60'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                className={`group inline-flex items-center gap-2.5 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700 hover:border-slate-500' : 'bg-white border-slate-300 text-blue-800 hover:bg-blue-50 hover:border-blue-200'} py-2.5 px-4 sm:px-5 rounded-full font-semibold cursor-pointer transition-all duration-200 hover:-translate-x-1 active:scale-95 shadow-sm text-sm`}
                onClick={() => navigate('/')}
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className={`h-8 w-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-200'} hidden md:block`}></div>
              <div className="flex flex-col">
                <h1 className={`text-lg sm:text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'} tracking-tight leading-none`}>
                  Contract<span className="text-blue-600">Builder</span>
                </h1>
                <span className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest`}>Editor</p>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-0 sm:px-6 py-0 sm:py-10">
        <section className="flex flex-col gap-6">
          <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-none sm:rounded-2xl shadow-xl sm:shadow-sm border-y sm:border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-6 sm:p-10 transition-all`}>
            <div className={`flex items-center gap-3 mb-10 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} pb-6`}>
              <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-blue-200 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Contract Configuration</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Fill in the details below to generate your legal document.</p>
              </div>
            </div>

            <form className="space-y-12 flex flex-col">
              {/* SECTION: BASIC INFO */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-black px-2 py-1 rounded">01</span>
                  <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1.5 ml-1`}>Document Title</label>
                    <input
                      type="text"
                      value={contract.documentTitle}
                      onChange={(e) => updateField('documentTitle', e.target.value)}
                      placeholder="Freelance Service Agreement"
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 focus:border-blue-500 outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1.5 ml-1`}>Effective Date</label>
                    <input
                      type="date"
                      value={contract.effectiveDate}
                      onChange={(e) => updateField('effectiveDate', e.target.value)}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1.5 ml-1`}>Governing Law</label>
                    <input
                      type="text"
                      value={contract.governingLaw}
                      onChange={(e) => updateField('governingLaw', e.target.value)}
                      placeholder="e.g. South Africa"
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: THE PARTIES */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-black px-2 py-1 rounded">02</span>
                  <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>The Parties</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Both boxes now use pageTheme.dark in dark mode */}
                  <div className={`p-5 ${isDark ? pageTheme.dark : 'bg-slate-50/50'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} space-y-4`}>
                    <p className={`text-[11px] font-black ${isDark ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-widest`}>Client Details</p>
                    <input
                      type="text"
                      value={contract.clientName}
                      onChange={(e) => updateField('clientName', e.target.value)}
                      placeholder="Client Name / Company"
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'} border rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all`}
                    />
                    <input
                      type="text"
                      value={contract.clientAddress}
                      onChange={(e) => updateField('clientAddress', e.target.value)}
                      placeholder="Physical Address"
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'} border rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all`}
                    />
                  </div>
                  <div className={`p-5 ${isDark ? pageTheme.dark : 'bg-slate-50/50'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-100'} space-y-4`}>
                    <p className={`text-[11px] font-black ${isDark ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-widest`}>Contractor Details</p>
                    <input
                      type="text"
                      value={contract.contractorName}
                      onChange={(e) => updateField('contractorName', e.target.value)}
                      placeholder="Your Name / Company"
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'} border rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all`}
                    />
                    <input
                      type="text"
                      value={contract.contractorAddress}
                      onChange={(e) => updateField('contractorAddress', e.target.value)}
                      placeholder="Physical Address"
                      className={`w-full px-4 py-2.5 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-800'} border rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: FINANCIALS */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-black px-2 py-1 rounded">03</span>
                  <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Financial Terms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1.5 ml-1`}>Total Contract Value</label>
                    <div className="relative">
                      <span className={`absolute inset-y-0 left-0 flex items-center pl-4 ${isDark ? 'text-slate-500' : 'text-slate-400'} font-black`}>R</span>
                      <input
                        type="number"
                        value={contract.totalValue}
                        onChange={(e) => updateField('totalValue', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`w-full pl-9 pr-4 py-3 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 transition-all`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-1.5 ml-1`}>Upfront Deposit (%)</label>
                    <input
                      type="number"
                      value={contract.depositPercent}
                      onChange={(e) => updateField('depositPercent', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 50"
                      className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 transition-all`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: SCOPE */}
              <div className="space-y-5 pb-6">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-black px-2 py-1 rounded">04</span>
                  <h3 className={`text-xs font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Scope & Deliverables</h3>
                </div>
                <textarea
                  rows={6}
                  value={contract.scope}
                  onChange={(e) => updateField('scope', e.target.value)}
                  placeholder="Describe the project milestones and final deliverables..."
                  className={`w-full px-4 py-4 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 outline-none transition-all resize-y min-h-[160px]`}
                />
              </div>

              <div className={`pt-8 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'} font-medium italic`}>All progress is updated in Preview page as you type.</p>
                <button
                  onClick={() => navigate('/contract-preview')}
                  className={`w-full sm:w-auto ${isDark ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-900/30' : 'bg-slate-900 hover:bg-blue-600 text-white shadow-slate-200'} px-10 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg`}
                >
                  Generate Preview
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <div className="sm:hidden pb-10 px-6 text-center">
        <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-widest font-bold`}>ContractBuilder Mobile v1.0</p>
      </div>
    </div>
  );
}