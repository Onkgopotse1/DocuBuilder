import { useNavigate } from 'react-router-dom';

export default function PurchaseOrderPreview() {
  const navigate = useNavigate();

  const items = [
    { desc: 'MacBook Pro 14" M3 Pro', qty: 3, unit: 'Each', unitPrice: 42000, total: 126000 },
    { desc: 'USB-C Hub – 7-in-1', qty: 3, unit: 'Each', unitPrice: 1200, total: 3600 },
    { desc: 'Software Licences – Annual', qty: 5, unit: 'Month', unitPrice: 850, total: 4250 },
  ];

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-['Inter',system-ui,sans-serif] pb-16">

      <nav className="fixed top-0 left-0 w-full bg-white border-b-2 border-blue-600 px-5 py-3 flex justify-between items-center z-50">
        <button
          onClick={() => navigate('/purchase-order-builder')}
          className="group w-10 h-10 rounded-lg border-2 border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm font-black text-slate-800 hidden sm:block">Purchase Order Preview</p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-600/25">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </nav>

      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div id="purchaseorder-section" className="bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(37,99,235,0.15)] border-2 border-[#dbeafe]" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
          <style>{`#purchaseorder-section, #purchaseorder-section * { color: #0f172a !important; border-color: #dbeafe !important; background-color: transparent !important; fill: #0f172a !important; }
      #purchaseorder-section { background-color: #ffffff !important; }
      #purchaseorder-section .bg-blue-600 { background-color: #2563eb !important; color: #ffffff !important; }
      #purchaseorder-section .text-[#2563eb] { color: #2563eb !important; }
      #purchaseorder-section .bg-[#2563eb] { background-color: #2563eb !important; color: #ffffff !important; }`}</style>

          {/* Header */}
          <div className="flex">
            <div className="w-1.5 bg-[#2563eb]"></div>
            <div className="flex-1 px-8 py-7 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-[#2563eb] rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#2563eb]">Purchase Order</span>
                </div>
                <h1 className="text-2xl font-black text-[#0f172a]">Nexus Solutions Inc.</h1>
                <p className="text-[#64748b] text-sm">procurement@nexus.com</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#2563eb]">PO-2025-001</p>
                <p className="text-xs text-[#94a3b8] mt-1">Issued: 20 Apr 2025</p>
                <p className="text-xs text-[#94a3b8]">Required by: 30 Apr 2025</p>
              </div>
            </div>
          </div>

          {/* Buyer / Vendor */}
          <div className="grid grid-cols-2 border-t-2 border-b-2 border-[#dbeafe]">
            <div className="p-6 border-r-2 border-[#dbeafe] bg-[#2563eb]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#bfdbfe] mb-2">Buyer</p>
              <p className="font-black text-[#ffffff] text-sm">Nexus Solutions Inc.</p>
              <p className="text-[#bfdbfe] text-sm">Jane Smith</p>
              <p className="text-[#c7d2fe] text-xs mt-1">123 Business Ave, Sandton</p>
              <p className="text-[#c7d2fe] text-xs">procurement@nexus.com</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Vendor</p>
              <p className="font-black text-[#0f172a] text-sm">TechSupply Co.</p>
              <p className="text-[#64748b] text-sm">Michael Lee</p>
              <p className="text-[#94a3b8] text-xs mt-1">99 Supplier Park, Midrand</p>
              <p className="text-[#94a3b8] text-xs">sales@techsupply.co.za</p>
            </div>
          </div>

          {/* Items */}
          <div className="px-8 py-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-4">Order Items</p>
            <div className="grid grid-cols-12 gap-2 pb-2 border-b-2 border-[#dbeafe]">
              <span className="col-span-5 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">Description</span>
              <span className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] text-center">Qty</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] text-center">Unit</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] text-right">Unit Price</span>
              <span className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-[#2563eb] text-right">Total</span>
            </div>
            {items.map((item, i) => (
              <div key={i} className={`grid grid-cols-12 gap-2 py-3 border-b border-[#eff6ff] items-center ${i % 2 === 0 ? 'bg-[#eff6ff]' : ''}`}>
                <div className="col-span-5 text-sm text-[#0f172a] font-medium">{item.desc}</div>
                <div className="col-span-1 text-sm text-[#475569] text-center font-bold">{item.qty}</div>
                <div className="col-span-2 text-sm text-[#64748b] text-center">{item.unit}</div>
                <div className="col-span-2 text-sm text-[#475569] text-right">R{item.unitPrice.toLocaleString('en-ZA')}</div>
                <div className="col-span-2 text-sm font-black text-[#1d4ed8] text-right">R{item.total.toLocaleString('en-ZA')}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mx-8 mb-6 bg-[#f0f4ff] rounded-2xl border-2 border-[#dbeafe] p-5">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">Subtotal</span>
                <span className="font-semibold text-[#334155]">R{subtotal.toLocaleString('en-ZA')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">VAT (15%)</span>
                <span className="font-semibold text-[#334155]">R{vat.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-3 border-t-2 border-[#bfdbfe] flex justify-between">
                <span className="font-black text-[#0f172a]">Order Total</span>
                <span className="font-black text-[#2563eb] text-2xl">R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="px-8 pb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Payment Terms & Notes</p>
            <p className="text-sm text-[#64748b] leading-relaxed bg-[#f0f4ff] rounded-xl px-4 py-3 border border-[#dbeafe]">
              Payment due within 30 days of delivery. All items subject to inspection on receipt. Please reference PO-2025-001 on all correspondence and invoices.
            </p>
          </div>

          {/* Authorisation */}
          <div className="mx-8 mb-8 grid grid-cols-2 gap-6">
            {['Authorised By', 'Vendor Acceptance'].map((label, i) => (
              <div key={i}>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-6">{label}</p>
                <div className={`border-t-2 ${i === 0 ? 'border-[#93c5fd]' : 'border-dashed border-[#e2e8f0]'} pt-2`}>
                  <p className={`text-xs ${i === 0 ? 'text-[#2563eb] font-semibold' : 'text-[#cbd5e1]'}`}>
                    {i === 0 ? 'Jane Smith · Procurement' : 'Signature & date'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#2563eb] px-8 py-3 flex justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#bfdbfe]"></div>
              <span className="text-xs text-[#bfdbfe] font-medium">DocuBuilder</span>
            </div>
            <span className="text-xs text-[#bfdbfe]">PO-2025-001 · {new Date().toLocaleDateString('en-ZA')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}