import { useNavigate } from 'react-router-dom';
import { useInvoice, formatMoney } from '../../context/InvoiceContext.tsx';

export default function InvoicePreview() {
  const navigate = useNavigate();
  const {
    clientName,
    clientEmail,
    clientAddress,
    invoiceNumber,
    invoiceDate,
    taxRate,
    lineItems,
    subtotal,
    taxAmount,
    total,
    generatePDF,
  } = useInvoice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9f0f5] to-[#d9e2ec] font-['Inter',system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] py-8 px-6 text-[#1e293b]">
      <div className="max-w-[1600px] mx-auto">
        <button
          className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-[#1e3c72] cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
          onClick={() => navigate('/invoice-builder')}
        >
          <i className="fas fa-arrow-left"></i> Back to Invoice Builder
        </button>

        {/* Preview Panel */}
        <div className="bg-white rounded-3xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.15)] p-6 sticky top-6">
          <h2 className="text-xl font-semibold text-[#0f2b3d] flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-4">
            🔍 Live Invoice Preview
          </h2>

          <div className="invoice-preview bg-white rounded-2xl p-6 border border-slate-100">
            <div className="preview-header flex justify-between items-start mb-6 pb-4 border-b-2 border-slate-200 flex-wrap">
              <div className="brand">
                <h2 className="text-2xl font-bold text-[#1e3c72]">✈️ FLIGHT BRIEF</h2>
                <div className="text-xs text-slate-600">Professional Services</div>
              </div>
              <div className="invoice-meta text-right text-sm">
                <div><strong>Invoice #</strong> {invoiceNumber}</div>
                <div><strong>Date</strong> {invoiceDate}</div>
              </div>
            </div>

            <div className="client-section mb-6 bg-slate-50 p-4 rounded-2xl">
              <div><strong>Bill To:</strong></div>
              <div className="whitespace-pre-line text-sm mt-1">
                {clientName}<br />{clientEmail}<br />{clientAddress}
              </div>
            </div>

            <table className="items-preview-table w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left py-2 px-1">Item</th>
                  <th className="text-left py-2 px-1">Qty</th>
                  <th className="text-left py-2 px-1">Unit Price</th>
                  <th className="text-left py-2 px-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2 px-1">{item.description || '—'}</td>
                    <td className="py-2 px-1">{item.quantity}</td>
                    <td className="py-2 px-1">{formatMoney(item.unitPrice)}</td>
                    <td className="py-2 px-1">{formatMoney(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
                {lineItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-slate-400 py-4">No items added</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="preview-totals mt-5 text-right">
              <div className="text-sm">Subtotal: {formatMoney(subtotal)}</div>
              <div className="text-sm">Tax ({taxRate}%): {formatMoney(taxAmount)}</div>
              <div className="text-lg font-bold border-t border-slate-200 mt-2 pt-2">Total: {formatMoney(total)}</div>
            </div>

            <div className="mt-4 text-xs text-center text-slate-500 border-t border-dashed border-slate-200 pt-3">
              Thank you for your business — payment due in 30 days
            </div>
          </div>

          <button
            onClick={generatePDF}
            className="bg-[#1e3c72] text-white border-0 py-3 px-6 rounded-full font-semibold text-base cursor-pointer mt-6 w-full transition hover:bg-[#0f2b3d] hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            📎 Download PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
}