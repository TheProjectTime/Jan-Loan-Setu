import { LoanScheme } from '../types';

export const GOVERNMENT_SCHEMES: LoanScheme[] = [
  {
    id: 'nsfdc_micro_credit',
    code: 'MCF-NSFDC',
    title: 'Micro Credit Finance (MCF) Scheme',
    hindiTitle: 'माइक्रो क्रेडिट वित्त (एमसीएफ) योजना',
    corporation: 'NSFDC (National Scheduled Castes Finance & Dev Corp)',
    description: 'Direct micro-finance assistance to target group beneficiaries (especially SC entrepreneurs, small vendors, artisans) through Self-Help Groups (SHGs) and Channel Partners for quick income generation.',
    targetBeneficiaries: 'Scheduled Caste (SC) individuals with family income up to ₹3,00,000 p.a. (Priority to women & rural artisans)',
    maxLoanAmount: 140000,
    maxProjectCost: 150000,
    interestRateMale: 5.0,
    interestRateFemale: 4.0, // 1% rebate for women
    interestRateChannelPartner: 2.0,
    promoterContributionPercent: 2.0, // Beneficiary only needs 2% margin
    subsidyPercent: 20.0,
    maxSubsidyAmount: 25000,
    maxTenureYears: 3,
    moratoriumMonths: 3,
    incomeCeiling: 300000,
    purposeCategories: ['small_shop', 'micro_business', 'handicraft_artisan', 'agriculture_allied'],
    eligibleCategories: ['SC', 'SafaiKaramchari'],
    suitableForSummary: 'Small shops, grocery stalls, tailoring, fruit/vegetable vending, petty repair shops & handicrafts up to ₹1.4 Lakh.',
    keyBenefits: [
      'Very low interest rate (4% for women, 5% for men)',
      'Only 2% promoter contribution required',
      'Quick sanction through State Channelizing Agencies (SCAs) & RRBs',
      'No collateral requirement for micro-enterprises'
    ],
    requiredDocuments: [
      'Caste Certificate (SC/Safai Karamchari)',
      'Income Certificate (Issued by Tehsildar / Competent Authority)',
      'Aadhaar Card & Voter ID',
      'Bank Passbook (First page showing IFSC & Account No)',
      'Simple Business Activity Quotation or Estimate'
    ],
    authorizedPartnerTypes: ['SCA', 'RRB', 'NBFC_MFI'],
    officialPortalUrl: 'https://nsfdc.nic.in'
  },
  {
    id: 'nsfdc_mahila_samriddhi',
    code: 'MSY-NSFDC',
    title: 'Mahila Samriddhi Yojana (MSY)',
    hindiTitle: 'महिला समृद्धि योजना (एमएसवाई)',
    corporation: 'NSFDC / NBCFDC',
    description: 'Exclusive micro-credit financing for women entrepreneurs to promote self-reliance, women empowerment, and sustainable household income.',
    targetBeneficiaries: 'SC / OBC Women beneficiaries with annual family income up to ₹3,00,000.',
    maxLoanAmount: 140000,
    maxProjectCost: 150000,
    interestRateMale: 4.0,
    interestRateFemale: 3.5, // Ultra-low subsidized interest
    interestRateChannelPartner: 1.5,
    promoterContributionPercent: 1.0,
    subsidyPercent: 25.0,
    maxSubsidyAmount: 30000,
    maxTenureYears: 3,
    moratoriumMonths: 4,
    incomeCeiling: 300000,
    purposeCategories: ['micro_business', 'small_shop', 'handicraft_artisan', 'agriculture_allied'],
    eligibleCategories: ['SC', 'OBC', 'SafaiKaramchari'],
    suitableForSummary: 'Dedicated exclusively to women starting beauty parlors, tailoring boutiques, food processing, dairy, or handloom crafts.',
    keyBenefits: [
      'Lowest interest rate of 3.5% per annum for women',
      'Only 1% margin money contribution',
      'Special preference given to single mothers and widows',
      'Direct disbursement via Women Development Corporations & SCAs'
    ],
    requiredDocuments: [
      'Caste Certificate of Applicant',
      'Income Certificate (under ₹3 Lakh)',
      'Aadhaar Card of Applicant',
      'Photograph (Passport Size x 2)',
      'Bank Account details in applicant name'
    ],
    authorizedPartnerTypes: ['SCA', 'RRB', 'NBFC_MFI'],
    officialPortalUrl: 'https://nsfdc.nic.in'
  },
  {
    id: 'nsfdc_term_loan',
    code: 'TLS-NSFDC',
    title: 'Term Loan Scheme (TLS)',
    hindiTitle: 'सावधि ऋण योजना (टर्म लोन)',
    corporation: 'NSFDC (National Scheduled Castes Finance & Dev Corp)',
    description: 'Financing for establishing medium to large business enterprises, manufacturing units, procurement of industrial machinery, and commercial vehicles.',
    targetBeneficiaries: 'SC beneficiaries with family income up to ₹3,00,000 p.a. (or project feasibility for higher viable projects up to ₹50 Lakh).',
    maxLoanAmount: 5000000,
    maxProjectCost: 5000000,
    interestRateMale: 6.0, // Up to 6-8% depending on project slab
    interestRateFemale: 5.5,
    interestRateChannelPartner: 3.0,
    promoterContributionPercent: 5.0, // 5% for up to 5L, 10% for above
    subsidyPercent: 15.0,
    maxSubsidyAmount: 150000,
    maxTenureYears: 5,
    moratoriumMonths: 6,
    incomeCeiling: 500000,
    purposeCategories: ['equipment_machinery', 'transport_vehicle', 'micro_business', 'agriculture_allied'],
    eligibleCategories: ['SC', 'SafaiKaramchari'],
    suitableForSummary: 'Medium & larger business units, machinery acquisition, CNC tools, flour mills, commercial transport, and packaging units (₹1.5 Lakh to ₹50 Lakh).',
    keyBenefits: [
      'Loans up to ₹50.00 Lakh at concessional interest rate (6.0%)',
      'Up to 90% of project cost funded by NSFDC/SCA',
      '6-month moratorium period before principal repayment starts',
      'Flexible repayment over up to 5 to 7 years'
    ],
    requiredDocuments: [
      'Caste & Income Certificate',
      'Detailed Project Report (DPR) / Business Feasibility Plan',
      'Machinery / Vehicle Quotations from authorized dealer',
      'PAN Card & Aadhaar Card',
      'Proof of Business Premises (Rent agreement / Electricity bill / Ownership)'
    ],
    authorizedPartnerTypes: ['SCA', 'PublicSectorBank', 'RRB'],
    officialPortalUrl: 'https://nsfdc.nic.in'
  },
  {
    id: 'nsfdc_education_domestic',
    code: 'ELS-DOM-NSFDC',
    title: 'Educational Loan Scheme (Domestic Studies)',
    hindiTitle: 'शिक्षा ऋण योजना (घरेलू अध्ययन)',
    corporation: 'NSFDC / NBCFDC',
    description: 'Concessional financial assistance for pursuing professional and technical higher education courses (Engineering, Medical, Management, Law, etc.) in approved institutions in India.',
    targetBeneficiaries: 'SC / OBC students securing admission in recognized professional/technical courses in India.',
    maxLoanAmount: 2000000,
    maxProjectCost: 2000000,
    interestRateMale: 4.0,
    interestRateFemale: 3.5, // 0.5% concession for female students
    interestRateChannelPartner: 1.5,
    promoterContributionPercent: 0.0, // 0% margin for domestic education!
    subsidyPercent: 0.0,
    maxSubsidyAmount: 0,
    maxTenureYears: 5,
    moratoriumMonths: 12, // Course duration + 1 year (or 6 months after getting job)
    incomeCeiling: 350000,
    purposeCategories: ['education_domestic'],
    eligibleCategories: ['SC', 'OBC', 'SafaiKaramchari'],
    suitableForSummary: 'B.Tech, MBBS, MBA, Polytechnic, Nursing, Law, and IT degree courses in recognized Indian colleges.',
    keyBenefits: [
      'Up to ₹20.00 Lakh for tuition fees, books, hostel & equipment',
      'Lowest educational interest rate in India (3.5% - 4.0%)',
      'Zero promoter contribution required (100% financed)',
      'Moratorium period: Full Course Duration + 1 Year grace before EMI begins'
    ],
    requiredDocuments: [
      'Admission Letter / Proof from UGC/AICTE recognized institution',
      'Fee Structure breakup on institution letterhead',
      'Mark sheets of 10th, 12th, and Graduation (if applicable)',
      'Caste Certificate & Family Income Certificate',
      'Aadhaar Card of student and parent/guarantor'
    ],
    authorizedPartnerTypes: ['SCA', 'PublicSectorBank', 'RRB'],
    officialPortalUrl: 'https://nsfdc.nic.in'
  },
  {
    id: 'nsfdc_education_abroad',
    code: 'ELS-ABR-NSFDC',
    title: 'Educational Loan Scheme (Studies Abroad)',
    hindiTitle: 'विदेश अध्ययन शिक्षा ऋण योजना',
    corporation: 'NSFDC / NBCFDC',
    description: 'Subsidized loan for SC/OBC students accepted into Master’s, Doctoral, or specialized technical degree programs in top global universities abroad.',
    targetBeneficiaries: 'SC / OBC students with admission in reputed foreign universities with family income under ₹5 Lakh.',
    maxLoanAmount: 4000000,
    maxProjectCost: 4000000,
    interestRateMale: 4.0,
    interestRateFemale: 3.5,
    interestRateChannelPartner: 1.5,
    promoterContributionPercent: 5.0,
    subsidyPercent: 0.0,
    maxSubsidyAmount: 0,
    maxTenureYears: 7,
    moratoriumMonths: 18,
    incomeCeiling: 500000,
    purposeCategories: ['education_abroad'],
    eligibleCategories: ['SC', 'OBC', 'SafaiKaramchari'],
    suitableForSummary: 'MS, PhD, STEM, and specialized postgraduate studies in USA, UK, Canada, Australia, Germany, etc.',
    keyBenefits: [
      'Up to ₹40.00 Lakh coverage including airfare, living costs & tuition',
      'Affordable 3.5% - 4.0% interest rate compared to 11%+ commercial bank rates',
      'Course duration + 18 months repayment holiday (moratorium)'
    ],
    requiredDocuments: [
      'Foreign University Offer Letter / I-20 Form',
      'Valid Passport & Student Visa documents',
      'GRE / IELTS / TOEFL scorecard',
      'Estimated living expenses and tuition fee breakdown',
      'Caste Certificate and Income Certificate'
    ],
    authorizedPartnerTypes: ['SCA', 'PublicSectorBank'],
    officialPortalUrl: 'https://nsfdc.nic.in'
  },
  {
    id: 'swachhata_udyami_yojana',
    code: 'SUY-NSKFDC',
    title: 'Swachhata Udyami Yojana (SUY)',
    hindiTitle: 'स्वच्छता उद्यमी योजना',
    corporation: 'NSKFDC (National Safai Karamcharis Finance & Dev Corp)',
    description: 'Assistance for setting up and mechanized cleaning operations, purchase of modern vacuum loader suction machines, sewer cleaning vehicles, and automated pay-and-use community toilets.',
    targetBeneficiaries: 'Safai Karamcharis, manual scavengers and their dependents with special assistance.',
    maxLoanAmount: 5000000,
    maxProjectCost: 5000000,
    interestRateMale: 4.0,
    interestRateFemale: 3.0,
    interestRateChannelPartner: 1.0,
    promoterContributionPercent: 2.0,
    subsidyPercent: 33.0, // High government capital subsidy
    maxSubsidyAmount: 500000,
    maxTenureYears: 7,
    moratoriumMonths: 6,
    incomeCeiling: null, // No income limit for identified manual scavengers/safai karamcharis
    purposeCategories: ['sanitation_vehicle', 'equipment_machinery'],
    eligibleCategories: ['SafaiKaramchari', 'SC'],
    suitableForSummary: 'Sewer cleaning vehicles, de-sludging machines, mobile vacuum suction units, mechanized sanitation enterprises.',
    keyBenefits: [
      'Generous 33% capital subsidy (up to ₹5 Lakh)',
      'Subsidized 3.0% - 4.0% interest rate for dignified livelihood',
      'Mechanizes cleaning work and eliminates manual hazardous entry'
    ],
    requiredDocuments: [
      'Safai Karamchari ID / Identity Certificate from Municipal Body',
      'Vehicle / Machine Quotation from authorized manufacturer',
      'Driving license / Commercial permit (for vehicle-mounted units)',
      'Aadhaar and Bank Account details'
    ],
    authorizedPartnerTypes: ['SCA', 'PublicSectorBank', 'RRB'],
    officialPortalUrl: 'https://nskfdc.nic.in'
  },
  {
    id: 'green_business_scheme',
    code: 'GBS-NSFDC',
    title: 'Green Business Scheme (GBS)',
    hindiTitle: 'हरित व्यापार योजना (ग्रीन बिजनेस)',
    corporation: 'NSFDC / NBCFDC',
    description: 'Financial support for eco-friendly and climate-positive enterprises like solar rooftop installation, e-rickshaws, battery recycling, organic manure, and biogas units.',
    targetBeneficiaries: 'SC / OBC entrepreneurs venturing into renewable energy, e-mobility, and green technology.',
    maxLoanAmount: 3000000,
    maxProjectCost: 3000000,
    interestRateMale: 5.0,
    interestRateFemale: 4.0,
    interestRateChannelPartner: 2.0,
    promoterContributionPercent: 5.0,
    subsidyPercent: 20.0,
    maxSubsidyAmount: 200000,
    maxTenureYears: 5,
    moratoriumMonths: 6,
    incomeCeiling: 300000,
    purposeCategories: ['green_energy', 'equipment_machinery', 'transport_vehicle', 'small_shop'],
    eligibleCategories: ['SC', 'OBC', 'SafaiKaramchari'],
    suitableForSummary: 'Electric 3-wheelers / E-rickshaws, Solar power setups, Polyhouse farming, Vermicompost production, Biomass pelleting.',
    keyBenefits: [
      'Up to ₹30.00 Lakh project finance at 4% to 5% interest rate',
      'Capital subsidy support for clean energy assets',
      'Fast-track appraisal under National Clean Energy goals'
    ],
    requiredDocuments: [
      'Caste & Income Certificate',
      'Technical specification sheet of solar / e-vehicle asset',
      'Quotation from MNRE or ARAI approved dealer',
      'PAN & Aadhaar Cards'
    ],
    authorizedPartnerTypes: ['SCA', 'PublicSectorBank', 'RRB'],
    officialPortalUrl: 'https://nsfdc.nic.in'
  },
  {
    id: 'standup_india',
    code: 'SUI-GOI',
    title: 'Stand-Up India Scheme',
    hindiTitle: 'स्टैंड-अप इंडिया योजना',
    corporation: 'SIDBI / Ministry of Finance',
    description: 'Promoting entrepreneurship among SC/ST and Women for greenfield enterprises in manufacturing, services, agri-allied, or trading sector.',
    targetBeneficiaries: 'Scheduled Caste (SC), Scheduled Tribe (ST) or Woman entrepreneur setting up a new enterprise.',
    maxLoanAmount: 10000000, // Up to 1 Crore
    maxProjectCost: 10000000,
    interestRateMale: 7.5, // Bank base rate + tenor premium
    interestRateFemale: 7.0,
    interestRateChannelPartner: 4.5,
    promoterContributionPercent: 10.0,
    subsidyPercent: 15.0,
    maxSubsidyAmount: 750000,
    maxTenureYears: 7,
    moratoriumMonths: 18,
    incomeCeiling: null, // Greenfield venture feasibility based
    purposeCategories: ['equipment_machinery', 'micro_business', 'agriculture_allied', 'transport_vehicle'],
    eligibleCategories: ['SC', 'ST', 'OBC', 'SafaiKaramchari', 'General'],
    suitableForSummary: 'Setting up new (greenfield) factories, diagnostic centers, retail superstores, transport fleets, or manufacturing units (₹10 Lakh to ₹1 Crore).',
    keyBenefits: [
      'Substantial credit ceiling: ₹10 Lakh to ₹100 Lakh',
      'Composite loan covering both Term Loan and Working Capital',
      'Handholding support from SIDBI & Lead District Managers'
    ],
    requiredDocuments: [
      'SC/ST Certificate (or Woman Entrepreneur self-declaration)',
      'Detailed Project Report (DPR) with 3-year cash flow projections',
      'Udyam Registration Certificate',
      'PAN, Aadhaar, GST registration (if applicable)',
      'Bank statement for last 6 months'
    ],
    authorizedPartnerTypes: ['PublicSectorBank', 'RRB'],
    officialPortalUrl: 'https://standupmitra.in'
  },
  {
    id: 'pm_mudra_shishu_kishore',
    code: 'PMMY-MUDRA',
    title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    hindiTitle: 'प्रधानमंत्री मुद्रा योजना',
    corporation: 'MUDRA / Dept of Financial Services',
    description: 'Collateral-free micro-credit for non-corporate, non-farm small/micro enterprises across Shishu (up to ₹50K), Kishore (₹50K-₹5L), and Tarun (₹5L-₹10L).',
    targetBeneficiaries: 'All micro-entrepreneurs, shopkeepers, service providers, artisans across all social categories.',
    maxLoanAmount: 1000000,
    maxProjectCost: 1000000,
    interestRateMale: 8.5,
    interestRateFemale: 8.0,
    interestRateChannelPartner: 5.0,
    promoterContributionPercent: 5.0,
    subsidyPercent: 0.0,
    maxSubsidyAmount: 0,
    maxTenureYears: 5,
    moratoriumMonths: 3,
    incomeCeiling: null,
    purposeCategories: ['small_shop', 'micro_business', 'equipment_machinery', 'handicraft_artisan'],
    eligibleCategories: ['SC', 'OBC', 'ST', 'SafaiKaramchari', 'General', 'Minority'],
    suitableForSummary: 'Quick collateral-free loans for street vendors, kirana stores, salons, repair garages, photostat centers, small workshops.',
    keyBenefits: [
      'Zero collateral or third-party guarantee required',
      'MUDRA Debit Card provided for easy working capital withdrawal',
      'Available at all commercial banks, RRBs, and NBFCs nationwide'
    ],
    requiredDocuments: [
      'Aadhaar Card and PAN Card',
      'Proof of Business Identity and Address',
      'Quotation of machinery/items to be purchased',
      'Recent 2 passport-size photographs'
    ],
    authorizedPartnerTypes: ['PublicSectorBank', 'RRB', 'NBFC_MFI'],
    officialPortalUrl: 'https://mudra.org.in'
  }
];
