import { useNavigate } from 'react-router-dom';
import { useInvoice, formatMoney } from '../../context/InvoiceContext.tsx';

export default function InvoiceBuilder() {
  const navigate = useNavigate();
  const {
    clientName, setClientName,
    clientEmail, setClientEmail,
    clientAddress, setClientAddress,
    invoiceNumber, setInvoiceNumber,
    invoiceDate, setInvoiceDate,
    taxRate, setTaxRate,
    lineItems,
    updateLineItem,
    addLineItem,
    removeLineItem,
    subtotal,
    taxAmount,
    total,
  } = useInvoice();

  const handlePreviewClick = () => {
    navigate('/invoice-preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9f0f5] to-[#d9e2ec] font-['Inter',system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] py-8 px-6 text-[#1e293b]">
      <div>
        <button
          className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-[#1e3c72] cursor-pointer mb-1 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
          onClick={() => navigate('/')}
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <button
          className="bg-[#1e3c72] text-white border-0 py-3 px- rounded-full font-semibold text-base cursor-pointer mt-1 transition hover:bg-[#0f2b3d] hover:-translate-y-0.5 flex items-center justify-center gap-2"
          onClick={handlePreviewClick}
        >
          <p>⬇ Preview Invoice</p>
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.15)] p-6 transition-all duration-200">
          {/* Client & Invoice Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0f2b3d] flex items-center gap-2 border-b-2 border-slate-200 pb-2">
              🏢 Client &amp; Invoice Details
            </h2>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[160px] space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Client / Company
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2b4c7c] focus:ring-[3px] focus:ring-[#2b4c7c]/15 transition"
                />
              </div>
              <div className="flex-1 min-w-[160px] space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Client Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2b4c7c] focus:ring-[3px] focus:ring-[#2b4c7c]/15 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Billing Address
              </label>
              <textarea
                rows={2}
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2b4c7c] focus:ring-[3px] focus:ring-[#2b4c7c]/15 transition"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[160px] space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2b4c7c] focus:ring-[3px] focus:ring-[#2b4c7c]/15 transition"
                />
              </div>
              <div className="flex-1 min-w-[160px] space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2b4c7c] focus:ring-[3px] focus:ring-[#2b4c7c]/15 transition"
                />
              </div>
              <div className="flex-1 min-w-[160px] space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2b4c7c] focus:ring-[3px] focus:ring-[#2b4c7c]/15 transition"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-[#0f2b3d] flex items-center gap-2 border-b-2 border-slate-200 pb-2">
              🧾 Line Items
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600 pb-2 border-b border-slate-200">
                      Description
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600 pb-2 border-b border-slate-200">
                      Qty
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600 pb-2 border-b border-slate-200">
                      Unit Price
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 pr-1">
                        <input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#2b4c7c] focus:ring-1 focus:ring-[#2b4c7c]/30"
                        />
                      </td>
                      <td className="py-2 pr-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                          className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#2b4c7c] focus:ring-1 focus:ring-[#2b4c7c]/30"
                        />
                      </td>
                      <td className="py-2 pr-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                          className="w-28 px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#2b4c7c] focus:ring-1 focus:ring-[#2b4c7c]/30"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="bg-transparent border-0 text-red-600 text-xl font-bold px-1 cursor-pointer hover:opacity-80"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addLineItem}
              className="bg-slate-100 border border-dashed border-slate-400 py-1.5 px-4 rounded-full text-sm font-medium text-[#1e3c72] cursor-pointer mt-2 hover:bg-slate-200 transition"
            >
              + Add line item
            </button>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 p-4 rounded-2xl mt-6">
            <div className="flex justify-end gap-6">
              <span className="font-medium text-slate-700">Subtotal:</span>
              <span className="font-medium text-slate-800">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-end gap-6 mt-1">
              <span className="font-medium text-slate-700">Tax ({taxRate}%):</span>
              <span className="font-medium text-slate-800">{formatMoney(taxAmount)}</span>
            </div>
            <div className="flex justify-end gap-6 mt-3 pt-2 border-t-2 border-slate-300">
              <span className="text-lg font-extrabold text-[#0f2b3d]">Total:</span>
              <span className="text-lg font-extrabold text-[#0f2b3d]">{formatMoney(total)}</span>
            </div>
          </div>
        </div>

        <button className="bg-[#1e3c72] text-white border-0 py-3 px-6 rounded-full font-semibold text-base cursor-pointer mt-3 w-full transition hover:bg-[#0f2b3d] hover:-translate-y-0.5 flex items-center justify-center gap-2">
          ⬇ Download Invoice
        </button>
      </div>
    </div>
  );
}