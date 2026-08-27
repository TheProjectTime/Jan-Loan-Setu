import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Languages, Smartphone, Menu, X, 
  LayoutDashboard, CheckCircle2, Calculator, MapPin, Bot 
} from 'lucide-react';
import { JanLoanSetuLogo } from './JanLoanSetuLogo';

interface HeaderProps {
  isHindi: boolean;
  setIsHindi: (val: boolean) => void;
  activeTab: 'dashboard' | 'recommender' | 'calculator' | 'locator' | 'ai-advisor';
  setActiveTab: (tab: 'dashboard' | 'recommender' | 'calculator' | 'locator' | 'ai-advisor') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isHindi,
  setIsHindi,
  activeTab,
  setActiveTab
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleSelectNav = (tabId: 'dashboard' | 'recommender' | 'calculator' | 'locator' | 'ai-advisor') => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5">
          {/* Left Brand Identity + Hamburger Menu */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Toggle Button */}
            <div className="relative" ref={menuRef}>
              <button
                id="hamburger-menu-btn"
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                  isMenuOpen 
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
                }`}
                title={isHindi ? 'मेनू खोलें' : 'Open Navigation Menu'}
                aria-label="Navigation Menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Hamburger Dropdown Menu Card (Styled accurately to provided design) */}
              {isMenuOpen && (
                <div 
                  id="hamburger-dropdown-menu"
                  className="absolute left-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-2xl p-3 shadow-xl border border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`hamburger-nav-${item.id}`}
                          type="button"
                          onClick={() => handleSelectNav(item.id)}
                          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer text-left ${
                            isActive
                              ? 'bg-indigo-50/90 text-indigo-700 font-bold shadow-2xs'
                              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Clickable Brand Logo & Title -> Redirects to Dashboard */}
            <button
              id="header-brand-home-btn"
              type="button"
              onClick={() => handleSelectNav('dashboard')}
              className="flex items-center text-left cursor-pointer group rounded-xl p-1 -m-1 transition-all hover:opacity-90 active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              title={isHindi ? 'डैशबोर्ड पर जाएं' : 'Return to Dashboard'}
              aria-label={isHindi ? 'जन लोन सेतु - डैशबोर्ड पर जाएं' : 'Jan Loan Setu - Return to Dashboard'}
            >
              <JanLoanSetuLogo
                size="md"
                variant="horizontal"
                isHindi={isHindi}
              />
            </button>
            
            {/* National Status Badge */}
            <span className="hidden xl:flex bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-full items-center gap-1 ml-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {isHindi ? 'राष्ट्रीय रियायती ऋण सलाहकार' : 'National Concessional Loan Advisor'}
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition shadow-2xs cursor-pointer"
              title="Toggle English / हिन्दी"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isHindi ? 'English' : 'हिंदी (Hindi)'}</span>
            </button>

            {/* Device / Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHindi ? 'मोबाइल फ्रेंडली' : 'Device'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

