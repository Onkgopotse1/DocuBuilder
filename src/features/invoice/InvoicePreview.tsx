import { useNavigate } from 'react-router-dom';


export default function InvoicePreview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-['Inter',system-ui,-apple-system,sans-serif] py-8 px-4 sm:px-6 text-slate-800">
      <div className="max-w-4xl mx-auto pt-20"> 

        <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-50 shadow-sm">
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/invoice-builder')}
              className="flex items-center justify-center px-4 py-2 bg-white text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm gap-2"
            >
              <span>←</span>
              <span>Back to Builder</span>
            </button>
          </div>
        </nav>

        {/* Preview Panel */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/50 p-6 md:p-10 border border-slate-100"> 
          <h2 className="text-lg font-semibold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-4 mb-8 uppercase tracking-wider">
            🔍 Live Invoice Preview
          </h2>

          <div className="invoice-document bg-white">
            <div className="preview-header flex justify-between items-start mb-10 flex-wrap gap-6">
              <div className="brand">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">FLIGHT BRIEF</h2>
                <div className="text-sm font-medium text-blue-600 mt-1">Professional Services</div>
              </div>
              <div className="invoice-meta text-right space-y-1">
                <div className="text-sm text-slate-500">Invoice Number</div>
                <div className="text-lg font-bold text-slate-800">INV-2026-001</div>
                <div className="text-sm text-slate-500 mt-3">Date Issued</div>
                <div className="font-semibold text-slate-800">May 3, 2026</div>
              </div>
            </div>

            <div className="client-section mb-10 bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Billed To</div>
              <div className="text-lg font-bold text-slate-800">Acme Corporation</div>
              <div className="text-slate-600 mt-1">billing@acmecorp.co.za</div>
              <div className="text-slate-600 mt-1 leading-relaxed">
                123 Business Road<br />
                Pretoria, Gauteng<br />
                South Africa
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100 mb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6">Description</th>
                    <th className="py-4 px-6 w-24 text-center">Qty</th>
                    <th className="py-4 px-6 w-32 text-right">Unit Price</th>
                    <th className="py-4 px-6 w-32 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">Web Application Development</td>
                    <td className="py-4 px-6 text-center text-slate-600">10</td>
                    <td className="py-4 px-6 text-right text-slate-600">R 1,500.00</td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-800">R 15,000.00</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">UI/UX Design Services</td>
                    <td className="py-4 px-6 text-center text-slate-600">5</td>
                    <td className="py-4 px-6 text-right text-slate-600">R 800.00</td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-800">R 4,000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between text-slate-600 px-6">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">R 19,000.00</span>
                </div>
                <div className="flex justify-between text-slate-600 px-6">
                  <span>Tax (15%)</span>
                  <span className="font-semibold text-slate-800">R 2,850.00</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4">
                  <span className="text-lg font-bold text-slate-800">Total Due</span>
                  <span className="text-2xl font-black text-blue-600">R 21,850.00</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-sm text-center text-slate-400 pt-6 border-t border-slate-100">
              <p>Thank you for your business. Payment is due within 30 days.</p>
            </div>
          </div>

          <button className="bg-slate-900 text-white py-4 px-6 rounded-2xl font-semibold text-base w-full mt-8 transition-all hover:bg-slate-800 hover:-translate-y-0.5 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
}