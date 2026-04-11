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
<div className="min-h-screen bg-[#f8fafc] font-['Inter',system-ui,sans-serif] text-[#1e293b] pb-12">
  {/* Fixed Header Navigation */}
<nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-sm">
  {/* Back Button: Hide text on mobile */}
<button
  className="flex items-center justify-center rounded-full w-12 h-12 md:w-10 md:h-10 bg-slate-100 hover:bg-slate-200 rounded-lg overflow-hidden"
  onClick={() => navigate('/')}
>
  <i className="fas fa-arrow-left text-xs"></i>
  <span className="hidden md:inline">
    <img
      src="./public/left-arrow.png"
      alt="Back"
      className="w-full h-full object-contain rounded-full"
    />
  </span>
</button>
  
  <div className="flex gap-2 md:gap-3">
    {/* Preview Button: Hide text on mobile */}
    <button
      className="flex items-center justify-center px-3 py-2 md:px-5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition shadow-sm"
      onClick={handlePreviewClick}
    >
      <span>👁️</span>
      <span className="hidden md:inline ml-1">Preview</span>
    </button>

    {/* Download Button: Hide text on mobile */}
    <button className="flex items-center justify-center px-3 py-2 md:px-5 bg-[#2563eb] text-white text-sm font-semibold rounded-lg hover:bg-[#1d4ed8] transition shadow-md shadow-blue-200 gap-2">
      <i className="fas fa-download"></i>
      <span className="hidden md:inline">Download</span>
    </button>
  </div>
</nav>

  <div className="max-w-5xl mx-auto pt-28 px-4">
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      
      {/* Client & Invoice Details Section */}
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <i className="fas fa-building text-lg"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Client & Invoice Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Client / Company
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Client Email
            </label>
            <input
              type="email"
              placeholder="client@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
            Billing Address
          </label>
          <textarea
            rows={2}
            placeholder="Street address, City, Country"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/30 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Tax Rate (%)
            </label>
            <div className="relative">
               <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      <div className="px-8 pb-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <i className="fas fa-list-ul text-lg"></i>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Line Items</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <th className="px-4 pb-2">Description</th>
                <th className="px-4 pb-2 w-24">Qty</th>
                <th className="px-4 pb-2 w-40">Unit Price</th>
                <th className="px-4 pb-2 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="group">
                  <td className="p-1">
                    <input
                      value={item.description}
                      placeholder="Item description..."
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                  </td>
                  <td className="p-1">
                    <div className="relative">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </td>
                  <td className="p-1 text-center">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addLineItem}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100"
        >
          <i className="fas fa-plus text-xs"></i> Add New Item
        </button>
      </div>

      {/* Summary Totals Section */}
      <div className="bg-slate-50/80 border-t border-slate-100 p-8">
        <div className="max-w-xs ml-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="text-slate-900 font-semibold">{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Tax ({taxRate}%)</span>
            <span className="text-slate-900 font-semibold">{formatMoney(taxAmount)}</span>
          </div>
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-lg font-extrabold text-[#0f2b3d]">Total Amount</span>
            <span className="text-lg font-extrabold text-[#0f2b3d]">
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}