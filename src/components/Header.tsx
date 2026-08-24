import React from 'react';
import { Compass, Calculator, MapPin, Bot, ShieldCheck, Sparkles, Languages, RefreshCw } from 'lucide-react';
import { UserFinancialProfile } from '../types';

interface HeaderProps {
  activeTab: 'recommender' | 'calculator' | 'locator' | 'ai-advisor';
  setActiveTab: (tab: 'recommender' | 'calculator' | 'locator' | 'ai-advisor') => void;
  isHindi: boolean;
  setIsHindi: (val: boolean) => void;
  onApplyPreset: (preset: Partial<UserFinancialProfile>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isHindi,
  setIsHindi,
  onApplyPreset
}) => {
  const PRESETS = [
    {
      label: isHindi ? 'गिरिडीह किराना दुकान (₹1 लाख)' : 'Giridih Small Shop (₹1 Lakh)',
      profile: {
        name: 'Sunil Kumar Paswan',
        category: 'SC' as const,
        gender: 'male' as const,
        age: 32,
        annualFamilyIncome: 180000,
        purpose: 'small_shop' as const,
        businessIdea: 'Grocery & General Kirana Store in Pachamba Market',
        projectCost: 100000,
        state: 'Jharkhand',
        district: 'Giridih',
        pincode: '815301'
      }
    },
    {
      label: isHindi ? 'महिला सिलाई बुटीक (₹1.4 लाख)' : 'SC Woman Boutique (₹1.4 Lakh)',
      profile: {
        name: 'Sushila Devi',
        category: 'SC' as const,
        gender: 'female' as const,
        age: 29,
        annualFamilyIncome: 140000,
        purpose: 'micro_business' as const,
        businessIdea: 'Embroidery, Tailoring & Garment Workshop',
        projectCost: 140000,
        state: 'Jharkhand',
        district: 'Giridih',
        pincode: '815301'
      }
    },
    {
      label: isHindi ? 'बी.टेक शिक्षा ऋण (₹8 लाख)' : 'B.Tech Education Loan (₹8 Lakh)',
      profile: {
        name: 'Rohan Chaudhary',
        category: 'SC' as const,
        gender: 'male' as const,
        age: 20,
        annualFamilyIncome: 240000,
        purpose: 'education_domestic' as const,
        businessIdea: '4-Year B.Tech in Computer Science at BIT Mesra',
        projectCost: 800000,
        state: 'Jharkhand',
        district: 'Ranchi',
        pincode: '834002'
      }
    },
    {
      label: isHindi ? 'सफाई मशीन वाहन (₹15 लाख)' : 'Sanitation Vehicle (₹15 Lakh)',
      profile: {
        name: 'Karan Valmiki',
        category: 'SafaiKaramchari' as const,
        gender: 'male' as const,
        age: 36,
        annualFamilyIncome: 200000,
        purpose: 'sanitation_vehicle' as const,
        businessIdea: 'Mechanized Suction Machine & Desludging Tanker',
        projectCost: 1500000,
        state: 'Uttar Pradesh',
        district: 'Lucknow',
        pincode: '226001'
      }
    }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar branding & language toggle */}
        <div className="flex items-center justify-between py-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md font-black text-xl tracking-tight">
              ऋ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Jan Loan Setu
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {isHindi ? 'राष्ट्रीय ऋण सलाहकार' : 'National Concessional Loan Advisor'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {isHindi 
                  ? 'सही सरकारी ऋण योजना • आसान ईएमआई • निकटतम अधिकृत चैनल पार्टनर'
                  : 'Smart Scheme Finder • Financial EMI Calculator • Authorized Channel Partner Locator'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-xs"
              title="Toggle English / हिन्दी"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'English' : 'हिन्दी (Hindi)'}</span>
            </button>
          </div>
        </div>

        {/* Demo Quick Presets */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs border-b border-slate-800/60">
          <span className="text-slate-400 font-semibold flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {isHindi ? 'त्वरित उदाहरण:' : 'Quick Test Personas:'}
          </span>
          <div className="flex items-center gap-1.5">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => onApplyPreset(p.profile)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-750 text-[11px] whitespace-nowrap transition flex items-center gap-1"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between py-2 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
            <button
              id="tab-recommender"
              onClick={() => setActiveTab('recommender')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'recommender'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. {isHindi ? 'योजना खोजक (Recommender)' : 'Scheme Recommender'}</span>
            </button>

            <button
              id="tab-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>2. {isHindi ? 'ईएमआई कैलकुलेटर' : 'Financial Calculator'}</span>
            </button>

            <button
              id="tab-locator"
              onClick={() => setActiveTab('locator')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'locator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>3. {isHindi ? 'निकटतम बैंक/एजेंसी लोकेटर' : 'Channel Partner Locator'}</span>
            </button>

            <button
              id="tab-ai-advisor"
              onClick={() => setActiveTab('ai-advisor')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'ai-advisor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>4. {isHindi ? 'एआई ऋण सलाहकार' : 'AI Scheme Assistant'}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
