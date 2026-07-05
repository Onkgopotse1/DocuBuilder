import { useNavigate } from "react-router-dom";
import  { useDocument } from "../../context/DocumentContext";
import { useTheme } from "../../context/Theme Context.tsx";
import type { InvoiceItem } from "../../context/DocumentContext";
import { pageThemes } from "../../data/pageThemes";


export default function InvoiceBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const { theme } = useTheme();
  const invoice = document.invoice;
  const pageTheme = pageThemes.invoice;

  const updateField = (field: keyof typeof invoice, value: any) => {
    setDocument((prev) => ({ ...prev, invoice: { ...prev.invoice, [field]: value } }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = { description: "", quantity: 1, unitPrice: 0 };
    setDocument((prev) => ({ ...prev, invoice: { ...prev.invoice, items: [...prev.invoice.items, newItem] } }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setDocument((prev) => {
      const items = [...prev.invoice.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, invoice: { ...prev.invoice, items } };
    });
  };

  const removeItem = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      invoice: { ...prev.invoice, items: prev.invoice.items.filter((_, i) => i !== index) },
    }));
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;


  return (
    <div className={`min-h-screen ${theme === 'dark' ? pageTheme.dark : pageTheme.light} font-['Inter',system-ui,sans-serif] ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'} pb-12`}>
      <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-50 shadow-sm dark:bg-slate-900/90 dark:border-slate-700">
        <button onClick={() => navigate("/")} className="flex items-center justify-center w-11 h-11 md:w-10 md:h-10 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors overflow-hidden">
          <span className="text-slate-600 text-sm">←</span>
        </button>
        <div className="flex gap-3">
          <button onClick={() => navigate("/invoice-preview")} className="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <span>👁️</span>
            <span className="hidden md:inline ml-2">Preview</span>
          </button>
          <button onClick={() => navigate("/invoice-preview?download=1")} className="flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Download</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto pt-32 px-4 md:px-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border-2 border-slate-300 overflow-hidden">
          <div className="p-8 md:p-10 space-y-8">
            <div className="flex items-center gap-4 border-b-2 border-slate-300 pb-6">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Client & Invoice Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Client / Company</label>
                <input type="text" value={invoice.clientName} onChange={(e) => updateField("clientName", e.target.value)} placeholder="e.g. Acme Corp" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Client Email</label>
                <input type="email" value={invoice.clientEmail} onChange={(e) => updateField("clientEmail", e.target.value)} placeholder="client@example.com" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-slate-50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Billing Address</label>
                <textarea rows={2} value={invoice.clientAddress} onChange={(e) => updateField("clientAddress", e.target.value)} placeholder="Street address, City, Country" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none bg-slate-50/50 hover:bg-slate-50 resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Invoice Number</label>
                <input type="text" value={invoice.invoiceNumber} onChange={(e) => updateField("invoiceNumber", e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Invoice Date</label>
                <input type="date" value={invoice.invoiceDate} onChange={(e) => updateField("invoiceDate", e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Tax Rate (%)</label>
                <input type="number" value={invoice.taxRate} onChange={(e) => updateField("taxRate", parseFloat(e.target.value) || 0)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" />
              </div>
            </div>
          </div>

          <div className="px-8 md:px-10 pb-10 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-300 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Line Items</h2>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-slate-300">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50/90">
                  <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-600">
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4 w-32">Qty</th>
                    <th className="px-5 py-4 w-48">Unit Price</th>
                    <th className="px-5 py-4 w-16 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">
                        <input value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} className="w-full px-4 py-2.5 bg-transparent border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                      </td>
                      <td className="p-3">
                        <input type="number" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 bg-transparent border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                      </td>
                      <td className="p-3">
                        <input type="number" value={item.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 bg-transparent border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => removeItem(idx)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={addItem} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100">
              <span className="text-lg leading-none">+</span> Add New Item
            </button>
          </div>

          <div className="bg-slate-50/80 border-t-2 border-slate-300 p-8 md:p-10">
            <div className="max-w-sm ml-auto space-y-4">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold text-slate-800">R {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Tax ({invoice.taxRate}%)</span>
                <span className="font-semibold text-slate-800">R {tax.toFixed(2)}</span>
              </div>
              <div className="pt-5 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xl font-extrabold text-slate-900">Total Amount</span>
                <span className="text-xl font-extrabold text-blue-600">R {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}