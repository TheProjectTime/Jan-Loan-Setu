import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, AlertCircle, ArrowRight, Calculator, MapPin, 
  FileText, Building, Percent, Clock, DollarSign, 
  HelpCircle, UserCheck, ShieldAlert, Award, ExternalLink,
  ChevronDown, ChevronUp, Check, Sparkles, RotateCcw, Zap,
  Phone, Loader2, Compass
} from 'lucide-react';
import { UserFinancialProfile, LoanScheme, SchemeMatchResult, LoanPurpose, BeneficiaryCategory, PincodeLookupResult } from '../types';
import { formatINR, formatINRLakhCrore } from '../utils/calculator';
import { lookupPincode, lookupPincodeSync, getNearestPartnerForScheme } from '../utils/locator';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'high_match' | 'low_interest' | 'women'>('all');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [isDetectingPincode, setIsDetectingPincode] = useState(false);
  const [pincodeFeedback, setPincodeFeedback] = useState<PincodeLookupResult | null>(() => {
    return profile.pincode ? lookupPincodeSync(profile.pincode) : null;
  });

  const PURPOSE_OPTIONS: { id: LoanPurpose; labelEn: string; labelHi: string; icon: string }[] = [
    { id: 'small_shop', labelEn: 'Small Shop / Kirana', labelHi: 'किराना दुकान / छोटी दुकान', icon: '🏪' },
    { id: 'micro_business', labelEn: 'Boutique / Tailoring', labelHi: 'सिलाई / बुटीक / व्यवसाय', icon: '✂️' },
    { id: 'equipment_machinery', labelEn: 'Machinery / Equipment', labelHi: 'मशीनरी / आटा चक्की', icon: '⚙️' },
    { id: 'sanitation_vehicle', labelEn: 'Sanitation / Suction Vehicle', labelHi: 'सफाई वाहन / सक्शन मशीन', icon: '🚛' },
    { id: 'green_energy', labelEn: 'E-Rickshaw / Green Solar', labelHi: 'सौर ऊर्जा / ई-रिक्शा', icon: '☀️' },
    { id: 'handicraft_artisan', labelEn: 'Handicraft / Artisan Unit', labelHi: 'हस्तशिल्प / कारीगर', icon: '🧵' },
    { id: 'education_domestic', labelEn: 'Higher Education (India)', labelHi: 'उच्च शिक्षा (भारत)', icon: '🎓' },
    { id: 'education_abroad', labelEn: 'Higher Education (Abroad)', labelHi: 'विदेश में उच्च शिक्षा', icon: '✈️' },
    { id: 'agriculture_allied', labelEn: 'Dairy / Poultry / Agri', labelHi: 'डेयरी / पोल्ट्री / कृषि', icon: '🐄' }
  ];

  const CATEGORY_CHIPS: { id: BeneficiaryCategory; labelEn: string; labelHi: string; tag: string }[] = [
    { id: 'SC', labelEn: 'Scheduled Caste (SC)', labelHi: 'अनुसूचित जाति (SC)', tag: 'NSFDC' },
    { id: 'SafaiKaramchari', labelEn: 'Safai Karamchari / Sanitation', labelHi: 'सफाई कर्मचारी / स्वच्छता कर्मी', tag: 'NSKFDC' },
    { id: 'OBC', labelEn: 'Other Backward Class (OBC)', labelHi: 'अन्य पिछड़ा वर्ग (OBC)', tag: 'NBCFDC' },
    { id: 'ST', labelEn: 'Scheduled Tribe (ST)', labelHi: 'अनुसूचित जनजाति (ST)', tag: 'NSTFDC' },
    { id: 'Minority', labelEn: 'Minority Community', labelHi: 'अल्पसंख्यक समुदाय', tag: 'NMDFC' },
    { id: 'General', labelEn: 'General / EWS Category', labelHi: 'सामान्य / EWS श्रेणी', tag: 'MUDRA / Stand-Up' }
  ];

  const QUICK_COSTS = [50000, 100000, 200000, 500000, 1000000, 1500000, 2500000, 5000000];

  const TEST_PERSONAS = [
    {
      id: 'kirana-sc',
      label: isHindi ? 'गिरिडीह किराना दुकान (₹1 लाख)' : 'Giridih Small Shop (₹1 Lakh)',
      name: 'Sunil Kumar Paswan',
      beneficiary: isHindi ? 'सुनील पासवान • SC पुरुष' : 'Sunil Paswan • SC Male, 32',
      amount: '₹1,00,000',
      rate: '4.0% p.a.',
      tag: 'NSFDC Micro-Credit',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      profile: {
        name: 'Sunil Kumar Paswan',
        category: 'SC' as const,
        gender: 'female' as const, // will be male
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
      id: 'boutique-sc-woman',
      label: isHindi ? 'एससी महिला बुटीक (₹14 लाख)' : 'SC Woman Boutique (₹14 Lakh)',
      name: 'Sushila Devi',
      beneficiary: isHindi ? 'सुशीला देवी • SC महिला' : 'Sushila Devi • SC Female, 29',
      amount: '₹14,00,000',
      rate: '3.5% p.a.',
      tag: 'Mahila Samriddhi',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
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
      id: 'education-sc',
      label: isHindi ? 'बी.टेक शिक्षा ऋण (₹8 लाख)' : 'B.Tech Education Loan (₹8 Lakh)',
      name: 'Rohan Chaudhary',
      beneficiary: isHindi ? 'रोहन चौधरी • SC छात्र' : 'Rohan Chaudhary • SC Male, 20',
      amount: '₹8,00,000',
      rate: '3.5% p.a.',
      tag: 'NSFDC Education',
      tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
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
      id: 'sanitation-vehicle',
      label: isHindi ? 'सफाई मशीन वाहन (₹15 लाख)' : 'Sanitation Vehicle (₹15 Lakh)',
      name: 'Karan Valmiki',
      beneficiary: isHindi ? 'करन वाल्मीकि • सफाई कर्मचारी' : 'Karan Valmiki • Sanitation, 36',
      amount: '₹15,00,000',
      rate: '4.0% p.a.',
      tag: 'NSKFDC Swachhta',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
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
    },
    {
      id: 'obc-dairy',
      label: isHindi ? 'ओबीसी डेयरी फार्म (₹3 लाख)' : 'OBC Dairy Farming (₹3 Lakh)',
      name: 'Manoj Yadav',
      beneficiary: isHindi ? 'मनोज यादव • OBC पुरुष' : 'Manoj Yadav • OBC Male, 34',
      amount: '₹3,00,000',
      rate: '5.0% p.a.',
      tag: 'NBCFDC Micro',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
      profile: {
        name: 'Manoj Yadav',
        category: 'OBC' as const,
        gender: 'male' as const,
        age: 34,
        annualFamilyIncome: 220000,
        purpose: 'agriculture_allied' as const,
        businessIdea: 'Dairy Farming, Milk Chilling & Fodder Unit',
        projectCost: 300000,
        state: 'Bihar',
        district: 'Patna',
        pincode: '800001'
      }
    }
  ];

  const handleInputChange = (field: keyof UserFinancialProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePincodeChange = async (pinValue: string) => {
    const cleanPin = pinValue.replace(/\D/g, '').slice(0, 6);
    
    // Immediate sync update
    setProfile(prev => ({
      ...prev,
      pincode: cleanPin
    }));

    if (cleanPin.length === 6) {
      setIsDetectingPincode(true);
      // Fast sync check first
      const syncMatch = lookupPincodeSync(cleanPin);
      if (syncMatch) {
        setPincodeFeedback(syncMatch);
        setProfile(prev => ({
          ...prev,
          pincode: cleanPin,
          district: syncMatch.district,
          state: syncMatch.state,
          userCoords: {
            latitude: syncMatch.latitude,
            longitude: syncMatch.longitude
          }
        }));
      }

      // Try deeper async postal lookup
      try {
        const asyncMatch = await lookupPincode(cleanPin);
        if (asyncMatch) {
          setPincodeFeedback(asyncMatch);
          setProfile(prev => ({
            ...prev,
            pincode: cleanPin,
            district: asyncMatch.district,
            state: asyncMatch.state,
            userCoords: {
              latitude: asyncMatch.latitude,
              longitude: asyncMatch.longitude
            }
          }));
        }
      } catch (err) {
        console.error('Pincode detection error:', err);
      } finally {
        setIsDetectingPincode(false);
      }
    } else if (cleanPin.length >= 3) {
      const syncMatch = lookupPincodeSync(cleanPin);
      if (syncMatch) {
        setPincodeFeedback(syncMatch);
      }
    } else {
      setPincodeFeedback(null);
    }
  };

  // Find Nearest Authorized Partner for the Top Recommended Scheme
  const nearestPartnerForBestMatch = useMemo(() => {
    if (!bestMatch?.scheme) return null;
    return getNearestPartnerForScheme(bestMatch.scheme.id, {
      latitude: profile.userCoords?.latitude,
      longitude: profile.userCoords?.longitude,
      district: profile.district,
      state: profile.state,
      pincode: profile.pincode
    });
  }, [bestMatch, profile.userCoords, profile.district, profile.state, profile.pincode]);

  // Filter other schemes based on tab
  const filteredMatches = allMatches.filter(m => {
    if (m === bestMatch) return false;
    if (activeFilter === 'high_match') return m.matchScore >= 80;
    if (activeFilter === 'low_interest') return m.effectiveInterestRate <= 5;
    if (activeFilter === 'women') return m.scheme.womenConcessionPercent > 0 || m.scheme.code.includes('MAHILA');
    return true;
  });

  return (
    <div id="scheme-recommender-view" className="space-y-6">
      {/* Quick Test Personas Card - Centered in Scheme Recommender */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{isHindi ? 'त्वरित टेस्ट प्रोफाइल (Quick Test Personas)' : 'Quick Test Personas'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {isHindi ? '1-क्लिक टेस्ट' : '1-Click Auto-Fill'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi 
                  ? 'नीचे दिए गए किसी भी टेस्ट प्रोफाइल पर क्लिक करके तुरंत फॉर्म भरें और सरकारी योजना मैच देखें:' 
                  : 'Click any sample persona below to auto-fill applicant criteria and verify matching schemes:'}
              </p>
            </div>
          </div>
        </div>

        {/* Personas Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {TEST_PERSONAS.map((p) => {
            const isCurrentActive = profile.name === p.profile.name && profile.projectCost === p.profile.projectCost;
            return (
              <button
                key={p.id}
                type="button"
                id={`persona-btn-${p.id}`}
                onClick={() => {
                  setProfile({
                    ...p.profile,
                    gender: p.id === 'kirana-sc' ? 'male' : p.profile.gender
                  });
                }}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                  isCurrentActive
                    ? 'bg-indigo-50/90 border-indigo-600 shadow-sm ring-2 ring-indigo-600/20'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${p.tagColor}`}>
                      {p.tag}
                    </span>
                    {isCurrentActive && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {p.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {p.beneficiary}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-slate-800">{p.amount}</span>
                  <span className="font-semibold text-emerald-700">{p.rate}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form on Left, Dynamic Recommendations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs text-slate-900 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              {isHindi ? 'आवेदक व परियोजना विवरण' : 'Applicant & Project Details'}
            </h3>
            <button
              id="btn-reset-profile-form"
              type="button"
              onClick={() => {
                setProfile({
                  name: '',
                  category: 'SC',
                  gender: 'female',
                  age: 28,
                  annualFamilyIncome: 150000,
                  purpose: 'small_shop',
                  businessIdea: '',
                  projectCost: 100000,
                  state: 'Jharkhand',
                  district: '',
                  pincode: ''
                });
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg border border-slate-300 transition shadow-2xs cursor-pointer group"
              title={isHindi ? "फ़ॉर्म को डिफ़ॉल्ट मानों पर रीसेट करें" : "Reset form to default values"}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 transition-transform group-hover:-rotate-45" />
              <span>{isHindi ? 'फ़ॉर्म रीसेट करें' : 'Reset Form'}</span>
            </button>
          </div>

          {/* 1. Applicant Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'आवेदक का नाम' : 'Applicant Full Name'}
            </label>
            <input
              id="input-applicant-name"
              type="text"
              value={profile.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder={isHindi ? "उदा. रमेश कुमार / अनिता देवी" : "Enter applicant name (e.g. Ramesh Kumar / Anita Devi)"}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition placeholder:text-slate-400"
            />
          </div>

          {/* 2. Interactive Social Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'सामाजिक श्रेणी (Caste Category)' : 'Social Category (Apex Corporation)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_CHIPS.map(cat => {
                const isSelected = profile.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleInputChange('category', cat.id)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs ring-1 ring-indigo-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs leading-tight">
                        {isHindi ? cat.labelHi : cat.labelEn}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </div>
                    <span className={`text-[10px] mt-1 font-mono ${isSelected ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                      {cat.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Gender & Income */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isHindi ? 'लिंग (Gender)' : 'Gender (Concessions Apply)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('gender', 'female')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    profile.gender === 'female'
                      ? 'bg-pink-50 text-pink-700 border-pink-300 shadow-xs font-bold ring-1 ring-pink-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>👩</span>
                  <span>{isHindi ? 'महिला (-1% छूट)' : 'Female (-1%)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('gender', 'male')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    profile.gender === 'male'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs font-bold ring-1 ring-indigo-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>👨</span>
                  <span>{isHindi ? 'पुरुष' : 'Male'}</span>
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
                value={profile.annualFamilyIncome === 0 ? '' : profile.annualFamilyIncome}
                onChange={e => handleInputChange('annualFamilyIncome', e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder={isHindi ? "उदा. 150000" : "Enter annual income (e.g. 150000)"}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition placeholder:text-slate-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {profile.annualFamilyIncome <= 300000 ? (
                  <span className="text-emerald-700 font-semibold">✅ {isHindi ? '₹3 लाख से कम (रियायती ब्याज पात्र)' : 'Under ₹3 Lakh (Eligible for Subsidized Rates)'}</span>
                ) : (
                  <span className="text-amber-700 font-semibold">⚠️ {isHindi ? '₹3 लाख से अधिक (टर्म लोन/स्टैंड-अप)' : 'Over ₹3 Lakh (Term Loans apply)'}</span>
                )}
              </span>
            </div>
          </div>

          {/* 4. Purpose Selection Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'ऋण का उद्देश्य / गतिविधि चुनें' : 'Select Loan Purpose / Activity'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PURPOSE_OPTIONS.map(opt => {
                const isSelected = profile.purpose === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleInputChange('purpose', opt.id)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-[11px] leading-tight line-clamp-2">
                      {isHindi ? opt.labelHi : opt.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Business Idea / Course Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'व्यवसाय या गतिविधि का संक्षिप्त विवरण' : 'Specific Business Idea or Activity Description'}
            </label>
            <input
              id="input-business-idea"
              type="text"
              value={profile.businessIdea}
              onChange={e => handleInputChange('businessIdea', e.target.value)}
              placeholder={isHindi ? "उदा. किराना दुकान, सिलाई व बुटीक सेंटर, आटा चक्की, ई-रिक्शा..." : "e.g. Kirana grocery store, tailoring boutique, flour mill, e-rickshaw..."}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition placeholder:text-slate-400"
            />
          </div>

          {/* 6. Project Cost & Interactive Presets */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                {isHindi ? 'आवश्यक ऋण / प्रोजेक्ट लागत' : 'Required Loan / Project Cost'}
              </label>
              <span className="text-sm font-black text-indigo-900 font-mono">
                {formatINR(profile.projectCost)}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="20000"
              max="5000000"
              step="10000"
              value={profile.projectCost}
              onChange={e => handleInputChange('projectCost', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            {/* Quick Cost Chips */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_COSTS.map(cost => (
                <button
                  key={cost}
                  type="button"
                  onClick={() => handleInputChange('projectCost', cost)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                    profile.projectCost === cost
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {formatINRLakhCrore(cost)}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Location (PIN Code with Auto-Detection & State/District) */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isHindi ? 'पिन कोड (PIN Code - स्वतः शहर/जिला पहचान)' : 'Postal PIN Code (Auto-Detects City & District)'}</span>
                </label>
                {isDetectingPincode && (
                  <span className="text-[11px] text-indigo-600 font-semibold animate-pulse flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {isHindi ? 'शहर पहचान रहे हैं...' : 'Detecting...'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="input-pincode"
                  type="text"
                  maxLength={6}
                  value={profile.pincode}
                  onChange={e => handlePincodeChange(e.target.value)}
                  placeholder={isHindi ? "6-अंक पिन कोड दर्ज करें (उदा. 815301, 834001, 800001, 226001)" : "Enter 6-digit PIN code (e.g. 815301, 834001, 800001, 226001)"}
                  className="w-full bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none transition shadow-2xs placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Quick PIN Code Test Chips */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-500 font-medium shrink-0">{isHindi ? 'त्वरित पिन:' : 'Quick PINs:'}</span>
                {[
                  { pin: '815301', label: 'Giridih' },
                  { pin: '834001', label: 'Ranchi' },
                  { pin: '800001', label: 'Patna' },
                  { pin: '226001', label: 'Lucknow' },
                  { pin: '110001', label: 'Delhi' },
                  { pin: '411001', label: 'Pune' }
                ].map((item) => (
                  <button
                    key={item.pin}
                    type="button"
                    onClick={() => handlePincodeChange(item.pin)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 text-slate-700 font-mono text-[10px] font-semibold transition shrink-0 cursor-pointer"
                  >
                    {item.pin} ({item.label})
                  </button>
                ))}
              </div>

              {/* Real-Time Auto-Detected Location Banner */}
              {profile.pincode && profile.pincode.length >= 3 && (
                <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 text-xs flex items-center justify-between gap-2 shadow-2xs animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                        {isHindi ? '📍 स्वतः पहचाना गया शहर / जिला:' : '📍 Auto-Detected City & District:'}
                      </span>
                      <span className="font-black text-slate-900 text-sm">
                        {profile.district || pincodeFeedback?.district || 'Recognized District'}
                        {profile.state || pincodeFeedback?.state ? `, ${profile.state || pincodeFeedback?.state}` : ''}
                      </span>
                      {pincodeFeedback?.postOfficeName && (
                        <span className="text-[10px] text-slate-600 block mt-0.5">
                          Post Office: {pincodeFeedback.postOfficeName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-emerald-300 text-emerald-800 font-bold block shadow-2xs">
                      PIN {profile.pincode}
                    </span>
                    <span className="text-[9px] text-emerald-700 font-semibold block mt-0.5">
                      Auto-matched
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'पहचाना गया राज्य (State)' : 'Detected State'}
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
                  <option value="Gujarat">Gujarat (गुजरात)</option>
                  <option value="Odisha">Odisha (ओडिशा)</option>
                  <option value="Punjab">Punjab (पंजाब)</option>
                  <option value="Karnataka">Karnataka (कर्नाटक)</option>
                  <option value="Telangana">Telangana (तेलंगाना)</option>
                  <option value="Tamil Nadu">Tamil Nadu (तमिलनाडु)</option>
                  <option value="Kerala">Kerala (केरल)</option>
                  <option value="Assam">Assam (असम)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'पहचाना गया जिला (District)' : 'Detected District / City'}
                </label>
                <input
                  id="input-district"
                  type="text"
                  value={profile.district}
                  onChange={e => handleInputChange('district', e.target.value)}
                  placeholder={isHindi ? "उदा. रांची, पटना, गिरिडीह, लखनऊ..." : "Enter district (e.g. Ranchi, Patna...)"}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 placeholder:text-slate-400 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Match Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Best Match Hero Card */}
          {bestMatch ? (
            <div id="best-scheme-match-card" className="bg-white border-2 border-emerald-600 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden text-slate-900">
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
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

              {/* NEAREST AUTHORIZED FINANCIAL INSTITUTION / CHANNEL PARTNER CARD */}
              {nearestPartnerForBestMatch && (
                <div id="nearest-institution-recommendation-card" className="bg-linear-to-br from-indigo-50/90 via-blue-50/70 to-slate-50 rounded-xl p-4 border border-indigo-200 mb-4 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-700 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                        <Building className="w-3 h-3" />
                        {isHindi ? 'इस योजना हेतु निकटतम अधिकृत संस्थान' : 'Nearest Authorized Institution for this Scheme'}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-950 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {nearestPartnerForBestMatch.partner.typeLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full font-extrabold text-xs font-mono border border-emerald-300 self-start sm:self-auto shadow-2xs">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{nearestPartnerForBestMatch.distanceKm} km {isHindi ? 'दूरी' : 'away'}</span>
                      {nearestPartnerForBestMatch.isDistrictMatch && (
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-sans ml-1">
                          {isHindi ? 'समान जिला' : 'Same District'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900">
                        {nearestPartnerForBestMatch.partner.name}
                      </h4>
                      <p className="text-xs font-bold text-indigo-900">
                        🏛️ {nearestPartnerForBestMatch.partner.branchName}
                      </p>
                      <p className="text-[11px] text-slate-600 flex items-start gap-1 leading-snug">
                        <span>📍</span>
                        <span>{nearestPartnerForBestMatch.partner.address}</span>
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0 space-y-1.5 bg-white/80 p-2.5 rounded-lg border border-indigo-100">
                      <div className="text-[11px]">
                        <span className="font-extrabold text-slate-900 block">{nearestPartnerForBestMatch.partner.contactPerson}</span>
                        <span className="text-[10px] text-indigo-700 font-semibold block">{nearestPartnerForBestMatch.partner.designation}</span>
                      </div>
                      <a
                        href={`tel:${nearestPartnerForBestMatch.partner.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300 transition shadow-2xs"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{nearestPartnerForBestMatch.partner.phone}</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-100 text-[11px]">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{isHindi ? 'समय:' : 'Hours:'} {nearestPartnerForBestMatch.partner.workingHours}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigateToLocator(bestMatch.scheme)}
                      className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer group"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-45 transition-transform" />
                      <span className="underline">{isHindi ? 'शाखा का इंटरैक्टिव गूगल मैप व रूट देखें' : 'View on Interactive Map & Route'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Match Reasoning & Highlights */}
              <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200 mb-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
                <button
                  id="btn-calculate-scheme-emi"
                  onClick={() => onNavigateToCalculator(bestMatch.scheme)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{isHindi ? 'ईएमआई व किस्त गणना' : 'Calculate Exact EMI'}</span>
                </button>

                <button
                  id="btn-locate-scheme-partner"
                  onClick={() => onNavigateToLocator(bestMatch.scheme)}
                  className="w-full py-2.5 px-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isHindi 
                      ? (profile.district ? `निकटतम बैंक (${profile.district})` : 'निकटतम बैंक खोजें') 
                      : (profile.district ? `Find Bank (${profile.district})` : 'Find Nearest Partner Bank')}
                  </span>
                </button>

                <button
                  id="btn-generate-slip"
                  onClick={() => onOpenSlipModal(bestMatch.scheme)}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
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

          {/* Other Matching Schemes List with Interactive Filter Tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs text-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                {isHindi ? 'अन्य प्रासंगिक सरकारी ऋण योजनाएं' : 'Other Relevant Government Schemes'}
              </h3>

              {/* Interactive Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'सभी' : 'All'}
                </button>
                <button
                  onClick={() => setActiveFilter('high_match')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeFilter === 'high_match'
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? '80%+ मैच' : '80%+ Match'}
                </button>
                <button
                  onClick={() => setActiveFilter('low_interest')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeFilter === 'low_interest'
                      ? 'bg-white text-indigo-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'कम ब्याज (≤5%)' : '≤5% Rate'}
                </button>
                <button
                  onClick={() => setActiveFilter('women')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeFilter === 'women'
                      ? 'bg-white text-pink-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'महिला विशेष' : 'Women Special'}
                </button>
              </div>
            </div>

            {/* Scheme Cards */}
            <div className="space-y-3">
              {filteredMatches.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  {isHindi ? 'इस फ़िल्टर में कोई अन्य योजना नहीं मिली।' : 'No other schemes match this specific filter.'}
                </div>
              ) : (
                filteredMatches.slice(0, 6).map((m) => {
                  const isExpanded = expandedSchemeId === m.scheme.id;
                  const schemeNearestPartner = getNearestPartnerForScheme(m.scheme.id, {
                    latitude: profile.userCoords?.latitude,
                    longitude: profile.userCoords?.longitude,
                    district: profile.district,
                    state: profile.state,
                    pincode: profile.pincode
                  });

                  return (
                    <div
                      key={m.scheme.id}
                      id={`scheme-card-${m.scheme.id}`}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5 max-w-md">
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
                          <p className="text-[11px] text-slate-600">
                            {m.scheme.suitableForSummary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigateToCalculator(m.scheme)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                          >
                            {isHindi ? 'ईएमआई' : 'Calc EMI'}
                          </button>
                          <button
                            onClick={() => onNavigateToLocator(m.scheme)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{isHindi ? 'निकटतम बैंक' : 'Locate'}</span>
                          </button>
                          <button
                            onClick={() => setExpandedSchemeId(isExpanded ? null : m.scheme.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                            aria-label="Toggle details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Quick Meta Row & Nearest Institution Pill */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-white p-2 rounded-lg border border-slate-200/80">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
                          <span>Rate: <strong className="text-emerald-700">{m.effectiveInterestRate}%</strong></span>
                          <span>Max: <strong className="text-slate-900">{formatINRLakhCrore(m.scheme.maxLoanAmount)}</strong></span>
                          <span>Margin: <strong className="text-amber-700">{m.scheme.promoterContributionPercent}%</strong></span>
                        </div>

                        {schemeNearestPartner && (
                          <div className="text-[11px] font-sans flex items-center gap-1 text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-medium">
                            <Building className="w-3 h-3 text-indigo-600 shrink-0" />
                            <span className="truncate max-w-[180px] sm:max-w-[240px] font-bold">
                              {schemeNearestPartner.partner.name}
                            </span>
                            <span className="text-emerald-700 font-bold font-mono">
                              ({schemeNearestPartner.distanceKm} km)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expandable Scheme Details */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-slate-200 space-y-2 text-xs text-slate-600 bg-white p-3 rounded-lg">
                          <p className="leading-relaxed">{m.scheme.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Eligible Channels:</span>
                              <span className="text-[11px] text-slate-600">{m.scheme.channelPartnerTypes.join(', ')}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Key Documents:</span>
                              <span className="text-[11px] text-slate-600">{m.scheme.requiredDocuments.slice(0, 3).join(', ')}</span>
                            </div>
                          </div>
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => onOpenSlipModal(m.scheme)}
                              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'इस योजना की पर्ची बनाएं' : 'Generate Pre-Application Slip'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
