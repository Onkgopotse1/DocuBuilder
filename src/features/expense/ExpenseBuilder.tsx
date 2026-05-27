import { useNavigate } from "react-router-dom";
import { useDocument } from "../../context/DocumentContext";
import type { ExpenseItem } from "../../context/DocumentContext";

export default function ExpenseBuilder() {
  const navigate = useNavigate();
  const { document, setDocument } = useDocument();
  const expense = document.expense;

  const updateField = (field: keyof typeof expense, value: any) => {
    setDocument((prev) => ({ ...prev, expense: { ...prev.expense, [field]: value } }));
  };

  const addItem = () => {
    const newItem: ExpenseItem = {
      date: new Date().toISOString().slice(0, 10),
      category: "",
      description: "",
      amount: 0,
    };
    setDocument((prev) => ({
      ...prev,
      expense: { ...prev.expense, items: [...prev.expense.items, newItem] },
    }));
  };

  const updateItem = (index: number, field: keyof ExpenseItem, value: any) => {
    setDocument((prev) => {
      const items = [...prev.expense.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, expense: { ...prev.expense, items } };
    });
  };

  const removeItem = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      expense: { ...prev.expense, items: prev.expense.items.filter((_, i) => i !== index) },
    }));
  };

  const totalAmount = expense.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] font-['Inter',system-ui,sans-serif]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-teal-400"></div>
          <span className="font-semibold text-white/90 text-sm tracking-tight">Expense Builder</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/expense-preview")}
            className="flex items-center gap-2 bg-teal-400 text-[#0f172a] px-5 py-2 rounded-xl font-black text-sm hover:bg-teal-300 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => navigate("/expense-preview?download=1")}
            className="flex items-center gap-2 bg-teal-400 text-[#0f172a] px-5 py-2 rounded-xl font-black text-sm hover:bg-teal-300 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto pt-24 px-4 pb-16 space-y-3">
        <div className="px-1 pb-2">
          <h1 className="text-3xl font-black text-white tracking-tight">New Expense Claim</h1>
          <p className="text-white/40 text-sm mt-1">Fill in the details below then preview your claim</p>
        </div>

        {/* Section 01 — Claimant */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
            <span className="text-teal-400 font-black text-xs tracking-widest">01</span>
            <span className="text-white font-bold text-sm">Claimant</span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Full Name</label>
              <input
                type="text"
                value={expense.claimantName}
                onChange={(e) => updateField("claimantName", e.target.value)}
                placeholder="e.g. John Mokoena"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Department / Role</label>
              <input
                type="text"
                value={expense.claimantRole}
                onChange={(e) => updateField("claimantRole", e.target.value)}
                placeholder="e.g. Sales · Freelancer"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Email</label>
              <input
                type="email"
                value={expense.claimantEmail}
                onChange={(e) => updateField("claimantEmail", e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Submitted To</label>
              <input
                type="text"
                value={expense.submittedTo}
                onChange={(e) => updateField("submittedTo", e.target.value)}
                placeholder="Manager or company name"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 02 — Claim Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
            <span className="text-teal-400 font-black text-xs tracking-widest">02</span>
            <span className="text-white font-bold text-sm">Claim Info</span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Claim Number</label>
              <input
                type="text"
                value={expense.claimNumber}
                onChange={(e) => updateField("claimNumber", e.target.value)}
                placeholder="EXP-2025-001"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Period From</label>
              <input
                type="date"
                value={expense.periodFrom}
                onChange={(e) => updateField("periodFrom", e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Period To</label>
              <input
                type="date"
                value={expense.periodTo}
                onChange={(e) => updateField("periodTo", e.target.value)}
                className="w-full bg-transparent border-b border-white/20 pb-2 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 03 — Items */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-teal-400 font-black text-xs tracking-widest">03</span>
              <span className="text-white font-bold text-sm">Expense Items</span>
            </div>
            <span className="text-white/30 text-xs hidden sm:block">Date · Category · Description · Amount</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="hidden sm:grid grid-cols-12 gap-3">
              <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-white/30">Date</span>
              <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-white/30">Category</span>
              <span className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Description</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-white/30 text-right">Amount</span>
            </div>

            {expense.items.map((item, idx) => (
              <div key={idx} className="group">
                <div className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Item {idx + 1}</div>
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-3 sm:items-end p-4 sm:p-3 bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none border border-white/10 sm:border-0 sm:border-b sm:border-white/10">
                  <div className="col-span-3 space-y-2">
                    <label className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-white/30 block">Date</label>
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => updateItem(idx, "date", e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 pb-1.5 text-white/80 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <label className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-white/30 block">Category</label>
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(idx, "category", e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 pb-1.5 text-white/80 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                    >
                      <option className="bg-[#0f172a]" value="">Select...</option>
                      {["Travel", "Meals", "Accommodation", "Fuel", "Software", "Equipment", "Stationery", "Other"].map((c) => (
                        <option key={c} className="bg-[#0f172a]" value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-4 space-y-2">
                    <label className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-white/30 block">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="What was this for?"
                      className="w-full bg-transparent border-b border-white/20 pb-1.5 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-400 transition-colors"
                    />
                  </div>
                  <div className="col-span-2 flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <label className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-white/30 block">Amount (R)</label>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateItem(idx, "amount", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full bg-transparent border-b border-white/20 pb-1.5 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-teal-400 transition-colors text-right"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(idx)}
                      className="mb-1 w-7 h-7 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-bold text-teal-400 hover:text-teal-300 transition-colors mt-1"
            >
              <span className="w-6 h-6 rounded-lg border border-teal-400/40 flex items-center justify-center hover:bg-teal-400/10 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Add item
            </button>
          </div>

          <div className="border-t border-white/10 px-6 py-4 flex justify-between items-center">
            <span className="text-white/40 text-sm font-medium">Total Claimed</span>
            <span className="text-teal-400 text-2xl font-black">R{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Section 04 — Notes */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
            <span className="text-teal-400 font-black text-xs tracking-widest">04</span>
            <span className="text-white font-bold text-sm">Purpose & Notes</span>
          </div>
          <div className="p-6">
            <textarea
              rows={3}
              value={expense.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Describe the business purpose of these expenses..."
              className="w-full bg-transparent text-white/80 text-sm placeholder:text-white/20 focus:outline-none resize-none border-b border-white/20 focus:border-teal-400 transition-colors pb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}