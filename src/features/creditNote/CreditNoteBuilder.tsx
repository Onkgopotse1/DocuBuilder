import { useNavigate } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import { useTheme } from "../../context/Theme Context.tsx";
import type { CreditNoteItem } from "../../context/DocumentContext";
import { pageThemes } from "../../data/pageThemes";

export default function CreditNoteBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const creditNote = document.creditNote;
  const pageTheme = pageThemes.CreditNote;

  const inputCls = `w-full px-0 py-2 bg-transparent border-b-2 ${isDark ? 'border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-rose-400' : 'border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-rose-500'} text-sm focus:outline-none transition-colors`;
  const labelCls = `text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'} block mb-1`;

  const updateField = (field: keyof typeof creditNote, value: any) => {
    setDocument((prev) => ({ ...prev, creditNote: { ...prev.creditNote, [field]: value } }));
  };

  const addItem = () => {
    const newItem: CreditNoteItem = { description: "", quantity: 1, unitPrice: 0, amount: 0 };
    setDocument((prev) => ({
      ...prev,
      creditNote: { ...prev.creditNote, items: [...prev.creditNote.items, newItem] },
    }));
  };

  const updateItem = (index: number, field: keyof CreditNoteItem, value: any) => {
    setDocument((prev) => {
      const items = [...prev.creditNote.items];
      const updatedItem = { ...items[index], [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
      }
      items[index] = updatedItem;
      return { ...prev, creditNote: { ...prev.creditNote, items } };
    });
  };

  const removeItem = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      creditNote: { ...prev.creditNote, items: prev.creditNote.items.filter((_, i) => i !== index) },
    }));
  };

  const totalAmount = creditNote.items.reduce((sum, item) => sum + item.amount, 0);

  const reasonOptions = [
    "Returned goods",
    "Overcharge",
    "Service not rendered",
    "Duplicate invoice",
    "Goodwill",
    "Other",
  ];

  return (
    <div className={`min-h-screen ${isDark ? pageTheme.dark : pageTheme.light} font-['Inter',system-ui,sans-serif] ${isDark ? 'text-slate-100' : 'text-slate-800'} pb-16`}>
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-400 z-50"></div>

      {/* Navbar – now uses pageTheme.dark in dark mode */}
      <nav className={`fixed top-1 left-0 w-full ${isDark ? pageTheme.dark : 'bg-white/95'} backdrop-blur-md border-b ${isDark ? 'border-slate-700' : 'border-slate-100'} px-5 py-3 flex justify-between items-center z-40 shadow-sm`}>
        <button
          onClick={() => navigate("/")}
          className={`w-10 h-10 rounded-full border-2 ${isDark ? 'border-slate-600 text-slate-300 hover:border-rose-400 hover:text-rose-400' : 'border-slate-200 text-slate-500 hover:border-rose-400 hover:text-rose-500'} flex items-center justify-center transition-all active:scale-95`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">New Document</p>
          <p className={`text-sm font-black ${isDark ? 'text-slate-100' : 'text-slate-800'} leading-none mt-0.5`}>Credit Note</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/credit-note-preview")}
            className={`flex items-center gap-2 border-2 ${isDark ? 'border-rose-400 text-rose-400 hover:bg-rose-500 hover:text-white' : 'border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white'} px-5 py-2 rounded-full font-black text-sm transition-all active:scale-95`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => navigate("/credit-note-preview?download=1")}
            className={`flex items-center gap-2 border-2 ${isDark ? 'border-rose-400 text-rose-400 hover:bg-rose-500 hover:text-white' : 'border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white'} px-5 py-2 rounded-full font-black text-sm transition-all active:scale-95`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto pt-28 px-6 space-y-10">
        {/* Reference block – no background, only inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <label className={labelCls}>Credit Note No.</label>
            <input
              type="text"
              value={creditNote.creditNoteNumber}
              onChange={(e) => updateField("creditNoteNumber", e.target.value)}
              placeholder="CN-2025-001"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Issue Date</label>
            <input
              type="date"
              value={creditNote.issueDate}
              onChange={(e) => updateField("issueDate", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Original Invoice</label>
            <input
              type="text"
              value={creditNote.originalInvoiceNumber}
              onChange={(e) => updateField("originalInvoiceNumber", e.target.value)}
              placeholder="INV-2025-042"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Original Invoice Date</label>
            <input
              type="date"
              value={creditNote.originalInvoiceDate}
              onChange={(e) => updateField("originalInvoiceDate", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className={`h-px ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

        {/* From / To – both boxes now use pageTheme.dark in dark mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className={`p-5 ${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} shadow-sm`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">Issued By</p>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Company Name</label>
                <input
                  type="text"
                  value={creditNote.issuerName}
                  onChange={(e) => updateField("issuerName", e.target.value)}
                  placeholder="Your business"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={creditNote.issuerEmail}
                  onChange={(e) => updateField("issuerEmail", e.target.value)}
                  placeholder="your@email.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <input
                  type="text"
                  value={creditNote.issuerAddress}
                  onChange={(e) => updateField("issuerAddress", e.target.value)}
                  placeholder="Street, City, Province"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
          <div className={`p-5 ${isDark ? pageTheme.dark : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700' : 'border-slate-200'} shadow-sm`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Issued To</p>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Client Name</label>
                <input
                  type="text"
                  value={creditNote.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  placeholder="Client or company"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={creditNote.clientEmail}
                  onChange={(e) => updateField("clientEmail", e.target.value)}
                  placeholder="client@email.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <input
                  type="text"
                  value={creditNote.clientAddress}
                  onChange={(e) => updateField("clientAddress", e.target.value)}
                  placeholder="Street, City, Province"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`h-px ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

        {/* Reason section – no background besides the page bg */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4">Reason for Credit</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {reasonOptions.map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={creditNote.reason === r}
                  onChange={(e) => updateField("reason", e.target.value)}
                  className="accent-rose-500 w-4 h-4"
                />
                <span className={`text-sm ${isDark ? 'text-slate-300 group-hover:text-rose-400' : 'text-slate-600 group-hover:text-rose-600'} transition-colors`}>{r}</span>
              </label>
            ))}
          </div>
          {creditNote.reason === "Other" && (
            <div className="mt-3">
              <label className={labelCls}>Please specify</label>
              <input
                type="text"
                value={creditNote.reasonOtherText || ""}
                onChange={(e) => updateField("reasonOtherText", e.target.value)}
                placeholder="Enter custom reason..."
                className={inputCls}
              />
            </div>
          )}
          <div className="mt-4">
            <label className={labelCls}>Additional Details</label>
            <textarea
              rows={2}
              value={creditNote.additionalDetails}
              onChange={(e) => updateField("additionalDetails", e.target.value)}
              placeholder="Describe the reason in more detail..."
              className={`w-full px-0 py-2 bg-transparent border-b-2 ${isDark ? 'border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-rose-400' : 'border-slate-200 text-slate-800 placeholder:text-slate-300 focus:border-rose-500'} text-sm focus:outline-none transition-colors resize-none`}
            />
          </div>
        </div>

        <div className={`h-px ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

        {/* Line items – the container has no extra background, only the items row */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-5">Credit Items</p>

          <div className={`hidden sm:grid grid-cols-12 gap-3 mb-2 ${isDark ? 'text-slate-400' : 'text-slate-300'}`}>
            <span className="col-span-6 text-[10px] font-bold uppercase tracking-widest">Description</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest">Qty</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest">Unit Price</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest">Amount</span>
          </div>

          {creditNote.items.map((item, idx) => (
            <div key={idx} className={`group grid grid-cols-12 gap-3 items-end py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className="col-span-12 sm:col-span-6">
                <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-300'} block mb-1`}>Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  placeholder="Item being credited..."
                  className={inputCls}
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-300'} block mb-1`}>Qty</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", parseFloat(e.target.value) || 0)}
                  placeholder="1"
                  className={`${inputCls} text-center`}
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-300'} block mb-1`}>Unit Price</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`${inputCls} text-right`}
                />
              </div>
              <div className="col-span-3 sm:col-span-2 flex items-end gap-1">
                <div className="flex-1">
                  <label className={`sm:hidden text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-300'} block mb-1`}>Amount</label>
                  <input
                    type="number"
                    value={item.amount}
                    readOnly
                    className={`${inputCls} text-right ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}
                  />
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className={`mb-1.5 w-7 h-7 rounded-lg ${isDark ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-900/30' : 'text-slate-200 hover:text-rose-400 hover:bg-rose-50'} transition-all flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100`}
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
            className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-500 hover:text-rose-600'} transition-colors mt-4`}
          >
            <span className={`w-6 h-6 rounded-full border ${isDark ? 'border-rose-700' : 'border-rose-300'} flex items-center justify-center`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            Add item
          </button>
        </div>

        {/* Total */}
        <div className={`flex justify-between items-center border-t-2 ${isDark ? 'border-slate-600' : 'border-slate-800'} pt-4`}>
          <p className={`font-black ${isDark ? 'text-slate-100' : 'text-slate-800'} text-lg`}>Total Credit Amount</p>
          <p className="font-black text-rose-600 text-3xl">R{totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}