import { useNavigate } from 'react-router-dom';

export default function QuoteBuilder() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Inter',system-ui,sans-serif] text-[#1e293b] pb-12">
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-sm">
        <button
          className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-blue-800 cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
          onClick={() => navigate('/')}
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <button className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-blue-800 cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
           onClick={() => navigate('/quote-preview')}
           >
          <p>⬇ Preview Quote</p>
        </button>
        </nav>
        <div className="max-w-5xl mx-auto pt-28 px-4">
          <div className="bg-black rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                
        

        <div className="w-full bg-white rounded-2xl shadow-md border border-gray-200 p-5 md:p-6 transition-all">
            

            <div className="flex items-center gap-2 text-blue-900 font-semibold text-lg border-b border-gray-100 pb-2 mb-4">
                <span>🏢</span> <span>YOUR COMPANY</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Company name</label>
                    <input type="text" id="companyName" value="Nexus Solutions Inc." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Logo (optional)</label>
                    <input type="file" id="logoUpload" accept="image/jpeg,image/png,image/webp" className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-sm" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Company address</label>
                    <input type="text" id="companyAddress" value="123 Business Blvd, Suite 400, Austin, TX 78701" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Company email</label>
                    <input type="email" id="companyEmail" value="hello@nexus-solutions.com" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
            </div>


            <div className="flex items-center gap-2 text-blue-900 font-semibold text-lg border-b border-gray-100 pb-2 mb-4 mt-2">
                <span>📋</span> <span>QUOTE DETAILS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Quote #</label>
                    <input type="text" id="quoteNumber" value="Q-2025-0042" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Quote date</label>
                    <input type="date" id="quoteDate" value="2025-04-15" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Expiration date</label>
                    <input type="date" id="expiryDate" value="2025-05-15" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
            </div>


            <div className="flex items-center gap-2 text-blue-900 font-semibold text-lg border-b border-gray-100 pb-2 mb-4 mt-2">
                <span>👤</span> <span>CLIENT INFORMATION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Client name</label>
                    <input type="text" id="clientName" value="BrightWave Marketing" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Client email</label>
                    <input type="email" id="clientEmail" value="contact@brightwave.com" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Client address</label>
                    <input type="text" id="clientAddress" value="450 Park Avenue, New York, NY 10022" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm" />
                </div>
            </div>


            <div className="flex items-center gap-2 text-blue-900 font-semibold text-lg border-b border-gray-100 pb-2 mb-4 mt-2">
                <span>📦</span> <span>LINE ITEMS</span>
            </div>
            <div className="overflow-x-auto mb-3">
                <table className="w-full text-sm" id="itemsTable">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="text-left py-2 px-1 font-semibold">Description</th>
                            <th className="text-left py-2 px-1 font-semibold w-20">Qty</th>
                            <th className="text-left py-2 px-1 font-semibold w-28">Unit Price (R)</th>
                            <th className="text-left py-2 px-1 font-semibold w-24">Line Total</th>
                            <th className="w-8"></th>
                        </tr>
                    </thead>
                    <tbody id="itemsTbody" className="divide-y divide-gray-100"></tbody>
                </table>
            </div>
            <button type="button" id="addItemBtn" className="inline-flex items-center gap-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-800 border border-dashed border-blue-300 rounded-full px-4 py-1.5 transition">➕ Add new item</button>


            <div className="bg-gray-50 rounded-xl p-4 my-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Discount (%)</label>
                        <input type="number" id="discountPercent" value="0" step="0.5" min="0" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tax Rate (%)</label>
                        <input type="number" id="taxPercent" value="8.5" step="0.1" min="0" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Shipping (R)</label>
                        <input type="number" id="shippingCost" value="0" step="1" min="0" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm" />
                    </div>
                </div>
            </div>


            <div className="flex items-center gap-2 text-blue-900 font-semibold text-lg border-b border-gray-100 pb-2 mb-3 mt-1">
                <span>📜</span> <span>TERMS & NOTES</span>
            </div>
            <textarea id="termsText" rows="3" className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm" placeholder="Payment terms, delivery details...">All services subject to our standard terms. Payment due within 15 days of acceptance. This quote is valid until expiration date.</textarea>


            <button id="downloadPdfBtn" className="mt-6 w-full bg-gradient-to-r from-slate-800 to-blue-800 hover:from-slate-900 hover:to-blue-900 text-white font-semibold py-3 rounded-full shadow-md transition flex items-center justify-center gap-2 text-base">📎 Download Quote PDF</button>
        </div>
          
        </div>
    </div>
    </div>
  );
}
