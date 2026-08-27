import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SchemeRecommender } from './components/SchemeRecommender';
import { FinancialCalculator } from './components/FinancialCalculator';
import { PartnerLocator } from './components/PartnerLocator';
import { AiAssistant } from './components/AiAssistant';
import { ApplicationSlipModal } from './components/ApplicationSlipModal';
import { UserFinancialProfile, LoanScheme, ChannelPartner } from './types';
import { GOVERNMENT_SCHEMES } from './data/schemes';
import { CHANNEL_PARTNERS } from './data/partners';
import { recommendSchemes } from './utils/recommender';
import { JanLoanSetuLogo } from './components/JanLoanSetuLogo';
import { ShieldCheck, Phone, ExternalLink } from 'lucide-react';

export default function App() {
  const [isHindi, setIsHindi] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recommender' | 'calculator' | 'locator' | 'ai-advisor'>('dashboard');

  // Core User Profile State (Clean Initial State with placeholders)
  const [profile, setProfile] = useState<UserFinancialProfile>({
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

  // Calculate live scheme recommendations
  const { bestMatch, allMatches } = useMemo(() => {
    return recommendSchemes(profile);
  }, [profile]);

  // Selected Scheme for Calculator / Locator / Slip
  const [selectedScheme, setSelectedScheme] = useState<LoanScheme>(
    bestMatch?.scheme || GOVERNMENT_SCHEMES[0]
  );

  // Selected Partner for Slip
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(CHANNEL_PARTNERS[0]);

  // Modal State
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);

  // Quick Preset Applicator
  const handleApplyPreset = (preset: Partial<UserFinancialProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...preset
    }));
    setActiveTab('recommender');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigations
  const handleNavigateToCalculator = (scheme: LoanScheme) => {
    setSelectedScheme(scheme);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToLocator = (scheme: LoanScheme) => {
    setSelectedScheme(scheme);
    setActiveTab('locator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSlipModal = (scheme: LoanScheme) => {
    setSelectedScheme(scheme);
    setIsSlipModalOpen(true);
  };

  const handleOpenSlipModalWithPartner = (scheme: LoanScheme, partner: ChannelPartner) => {
    setSelectedScheme(scheme);
    setSelectedPartner(partner);
    setIsSlipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Header with Hamburger Menu */}
      <Header
        isHindi={isHindi}
        setIsHindi={setIsHindi}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <main className="w-full min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              onStartRecommendation={() => {
                setActiveTab('recommender');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isHindi={isHindi}
            />
          )}

          {activeTab === 'recommender' && (
            <SchemeRecommender
              profile={profile}
              setProfile={setProfile}
              bestMatch={bestMatch}
              allMatches={allMatches}
              onSelectScheme={setSelectedScheme}
              onNavigateToCalculator={handleNavigateToCalculator}
              onNavigateToLocator={handleNavigateToLocator}
              onOpenSlipModal={handleOpenSlipModal}
              isHindi={isHindi}
            />
          )}

          {activeTab === 'calculator' && (
            <FinancialCalculator
              selectedScheme={selectedScheme}
              allSchemes={GOVERNMENT_SCHEMES}
              onSelectScheme={setSelectedScheme}
              profile={profile}
              onNavigateToLocator={handleNavigateToLocator}
              onOpenSlipModal={handleOpenSlipModal}
              isHindi={isHindi}
            />
          )}

          {activeTab === 'locator' && (
            <PartnerLocator
              selectedScheme={selectedScheme}
              allSchemes={GOVERNMENT_SCHEMES}
              onSelectScheme={setSelectedScheme}
              profile={profile}
              onOpenSlipModalWithPartner={handleOpenSlipModalWithPartner}
              isHindi={isHindi}
            />
          )}

          {activeTab === 'ai-advisor' && (
            <AiAssistant
              profile={profile}
              selectedScheme={selectedScheme}
              isHindi={isHindi}
            />
          )}
        </main>
      </div>

      {/* Printable Pre-Application Slip Modal */}
      <ApplicationSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        scheme={selectedScheme}
        partner={selectedPartner}
        profile={profile}
        isHindi={isHindi}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <JanLoanSetuLogo
              size="sm"
              variant="icon"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">
                  <span className="text-[#0a3370]">Jan Loan </span>
                  <span className="text-[#16a34a]">Setu</span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[11px] text-slate-500">
                  {isHindi ? 'अवसरों से आपका जुड़ाव' : 'Connecting You To Opportunities'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isHindi 
                  ? 'सरकारी ऋण योजनाएं • विश्वसनीय पार्टनर • सामाजिक न्याय एवं अधिकारिता मंत्रालय'
                  : 'Sarkari Loan Schemes • Trusted Partners • Dedicated Citizen Advisory'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-600 text-xs">
            <div className="flex items-center gap-1.5 font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>NSFDC Helpline: 1800-11-0505</span>
            </div>
            <a 
              href="https://nsfdc.nic.in" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-900 flex items-center gap-1 transition"
            >
              <span>NSFDC Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
