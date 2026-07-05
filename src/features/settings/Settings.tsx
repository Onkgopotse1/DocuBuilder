import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../context/Theme Context.tsx';

type Tab = 'settings' | 'help' | 'about';

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'settings';

  const setTab = (tab: Tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Header – similar to Home */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2.5 bg-white border border-slate-300 py-2 px-4 rounded-full font-semibold text-blue-800 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 hover:-translate-x-1 active:scale-95 shadow-sm text-sm"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-xs text-slate-500">Manage your preferences &amp; learn about the app</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            v2.0
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-8">
          {(['settings', 'help', 'about'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {activeTab === 'settings' && <SettingsPanel />}
          {activeTab === 'help' && <HelpPanel />}
          {activeTab === 'about' && <AboutPanel />}
        </div>
      </div>
    </div>
  );
}

// ---------- Settings Panel ----------
function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState('ZAR');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Preferences</h2>
      <div className="space-y-6">
        {/* Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <label className="font-bold text-slate-700">Theme</label>
            <p className="text-sm text-slate-500">Choose light or dark mode</p>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                theme === 'light' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Currency */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <label className="font-bold text-slate-700">Default Currency</label>
            <p className="text-sm text-slate-500">Used across all documents</p>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-2 sm:mt-0 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ZAR">ZAR – South African Rand</option>
            <option value="USD">USD – US Dollar</option>
            <option value="EUR">EUR – Euro</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <label className="font-bold text-slate-700">Notifications</label>
            <p className="text-sm text-slate-500">Receive email updates about your documents</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`mt-2 sm:mt-0 w-12 h-7 rounded-full transition-colors ${
              notifications ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// ---------- Help Panel ----------
function HelpPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Help &amp; Support</h2>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800">📄 Getting Started</h3>
          <p className="text-sm text-slate-600 mt-1">
            Choose a document type from the Home screen, fill in the details, and click <strong>Preview</strong> to see your document. Use the <strong>Download PDF</strong> button to save a copy.
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800">❓ Frequently Asked Questions</h3>
          <ul className="text-sm text-slate-600 space-y-2 mt-1 list-disc pl-5">
            <li><strong>Can I edit a document after downloading?</strong> – Yes, you can go back to the builder, make changes, and download again.</li>
            <li><strong>Is my data saved?</strong> – Your document data is stored in your browser’s session; refreshing the page will not lose your work.</li>
            <li><strong>How do I change the tax rate?</strong> – In each builder, look for the <strong>Tax Rate</strong> field (e.g., in Invoice or Report builders).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------- About Panel ----------
function AboutPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">About DocuBuilder</h2>
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-white text-3xl font-black">DB</span>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800">DocuBuilder v2.0</p>
          <p className="text-sm text-slate-600 mt-1">
            A complete document toolkit for professionals – build invoices, quotes, contracts, receipts, reports, expenses, timesheets, credit notes, delivery notes, and purchase orders in one place.
          </p>
          <div className="mt-3 text-xs text-slate-500 space-y-1">
            <p><span className="font-semibold">Version:</span> 2.0.0</p>
            <p><span className="font-semibold">Released:</span> June 2026</p>
            <p><span className="font-semibold">Built with:</span> React, TypeScript, Tailwind CSS, html2canvas, jsPDF</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} DocuBuilder. All rights reserved.
      </div>
    </div>
  );
}