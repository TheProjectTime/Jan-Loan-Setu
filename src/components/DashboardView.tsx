import React from 'react';
import { 
  FileText, Landmark, Users, ShieldCheck, Sparkles, 
  Target, Clock, Shield, ArrowRight, Building2, User, 
  CheckCircle2, ChevronRight
} from 'lucide-react';
import { ChannelSystemExplainer } from './ChannelSystemExplainer';

interface DashboardViewProps {
  onStartRecommendation: () => void;
  onNavigateToTab: (tab: 'recommender' | 'calculator' | 'locator' | 'ai-advisor') => void;
  isHindi: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartRecommendation,
  onNavigateToTab,
  isHindi
}) => {
  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Greeting Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {isHindi ? 'जन ऋण सेतु में आपका स्वागत है 👋' : 'Welcome to Jan Loan Setu 👋'}
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {isHindi 
            ? 'सरकारी रियायती ऋण योजनाओं को खोजने और आवेदन करने का आपका एकल मंच'
            : 'Your one-stop platform to discover government concessional loans'}
        </p>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 250+ Schemes */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition hover:shadow-sm">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">250+</div>
            <div className="text-xs text-slate-500 font-medium leading-snug mt-0.5">
              {isHindi ? 'सरकारी योजनाएं आपके लिए' : 'Government Schemes'}
              <span className="block text-slate-400 text-[11px]">{isHindi ? 'विस्तृत विवरण सहित' : 'Curated for you'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: 150+ Partners */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition hover:shadow-sm">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">150+</div>
            <div className="text-xs text-slate-500 font-medium leading-snug mt-0.5">
              {isHindi ? 'अधिकृत चैनल पार्टनर' : 'Channel Partners'}
              <span className="block text-slate-400 text-[11px]">{isHindi ? 'पूरे भारत में' : 'Across India'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: 10K+ Beneficiaries */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition hover:shadow-sm">
          <div className="w-13 h-13 rounded-2xl bg-amber-50/80 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">10K+</div>
            <div className="text-xs text-slate-500 font-medium leading-snug mt-0.5">
              {isHindi ? 'सशक्त लाभार्थी' : 'Beneficiaries'}
              <span className="block text-slate-400 text-[11px]">{isHindi ? 'सहायता प्राप्त' : 'Empowered'}</span>
            </div>
          </div>
        </div>

        {/* Card 4: 100% Verified */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition hover:shadow-sm">
          <div className="w-13 h-13 rounded-2xl bg-sky-50/80 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">100%</div>
            <div className="text-xs text-slate-500 font-medium leading-snug mt-0.5">
              {isHindi ? 'सत्यापित व सुरक्षित' : 'Verified & Trusted'}
              <span className="block text-slate-400 text-[11px]">{isHindi ? 'आधिकारिक प्रक्रिया' : 'Secure Process'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Channel Finance System Flow Card */}
      <ChannelSystemExplainer 
        isHindi={isHindi} 
        onNavigateToLocator={() => onNavigateToTab('locator')}
        onNavigateToRecommender={onStartRecommendation}
      />

      {/* AI-Powered Recommendation CTA + 3 Feature Highlights */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left CTA Card */}
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHindi ? 'एआई संचालित' : 'AI-POWERED'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isHindi ? 'अपने लिए सही योजना खोजें' : 'Find the Right Scheme for You'}
            </h2>

            <p className="text-xs text-slate-500 leading-relaxed">
              {isHindi
                ? 'कुछ सरल प्रश्नों के उत्तर दें और हमारा एआई आपकी आवश्यकताओं के लिए सर्वोत्तम योजनाओं का मिलान करेगा।'
                : 'Answer a few simple questions and our AI will match the best schemes for your needs.'}
            </p>

            <div className="pt-2">
              <button
                id="btn-dashboard-start-recommendation"
                onClick={onStartRecommendation}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isHindi ? 'स्मार्ट अनुशंसा शुरू करें' : 'Start Smart Recommendation'}</span>
              </button>
            </div>
          </div>

          {/* Right 3 Value Highlight Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Card 1: Personalized Matches */}
            <div 
              onClick={() => onNavigateToTab('recommender')}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-3 group-hover:scale-105 transition-transform">
                <Target className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                {isHindi ? 'व्यक्तिगत मिलान' : 'Personalized Matches'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi 
                  ? 'एआई सबसे प्रासंगिक योजनाओं की सिफारिश करता है'
                  : 'AI recommends the most relevant schemes'}
              </p>
            </div>

            {/* Card 2: Save Time */}
            <div 
              onClick={() => onNavigateToTab('locator')}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                {isHindi ? 'समय की बचत' : 'Save Time'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'विभिन्न वेबसाइटों पर भटकने की जरूरत नहीं'
                  : 'No more searching through multiple websites'}
              </p>
            </div>

            {/* Card 3: Trusted Information */}
            <div 
              onClick={() => onNavigateToTab('calculator')}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-105 transition-transform">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                {isHindi ? 'सत्यापित जानकारी' : 'Trusted Information'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? '100% सत्यापित सरकारी योजनाएं व अधिकृत पार्टनर'
                  : '100% verified government schemes & partners'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
