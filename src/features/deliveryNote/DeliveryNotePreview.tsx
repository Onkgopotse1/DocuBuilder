import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { exportPDF } from '../../utils/PDF.Generator';

export default function DeliveryNotePreview() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const { document } = useDocument();
  const deliveryNote = document.deliveryNote;

  const handleExport = async () => {
    try {
      await exportPDF('deliverynote-section', 'delivery-note');
    } catch (error) {
      console.error('Delivery note export failed:', error);
    }
  };

  // Auto-download when ?download=1 is present (once)
  useEffect(() => {
    const shouldAutoDownload = searchParams.get('download') === '1';
    if (shouldAutoDownload && !isAutoExporting) {
      setIsAutoExporting(true);
      handleExport().finally(() => {
        // Remove the query parameter without reloading the page
        setSearchParams({}, { replace: true });
        setIsAutoExporting(false);
      });
    }
  }, [searchParams]);

  const items = deliveryNote.items;

  return (
    <div className="min-h-screen font-['Inter',system-ui,sans-serif] pb-16" style={{ backgroundColor: '#0f172a' }}>

      <nav className="fixed top-0 left-0 w-full backdrop-blur-md px-5 py-3 flex justify-between items-center z-50" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(88, 96, 108, 0.6)' }}>
        <button
          onClick={() => navigate('/delivery-note-builder')}
          className="group w-10 h-10 rounded-lg border flex items-center justify-center transition-all active:scale-95"
          style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#94a3b8' }}
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="font-bold text-sm hidden sm:block" style={{ color: '#cbd5e1' }}>Delivery Note Preview</span>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg font-black text-sm transition-all active:scale-95"
          style={{ backgroundColor: '#10b981', color: '#0f172a', padding: '0.8rem 1.2rem' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div id="deliverynote-section" className="bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)]" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>

          {/* Green header */}
          <div className="bg-[#0f172a] px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">Delivery Note</span>
                </div>
                <h1 className="text-xl font-black text-[#ffffff]">{deliveryNote.dispatchedFromCompany || 'Nexus Solutions Inc.'}</h1>
                <p className="text-[#94a3b8] text-sm">{deliveryNote.dispatchedFromContact || 'dispatch@nexus.com'} · {deliveryNote.dispatchedFromPhone || '+27 11 000 0000'}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#22c55e]">{deliveryNote.dnNumber || 'DN-2025-001'}</p>
                <p className="text-xs text-[#94a3b8] mt-1">Date: {deliveryNote.date || '20 Apr 2025'}</p>
                <p className="text-xs text-[#94a3b8]">PO Ref: {deliveryNote.poReference || 'PO-2025-055'}</p>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 border-b border-[#f1f5f9]">
            <div className="p-6 border-r border-[#f1f5f9]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#16a34a] mb-2">Dispatched From</p>
              <p className="font-bold text-[#0f172a] text-sm">{deliveryNote.dispatchedFromCompany || 'Nexus Solutions Inc.'}</p>
              <p className="text-[#64748b] text-sm">{deliveryNote.dispatchedFromContact || 'John Mokoena'}</p>
              <p className="text-[#94a3b8] text-xs mt-1">{deliveryNote.dispatchedFromAddress || '12 Industrial Rd, Germiston'}</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Deliver To</p>
              <p className="font-bold text-[#0f172a] text-sm">{deliveryNote.deliverToCompany || 'Acme Innovations'}</p>
              <p className="text-[#64748b] text-sm">{deliveryNote.deliverToContact || 'Sarah Dlamini'}</p>
              <p className="text-[#94a3b8] text-xs mt-1">{deliveryNote.deliverToAddress || '456 Corporate Blvd, Rosebank'}</p>
            </div>
          </div>

          {/* Carrier info bar */}
          <div className="px-8 py-3 bg-[#ecfdf5] border-b border-[#d1fae5] flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#16a34a' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: '#047857' }}>Driver: {deliveryNote.driverName || 'Thabo Nkosi'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#16a34a' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: '#047857' }}>Vehicle: {deliveryNote.vehicleReg || 'GP 456 789'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#16a34a' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: '#047857' }}>ETA: {deliveryNote.eta || '21 Apr 2025'}</span>
            </div>
          </div>

          {/* Items */}
          <div className="px-8 py-6">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>Items Dispatched</p>
            <div className="grid grid-cols-12 gap-2 pb-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <span className="col-span-6 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#cbd5e1' }}>Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#cbd5e1' }}>Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#cbd5e1' }}>Unit</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: '#cbd5e1' }}>Condition</span>
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
                  <div className="col-span-6 text-sm font-medium" style={{ color: '#334155' }}>{item.description || '—'}</div>
                  <div className="col-span-2 text-sm text-center font-bold" style={{ color: '#475569' }}>{item.quantity}</div>
                  <div className="col-span-2 text-sm text-center" style={{ color: '#64748b' }}>{item.unit}</div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>{item.condition}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm" style={{ color: '#64748b' }}>No items added yet. Go back to builder to add dispatched items.</div>
            )}
            <div className="mt-3 flex justify-end">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#64748b' }}>{items.length} items · {items.reduce((s, item) => s + item.quantity, 0)} units total</span>
            </div>
          </div>

          {/* Signature */}
          <div className="mx-8 mb-8 grid grid-cols-2 gap-6 pt-6" style={{ borderTop: '1px solid #f1f5f9' }}>
            {[
              { label: 'Dispatched By', name: 'John Mokoena' },
              { label: 'Received By', name: 'Signature & date' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: '#94a3b8' }}>{s.label}</p>
                <div className="border-t-2 pt-2" style={{ borderTopStyle: i === 1 ? 'dashed' : 'solid', borderTopColor: i === 1 ? '#e2e8f0' : '#cbd5e1' }}>
                  <p className="text-xs" style={{ color: i === 1 ? '#cbd5e1' : '#475569', fontWeight: i === 1 ? '400' : 600 }}>{s.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-8 py-3 flex justify-between" style={{ backgroundColor: '#0f172a' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#34d399' }}></div>
              <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>DocuBuilder</span>
            </div>
            <span className="text-xs" style={{ color: '#94a3b8' }}>DN-2025-001 · {new Date().toLocaleDateString('en-ZA')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}