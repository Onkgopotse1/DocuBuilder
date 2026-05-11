import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import type { QuoteItem } from '../../context/DocumentContext';

export default function QuoteBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const quote = document.quote;

  const updateField = (field: keyof typeof quote, value: any) => {
    setDocument((prev) => ({ ...prev, quote: { ...prev.quote, [field]: value } }));
  };

  const addItem = () => {
    const newItem: QuoteItem = { description: '', quantity: 1, unitPrice: 0 };
    setDocument((prev) => ({ ...prev, quote: { ...prev.quote, items: [...prev.quote.items, newItem] } }));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    setDocument((prev) => {
      const items = [...prev.quote.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, quote: { ...prev.quote, items } };
    });
  };

  const removeItem = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      quote: { ...prev.quote, items: prev.quote.items.filter((_, i) => i !== index) },
    }));
  };

  const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 sm:gap-8">
              <button
                onClick={() => navigate('/')}
                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
                title="Back to Home"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex flex-col border-l border-slate-200 pl-4 sm:pl-8">
                <h1 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-sm">Q</span>
                  <span>Quote<span className="text-blue-600">Gen</span></span>
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Drafting Mode</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/quote-preview')}
                className="relative group overflow-hidden bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2.5"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="relative">Live Preview</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-4xl mx-auto px-0 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-none sm:rounded-2xl shadow-xl sm:shadow-sm border-y sm:border border-slate-200 p-6 sm:p-10">
          <form className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="bg-blue-600 p-2 rounded-lg text-white">🏢</div>
                <h2 className="text-xl font-bold text-slate-900">Your Company</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Company Name</label>
                  <input
                    type="text"
                    value={quote.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="Company name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Company Email</label>
                  <input
                    type="email"
                    value={quote.companyEmail}
                    onChange={(e) => updateField('companyEmail', e.target.value)}
                    placeholder="hello@nexus-solutions.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2 ml-1">Company Address</label>
                  <input
                    type="text"
                    value={quote.companyAddress}
                    onChange={(e) => updateField('companyAddress', e.target.value)}
                    placeholder="123 Business Blvd, Suite 400, Austin, TX"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="bg-slate-900 p-2 rounded-lg text-white">📋</div>
                  <h2 className="text-lg font-bold text-slate-900">Quote Details</h2>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={quote.quoteNumber}
                    onChange={(e) => updateField('quoteNumber', e.target.value)}
                    placeholder="Quote #"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Issue Date</label>
                      <input
                        type="date"
                        value={quote.issueDate}
                        onChange={(e) => updateField('issueDate', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={quote.expiryDate}
                        onChange={(e) => updateField('expiryDate', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-700">👤</div>
                  <h2 className="text-lg font-bold text-slate-900">Client Information</h2>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={quote.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
                    placeholder="Client Name"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    value={quote.clientEmail}
                    onChange={(e) => updateField('clientEmail', e.target.value)}
                    placeholder="Client Email"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={quote.clientAddress}
                    onChange={(e) => updateField('clientAddress', e.target.value)}
                    placeholder="Client Address"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 p-2 rounded-lg text-white">📦</div>
                  <h2 className="text-xl font-bold text-slate-900">Line Items</h2>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-xs font-bold bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  + Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                      <th className="text-left py-4 px-2">Description</th>
                      <th className="text-center py-4 px-2 w-24">Qty</th>
                      <th className="text-right py-4 px-2 w-32">Price (R)</th>
                      <th className="text-right py-4 px-2 w-32">Total</th>
                      <th className="py-4 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {quote.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-4 px-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(idx, 'description', e.target.value)}
                            placeholder="Item description"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                          />
                        </td>
                        <td className="py-4 px-2 text-center">
                          <input
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value) || 0)}
                            className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-center"
                          />
                        </td>
                        <td className="py-4 px-2 text-right">
                          <input
                            type="number"
                            value={item.unitPrice}
                            min={0}
                            onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value) || 0)}
                            className="w-24 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-right"
                          />
                        </td>
                        <td className="py-4 px-2 text-right font-bold">R {(item.quantity * item.unitPrice).toFixed(2)}</td>
                        <td className="py-4 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-slate-400 ml-1">Terms & Conditions</label>
                <textarea
                  rows={5}
                  value={quote.terms}
                  onChange={(e) => updateField('terms', e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white transition-all outline-none"
                  placeholder="All services subject to standard terms."
                />
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-3">Quote Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span>R {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax (15%)</span>
                    <span>R {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-800">
                    <span>Total Amount</span>
                    <span className="text-blue-400">R {total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 mt-4 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Generate Quote PDF
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <footer className="text-center py-8 opacity-40">
        <p className="text-[10px] font-bold uppercase tracking-widest">Nexus Suite v2.0 • Soshanguve, ZA</p>
      </footer>
    </div>
  );
}
