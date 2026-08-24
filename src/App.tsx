import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ChannelSystemExplainer } from './components/ChannelSystemExplainer';
import { SchemeRecommender } from './components/SchemeRecommender';
import { FinancialCalculator } from './components/FinancialCalculator';
import { PartnerLocator } from './components/PartnerLocator';
import { AiAssistant } from './components/AiAssistant';
import { ApplicationSlipModal } from './components/ApplicationSlipModal';
import { UserFinancialProfile, LoanScheme, ChannelPartner } from './types';
import { GOVERNMENT_SCHEMES } from './data/schemes';
import { CHANNEL_PARTNERS } from './data/partners';
import { recommendSchemes } from './utils/recommender';
import { ShieldCheck, Phone, ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [isHindi, setIsHindi] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'recommender' | 'calculator' | 'locator' | 'ai-advisor'>('recommender');

  // Core User Profile State (Default set to Giridih Small Shop example from prompt)
  const [profile, setProfile] = useState<UserFinancialProfile>({
    name: 'Sunil Kumar Paswan',
    category: 'SC',
    gender: 'male',
    age: 32,
    annualFamilyIncome: 180000,
    purpose: 'small_shop',
    businessIdea: 'Small Grocery & General Store in Pachamba Market',
    projectCost: 100000,
    state: 'Jharkhand',
    district: 'Giridih',
    pincode: '815301'
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
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isHindi={isHindi}
        setIsHindi={setIsHindi}
        onApplyPreset={handleApplyPreset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Channel Finance Explainer */}
        <ChannelSystemExplainer isHindi={isHindi} />

        {/* Tab Content */}
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
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-slate-400 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isHindi 
                ? 'जन ऋण सेतु • सामाजिक न्याय एवं अधिकारिता मंत्रालय समर्पित नागरिक सहायता पोर्टल'
                : 'Jan Loan Setu • Dedicated Citizen Advisory for Concessional Government Schemes'}
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-300">
            <div className="flex items-center gap-1.5 font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>NSFDC Helpline: 1800-11-0505</span>
            </div>
            <a 
              href="https://nsfdc.nic.in" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 transition"
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
