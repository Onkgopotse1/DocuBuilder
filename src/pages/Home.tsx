import { useNavigate } from 'react-router-dom';
import { builders } from '../data/builders';
import { useTheme } from '../context/Theme Context.tsx';
import { homePageTheme as homePageThemeConfig } from '../data/pageThemes';

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const homePageTheme = homePageThemeConfig;
  const isDark = theme === 'dark';
  const pageBackground = isDark ? homePageTheme.dark : homePageTheme.light;
  const panelBackground = isDark ? 'bg-slate-900/95' : 'bg-white/90';
  const headerBackground = isDark ? 'bg-slate-800/80' : 'bg-slate-50/90';
  const cardBackground = isDark ? 'bg-slate-800 border-slate-700 shadow-slate-950/30 hover:border-blue-400/40' : 'bg-white border-slate-300/50 hover:border-blue-200';
  const cardText = isDark ? 'text-slate-100' : 'text-slate-900';
  const secondaryText = isDark ? 'text-slate-400' : 'text-slate-600';
  const buttonClasses = isDark
    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-blue-300'
    : 'bg-slate-50 text-slate-700 hover:bg-white hover:text-blue-800';

  return (
    <div className={`h-screen ${pageBackground} home-container transition-colors duration-300`}>
      <div className={`h-full ${panelBackground} shadow-2xl p-8 flex flex-col transition-colors duration-300`}>
        <div className={`w-full flex flex-wrap justify-between items-center gap-4 border-b-2 border-blue-500/20 pb-4 mb-6 ${headerBackground} backdrop-blur-sm z-10 header-section transition-colors duration-300`}>
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-lg">
          <img src="src\assets\doc.png" className="fas fa-hard-hat text-xl sm:text-2xl text-white"></img>
        </div>
        <div>
          <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${isDark ? 'from-slate-100 to-blue-400' : 'from-slate-900 to-blue-600'} bg-clip-text text-transparent tracking-tight`}>
            DocuBuilder
          </h1>
          <div className={`${secondaryText} font-medium text-xs sm:text-sm mt-1 sm:mt-2`}>
            <i className="fas fa-bolt"></i> Complete toolkit for pros 10 builders
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className={`font-medium ${isDark ? 'text-slate-200 bg-slate-800' : 'text-slate-600 bg-blue-50'} py-1 px-3 sm:py-1.5 sm:px-4 rounded-full text-[10px] sm:text-xs`}>
        <i className="fas fa-mobile-alt"></i> PC + mobile ready smart docs
      </div>
    </div>


      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-section">
          {builders.map((builder) => (
            <div
              key={builder.id}
              className={`group rounded-[1.75rem] p-6 pb-7 transition-all duration-300 cursor-pointer shadow-lg border flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl ${cardBackground} card-hover`}
              onClick={() => navigate(`${builder.path}`)}
            >
              <div className="bg-blue-50 w-14 h-14 flex items-center justify-center rounded-xl mb-5 group-hover:bg-blue-600 transition-colors duration-300 icon-hover">
                <img
                  src={builder.image}
                  alt={builder.name}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <h3 className={`text-xl font-bold mb-2.5 ${cardText}`}>{builder.name}</h3>
              <div className={`text-sm leading-relaxed ${secondaryText} mb-5 flex-1`}>{builder.desc}</div>
              <div className={`inline-flex items-center gap-2 font-semibold text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Launch tool <i className="fas fa-arrow-right transition-transform duration-200"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 pt-7 border-t border-slate-400/20 flex justify-center gap-4 flex-wrap buttons-section">
          <button
            className={`${buttonClasses} text-base font-medium py-2.5 px-5 rounded-full inline-flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 button-hover`}
            onClick={() => navigate('/settings')}
          >
            <i className="fas fa-sliders-h text-lg text-blue-500"></i> Settings
          </button>
          <button
            className={`${buttonClasses} text-base font-medium py-2.5 px-5 rounded-full inline-flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 button-hover`}
            onClick={() => navigate('/settings?tab=help')}
          >
            <i className="fas fa-question-circle text-lg text-blue-500"></i> Help
          </button>
          <button
            className={`${buttonClasses} text-base font-medium py-2.5 px-5 rounded-full inline-flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 button-hover`}
            onClick={() => navigate('/settings?tab=about')}
          >
            <i className="fas fa-info-circle text-lg text-blue-500"></i> About
          </button>
        </div>

        <div className={`text-center text-xs mt-6 ${secondaryText} opacity-80`}>
          <i className="fas fa-shield-alt"></i> Click any card to open the builder
        </div>
      </div>
    </div>
  </div>
);


}