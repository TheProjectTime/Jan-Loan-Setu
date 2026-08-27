import React from 'react';
import { 
  LayoutDashboard, CheckCircle2, Calculator, MapPin, 
  Bot, Zap, ShieldCheck, Lock, ChevronRight 
} from 'lucide-react';
import { UserFinancialProfile } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'recommender' | 'calculator' | 'locator' | 'ai-advisor';
  setActiveTab: (tab: 'dashboard' | 'recommender' | 'calculator' | 'locator' | 'ai-advisor') => void;
  onApplyPreset: (preset: Partial<UserFinancialProfile>) => void;
  isHindi: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onApplyPreset,
  isHindi
}) => {
  const NAV_ITEMS = [
    {
      id: 'dashboard' as const,
      label: isHindi ? 'डैशबोर्ड' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'recommender' as const,
      label: isHindi ? 'योजना अनुशंसा' : 'Scheme Recommender',
      icon: CheckCircle2,
    },
    {
      id: 'calculator' as const,
      label: isHindi ? 'वित्तीय कैलकुलेटर' : 'Financial Calculator',
      icon: Calculator,
    },
    {
      id: 'locator' as const,
      label: isHindi ? 'चैनल पार्टनर खोजें' : 'Channel Partner Locator',
      icon: MapPin,
    },
    {
      id: 'ai-advisor' as const,
      label: isHindi ? 'एआई योजना सहायक' : 'AI Scheme Assistant',
      icon: Bot,
    }
  ];

  const PRESETS = [
    {
      label: isHindi ? 'गिरिडीह दुकान (₹1 लाख)' : 'Giridih Small Shop (₹1 Lakh)',
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
      label: isHindi ? 'एससी महिला बुटीक (₹14 लाख)' : 'SC Woman Boutique (₹14 Lakh)',
      profile: {
        name: 'Sushila Devi',
        category: 'SC' as const,
        gender: 'female' as const,
        age: 29,
        annualFamilyIncome: 140000,
        purpose: 'micro_business' as const,
        businessIdea: 'Embroidery, Tailoring & Garment Workshop',
        projectCost: 1400000,
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
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Navigation Menu Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-indigo-700' : 'text-slate-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Test Personas Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800 text-xs font-bold">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          <span>{isHindi ? 'त्वरित टेस्ट प्रोफाइल' : 'Quick Test Personas'}</span>
        </div>

        <div className="space-y-1.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              id={`sidebar-preset-${idx}`}
              onClick={() => {
                onApplyPreset(p.profile);
                setActiveTab('recommender');
              }}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium transition cursor-pointer truncate"
              title={p.label}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 100% Secure Bottom Badge */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">
              {isHindi ? '100% सुरक्षित' : '100% Secure'}
            </div>
            <div className="text-[11px] text-emerald-700">
              {isHindi ? 'डेटा पूरी तरह गोपनीय' : 'Your data is safe with us'}
            </div>
          </div>
        </div>
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
      </div>
    </aside>
  );
};
