export type BeneficiaryCategory = 'SC' | 'OBC' | 'SafaiKaramchari' | 'General' | 'ST' | 'Minority';

export type LoanPurpose =
  | 'small_shop'
  | 'micro_business'
  | 'equipment_machinery'
  | 'education_domestic'
  | 'education_abroad'
  | 'sanitation_vehicle'
  | 'green_energy'
  | 'agriculture_allied'
  | 'handicraft_artisan'
  | 'transport_vehicle';

export type PartnerType = 'SCA' | 'PublicSectorBank' | 'RRB' | 'NBFC_MFI';

export interface UserFinancialProfile {
  name: string;
  category: BeneficiaryCategory;
  gender: 'female' | 'male' | 'other';
  age: number;
  annualFamilyIncome: number; // in INR
  purpose: LoanPurpose;
  businessIdea: string;
  projectCost: number; // in INR
  state: string;
  district: string;
  pincode: string;
  hasBPLCard?: boolean;
  educationLevel?: string;
  userCoords?: {
    latitude: number;
    longitude: number;
  };
}

export interface LoanScheme {
  id: string;
  code: string;
  title: string;
  hindiTitle: string;
  corporation: string; // e.g. "NSFDC (National Scheduled Castes Finance & Dev Corp)"
  description: string;
  targetBeneficiaries: string;
  maxLoanAmount: number; // in INR
  maxProjectCost: number; // in INR
  interestRateMale: number; // e.g. 6.0%
  interestRateFemale: number; // e.g. 4.5% (concession for women)
  interestRateChannelPartner: number; // e.g. 2.0% (corporation to SCA rate)
  promoterContributionPercent: number; // e.g. 2% to 10%
  subsidyPercent: number; // e.g. up to 33% or fixed amount
  maxSubsidyAmount: number;
  maxTenureYears: number; // e.g. 3 to 10 years
  moratoriumMonths: number; // e.g. 3 to 24 months
  incomeCeiling: number | null; // e.g. 300000 or 500000, null if no ceiling
  purposeCategories: LoanPurpose[];
  eligibleCategories: BeneficiaryCategory[];
  suitableForSummary: string;
  keyBenefits: string[];
  requiredDocuments: string[];
  authorizedPartnerTypes: PartnerType[];
  officialPortalUrl?: string;
}

export interface SchemeMatchResult {
  scheme: LoanScheme;
  isEligible: boolean;
  matchScore: number; // 0 to 100
  effectiveInterestRate: number;
  maxEligibleLoan: number;
  promoterContribution: number;
  estimatedSubsidy: number;
  reasoning: string[];
  warnings: string[];
  suggestedTenureYears: number;
}

export interface AmortizationRow {
  month: number;
  year: number;
  beginningBalance: number;
  emi: number;
  principalPayment: number;
  interestPayment: number;
  endingBalance: number;
  isMoratorium: boolean;
}

export interface CalculationResult {
  projectCost: number;
  loanAmount: number;
  promoterShare: number;
  subsidyAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  totalInterestPaid: number;
  totalRepayment: number;
  netBenefit: number;
  schedule: AmortizationRow[];
}

export interface ChannelPartner {
  id: string;
  name: string;
  type: PartnerType;
  typeLabel: string;
  branchName: string;
  district: string;
  state: string;
  pincode: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  supportedSchemeIds: string[];
  activeStatus: 'Active' | 'HighVolume' | 'TemporarilyRestricted';
  workingHours: string;
  distanceKm?: number;
  specialInstructions?: string;
}

export interface PreApplicationSlip {
  referenceNumber: string;
  dateGenerated: string;
  applicant: {
    name: string;
    category: string;
    gender: string;
    income: number;
    district: string;
    state: string;
    phone?: string;
  };
  project: {
    purpose: string;
    idea: string;
    projectCost: number;
  };
  scheme: {
    id: string;
    code: string;
    name: string;
    corporation: string;
    interestRate: number;
    maxLoan: number;
    promoterContribution: number;
    estimatedSubsidy: number;
  };
  financials: {
    loanAmount: number;
    emi: number;
    tenureYears: number;
    moratoriumMonths: number;
    totalRepayment: number;
  };
  channelPartner: {
    name: string;
    type: string;
    branchName: string;
    address: string;
    phone: string;
    contactPerson: string;
  };
  documentChecklist: string[];
}

export interface PincodeLookupResult {
  pincode: string;
  district: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  postOfficeName?: string;
  source: 'local_database' | 'postal_api' | 'prefix_estimate';
}

export interface NearestPartnerMatch {
  partner: ChannelPartner;
  distanceKm: number;
  isDistrictMatch: boolean;
  userLocationName: string;
}
