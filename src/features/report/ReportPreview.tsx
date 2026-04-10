import { useNavigate } from 'react-router-dom';

export default function ReportPreview() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <button
          className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-blue-800 cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
          onClick={() => navigate('/report-builder')}
        >
          <i className="fas fa-arrow-left"></i> Back to Report Builder
        </button>

    </div>
  );
}
