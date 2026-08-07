import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { useTheme } from '../../context/Theme Context.tsx';
import type { PurchaseOrderItem } from '../../context/DocumentContext';
import { calculateTotals } from '../../utils/calculateTotals';
import { pageThemes } from '../../data/pageThemes';

export default function PurchaseOrderBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const po = document.purchaseOrder;
  const pageTheme = pageThemes.PurchaseOrderBuilder;

  const updateField = (field: keyof typeof po, value: any) => {
    setDocument((prev) => ({
      ...prev,
      purchaseOrder: { ...prev.purchaseOrder, [field]: value },
    }));
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      description: '',
      quantity: 1,
      unit: 'Each',
      unitPrice: 0,
      total: 0,
    };
    setDocument((prev) => ({
      ...prev,
      purchaseOrder: { ...prev.purchaseOrder, items: [...prev.purchaseOrder.items, newItem] },
    }));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setDocument((prev) => {
      const items = [...prev.purchaseOrder.items];
      const updated = { ...items[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updated.total = updated.quantity * updated.unitPrice;
      }
      items[index] = updated;
      return { ...prev, purchaseOrder: { ...prev.purchaseOrder, items } };
    });
  };

  const removeItem = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      purchaseOrder: {
        ...prev.purchaseOrder,
        items: prev.purchaseOrder.items.filter((_, i) => i !== index),
      },
    }));
  };

  const { subtotal, tax: vatAmount, total } = calculateTotals(
    po.items,
    (item) => item.total,
    po.vatRate
  );

  return (
    <div className={`min-h-screen ${isDark ? pageTheme.dark : pageTheme.light} font-['Inter',system-ui,sans-serif] ${isDark ? 'text-slate-100' : 'text-slate-800'} pb-16`}>
      {/* Nav – uses pageTheme.dark */}
      <nav className={`fixed top-0 left-0 w-full ${isDark ? pageTheme.dark : 'bg-white'} border-b-2 ${isDark ? 'border-blue-700' : 'border-blue-600'} px-5 py-3 flex justify-between items-center z-50`}>
        <button
          onClick={() => navigate('/')}
          className={`w-10 h-10 rounded-lg border-2 ${isDark ? 'border-blue-700 text-blue-300 hover:bg-blue-700 hover:text-white hover:border-blue-600' : 'border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'} flex items-center justify-center transition-all active:scale-95`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'} leading-none`}>Purchase Order</p>
            <p className={`text-sm font-black ${isDark ? 'text-slate-100' : 'text-slate-800'} leading-tight`}>Builder</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/purchase-order-preview')}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-600/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => navigate('/purchase-order-preview?download=1')}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-600/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto pt-24 px-4 space-y-4">
        {/* PO header info */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white">
          <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-4">Purchase Order Details</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1.5">PO Number</label>
              <input
                type="text"
                value={po.poNumber}
                onChange={(e) => updateField('poNumber', e.target.value)}
                placeholder="PO-2025-001"
                className="w-full px-3 py-2 bg-white/15 border border-white/25 rounded-lg text-white text-sm placeholder:text-blue-200/50 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1.5">Issue Date</label>
              <input
                type="date"
                value={po.issueDate}
                onChange={(e) => updateField('issueDate', e.target.value)}
                className="w-full px-3 py-2 bg-white/15 border border-white/25 rounded-lg text-white text-sm focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1.5">Required By</label>
              <input
                type="date"
                value={po.requiredBy}
                onChange={(e) => updateField('requiredBy', e.target.value)}
                className="w-full px-3 py-2 bg-white/15 border border-white/25 rounded-lg text-white text-sm focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-200 block mb-1.5">Currency</label>
              <input
                type="text"
                value={po.currency}
                onChange={(e) => updateField('currency', e.target.value)}
                placeholder="ZAR"
                className="w-full px-3 py-2 bg-white/15 border border-white/25 rounded-lg text-white text-sm placeholder:text-blue-200/50 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Buyer / Vendor – both use pageTheme.dark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border-2 ${isDark ? 'border-blue-800' : 'border-blue-100'} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Buyer (Us)</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Company Name</label>
                <input
                  type="text"
                  value={po.buyerCompany}
                  onChange={(e) => updateField('buyerCompany', e.target.value)}
                  placeholder="Your business"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Contact Person</label>
                <input
                  type="text"
                  value={po.buyerContact}
                  onChange={(e) => updateField('buyerContact', e.target.value)}
                  placeholder="Full name"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Email</label>
                <input
                  type="email"
                  value={po.buyerEmail}
                  onChange={(e) => updateField('buyerEmail', e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Billing Address</label>
                <input
                  type="text"
                  value={po.buyerAddress}
                  onChange={(e) => updateField('buyerAddress', e.target.value)}
                  placeholder="Street, City"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
            </div>
          </div>
          <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Vendor / Supplier</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Vendor Name</label>
                <input
                  type="text"
                  value={po.vendorName}
                  onChange={(e) => updateField('vendorName', e.target.value)}
                  placeholder="Supplier company"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Contact Person</label>
                <input
                  type="text"
                  value={po.vendorContact}
                  onChange={(e) => updateField('vendorContact', e.target.value)}
                  placeholder="Full name"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Email</label>
                <input
                  type="email"
                  value={po.vendorEmail}
                  onChange={(e) => updateField('vendorEmail', e.target.value)}
                  placeholder="vendor@email.com"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Vendor Address</label>
                <input
                  type="text"
                  value={po.vendorAddress}
                  onChange={(e) => updateField('vendorAddress', e.target.value)}
                  placeholder="Street, City"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Items – uses pageTheme.dark */}
        <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} overflow-hidden`}>
          <div className="px-6 py-4 bg-blue-600 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Order Items</p>
            <p className="text-xs text-blue-200 hidden sm:block">Description · Qty · Unit · Unit Price · Total</p>
          </div>

          <div className="p-6 space-y-3">
            <div className={`hidden sm:grid grid-cols-12 gap-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              <span className="col-span-5 text-[10px] font-bold uppercase tracking-widest">Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest">Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest">Unit</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-right">Unit Price</span>
            </div>

            {po.items.map((item, idx) => (
              <div key={idx} className="group grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 sm:col-span-5">
                  <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'} mb-1 block`}>Item {idx + 1}</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    placeholder="Item or service description"
                    className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'} mb-1 block`}>Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100' : 'bg-[#f0f4ff] border-blue-100 text-slate-700'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-center`}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'} mb-1 block`}>Unit</label>
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                    className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100' : 'bg-[#f0f4ff] border-blue-100 text-slate-600'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                  >
                    {['Each', 'Box', 'Kg', 'Litre', 'Set', 'Hour', 'Month'].map((u) => (
                      <option key={u} className={isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700'}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center gap-1">
                  <div className="flex-1">
                    <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'} mb-1 block`}>Unit Price</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-right`}
                    />
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className={`w-7 h-7 rounded-lg ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-200 hover:text-red-400 hover:bg-red-50'} transition-all flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors mt-1`}
            >
              <span className={`w-6 h-6 rounded-lg border-2 ${isDark ? 'border-blue-700' : 'border-blue-300'} flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Add item
            </button>
          </div>

          {/* Totals – inside the same container */}
          <div className={`border-t-2 ${isDark ? 'border-blue-800' : 'border-blue-100'} px-6 py-5 ${isDark ? 'bg-slate-800' : 'bg-[#f0f4ff]'}`}>
            <div className="max-w-xs ml-auto space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subtotal</span>
                <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center gap-3">
                <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>VAT (%)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={po.vatRate}
                    onChange={(e) => updateField('vatRate', parseFloat(e.target.value) || 0)}
                    className={`w-14 px-2 py-1 ${isDark ? 'bg-slate-700 border-blue-800 text-slate-100' : 'bg-white border-blue-200 text-slate-700'} border rounded-lg text-sm text-center focus:outline-none focus:border-blue-400 transition-all`}
                  />
                  <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-700'} w-16 text-right`}>R{vatAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className={`pt-3 border-t-2 ${isDark ? 'border-blue-800' : 'border-blue-200'} flex justify-between`}>
                <span className={`font-black ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Order Total</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-xl">R{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms + notes – both use pageTheme.dark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-5`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-3`}>Payment Terms</p>
            <div className="space-y-2">
              {['30 days net', '14 days net', 'COD', 'Upfront', '50% deposit', 'Custom'].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="paymentTerms"
                    value={t}
                    checked={po.paymentTerms === t}
                    onChange={(e) => updateField('paymentTerms', e.target.value)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className={`text-sm ${isDark ? 'text-slate-300 group-hover:text-blue-400' : 'text-slate-600 group-hover:text-blue-600'} transition-colors`}>{t}</span>
                </label>
              ))}
            </div>
            {po.paymentTerms === 'Custom' && (
              <div className="mt-3">
                <label className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`}>Custom terms</label>
                <input
                  type="text"
                  value={po.customTerms || ''}
                  onChange={(e) => updateField('customTerms', e.target.value)}
                  placeholder="e.g. 60 days net"
                  className={`w-full px-3 py-2 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-all`}
                />
              </div>
            )}
          </div>
          <div className={`${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} p-5`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'} mb-3`}>Notes / Terms</p>
            <textarea
              rows={6}
              value={po.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Delivery instructions, special terms, or additional notes..."
              className={`w-full px-3 py-2.5 ${isDark ? 'bg-slate-800 border-blue-800 text-slate-100 placeholder:text-slate-500' : 'bg-[#f0f4ff] border-blue-100 text-slate-700 placeholder:text-slate-300'} border rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}