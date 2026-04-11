import { useNavigate } from 'react-router-dom';
import { builders } from '../data/builders';

export default function Home() {
  const navigate = useNavigate();

  const showDemoMessage = (title: string, message: string) => {
    alert(` ${title}\n\n${message}\n\n(Full functionality would be implemented here.)`);
  };

return (
  <div className="h-screen bg-slate-100 home-container ">
    <div className="h-full bg-white/90 shadow-2xl p-8 flex flex-col">
    <div className="w-full flex flex-wrap justify-between items-center gap-4 border-b-2 border-blue-500/20 pb-4 mb-6 bg-grey-50/90 backdrop-blur-sm z-10 header-section">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <div className="bg-gradient-to-br from-blue-800 to-blue-500 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-lg">
          <i className="fas fa-hard-hat text-xl sm:text-2xl text-white"></i>
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent tracking-tight">
            DocuBuilder
          </h1>
          <div className="text-slate-700 font-medium text-xs sm:text-sm mt-1 sm:mt-2">
            <i className="fas fa-bolt"></i> Complete toolkit for pros 10 builders
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="font-medium text-slate-600 bg-blue-50 py-1 px-3 sm:py-1.5 sm:px-4 rounded-full text-[10px] sm:text-xs">
        <i className="fas fa-mobile-alt"></i> PC + mobile ready smart docs
      </div>
    </div>


      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-section">
          {builders.map((builder) => (
            <div
              key={builder.id}
              className="group bg-white rounded-[1.75rem] p-6 pb-7 transition-all duration-300 cursor-pointer shadow-lg border border-slate-300/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200 card-hover"
              onClick={() => navigate(`${builder.path}`)}
            >
              <div className="bg-blue-50 w-14 h-14 flex items-center justify-center rounded-xl mb-5 group-hover:bg-blue-600 transition-colors duration-300 icon-hover">
                <img
                  src={builder.image}
                  alt={builder.name}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2.5 text-slate-900">{builder.name}</h3>
              <div className="text-sm leading-relaxed text-slate-600 mb-5 flex-1">{builder.desc}</div>
              <div className="inline-flex items-center gap-2 font-semibold text-xs text-blue-600">
                Launch tool <i className="fas fa-arrow-right transition-transform duration-200"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 pt-7 border-t border-slate-400/20 flex justify-center gap-4 flex-wrap buttons-section">
          <button
            className="bg-slate-50 text-base font-medium py-2.5 px-5 rounded-full inline-flex items-center gap-3 cursor-pointer text-slate-700 transition-all duration-200 hover:bg-white hover:text-blue-800 hover:-translate-y-0.5 button-hover"
            onClick={() => showDemoMessage('Settings', 'Customize currencies, tax rates, branding, and invoice defaults.')}
          >
            <i className="fas fa-sliders-h text-lg text-blue-500"></i> Settings
          </button>
          <button
            className="bg-slate-50 text-base font-medium py-2.5 px-5 rounded-full inline-flex items-center gap-3 cursor-pointer text-slate-700 transition-all duration-200 hover:bg-white hover:text-blue-800 hover:-translate-y-0.5 button-hover"
            onClick={() => showDemoMessage('Help', 'Video tutorials, FAQ, live chat, and documentation.')}
          >
            <i className="fas fa-question-circle text-lg text-blue-500"></i> Help
          </button>
          <button
            className="bg-slate-50 text-base font-medium py-2.5 px-5 rounded-full inline-flex items-center gap-3 cursor-pointer text-slate-700 transition-all duration-200 hover:bg-white hover:text-blue-800 hover:-translate-y-0.5 button-hover"
            onClick={() => showDemoMessage('About', 'MyBuilder Pro v2.0 10-in-1 document suite for builders, contractors & agencies.')}
          >
            <i className="fas fa-info-circle text-lg text-blue-500"></i> About
          </button>
        </div>

        <div className="text-center text-xs mt-6 text-slate-500 opacity-80">
          <i className="fas fa-shield-alt"></i> Click any card to open the builder
        </div>
      </div>
    </div>
  </div>
);


}