import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { useTheme } from '../../context/Theme Context.tsx';
import { exportPDF } from '../../utils/PDF.Generator';
import { pageThemes } from "../../data/pageThemes";

export default function DeliveryNotePreview() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [exportError, setExportError] = useState<string | null>(null);
  const [isAutoExporting, setIsAutoExporting] = useState(false);
  const { document } = useDocument();
  const deliveryNote = document.deliveryNote;
  const isDark = theme === 'dark';
  const pageTheme = pageThemes.Delivery_Note;

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

  // Color palette (all hex, no oklch)
  const colors = {
    white: '#ffffff',
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate300: '#cbd5e1',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1e293b',
    slate900: '#0f172a',
    emerald50: '#ecfdf5',
    emerald100: '#d1fae5',
    emerald500: '#10b981',
    emerald600: '#059669',
    emerald700: '#047857',
    red50: '#fef2f2',
    red200: '#fecaca',
    red800: '#991b1b',
  };

  return (
    <div   className={`minHeight: '100vh', ${isDark ? pageTheme.dark : pageTheme.light} font-['Inter',system-ui,sans-serif] pb-16 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Navigation Bar */}
    <nav className={"fixed top-0 left-0 w-full z-50 flex items-center justify-between py-3 px-5  border-b border-slate-200 dark:border-slate-700" }>
        <button
          onClick={() => navigate('/delivery-note-builder')}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-600 cursor-pointer transition-colors hover:bg-slate-200 hover:text-slate-900"
        >
          <svg
            className="w-5 h-5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="hidden sm:block font-bold text-sm text-slate-700">
            Delivery Note Preview
          </span>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg font-black text-sm transition-colors bg-emerald-600 text-white py-2 px-5 cursor-pointer hover:bg-emerald-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div
          id="deliverynote-section"
          style={{
            backgroundColor: colors.white,
            borderRadius: '1.5rem',
            overflow: 'hidden',
            boxShadow: '0 30px 80px -30px rgba(15,23,42,0.25)',
            color: colors.slate900,
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: colors.slate50, padding: '1.5rem 2rem', borderBottom: `1px solid ${colors.slate200}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <svg style={{ width: '1rem', height: '1rem', color: colors.emerald500 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.emerald500 }}>
                    Delivery Note
                  </span>
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: colors.slate900 }}>{deliveryNote.dispatchedFromCompany || 'Nexus Solutions Inc.'}</h1>
                <p style={{ color: colors.slate500, fontSize: '0.875rem' }}>
                  {deliveryNote.dispatchedFromContact || 'dispatch@nexus.com'} · {deliveryNote.dispatchedFromPhone || '+27 11 000 0000'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: colors.emerald600 }}>{deliveryNote.dnNumber || 'DN-2025-001'}</p>
                <p style={{ fontSize: '0.75rem', color: colors.slate500, marginTop: '0.25rem' }}>Date: {formatDate(deliveryNote.date)}</p>
                <p style={{ fontSize: '0.75rem', color: colors.slate500 }}>PO Ref: {deliveryNote.poReference || '—'}</p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${colors.slate100}` }}>
            <div style={{ padding: '1.5rem', borderRight: `1px solid ${colors.slate100}` }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.emerald500, marginBottom: '0.5rem' }}>
                Dispatched From
              </p>
              <p style={{ fontWeight: 700, color: colors.slate900, fontSize: '0.875rem' }}>{deliveryNote.dispatchedFromCompany || '—'}</p>
              <p style={{ color: colors.slate600, fontSize: '0.875rem' }}>{deliveryNote.dispatchedFromContact || '—'}</p>
              <p style={{ color: colors.slate400, fontSize: '0.75rem', marginTop: '0.25rem' }}>{deliveryNote.dispatchedFromAddress || '—'}</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.slate400, marginBottom: '0.5rem' }}>
                Deliver To
              </p>
              <p style={{ fontWeight: 700, color: colors.slate900, fontSize: '0.875rem' }}>{deliveryNote.deliverToCompany || '—'}</p>
              <p style={{ color: colors.slate600, fontSize: '0.875rem' }}>{deliveryNote.deliverToContact || '—'}</p>
              <p style={{ color: colors.slate400, fontSize: '0.75rem', marginTop: '0.25rem' }}>{deliveryNote.deliverToAddress || '—'}</p>
            </div>
          </div>

          {/* Driver / Vehicle / ETA */}
          <div
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: colors.emerald50,
              borderBottom: `1px solid ${colors.emerald100}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg style={{ width: '0.875rem', height: '0.875rem', color: colors.emerald500 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.emerald700 }}>Driver: {deliveryNote.driverName || '—'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg style={{ width: '0.875rem', height: '0.875rem', color: colors.emerald500 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1" />
              </svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.emerald700 }}>Vehicle: {deliveryNote.vehicleReg || '—'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg style={{ width: '0.875rem', height: '0.875rem', color: colors.emerald500 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.emerald700 }}>ETA: {formatDate(deliveryNote.eta)}</span>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ padding: '1.5rem 2rem' }}>
            <p style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: colors.slate400 }}>
              Items Dispatched
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '0.5rem',
                paddingBottom: '0.5rem',
                borderBottom: `1px solid ${colors.slate100}`,
              }}
            >
              <span style={{ gridColumn: 'span 6', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.slate400 }}>
                Description
              </span>
              <span style={{ gridColumn: 'span 2', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', color: colors.slate400 }}>
                Qty
              </span>
              <span style={{ gridColumn: 'span 2', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', color: colors.slate400 }}>
                Unit
              </span>
              <span style={{ gridColumn: 'span 2', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', color: colors.slate400 }}>
                Condition
              </span>
            </div>
            {items.length > 0 ? (
              items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '0.5rem',
                    padding: '0.75rem 0.25rem',
                    alignItems: 'center',
                    borderRadius: '0.5rem',
                    borderBottom: `1px solid ${colors.slate50}`,
                    backgroundColor: i % 2 === 0 ? 'rgba(248, 250, 252, 0.4)' : 'transparent',
                  }}
                >
                  <div style={{ gridColumn: 'span 6', fontSize: '0.875rem', fontWeight: 500, color: colors.slate700 }}>{item.description || '—'}</div>
                  <div style={{ gridColumn: 'span 2', fontSize: '0.875rem', textAlign: 'center', fontWeight: 700, color: colors.slate600 }}>{item.quantity}</div>
                  <div style={{ gridColumn: 'span 2', fontSize: '0.875rem', textAlign: 'center', color: colors.slate500 }}>{item.unit}</div>
                  <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: colors.emerald50,
                        color: colors.emerald700,
                      }}
                    >
                      {item.condition}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem 0', textAlign: 'center', fontSize: '0.875rem', color: colors.slate500 }}>No items added yet.</div>
            )}
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.slate500 }}>
                {items.length} items · {totalUnits} units total
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div
            style={{
              margin: '0 2rem 2rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${colors.slate100}`,
            }}
          >
            <div>
              <p style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: colors.slate400 }}>
                Dispatched By
              </p>
              <div style={{ borderTop: `2px solid ${colors.slate200}`, paddingTop: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.slate600 }}>{deliveryNote.dispatchedFromContact || '—'}</p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: colors.slate400 }}>
                Received By
              </p>
              <div style={{ borderTop: `2px dashed ${colors.slate200}`, paddingTop: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: colors.slate400 }}>Signature & date</p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {deliveryNote.instructions && (
            <div style={{ padding: '0 2rem 1.5rem' }}>
              <p style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', color: colors.slate400 }}>
                Special Instructions
              </p>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: colors.slate600,
                  lineHeight: '1.625',
                  backgroundColor: colors.slate50,
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  border: `1px solid ${colors.slate100}`,
                }}
              >
                {deliveryNote.instructions}
              </p>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              padding: '0.75rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: colors.slate50,
              borderTop: `1px solid ${colors.slate200}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: colors.emerald500 }}></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: colors.slate500 }}>DocuBuilder</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: colors.slate500 }}>
              {deliveryNote.dnNumber} · {new Date().toLocaleDateString('en-ZA')}
            </span>
          </div>
        </div>

        {exportError && (
          <div
            style={{
              marginTop: '1.5rem',
              borderRadius: '1rem',
              border: `1px solid ${colors.red200}`,
              backgroundColor: colors.red50,
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              color: colors.red800,
            }}
          >
            {exportError}
          </div>
        )}
      </div>
    </div>
  );
}