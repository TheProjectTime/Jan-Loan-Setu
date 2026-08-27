import React from 'react';
import { ShieldCheck, Languages, Smartphone } from 'lucide-react';
import { JanLoanSetuLogo } from './JanLoanSetuLogo';

interface HeaderProps {
  isHindi: boolean;
  setIsHindi: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isHindi,
  setIsHindi
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5">
          {/* Left Brand Identity with Authentic Logo */}
          <div className="flex items-center gap-3">
            <JanLoanSetuLogo
              size="md"
              variant="horizontal"
              isHindi={isHindi}
            />
            
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

