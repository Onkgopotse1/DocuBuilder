import { useNavigate } from 'react-router-dom';

export default function QuotePreview() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e9f0f5] to-[#d9e2ec] font-['Inter',system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] py-8 px-6 text-[#1e293b]">
      <div className="max-w-[1600px] mx-auto pt-20">
        {/*navbar*/}
       <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-sm">
        <button
          className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-blue-800 cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
          onClick={() => navigate('/quote-builder')}
        >
          <i className="fas fa-arrow-left"></i> Back to Quote Builder
        </button>
       </nav>
       
       {/* Preview Panel */}
       <div className="bg-white rounded-3xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.15)] p-6 sticky top-24">
        <h2 className="text-xl font-semibold text-[#0f2b3d] flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-4">
        🔍 Live Invoice Preview
        </h2>
        <div className="invoice-preview bg-white rounded-2xl p-6 border border-slate-100">
          
    <div className="width mx-auto bg-white shadow-md rounded-lg p-6 md:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">QUOTE</h1>
        <p className="text-gray-700">Nexus Solutions Inc.</p>
        <p className="text-gray-700">
          123 Business Blvd, Suite 400, Austin, TX 78701
        </p>
        <p className="text-gray-700">hello@nexus-solutions.com</p>
      </div>

      {/* Quote Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
        <div className="space-y-1">
          <p><span className="font-semibold">Quote #:</span> Q-2025-0042</p>
          <p><span className="font-semibold">Date:</span> 2025-04-15</p>
          <p><span className="font-semibold">Valid until:</span> 2025-05-15</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold">Bill to:</p>
          <p>BrightWave Marketing</p>
          <p>450 Park Avenue, New York, NY 10022</p>
          <p>contact@brightwave.com</p>
        </div>
      </div>

      {/* Reference */}
      <div className="mb-8 text-sm">
        <p><span className="font-semibold">Reference:</span> Prepared for BrightWave</p>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Item / Service</th>
              <th className="border px-4 py-2 text-center">Qty</th>
              <th className="border px-4 py-2 text-right">Unit Price</th>
              <th className="border px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Website UX Audit</td>
              <td className="border px-4 py-2 text-center">1</td>
              <td className="border px-4 py-2 text-right">R450.00</td>
              <td className="border px-4 py-2 text-right">450.00</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">SEO optimization (monthly)</td>
              <td className="border px-4 py-2 text-center">3</td>
              <td className="border px-4 py-2 text-right">R290.00</td>
              <td className="border px-4 py-2 text-right">R870.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="text-sm space-y-1 mb-8">
        <p><span className="font-semibold">Subtotal:</span> R1320.00</p>
        <p><span className="font-semibold">Shipping:</span> R0.00</p>
        <p><span className="font-semibold">Tax (8.5%):</span> R112.20</p>
        <p className="font-bold text-lg">GRAND TOTAL: R1432.20</p>
      </div>

      {/* Terms */}
      <div className="text-xs text-gray-600 border-t pt-4 leading-relaxed">
        <p>
          All services subject to our standard terms. Payment due within 15 days of acceptance.
          This quote is valid until expiration date.
        </p>
        <p className="mt-2">
          Thank you for your business — this quote is an official offer.
        </p>
      </div>
    </div>
        </div>
       </div>
      </div>
    </div>
  );
}
