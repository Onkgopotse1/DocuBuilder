import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { exportPDF } from '../../utils/PDF.Generator';

export default function ContractPreview() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const contract = document.contract;

  const [exportError, setExportError] = useState<string | null>(null);
  const [localContract, setLocalContract] = useState(contract);

  // If context somehow loses data, restore from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('contractBackup');
    if (saved && (!contract.documentTitle && !contract.clientName)) {
      const parsed = JSON.parse(saved);
      setDocument((prev) => ({ ...prev, contract: parsed }));
    }
  }, []);

  // Backup to sessionStorage whenever contract changes
  useEffect(() => {
    if (contract && Object.keys(contract).length) {
      sessionStorage.setItem('contractBackup', JSON.stringify(contract));
    }
    setLocalContract(contract);
  }, [contract]);

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportPDF("contract-section", "contract");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setExportError(`PDF export failed: ${message}`);
    }
  };

  // Helper to format values with fallback
  const formatDate = (dateStr: string) => dateStr || "[Date]";
  const formatValue = (value: number) => (value ? `R ${value.toFixed(2)}` : "[Value]");
  const formatPercent = (percent: number) => (percent ? `${percent}%` : "[Deposit]%");

  // Use localContract or contract (both are same, but localContract ensures re-render)
  const displayContract = localContract;

  return (
    <div className="min-h-screen bg-slate-200/60 font-sans text-slate-800">
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
            <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-[#1e3c72] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition-all shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </nav>

      {exportError && (
        <div className="bg-red-50 border-b border-red-200 px-4 sm:px-8 py-3">
          <div className="max-w-5xl mx-auto text-sm text-red-800">{exportError}</div>
        </div>
      )}

      <main className="max-w-5xl mx-auto py-8 sm:py-12 px-0 sm:px-6 flex justify-center">
        <section id="contract-section" className="bg-[#ffffff] w-full max-w-[210mm] min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:rounded-sm overflow-hidden flex flex-col" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
          <style>{`
            #contract-section, #contract-section * { color: #0f172a !important; border-color: #e2e8f0 !important; background-color: transparent !important; fill: #0f172a !important; }
            #contract-section { background-color: #ffffff !important; }
            #contract-section .bg-[#0f172a] { background-color: #0f172a !important; color: #ffffff !important; }
            #contract-section .text-slate-800 { color: #0f172a !important; }
            #contract-section .bg-[#f8fafc] { background-color: #f8fafc !important; }
            #contract-section .border-slate-900 { border-color: #0f172a !important; }
          `}</style>

          <div className="p-10 sm:p-20 flex-1 relative">
            <div className="flex justify-between items-start mb-16">
              <div className="w-12 h-12 bg-[#0f172a] rounded-sm flex items-center justify-center text-[#ffffff] font-black text-xl">C</div>
              <div className="text-right">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#94a3b8]">Legal Document</h2>
                <p className="text-xs text-[#94a3b8]">
                  Ref: {displayContract.documentTitle ? displayContract.documentTitle.slice(0, 3).toUpperCase() : 'AGC'}-
                  {displayContract.effectiveDate?.replace(/-/g, '') || '000000'}
                </p>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center mb-12 uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-8">
              {displayContract.documentTitle || "Service Agreement"}
            </h1>

            <div className="space-y-8 text-slate-800 font-serif leading-relaxed text-sm sm:text-base">
              <p>
                This Agreement is made effective as of <span className="font-bold border-b border-slate-300 px-2">
                  {formatDate(displayContract.effectiveDate)}
                </span>, 
                by and between <strong>{displayContract.clientName || "[Client Name]"}</strong> (hereinafter referred to as the "Client") and 
                <strong>{displayContract.contractorName || "[Contractor Name]"}</strong> (hereinafter referred to as the "Contractor").
              </p>

              {(displayContract.clientAddress || displayContract.contractorAddress) && (
                <div className="bg-[#f8fafc] p-4 rounded-lg text-sm space-y-1">
                  {displayContract.clientAddress && <p><strong>Client Address:</strong> {displayContract.clientAddress}</p>}
                  {displayContract.contractorAddress && <p><strong>Contractor Address:</strong> {displayContract.contractorAddress}</p>}
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-xs bg-[#0f172a] text-[#ffffff] w-5 h-5 flex items-center justify-center rounded-full">1</span>
                  Scope of Services
                </h2>
                <div className="bg-[#f8fafc] border-l-4 border-[#e2e8f0] p-6 italic text-[#475569] whitespace-pre-wrap">
                  {displayContract.scope || "[The scope of work details will appear here dynamically from your editor...]"}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-xs bg-[#0f172a] text-[#ffffff] w-5 h-5 flex items-center justify-center rounded-full">2</span>
                  Payment Terms
                </h2>
                <p>
                  The total consideration for the services described shall be a sum of 
                  <span className="font-bold"> {formatValue(displayContract.totalValue)}</span>. The Client agrees to pay an upfront deposit of 
                  <span className="font-bold"> {formatPercent(displayContract.depositPercent)}</span> upon execution of this Agreement.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-xs bg-[#0f172a] text-[#ffffff] w-5 h-5 flex items-center justify-center rounded-full">3</span>
                  Governing Law
                </h2>
                <p>
                  This Agreement shall be governed by and construed in accordance with the laws of 
                  <strong>{displayContract.governingLaw || "[Governing Law]"}</strong>.
                </p>
              </div>

              <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-24">
                <div>
                  <div className="border-b-2 border-[#0f172a] h-12 mb-3"></div>
                  <p className="font-bold text-xs uppercase tracking-widest">Client Signature</p>
                  <p className="text-[10px] text-[#94a3b8] mt-1">Authorized Representative</p>
                </div>
                <div>
                  <div className="border-b-2 border-[#0f172a] h-12 mb-3"></div>
                  <p className="font-bold text-xs uppercase tracking-widest">Contractor Signature</p>
                  <p className="text-[10px] text-[#94a3b8] mt-1">Service Provider</p>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center opacity-40">
              <p className="text-[9px] uppercase tracking-[0.3em]">ContractBuilder Framework</p>
              <p className="text-[9px]">Page 1 of 1</p>
            </div>
          </div>
        </section>
      </main>

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