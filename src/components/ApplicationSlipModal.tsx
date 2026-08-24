import React, { useState } from 'react';
import { 
  X, Printer, Download, CheckCircle2, ShieldCheck, 
  Landmark, User, FileText, Sparkles, Building, Calendar, Phone 
} from 'lucide-react';
import { LoanScheme, ChannelPartner, UserFinancialProfile, CalculationResult } from '../types';
import { formatINR, formatINRLakhCrore, calculateLoanFinancials } from '../utils/calculator';

interface ApplicationSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: LoanScheme;
  partner?: ChannelPartner | null;
  profile: UserFinancialProfile;
  isHindi: boolean;
}

export const ApplicationSlipModal: React.FC<ApplicationSlipModalProps> = ({
  isOpen,
  onClose,
  scheme,
  partner,
  profile,
  isHindi
}) => {
  if (!isOpen) return null;

  const [refNumber] = useState<string>(
    `JLS-${profile.state?.slice(0, 2).toUpperCase() || 'IN'}-${profile.district?.slice(0, 3).toUpperCase() || 'DST'}-${Math.floor(100000 + Math.random() * 900000)}`
  );

  const interestRate = profile.gender === 'female' ? scheme.interestRateFemale : scheme.interestRateMale;
  const projectCost = profile.projectCost || scheme.maxLoanAmount || 100000;
  
  const financials: CalculationResult = calculateLoanFinancials({
    projectCost,
    promoterPercentage: scheme.promoterContributionPercent,
    subsidyPercentage: scheme.subsidyPercent,
    maxSubsidyCap: scheme.maxSubsidyAmount,
    annualInterestRate: interestRate,
    tenureYears: Math.min(3, scheme.maxTenureYears),
    moratoriumMonths: scheme.moratoriumMonths
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 text-slate-900 relative">
        {/* Modal Controls Bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHindi ? 'जन ऋण सेतु • आधिकारिक पूर्व-आवेदन पर्ची' : 'Jan Loan Setu • Pre-Application Eligibility Token'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHindi ? 'प्रिंट / पीडीएफ सेव करें' : 'Print / Save PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Slip Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white" id="printable-slip">
          {/* Slip Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-900 text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-xs">
                ऋ
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  Jan Loan Setu (जन ऋण सेतु)
                </h1>
                <p className="text-xs text-slate-600 font-semibold">
                  National Government Concessional Loan Scheme & Channel Partner Application Token
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Token Ref Number</span>
              <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 inline-block">
                {refNumber}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Section 1: Beneficiary Profile & Target Scheme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                1. Applicant Profile (लाभार्थी विवरण)
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                <p><strong>Name:</strong> {profile.name || 'Beneficiary Applicant'}</p>
                <p><strong>Category:</strong> {profile.category} • <strong>Gender:</strong> {profile.gender.toUpperCase()}</p>
                <p><strong>Annual Family Income:</strong> {formatINR(profile.annualFamilyIncome)}/year</p>
                <p><strong>Location:</strong> {profile.district}, {profile.state} (Pincode: {profile.pincode || '815301'})</p>
                <p><strong>Project Activity:</strong> {profile.businessIdea || profile.purpose}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                2. Recommended Scheme (योजना)
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                <p className="font-bold text-slate-900">{scheme.title} ({scheme.code})</p>
                <p className="text-[11px] text-slate-600">🏢 {scheme.corporation}</p>
                <p><strong>Concessional Interest:</strong> <span className="text-emerald-700 font-bold">{interestRate}% p.a.</span></p>
                <p><strong>Max Entitlement:</strong> {formatINRLakhCrore(scheme.maxLoanAmount)}</p>
                <p><strong>Promoter Margin:</strong> {scheme.promoterContributionPercent}% ({formatINR(financials.promoterShare)})</p>
              </div>
            </div>
          </div>

          {/* Section 2: Calculated Loan Financials */}
          <div className="bg-emerald-50 border-2 border-emerald-600 p-4 rounded-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              3. Sanction & Financial Breakdown (ऋण व ईएमआई सारांश)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-sans block">Total Project Cost</span>
                <span className="font-bold text-slate-900 text-sm">{formatINR(financials.projectCost)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-sans block">Principal Loan Amount</span>
                <span className="font-bold text-emerald-700 text-sm">{formatINR(financials.loanAmount)}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-sans block">Estimated Monthly EMI</span>
                <span className="font-extrabold text-slate-900 text-sm">{formatINR(financials.monthlyEMI)}/mo</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-sans block">Repayment Tenure</span>
                <span className="font-bold text-slate-900 text-sm">{financials.tenureYears} Years</span>
              </div>
            </div>
          </div>

          {/* Section 3: Assigned Channel Partner Branch */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-purple-600" />
              4. Assigned Channel Partner (अधिकृत आवेदन केंद्र / बैंक शाखा)
            </h3>
            {partner ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{partner.name}</p>
                  <p>{partner.branchName} ({partner.typeLabel})</p>
                  <p className="text-slate-600">📍 {partner.address}</p>
                </div>
                <div className="space-y-1">
                  <p><strong>Nodal Officer:</strong> {partner.contactPerson} ({partner.designation})</p>
                  <p><strong>Phone:</strong> {partner.phone} • <strong>Hours:</strong> {partner.workingHours}</p>
                  <p className="text-emerald-700 font-bold">✅ Authorized Desk for {scheme.code}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Nearest State Channelizing Agency (SCA) District Office or Lead District Bank in {profile.district || 'Giridih'}.
              </p>
            )}
          </div>

          {/* Section 4: Mandatory Document Checklist */}
          <div className="border border-slate-200 p-4 rounded-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              5. Mandatory Documents to Carry (साथ ले जाने वाले आवश्यक दस्तावेज)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {scheme.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{doc}</span>
                </div>
              ))}
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>2 Recent Passport Size Photographs</span>
              </div>
            </div>
          </div>

          {/* Verification Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
            <span>Generated via Jan Loan Setu National Portal</span>
            <span>Beneficiary Signature: _______________________</span>
          </div>
        </div>
      </div>
    </div>
  );
};
