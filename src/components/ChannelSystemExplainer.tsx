import React, { useState } from 'react';
import { 
  Building2, Landmark, User, ArrowRight, CheckCircle2, 
  Sparkles, HelpCircle, ShieldCheck, TrendingDown, ArrowUpRight, 
  MapPin, ChevronRight, Play, RotateCcw, Wallet, Award, Clock
} from 'lucide-react';
import { formatINR } from '../utils/calculator';

interface ChannelSystemExplainerProps {
  isHindi: boolean;
  onNavigateToLocator?: () => void;
  onNavigateToRecommender?: () => void;
}

export const ChannelSystemExplainer: React.FC<ChannelSystemExplainerProps> = ({ 
  isHindi, 
  onNavigateToLocator,
  onNavigateToRecommender 
}) => {
  const [activeStep, setActiveStep] = useState<number>(2); // Default to Step 2 (Where you apply)
  const [sampleLoanAmount, setSampleLoanAmount] = useState<number>(100000);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Simplified steps data
  const steps = [
    {
      id: 1,
      stepNumber: '1',
      title: isHindi ? 'केंद्र सरकार (फंड)' : 'Govt Apex Fund',
      subtitle: isHindi ? 'कम ब्याज पर पैसा जारी करता है' : 'Releases Low-Cost Money',
      corp: 'NSFDC / NBCFDC / NSKFDC',
      icon: Building2,
      badge: isHindi ? 'बजट व सब्सिडी' : 'Subsidized Capital',
      color: 'indigo',
      simpleSummary: isHindi 
        ? 'सरकार सीधे जनता को चेक नहीं बांटती। वह शीर्ष निगमों के जरिए भारी सब्सिडी वाला पैसा (1.5% - 3%) बैंकों और राज्य एजेंसियों को देती है।'
        : 'The central government creates low-interest funds (1.5% - 3%) and transfers them to state agencies and partner banks.',
      whatTheyDo: isHindi ? 'धनराशि व सब्सिडी मंजूर करना' : 'Approves loan quota & interest subsidy',
      whatYouDo: isHindi ? 'आपको यहां नहीं जाना होता है' : 'No action needed from you here',
      keyBenefit: isHindi ? 'ब्याज दर बेहद कम (3% - 6%) रखी जाती है' : 'Guarantees 3% - 6% low interest rate'
    },
    {
      id: 2,
      stepNumber: '2',
      title: isHindi ? 'लोकल बैंक / एससीए ऑफिस' : 'Local Bank / SCA Office',
      subtitle: isHindi ? 'यहीं आपको आवेदन जमा करना है' : '⭐ Where You Apply',
      corp: isHindi ? 'जिला कल्याण कार्यालय (SCA) / SBI / PNB / ग्रामीण बैंक' : 'District Welfare Office / Lead Bank / RRB',
      icon: Landmark,
      badge: isHindi ? 'आपका आवेदन केंद्र' : 'WHERE YOU APPLY',
      color: 'emerald',
      simpleSummary: isHindi
        ? 'आपके जिले का सरकारी बैंक या जिला कल्याण अधिकारी (SCA) आपके कागजात (आधार, जाति प्रमाण, आय) जांचकर लोन पास करता है।'
        : 'Your local district welfare desk (SCA) or designated bank branch receives your token, checks simple papers, and disburses the money.',
      whatTheyDo: isHindi ? 'दस्तावेज़ सत्यापन और ऋण वितरण' : 'Verifies your papers & disburses the loan',
      whatYouDo: isHindi ? 'जन ऋण सेतु स्लिप लेकर यहां जाएं' : 'Visit here with your Jan Loan Setu Slip',
      keyBenefit: isHindi ? 'बिना किसी बिचौलिए या रिश्वत के सीधी मंजूरी' : 'Direct processing with no middlemen or agents'
    },
    {
      id: 3,
      stepNumber: '3',
      title: isHindi ? 'आप (लाभार्थी नागरिक)' : 'You (Citizen Borrower)',
      subtitle: isHindi ? 'कम ईएमआई पर लोन प्राप्त करें' : 'Get Loan & Start Business',
      corp: isHindi ? 'स्वरोजगार, दुकान, मशीनरी या व्यापार' : 'Self-Employment, Shop, Vehicle or Farm',
      icon: User,
      badge: isHindi ? 'सफलता व तरक्की' : 'Your Growth',
      color: 'amber',
      simpleSummary: isHindi
        ? 'आपको सीधे आपके बैंक खाते में रियायती ऋण और सब्सिडी मिलती है। 3 से 5 साल में छोटी मासिक किस्तों (EMI) में चुकाएं।'
        : 'The money is credited into your savings account. You start your micro-business and repay in comfortable small monthly installments.',
      whatTheyDo: isHindi ? 'व्यवसाय शुरू कर मासिक किस्त चुकाना' : 'Run your business and pay easy monthly EMI',
      whatYouDo: isHindi ? 'अपना कारोबार शुरू करें और तरक्की करें' : 'Grow income and achieve financial freedom',
      keyBenefit: isHindi ? 'प्राइवेट साहूकार की तुलना में ₹15,000+ की बचत' : 'Save ₹15,000+ compared to high-cost moneylenders'
    }
  ];

  // Quick loan amounts for interactive calculator
  const loanOptions = [50000, 100000, 200000, 500000];

  // Calculations for Govt Concessional Loan (4.5% avg) vs Private Lender (24% avg) over 3 years
  const tenureYears = 3;
  const govtRate = 0.045; // 4.5%
  const privateRate = 0.24; // 24%

  const govtMonthlyEmi = Math.round((sampleLoanAmount + (sampleLoanAmount * govtRate * tenureYears)) / (tenureYears * 12));
  const govtTotalInterest = Math.round(sampleLoanAmount * govtRate * tenureYears);

  const privateMonthlyEmi = Math.round((sampleLoanAmount + (sampleLoanAmount * privateRate * tenureYears)) / (tenureYears * 12));
  const privateTotalInterest = Math.round(sampleLoanAmount * privateRate * tenureYears);
  const totalSavings = privateTotalInterest - govtTotalInterest;

  // Simulate automated walkthrough
  const handleStartSimulation = () => {
    setIsSimulating(true);
    setActiveStep(1);
    
    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setTimeout(() => {
          setIsSimulating(false);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const currentStepData = steps.find(s => s.id === activeStep) || steps[1];

  return (
    <div id="channel-system-explainer" className="bg-white text-slate-900 rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-200/90 my-6 transition-all">
      {/* Header with Title & Quick Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isHindi ? 'सरल चैनल गाइड' : 'EASY 3-STEP GUIDE'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isHindi 
              ? 'सरकारी रियायती लोन आपको कैसे मिलता है?' 
              : 'How Government Concessional Loans Reach You'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isHindi
              ? 'सरकार सीधे लोन नहीं देती, बल्कि अधिकृत "चैनल पार्टनर बैंक व जिला कार्यालय" के माध्यम से देती है। नीचे दिए गए 3 चरणों पर क्लिक करके समझें:'
              : 'The government operates via authorized Channel Partners (Local Banks & SCAs). Click any step below to see how the simple process works:'}
          </p>
        </div>

        {/* Interactive Play/Reset Button */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              isSimulating 
                ? 'bg-indigo-100 text-indigo-700 cursor-not-allowed animate-pulse' 
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isHindi ? (isSimulating ? 'प्रक्रिया चल रही है...' : 'स्टेप्स चलाकर देखें') : (isSimulating ? 'Animating Flow...' : '▶ See Live Flow')}</span>
          </button>
        </div>
      </div>

      {/* 3 Interactive Cards (Clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {steps.map((step) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;
          const isStep2 = step.id === 2;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 relative text-left border-2 flex flex-col justify-between select-none ${
                isSelected 
                  ? step.id === 1
                    ? 'bg-indigo-50/60 border-indigo-600 shadow-md ring-2 ring-indigo-600/20 translate-y-[-2px]'
                    : step.id === 2
                    ? 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-600/20 translate-y-[-2px]'
                    : 'bg-amber-50/60 border-amber-500 shadow-md ring-2 ring-amber-500/20 translate-y-[-2px]'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
              }`}
            >
              {/* Highlight Badge on Step 2 */}
              {isStep2 && (
                <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{isHindi ? 'आपका आवेदन केंद्र' : 'WHERE YOU APPLY'}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-2xs border ${
                    step.id === 1 
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
                      : step.id === 2 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${
                    isSelected 
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200' 
                      : 'text-slate-500 bg-slate-200/60'
                  }`}>
                    STEP {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {step.subtitle}
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {step.simpleSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1 ${
                  step.id === 1 ? 'text-indigo-700' : step.id === 2 ? 'text-emerald-700' : 'text-amber-800'
                }`}>
                  {step.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600 flex items-center gap-0.5">
                  {isSelected ? (isHindi ? 'विवरण नीचे देखें ↓' : 'Details Below ↓') : (isHindi ? 'क्लिक करें →' : 'Click →')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Expanded Detail Box for Active Step */}
      <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 mb-6 ${
        activeStep === 1 
          ? 'bg-indigo-50/40 border-indigo-200' 
          : activeStep === 2 
          ? 'bg-emerald-50/50 border-emerald-300' 
          : 'bg-amber-50/40 border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4 border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
              activeStep === 1 ? 'bg-indigo-600' : activeStep === 2 ? 'bg-emerald-600' : 'bg-amber-600'
            }`}>
              {activeStep}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isHindi ? 'चयनित चरण की पूरी जानकारी' : 'STEP DETAILS & ACTION'}
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {currentStepData.title} • {currentStepData.corp}
              </h4>
            </div>
          </div>

          {activeStep === 2 && onNavigateToLocator && (
            <button
              type="button"
              onClick={onNavigateToLocator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition shrink-0"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isHindi ? 'अपना नजदीकी केंद्र खोजें' : 'Locate My Branch'}</span>
            </button>
          )}

          {activeStep === 3 && onNavigateToRecommender && (
            <button
              type="button"
              onClick={onNavigateToRecommender}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition shrink-0"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isHindi ? 'अपनी पात्रता जांचें' : 'Check My Schemes'}</span>
            </button>
          )}
        </div>

        {/* 3 Detail Columns for the Step */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              {isHindi ? '🏢 यह क्या करता है?' : '🏢 What Happens Here?'}
            </span>
            <p className="font-semibold text-slate-800 text-sm">
              {currentStepData.whatTheyDo}
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              {isHindi ? '👤 आपको क्या करना है?' : '👤 What You Need To Do?'}
            </span>
            <p className="font-semibold text-slate-800 text-sm">
              {currentStepData.whatYouDo}
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              {isHindi ? '💡 मुख्य फायदा (Benefit)' : '💡 Key Benefit for You'}
            </span>
            <p className="font-bold text-emerald-700 text-sm">
              {currentStepData.keyBenefit}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive "Why Govt Loan is Better" Live Money Comparison Slider */}
      <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md inline-block mb-1">
              {isHindi ? 'लाइव ब्याज तुलना' : 'LIVE SAVINGS COMPARISON'}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {isHindi 
                ? 'सरकारी रियायती लोन से आपकी कितनी बचत होती है?' 
                : 'See How Much You Save Compared to Private Moneylenders'}
            </h4>
          </div>

          {/* Quick Loan Amount Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1">
              {isHindi ? 'लोन राशि:' : 'Amount:'}
            </span>
            {loanOptions.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSampleLoanAmount(amt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  sampleLoanAmount === amt
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Comparison Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Govt Scheme Option */}
          <div className="bg-white p-4 rounded-xl border-2 border-emerald-500 shadow-2xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isHindi ? 'सरकारी योजना (जन ऋण सेतु)' : 'Govt Concessional Scheme'}
              </span>
              <span className="text-xs font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                ~4.5% p.a.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">{isHindi ? 'मासिक ईएमआई' : 'Monthly EMI'}</span>
                <span className="text-base font-black text-slate-900">{formatINR(govtMonthlyEmi)}/mo</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{isHindi ? '3 साल का कुल ब्याज' : '3-Yr Total Interest'}</span>
                <span className="text-base font-black text-emerald-700">{formatINR(govtTotalInterest)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 border-t pt-2 border-slate-100">
              {isHindi ? '✓ कोई छिपे शुल्क नहीं, सब्सिडी व अधिस्थगन (Moratorium) का लाभ' : '✓ No hidden fees, moratorium grace period & subsidy benefits'}
            </p>
          </div>

          {/* Private Lender Option */}
          <div className="bg-slate-100/80 p-4 rounded-xl border border-slate-300 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isHindi ? 'निजी साहूकार / असुरक्षित लोन' : 'Private Lender / Informal'}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md">
                ~24% to 36%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">{isHindi ? 'मासिक ईएमआई' : 'Monthly EMI'}</span>
                <span className="text-base font-bold text-slate-700">{formatINR(privateMonthlyEmi)}/mo</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{isHindi ? '3 साल का कुल ब्याज' : '3-Yr Total Interest'}</span>
                <span className="text-base font-bold text-rose-600">{formatINR(privateTotalInterest)}</span>
              </div>
            </div>

            {/* Savings Highlight Banner */}
            <div className="mt-2 border-t pt-2 border-slate-200 flex items-center justify-between text-xs">
              <span className="text-emerald-800 font-extrabold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                {isHindi ? `आपकी कुल सीधी बचत: ${formatINR(totalSavings)}` : `You Save Direct: ${formatINR(totalSavings)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
