import React from 'react';
import { 
  CheckCircle2, AlertCircle, ArrowRight, Calculator, MapPin, 
  FileText, Sparkles, Building, Percent, Clock, DollarSign, 
  HelpCircle, UserCheck, ShieldAlert, Award, ExternalLink
} from 'lucide-react';
import { UserFinancialProfile, LoanScheme, SchemeMatchResult, LoanPurpose, BeneficiaryCategory } from '../types';
import { formatINR, formatINRLakhCrore } from '../utils/calculator';

interface SchemeRecommenderProps {
  profile: UserFinancialProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserFinancialProfile>>;
  bestMatch: SchemeMatchResult | null;
  allMatches: SchemeMatchResult[];
  onSelectScheme: (scheme: LoanScheme) => void;
  onNavigateToCalculator: (scheme: LoanScheme) => void;
  onNavigateToLocator: (scheme: LoanScheme) => void;
  onOpenSlipModal: (scheme: LoanScheme) => void;
  isHindi: boolean;
}

export const SchemeRecommender: React.FC<SchemeRecommenderProps> = ({
  profile,
  setProfile,
  bestMatch,
  allMatches,
  onSelectScheme,
  onNavigateToCalculator,
  onNavigateToLocator,
  onOpenSlipModal,
  isHindi
}) => {
  const PURPOSE_OPTIONS: { id: LoanPurpose; labelEn: string; labelHi: string; icon: string }[] = [
    { id: 'small_shop', labelEn: 'Small Shop / Kirana / Vendor', labelHi: 'किराना दुकान / छोटी दुकान / विक्रेता', icon: '🏪' },
    { id: 'micro_business', labelEn: 'Micro Business / Tailoring / Boutique', labelHi: 'सिलाई / बुटीक / सूक्ष्म व्यवसाय', icon: '✂️' },
    { id: 'equipment_machinery', labelEn: 'Machinery / Industrial Equipment', labelHi: 'मशीनरी / उपकरण / आटा चक्की', icon: '⚙️' },
    { id: 'education_domestic', labelEn: 'Higher Education in India (B.Tech, MBBS, etc.)', labelHi: 'भारत में उच्च शिक्षा (बी.टेक, एमबीबीएस)', icon: '🎓' },
    { id: 'education_abroad', labelEn: 'Higher Education Abroad (MS, PhD)', labelHi: 'विदेश में उच्च शिक्षा (एमएस, पीएचडी)', icon: '✈️' },
    { id: 'sanitation_vehicle', labelEn: 'Sanitation / Suction Vehicle Unit', labelHi: 'सफाई वाहन / सक्शन मशीन यूनिट', icon: '🚛' },
    { id: 'green_energy', labelEn: 'Green Energy / E-Rickshaw / Solar', labelHi: 'सौर ऊर्जा / ई-रिक्शा / हरित उद्यम', icon: '☀️' },
    { id: 'handicraft_artisan', labelEn: 'Handicraft / Weaver / Artisan Unit', labelHi: 'हस्तशिल्प / बुनकर / कारीगर', icon: '🧵' },
    { id: 'agriculture_allied', labelEn: 'Dairy / Poultry / Agri-Allied', labelHi: 'डेयरी / पोल्ट्री / कृषि संबद्ध', icon: '🐄' }
  ];

  const QUICK_COSTS = [50000, 100000, 140000, 300000, 500000, 1000000, 1500000, 2500000, 5000000];

  const handleInputChange = (field: keyof UserFinancialProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div id="scheme-recommender-view" className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {isHindi ? 'स्मार्ट योजना खोजक' : 'AI-Powered Government Loan Matcher'}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {isHindi 
                ? 'अपनी आवश्यकता दर्ज करें, सर्वोत्तम सरकारी ऋण योजना पाएं' 
                : 'Enter Your Profile to Discover Eligible Government Loan Schemes'}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              {isHindi
                ? 'NSFDC, NBCFDC, NSKFDC और मुद्रा नियमों के आधार पर आपकी जाति श्रेणी, आय, व्यवसाय और स्थान के लिए सबसे सही योजना।'
                : 'Scored dynamically against official Ministry rules for SC/OBC/Safai Karamchari/Women beneficiaries.'}
            </p>
          </div>
          {bestMatch && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-right">
              <span className="text-xs text-emerald-800 font-semibold">{isHindi ? 'शीर्ष अनुशंसित योजना' : 'Top Recommendation'}</span>
              <p className="text-sm font-bold text-slate-900 truncate max-w-xs">{bestMatch.scheme.title}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-xs text-slate-600 font-medium">{bestMatch.effectiveInterestRate}% {isHindi ? 'ब्याज' : 'Interest'}</span>
                <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-full">{bestMatch.matchScore}% Match</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Form on Left, Dynamic Recommendations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              {isHindi ? 'आवेदक व परियोजना विवरण' : 'Applicant & Project Details'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">{isHindi ? 'सभी क्षेत्र अनिवार्य' : 'Instant live scoring'}</span>
          </div>

          {/* 1. Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'आवेदक का नाम' : 'Applicant Full Name'}
              </label>
              <input
                id="input-applicant-name"
                type="text"
                value={profile.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="e.g. Sunil Kumar Paswan"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'सामाजिक श्रेणी (Caste Category)' : 'Social Category'}
              </label>
              <select
                id="select-category"
                value={profile.category}
                onChange={e => handleInputChange('category', e.target.value as BeneficiaryCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              >
                <option value="SC">Scheduled Caste (SC / अनुसूचित जाति)</option>
                <option value="SafaiKaramchari">Safai Karamchari / Sanitation Worker</option>
                <option value="OBC">Other Backward Class (OBC / अन्य पिछड़ा वर्ग)</option>
                <option value="ST">Scheduled Tribe (ST / अनुसूचित जनजाति)</option>
                <option value="Minority">Minority Community (अल्पसंख्यक)</option>
                <option value="General">General Category (सामान्य)</option>
              </select>
            </div>
          </div>

          {/* 2. Gender & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'लिंग (Gender)' : 'Gender (Concessions Apply)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('gender', 'female')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    profile.gender === 'female'
                      ? 'bg-pink-50 text-pink-700 border-pink-300 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  👩 {isHindi ? 'महिला (1% छूट)' : 'Female (-1% Concession)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('gender', 'male')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    profile.gender === 'male'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  👨 {isHindi ? 'पुरुष' : 'Male'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'वार्षिक पारिवारिक आय (₹)' : 'Annual Family Income (₹)'}
              </label>
              <input
                id="input-family-income"
                type="number"
                step="10000"
                min="0"
                value={profile.annualFamilyIncome}
                onChange={e => handleInputChange('annualFamilyIncome', Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {profile.annualFamilyIncome <= 300000 ? (
                  <span className="text-emerald-700 font-semibold">✅ {isHindi ? '₹3 लाख से कम (पूर्ण रियायत हेतु पात्र)' : 'Under ₹3 Lakh (Fully Eligible for Subsidized Rates)'}</span>
                ) : (
                  <span className="text-amber-700 font-semibold">⚠️ {isHindi ? '₹3 लाख से अधिक (टर्म लोन / स्टैंड-अप योजनाएं लागू)' : 'Over ₹3 Lakh (Term Loans & Stand-Up apply)'}</span>
                )}
              </span>
            </div>
          </div>

          {/* 3. Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'ऋण का उद्देश्य / गतिविधि' : 'Loan Purpose / Activity'}
            </label>
            <select
              id="select-loan-purpose"
              value={profile.purpose}
              onChange={e => handleInputChange('purpose', e.target.value as LoanPurpose)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
            >
              {PURPOSE_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.icon} {isHindi ? opt.labelHi : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Business Idea / Course details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'व्यवसाय या पाठ्यक्रम का संक्षिप्त विवरण' : 'Specific Business Idea or Course Description'}
            </label>
            <input
              id="input-business-idea"
              type="text"
              value={profile.businessIdea}
              onChange={e => handleInputChange('businessIdea', e.target.value)}
              placeholder="e.g. Small general store, tailoring unit, flour mill machinery..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
            />
          </div>

          {/* 5. Project Cost */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {isHindi ? 'कुल परियोजना लागत / आवश्यक ऋण' : 'Total Project Cost / Required Loan'}
              </label>
              <span className="text-sm font-bold text-emerald-700 font-mono">
                {formatINR(profile.projectCost)} ({formatINRLakhCrore(profile.projectCost)})
              </span>
            </div>
            <input
              id="range-project-cost"
              type="range"
              min="20000"
              max="5000000"
              step="10000"
              value={profile.projectCost}
              onChange={e => handleInputChange('projectCost', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {QUICK_COSTS.map(cost => (
                <button
                  key={cost}
                  type="button"
                  onClick={() => handleInputChange('projectCost', cost)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium border transition ${
                    profile.projectCost === cost
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {cost >= 100000 ? `₹${cost / 100000}L` : `₹${cost / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Location (State & District) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'राज्य (State)' : 'State'}
              </label>
              <select
                id="select-state"
                value={profile.state}
                onChange={e => handleInputChange('state', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              >
                <option value="Jharkhand">Jharkhand (झारखण्ड)</option>
                <option value="Bihar">Bihar (बिहार)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
                <option value="Delhi">Delhi NCR (दिल्ली)</option>
                <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                <option value="Rajasthan">Rajasthan (राजस्थान)</option>
                <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                <option value="West Bengal">West Bengal (पश्चिम बंगाल)</option>
                <option value="Karnataka">Karnataka (कर्नाटक)</option>
                <option value="Telangana">Telangana (तेलंगाना)</option>
                <option value="Tamil Nadu">Tamil Nadu (तमिलनाडु)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'जिला / शहर (District)' : 'District / City'}
              </label>
              <input
                id="input-district"
                type="text"
                value={profile.district}
                onChange={e => handleInputChange('district', e.target.value)}
                placeholder="e.g. Giridih, Ranchi, Patna..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Match Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Best Match Hero Card */}
          {bestMatch ? (
            <div id="best-scheme-match-card" className="bg-white border-2 border-emerald-600 rounded-2xl p-6 shadow-xs relative overflow-hidden text-slate-900">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Award className="w-3.5 h-3.5" />
                    {isHindi ? 'सर्वश्रेष्ठ अनुशंसित योजना' : 'Top Recommended Scheme'}
                  </span>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    {bestMatch.scheme.code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-medium">{isHindi ? 'मैच स्कोर:' : 'Match Score:'}</span>
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {bestMatch.matchScore}%
                  </span>
                </div>
              </div>

              {/* Title & Corporation */}
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isHindi ? bestMatch.scheme.hindiTitle : bestMatch.scheme.title}
              </h3>
              <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                🏢 {bestMatch.scheme.corporation}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {bestMatch.scheme.description}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {isHindi ? 'ब्याज दर' : 'Interest Rate'}
                  </span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    {bestMatch.effectiveInterestRate}% p.a.
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {profile.gender === 'female' ? (isHindi ? 'महिला रियायत सहित' : 'Women discount') : (isHindi ? 'रियायती दर' : 'Concessional')}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {isHindi ? 'अधिकतम ऋण सीमा' : 'Max Loan Limit'}
                  </span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {formatINRLakhCrore(bestMatch.scheme.maxLoanAmount)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {isHindi ? 'पात्रता अनुसार' : 'Up to scheme cap'}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {isHindi ? 'मार्जिन (प्रमोटर शेयर)' : 'Promoter Margin'}
                  </span>
                  <span className="text-base font-black text-amber-700 font-mono">
                    {bestMatch.scheme.promoterContributionPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {formatINR(bestMatch.promoterContribution)}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {isHindi ? 'सरकारी सब्सिडी' : 'Est. Subsidy'}
                  </span>
                  <span className="text-base font-black text-teal-700 font-mono">
                    {bestMatch.estimatedSubsidy > 0 ? formatINR(bestMatch.estimatedSubsidy) : 'N/A'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {bestMatch.scheme.subsidyPercent > 0 ? `${bestMatch.scheme.subsidyPercent}% capital` : 'Low interest'}
                  </span>
                </div>
              </div>

              {/* Match Reasoning & Highlights */}
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 mb-5">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {isHindi ? 'यह योजना आपके लिए क्यों उपयुक्त है?' : 'Why This Scheme Matches Your Profile:'}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {bestMatch.reasoning.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <button
                  id="btn-calculate-scheme-emi"
                  onClick={() => onNavigateToCalculator(bestMatch.scheme)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{isHindi ? 'ईएमआई व किस्त गणना' : 'Calculate Exact EMI'}</span>
                </button>

                <button
                  id="btn-locate-scheme-partner"
                  onClick={() => onNavigateToLocator(bestMatch.scheme)}
                  className="w-full py-2.5 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{isHindi ? `निकटतम बैंक (${profile.district})` : `Find Bank (${profile.district})`}</span>
                </button>

                <button
                  id="btn-generate-slip"
                  onClick={() => onOpenSlipModal(bestMatch.scheme)}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-indigo-700" />
                  <span>{isHindi ? 'आवेदन पर्ची डाउनलोड' : 'Get Pre-Application Slip'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-xs">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p>{isHindi ? 'कृपया अपनी जानकारी दर्ज करें।' : 'Please enter your profile to view recommendations.'}</p>
            </div>
          )}

          {/* Other Matching Schemes List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                {isHindi ? 'अन्य प्रासंगिक सरकारी ऋण योजनाएं' : 'Other Relevant Government Schemes'}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {allMatches.filter(m => m !== bestMatch).length} {isHindi ? 'योजनाएं उपलब्ध' : 'schemes evaluated'}
              </span>
            </div>

            <div className="space-y-3">
              {allMatches
                .filter(m => m !== bestMatch)
                .slice(0, 4)
                .map((m, idx) => (
                  <div
                    key={m.scheme.id}
                    id={`scheme-card-${m.scheme.id}`}
                    className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {isHindi ? m.scheme.hindiTitle : m.scheme.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {m.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        {m.scheme.suitableForSummary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-700 font-mono">
                        <span>Rate: <strong className="text-emerald-700">{m.effectiveInterestRate}%</strong></span>
                        <span>Max: <strong className="text-slate-900">{formatINRLakhCrore(m.scheme.maxLoanAmount)}</strong></span>
                        <span>Margin: <strong className="text-amber-700">{m.scheme.promoterContributionPercent}%</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToCalculator(m.scheme)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition"
                      >
                        {isHindi ? 'ईएमआई' : 'Calc EMI'}
                      </button>
                      <button
                        onClick={() => onNavigateToLocator(m.scheme)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{isHindi ? 'बैंक' : 'Bank'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
