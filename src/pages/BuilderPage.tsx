import { useParams, useNavigate } from 'react-router-dom';
import { builders } from '../data/builders';

export default function BuilderPage() {
  const { builderId } = useParams<{ builderId: string }>();
  const navigate = useNavigate();
  const builder = builders.find(b => b.path === builderId);

  if (!builder) {
    return (
      <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white/90 shadow-2xl rounded-[2rem] p-8">
          <button
            className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-blue-800 cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
            onClick={() => navigate('/')}
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Builder not found</h2>
            <p className="text-slate-600 leading-relaxed">The requested builder tool does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/90 shadow-2xl rounded-[2rem] p-8">
        <button
          className="inline-flex items-center gap-2.5 bg-white border border-slate-300 py-2.5 px-5 rounded-full font-semibold text-blue-800 cursor-pointer mb-8 transition-all duration-200 hover:bg-blue-50 hover:-translate-x-1"
          onClick={() => navigate('/')}
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <div className="bg-white rounded-[1.75rem] p-8 shadow-xl">
          <h2 className="text-2xl mb-4 flex items-center gap-3 text-slate-900">
            <i className={builder.icon}></i> {builder.name}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">{builder.longDesc}</p>
          <hr className="my-6 border-slate-200" />
          <p className="text-slate-700 mb-4">
            <strong>📄 Interactive demo:</strong> This builder would include full form fields, live preview, and PDF/export functionality.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-blue-500">
            <i className="fas fa-info-circle"></i> <strong>Pro tip:</strong> All builders share an intuitive workflow. Save templates for reuse.
          </div>
        </div>
      </div>
    </div>
  );
}