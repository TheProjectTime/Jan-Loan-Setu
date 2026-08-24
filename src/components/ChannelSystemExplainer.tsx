import React from 'react';
import { Building2, Landmark, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ChannelSystemExplainerProps {
  isHindi: boolean;
}

export const ChannelSystemExplainer: React.FC<ChannelSystemExplainerProps> = ({ isHindi }) => {
  return (
    <div id="channel-system-explainer" className="bg-white text-slate-900 rounded-2xl p-6 shadow-xs border border-slate-200 my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isHindi ? 'चैनल वित्त पोषण प्रणाली' : 'Channel Finance System Explained'}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {isHindi 
              ? 'सरकार से सीधे आपके खाते तक ऋण कैसे पहुँचता है?' 
              : 'How Government Concessional Loans Reach You'}
          </h3>
        </div>
        <p className="text-sm text-slate-600 max-w-md">
          {isHindi
            ? 'सरकार सीधे ऋण नहीं देती, बल्कि अधिकृत "चैनल पार्टनर्स" (SCAs, बैंकों, RRBs) के माध्यम से वितरित करती है। गलत बैंक जाने से बचने के लिए सही पार्टनर चुनना जरूरी है।'
            : 'The Government does not disburse loans directly; it operates via authorized Channel Partners (SCAs, Banks, RRBs, NBFCs). Jan Loan Setu connects you to the exact partner.'}
        </p>
      </div>

      {/* Visual Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Step 1: Apex Corporation */}
        <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3 border border-indigo-200">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Step 1 • Apex Fund</span>
            <h4 className="text-base font-semibold text-slate-900 mt-1">
              {isHindi ? 'राष्ट्रीय निगम (NSFDC / NBCFDC / NSKFDC)' : 'National Apex Corporation (NSFDC / NSKFDC)'}
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {isHindi
                ? 'केंद्र सरकार के सामाजिक न्याय मंत्रालय द्वारा 1.5% से 3% रियायती दर पर फंड उपलब्ध कराया जाता है।'
                : 'Provides subsidized funds at 1.5% - 3.0% interest rate to state channelizing agencies & banks.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs text-emerald-700 font-semibold">
            <span>{isHindi ? 'रियायती पूंजी आबंटन' : 'Subsidized Capital Pool'}</span>
          </div>
        </div>

        {/* Step 2: Channel Partner */}
        <div className="bg-emerald-50/40 rounded-xl p-5 border-2 border-emerald-600 relative shadow-xs flex flex-col justify-between">
          <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
            {isHindi ? 'आपका आवेदन केंद्र' : 'Where You Apply'}
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 border border-emerald-200">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Step 2 • Channel Partner</span>
            <h4 className="text-base font-semibold text-slate-900 mt-1">
              {isHindi ? 'चैनल पार्टनर (SCA / बैंक / RRB / NBFC)' : 'Channel Partner (SCA / Bank / RRB)'}
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {isHindi
                ? 'राज्य चैनलिंग एजेंसी (DWO कार्यालय), लीड बैंक (SBI/PNB), या ग्रामीण बैंक आपके कागजात जांचकर ऋण स्वीकृत करते हैं।'
                : 'State Channelizing Agencies (SCAs), Public Sector Banks, or RRBs verify documents & disburse the loan.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center text-xs text-emerald-700 font-bold">
            <span>{isHindi ? '✅ Jan Loan Setu खोजता है' : '✅ Located by Jan Loan Setu'}</span>
          </div>
        </div>

        {/* Step 3: Beneficiary */}
        <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3 border border-amber-200">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Step 3 • Beneficiary</span>
            <h4 className="text-base font-semibold text-slate-900 mt-1">
              {isHindi ? 'नागरिक / लाभार्थी (आप)' : 'Citizen / Beneficiary (You)'}
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {isHindi
                ? 'आपको मात्र 3.5% - 6% ब्याज, आसान ईएमआई और सरकारी सब्सिडी के साथ सीधे ऋण प्राप्त होता है।'
                : 'You receive low-interest credit (3.5% - 6%), government subsidy, and clear monthly EMI.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs text-amber-700 font-semibold">
            <span>{isHindi ? 'स्वरोजगार व वित्तीय स्वतंत्रता' : 'Self-Reliance & Prosperity'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
