import React, { useState, useMemo } from 'react';
import { 
  Calculator, DollarSign, Percent, Clock, Calendar, ArrowRight, 
  MapPin, FileText, CheckCircle2, TrendingDown, HelpCircle, 
  ShieldCheck, ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';
import { LoanScheme, CalculationResult, UserFinancialProfile } from '../types';
import { calculateLoanFinancials, formatINR, formatINRLakhCrore } from '../utils/calculator';

interface FinancialCalculatorProps {
  selectedScheme: LoanScheme;
  allSchemes: LoanScheme[];
  onSelectScheme: (scheme: LoanScheme) => void;
  profile: UserFinancialProfile;
  onNavigateToLocator: (scheme: LoanScheme) => void;
  onOpenSlipModal: (scheme: LoanScheme) => void;
  isHindi: boolean;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  selectedScheme,
  allSchemes,
  onSelectScheme,
  profile,
  onNavigateToLocator,
  onOpenSlipModal,
  isHindi
}) => {
  // Configurable sliders
  const [projectCost, setProjectCost] = useState<number>(profile.projectCost || selectedScheme.maxLoanAmount || 100000);
  const [interestRate, setInterestRate] = useState<number>(
    profile.gender === 'female' ? selectedScheme.interestRateFemale : selectedScheme.interestRateMale
  );
  const [tenureYears, setTenureYears] = useState<number>(Math.min(3, selectedScheme.maxTenureYears));
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(selectedScheme.moratoriumMonths || 0);
  const [promoterPercent, setPromoterPercent] = useState<number>(selectedScheme.promoterContributionPercent || 2);
  const [subsidyPercent, setSubsidyPercent] = useState<number>(selectedScheme.subsidyPercent || 0);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [scheduleViewMode, setScheduleViewMode] = useState<'yearly' | 'monthly'>('yearly');

  // Recalculate whenever inputs change
  const calcResult: CalculationResult = useMemo(() => {
    return calculateLoanFinancials({
      projectCost,
      promoterPercentage: promoterPercent,
      subsidyPercentage: subsidyPercent,
      maxSubsidyCap: selectedScheme.maxSubsidyAmount,
      annualInterestRate: interestRate,
      tenureYears,
      moratoriumMonths
    });
  }, [projectCost, promoterPercent, subsidyPercent, interestRate, tenureYears, moratoriumMonths, selectedScheme]);

  // Commercial Bank Comparison (e.g. 13.5% commercial unsecured loan)
  const commercialComparison = useMemo(() => {
    const commCalc = calculateLoanFinancials({
      projectCost,
      promoterPercentage: 15, // standard commercial banks require 15-20% margin
      subsidyPercentage: 0,
      maxSubsidyCap: 0,
      annualInterestRate: 13.5,
      tenureYears,
      moratoriumMonths: 0
    });
    const interestSaved = commCalc.totalInterestPaid - calcResult.totalInterestPaid;
    const monthlyDifference = commCalc.monthlyEMI - calcResult.monthlyEMI;
    return {
      commEMI: commCalc.monthlyEMI,
      commTotalInterest: commCalc.totalInterestPaid,
      interestSaved: Math.max(0, interestSaved),
      monthlyDifference: Math.max(0, monthlyDifference)
    };
  }, [projectCost, tenureYears, calcResult]);

  // Group schedule into yearly rows
  const yearlySchedule = useMemo(() => {
    const yearsMap: Record<number, {
      year: number;
      totalEMI: number;
      totalPrincipal: number;
      totalInterest: number;
      endingBalance: number;
    }> = {};

    calcResult.schedule.forEach(row => {
      if (!yearsMap[row.year]) {
        yearsMap[row.year] = {
          year: row.year,
          totalEMI: 0,
          totalPrincipal: 0,
          totalInterest: 0,
          endingBalance: row.endingBalance
        };
      }
      yearsMap[row.year].totalEMI += row.emi;
      yearsMap[row.year].totalPrincipal += row.principalPayment;
      yearsMap[row.year].totalInterest += row.interestPayment;
      yearsMap[row.year].endingBalance = row.endingBalance;
    });

    return Object.values(yearsMap);
  }, [calcResult.schedule]);

  return (
    <div id="financial-calculator-view" className="space-y-8">
      {/* Top Scheme Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs text-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                {isHindi ? 'सरकारी वित्तीय एवं ईएमआई कैलकुलेटर' : 'Concessional Loan EMI & Financial Calculator'}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {isHindi ? 'सटीक ईएमआई, ब्याज व सरकारी सब्सिडी की गणना' : 'Transparent EMI, Interest & Repayment Analysis'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-600 whitespace-nowrap">
              {isHindi ? 'योजना बदलें:' : 'Active Scheme:'}
            </label>
            <select
              id="select-calculator-scheme"
              value={selectedScheme.id}
              onChange={e => {
                const s = allSchemes.find(x => x.id === e.target.value);
                if (s) {
                  onSelectScheme(s);
                  setProjectCost(Math.min(projectCost, s.maxProjectCost));
                  setInterestRate(profile.gender === 'female' ? s.interestRateFemale : s.interestRateMale);
                  setTenureYears(Math.min(tenureYears, s.maxTenureYears));
                  setMoratoriumMonths(s.moratoriumMonths);
                  setPromoterPercent(s.promoterContributionPercent);
                  setSubsidyPercent(s.subsidyPercent);
                }
              }}
              className="bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
            >
              {allSchemes.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Sliders & Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? 'ऋण पैरामीटर समायोजित करें' : 'Adjust Loan Parameters'}
            </h3>
            <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono font-semibold">
              {selectedScheme.code}
            </span>
          </div>

          {/* 1. Total Project Cost */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {isHindi ? 'कुल परियोजना लागत (Project Cost)' : 'Total Project Cost'}
              </label>
              <span className="text-base font-bold text-emerald-700 font-mono">
                {formatINR(projectCost)}
              </span>
            </div>
            <input
              id="slider-calc-project-cost"
              type="range"
              min="20000"
              max={selectedScheme.maxProjectCost}
              step="5000"
              value={projectCost}
              onChange={e => setProjectCost(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹20,000</span>
              <span>Max: {formatINRLakhCrore(selectedScheme.maxProjectCost)}</span>
            </div>
          </div>

          {/* 2. Concessional Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {isHindi ? 'वार्षिक ब्याज दर (Annual Interest Rate)' : 'Concessional Interest Rate'}
              </label>
              <span className="text-base font-bold text-emerald-700 font-mono">
                {interestRate}% p.a.
              </span>
            </div>
            <input
              id="slider-calc-interest-rate"
              type="range"
              min="3.0"
              max="12.0"
              step="0.5"
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">{profile.gender === 'female' ? '👩 Female Rate (Subsidized)' : '👨 Standard Rate'}</span>
              <span className="text-emerald-700 font-medium">vs 12-16% Commercial Banks</span>
            </div>
          </div>

          {/* 3. Loan Tenure (Years) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {isHindi ? 'ऋण अवधि (Tenure)' : 'Loan Tenure (Years)'}
              </label>
              <span className="text-base font-bold text-slate-900 font-mono">
                {tenureYears} {isHindi ? 'वर्ष' : 'Years'} ({tenureYears * 12} {isHindi ? 'माह' : 'Months'})
              </span>
            </div>
            <input
              id="slider-calc-tenure"
              type="range"
              min="1"
              max={selectedScheme.maxTenureYears}
              step="1"
              value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 Year</span>
              <span>Max: {selectedScheme.maxTenureYears} Years</span>
            </div>
          </div>

          {/* 4. Moratorium Period */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {isHindi ? 'मोरेटोरियम / छूट अवधि (Moratorium)' : 'Moratorium / Grace Period'}
              </label>
              <span className="text-sm font-bold text-amber-700 font-mono">
                {moratoriumMonths} {isHindi ? 'महीने' : 'Months'}
              </span>
            </div>
            <input
              id="slider-calc-moratorium"
              type="range"
              min="0"
              max="24"
              step="1"
              value={moratoriumMonths}
              onChange={e => setMoratoriumMonths(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              {moratoriumMonths > 0 
                ? (isHindi ? `प्रथम ${moratoriumMonths} माह मूलधन वापसी स्थगित (केवल साधारण ब्याज देय)` : `First ${moratoriumMonths} months principal deferred`)
                : (isHindi ? 'कोई मोरेटोरियम नहीं' : 'Immediate EMI starts from month 1')}
            </span>
          </div>

          {/* 5. Promoter Contribution % & Subsidy % */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'प्रमोटर अंश (%)' : 'Promoter Margin (%)'}
              </label>
              <input
                id="input-promoter-margin"
                type="number"
                min="0"
                max="30"
                value={promoterPercent}
                onChange={e => setPromoterPercent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block font-semibold">
                = {formatINR(calcResult.promoterShare)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHindi ? 'पूंजी सब्सिडी (%)' : 'Govt Subsidy (%)'}
              </label>
              <input
                id="input-subsidy-percent"
                type="number"
                min="0"
                max="50"
                value={subsidyPercent}
                onChange={e => setSubsidyPercent(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-mono"
              />
              <span className="text-[10px] text-teal-700 mt-0.5 block font-semibold">
                = {formatINR(calcResult.subsidyAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Financial Results & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main EMI Highlight Box */}
          <div id="emi-summary-box" className="bg-white border-2 border-emerald-600 rounded-2xl p-6 shadow-xs text-slate-900 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  {isHindi ? 'अनुमानित मासिक किस्त' : 'Estimated Monthly Installment'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                    {formatINR(calcResult.monthlyEMI)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {isHindi ? 'प्रति माह' : 'month'}</span>
                </div>
              </div>

              {/* Concessional Savings Tag */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-right">
                <span className="text-[11px] text-emerald-800 font-semibold block">
                  {isHindi ? 'व्यावसायिक बैंक की तुलना में बचत:' : 'Savings vs Commercial Bank:'}
                </span>
                <span className="text-sm font-black text-emerald-700 font-mono">
                  +{formatINR(commercialComparison.interestSaved)}
                </span>
              </div>
            </div>

            {/* Financial Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">
                  {isHindi ? 'ऋण मूलधन राशि' : 'Sanctioned Loan'}
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {formatINR(calcResult.loanAmount)}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">
                  {isHindi ? 'कुल ब्याज भुगतान' : 'Total Interest'}
                </span>
                <span className="text-sm font-extrabold text-amber-700 font-mono">
                  {formatINR(calcResult.totalInterestPaid)}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">
                  {isHindi ? 'कुल चुकौती राशि' : 'Total Repayment'}
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {formatINR(calcResult.totalRepayment)}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-medium">
                  {isHindi ? 'लाभार्थी अंश (मार्जिन)' : 'Promoter Margin'}
                </span>
                <span className="text-sm font-extrabold text-teal-700 font-mono">
                  {formatINR(calcResult.promoterShare)}
                </span>
              </div>
            </div>

            {/* Visual Repayment Breakdown Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                <span>{isHindi ? 'लागत संरचना:' : 'Cost Structure Breakdown:'}</span>
                <span className="font-mono text-slate-900 font-bold">{formatINR(projectCost)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
                <div 
                  style={{ width: `${(calcResult.loanAmount / (calcResult.totalRepayment + calcResult.promoterShare)) * 100}%` }}
                  className="bg-emerald-600 h-full" 
                  title="Principal Loan"
                />
                <div 
                  style={{ width: `${(calcResult.totalInterestPaid / (calcResult.totalRepayment + calcResult.promoterShare)) * 100}%` }}
                  className="bg-amber-500 h-full" 
                  title="Interest"
                />
                <div 
                  style={{ width: `${(calcResult.promoterShare / (calcResult.totalRepayment + calcResult.promoterShare)) * 100}%` }}
                  className="bg-indigo-600 h-full" 
                  title="Margin Money"
                />
              </div>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-600 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span>Principal: {formatINR(calcResult.loanAmount)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span>Interest: {formatINR(calcResult.totalInterestPaid)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                  <span>Margin: {formatINR(calcResult.promoterShare)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-3 border-t border-slate-100">
              <button
                id="btn-calc-find-bank"
                onClick={() => onNavigateToLocator(selectedScheme)}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>{isHindi ? 'निकटतम अधिकृत चैनल पार्टनर खोजें' : 'Find Authorized Channel Partner'}</span>
              </button>

              <button
                id="btn-calc-get-slip"
                onClick={() => onOpenSlipModal(selectedScheme)}
                className="py-2.5 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? 'पात्रता पर्ची डाउनलोड करें' : 'Download Pre-Application Slip'}</span>
              </button>
            </div>
          </div>

          {/* Amortization Schedule Accordion */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  {isHindi ? 'चुकौती अनुसूची (Amortization Schedule)' : 'Repayment Schedule & Year-wise Breakdown'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'हर साल और महीने की मूलधन व ब्याज कटौती का विवरण' : 'Detailed breakdown of principal and interest per period'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex text-xs">
                  <button
                    onClick={() => setScheduleViewMode('yearly')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      scheduleViewMode === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isHindi ? 'वार्षिक' : 'Yearly'}
                  </button>
                  <button
                    onClick={() => setScheduleViewMode('monthly')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      scheduleViewMode === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isHindi ? 'मासिक' : 'Monthly'}
                  </button>
                </div>

                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition"
                  title="Toggle Schedule"
                >
                  {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {showSchedule ? (
              <div className="overflow-x-auto max-h-80 overflow-y-auto no-scrollbar border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">{scheduleViewMode === 'yearly' ? 'Year' : 'Month'}</th>
                      <th className="p-2.5">{isHindi ? 'ईएमआई' : 'EMI Paid'}</th>
                      <th className="p-2.5">{isHindi ? 'मूलधन' : 'Principal'}</th>
                      <th className="p-2.5">{isHindi ? 'ब्याज' : 'Interest'}</th>
                      <th className="p-2.5">{isHindi ? 'शेष ऋण' : 'Balance'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scheduleViewMode === 'yearly'
                      ? yearlySchedule.map(row => (
                          <tr key={row.year} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-indigo-700">Year {row.year}</td>
                            <td className="p-2.5 text-slate-900">{formatINR(row.totalEMI)}</td>
                            <td className="p-2.5 text-emerald-700">{formatINR(row.totalPrincipal)}</td>
                            <td className="p-2.5 text-amber-700">{formatINR(row.totalInterest)}</td>
                            <td className="p-2.5 text-slate-700">{formatINR(row.endingBalance)}</td>
                          </tr>
                        ))
                      : calcResult.schedule.map(row => (
                          <tr key={row.month} className={`hover:bg-slate-50 ${row.isMoratorium ? 'bg-amber-50/60' : ''}`}>
                            <td className="p-2.5 font-bold text-indigo-700">
                              M{row.month} {row.isMoratorium && <span className="text-[10px] text-amber-700 ml-1 font-sans font-bold">(Grace)</span>}
                            </td>
                            <td className="p-2.5 text-slate-900">{formatINR(row.emi)}</td>
                            <td className="p-2.5 text-emerald-700">{formatINR(row.principalPayment)}</td>
                            <td className="p-2.5 text-amber-700">{formatINR(row.interestPayment)}</td>
                            <td className="p-2.5 text-slate-700">{formatINR(row.endingBalance)}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <button
                onClick={() => setShowSchedule(true)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition text-center"
              >
                {isHindi ? 'पूरा चुकौती चार्ट देखने के लिए क्लिक करें' : 'Click to View Full Amortization Schedule'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
