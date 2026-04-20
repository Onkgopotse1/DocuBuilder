import { useNavigate } from 'react-router-dom';

export default function ContractPreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-200/60 font-sans text-slate-800">
      
      {/* --- PREVIEW TOOLBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-slate-300 shadow-sm px-4 sm:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <button
            className="group flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-blue-700 transition-colors"
            onClick={() => navigate('/contract-builder')}
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Editor
          </button>

          <div className="flex items-center gap-3">
             {/* Print Button (Optional but helpful) */}
             <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
             </button>

             <button className="flex items-center gap-2 bg-[#1e3c72] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
             </button>
          </div>
        </div>
      </nav>

      {/* --- DOCUMENT AREA --- */}
      <main className="max-w-5xl mx-auto py-8 sm:py-12 px-0 sm:px-6 flex justify-center">
        
        {/* A4 Paper Container */}
        <section className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:rounded-sm overflow-hidden flex flex-col">
          
          {/* Document Content */}
          <div className="p-10 sm:p-20 flex-1 relative">
            
            {/* Header / Letterhead Decor */}
            <div className="flex justify-between items-start mb-16">
              <div className="w-12 h-12 bg-slate-900 rounded-sm flex items-center justify-center text-white font-black text-xl">
                C
              </div>
              <div className="text-right">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Legal Document</h2>
                <p className="text-xs text-slate-400">Ref: CB-2026-001</p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-12 uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-8">
              Service Agreement
            </h1>

            <div className="space-y-8 text-slate-800 font-serif leading-relaxed text-sm sm:text-base">
              
              <p>
                This Agreement is made effective as of <span className="font-bold border-b border-slate-300 px-2">[Date]</span>, 
                by and between <strong>[Client Name]</strong> (hereinafter referred to as the "Client") and 
                <strong> [Contractor Name]</strong> (hereinafter referred to as the "Contractor").
              </p>

              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-xs bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-full">1</span>
                  Scope of Services
                </h2>
                <div className="bg-slate-50 border-l-4 border-slate-200 p-6 italic text-slate-600 whitespace-pre-wrap">
                  [The scope of work details will appear here dynamically from your editor...]
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-xs bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-full">2</span>
                  Payment Terms
                </h2>
                <p>
                  The total consideration for the services described shall be a sum of 
                  <span className="font-bold"> R [Value]</span>. The Client agrees to pay an upfront deposit of 
                  <span className="font-bold"> [Deposit]%</span> upon execution of this Agreement.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-xs bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-full">3</span>
                  Governing Law
                </h2>
                <p>
                  This Agreement shall be governed by and construed in accordance with the laws of 
                  <strong> [Governing Law]</strong>.
                </p>
              </div>

              {/* Signature Area */}
              <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-24">
                <div>
                  <div className="border-b-2 border-slate-900 h-12 mb-3"></div>
                  <p className="font-bold text-xs uppercase tracking-widest">Client Signature</p>
                  <p className="text-[10px] text-slate-400 mt-1">Authorized Representative</p>
                </div>
                <div>
                  <div className="border-b-2 border-slate-900 h-12 mb-3"></div>
                  <p className="font-bold text-xs uppercase tracking-widest">Contractor Signature</p>
                  <p className="text-[10px] text-slate-400 mt-1">Service Provider</p>
                </div>
              </div>

            </div>

            {/* Footer Watermark */}
            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center opacity-40">
                <p className="text-[9px] uppercase tracking-[0.3em]">ContractBuilder Framework</p>
                <p className="text-[9px]">Page 1 of 1</p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating UI for Mobile (Edit Button) */}
      <button 
        onClick={() => navigate('/contract-builder')}
        className="sm:hidden fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl active:scale-90 z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

    </div>
  );
}