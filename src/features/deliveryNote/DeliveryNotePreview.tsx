import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { exportPDF } from '../../utils/PDF.Generator';

export default function DeliveryNotePreview() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const { document } = useDocument();
  const deliveryNote = document.deliveryNote;

  const handleExport = async () => {
    setExportError(null);
    try {
      await exportPDF('deliverynote-section', 'delivery-note');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setExportError(`PDF export failed: ${message}`);
    }
  };

  useEffect(() => {
    const shouldAutoDownload = searchParams.get('download') === '1';
    if (shouldAutoDownload && !isAutoExporting) {
      setIsAutoExporting(true);
      handleExport().finally(() => {
        setSearchParams({}, { replace: true });
        setIsAutoExporting(false);
      });
    }
  }, [searchParams]);

  const items = deliveryNote.items;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen font-['Inter',system-ui,sans-serif] pb-16 bg-slate-50">
      <nav className="fixed top-0 left-0 w-full backdrop-blur-md px-5 py-3 flex justify-between items-center z-50 bg-white/95 border-b border-slate-200">
        <button
          onClick={() => navigate('/delivery-note-builder')}
          className="group w-10 h-10 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 flex items-center justify-center transition-all active:scale-95 hover:bg-slate-200 hover:text-slate-900"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="font-bold text-sm hidden sm:block text-slate-700">Delivery Note Preview</span>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg font-black text-sm transition-all active:scale-95 bg-emerald-600 text-white px-5 py-2 hover:bg-emerald-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div id="deliverynote-section" className="bg-white rounded-3xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)]" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Delivery Note</span>
                </div>
                <h1 className="text-xl font-black text-slate-900">{deliveryNote.dispatchedFromCompany || 'Nexus Solutions Inc.'}</h1>
                <p className="text-slate-500 text-sm">{deliveryNote.dispatchedFromContact || 'dispatch@nexus.com'} · {deliveryNote.dispatchedFromPhone || '+27 11 000 0000'}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-600">{deliveryNote.dnNumber || 'DN-2025-001'}</p>
                <p className="text-xs text-slate-500 mt-1">Date: {formatDate(deliveryNote.date)}</p>
                <p className="text-xs text-slate-500">PO Ref: {deliveryNote.poReference || '—'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="p-6 border-r border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Dispatched From</p>
              <p className="font-bold text-slate-900 text-sm">{deliveryNote.dispatchedFromCompany || '—'}</p>
              <p className="text-slate-600 text-sm">{deliveryNote.dispatchedFromContact || '—'}</p>
              <p className="text-slate-400 text-xs mt-1">{deliveryNote.dispatchedFromAddress || '—'}</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Deliver To</p>
              <p className="font-bold text-slate-900 text-sm">{deliveryNote.deliverToCompany || '—'}</p>
              <p className="text-slate-600 text-sm">{deliveryNote.deliverToContact || '—'}</p>
              <p className="text-slate-400 text-xs mt-1">{deliveryNote.deliverToAddress || '—'}</p>
            </div>
          </div>

          <div className="px-8 py-3 bg-emerald-50 border-b border-emerald-100 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-semibold text-emerald-700">Driver: {deliveryNote.driverName || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1" />
              </svg>
              <span className="text-xs font-semibold text-emerald-700">Vehicle: {deliveryNote.vehicleReg || '—'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-semibold text-emerald-700">ETA: {formatDate(deliveryNote.eta)}</span>
            </div>
          </div>

          <div className="px-8 py-6">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-slate-400">Items Dispatched</p>
            <div className="grid grid-cols-12 gap-2 pb-2 border-b border-slate-100">
              <span className="col-span-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-center text-slate-400">Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-center text-slate-400">Unit</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-center text-slate-400">Condition</span>
            </div>
            {items.length > 0 ? (
              items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 py-3 items-center rounded-lg px-1"
                  style={{
                    borderBottom: '1px solid #f8fafc',
                    backgroundColor: i % 2 === 0 ? 'rgba(248, 250, 252, 0.4)' : 'transparent',
                  }}
                >
                  <div className="col-span-6 text-sm font-medium text-slate-700">{item.description || '—'}</div>
                  <div className="col-span-2 text-sm text-center font-bold text-slate-600">{item.quantity}</div>
                  <div className="col-span-2 text-sm text-center text-slate-500">{item.unit}</div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{item.condition}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">No items added yet.</div>
            )}
            <div className="mt-3 flex justify-end">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">{items.length} items · {totalUnits} units total</span>
            </div>
          </div>

          <div className="mx-8 mb-8 grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Dispatched By</p>
              <div className="border-t-2 border-slate-200 pt-2">
                <p className="text-xs font-semibold text-slate-600">{deliveryNote.dispatchedFromContact || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Received By</p>
              <div className="border-t-2 border-dashed border-slate-200 pt-2">
                <p className="text-xs text-slate-400">Signature & date</p>
              </div>
            </div>
          </div>

          {deliveryNote.instructions && (
            <div className="px-8 pb-6">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Special Instructions</p>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                {deliveryNote.instructions}
              </p>
            </div>
          )}

          <div className="px-8 py-3 flex justify-between bg-slate-50 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-slate-500">DocuBuilder</span>
            </div>
            <span className="text-xs text-slate-500">{deliveryNote.dnNumber} · {new Date().toLocaleDateString('en-ZA')}</span>
          </div>
        </div>

        {exportError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {exportError}
          </div>
        )}
      </div>
    </div>
  );
}