import { useNavigate } from 'react-router-dom';

export default function QuoteBuilder() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <button
          className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-blue-800 cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
          onClick={() => navigate('/')}
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <button className="bg-[#1e3c72] text-white border-0 py-3 px- rounded-full font-semibold text-base cursor-pointer mt-1 transition hover:bg-[#0f2b3d] hover:-translate-y-0.5 flex items-center justify-center gap-2"
           onClick={() => navigate('/quote-preview')}
           >
          <p>⬇ Preview Quote</p>
        </button>
    </div>
  );
}
