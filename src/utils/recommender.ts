import { GOVERNMENT_SCHEMES } from '../data/schemes';
import { UserFinancialProfile, SchemeMatchResult, LoanScheme } from '../types';

/**
 * Intelligent Rule-Based Government Scheme Recommendation Engine
 */
export function recommendSchemes(profile: UserFinancialProfile): {
  bestMatch: SchemeMatchResult | null;
  allMatches: SchemeMatchResult[];
} {
  const matches: SchemeMatchResult[] = GOVERNMENT_SCHEMES.map((scheme: LoanScheme) => {
    let score = 0;
    const reasoning: string[] = [];
    const warnings: string[] = [];

    // 1. Check Category Eligibility
    const categoryEligible = scheme.eligibleCategories.includes(profile.category) ||
      (profile.category === 'SC' && scheme.eligibleCategories.includes('SC')) ||
      (profile.category === 'OBC' && scheme.eligibleCategories.includes('OBC')) ||
      (profile.category === 'SafaiKaramchari' && (scheme.eligibleCategories.includes('SafaiKaramchari') || scheme.eligibleCategories.includes('SC')));

    if (categoryEligible) {
      score += 25;
      reasoning.push(`Target Beneficiary category '${profile.category}' is explicitly eligible.`);
    } else {
      warnings.push(`Primary category is designated for ${scheme.eligibleCategories.join(', ')}.`);
    }

    // 2. Check Purpose Match
    const isPurposeMatch = scheme.purposeCategories.includes(profile.purpose);
    if (isPurposeMatch) {
      score += 30;
      reasoning.push(`Purpose matches approved activities: ${scheme.suitableForSummary}`);
    } else if (
      (profile.purpose === 'small_shop' || profile.purpose === 'micro_business') &&
      scheme.purposeCategories.includes('micro_business')
    ) {
      score += 25;
      reasoning.push(`Enterprise fits micro-credit parameters.`);
    } else if (
      (profile.purpose === 'education_domestic' || profile.purpose === 'education_abroad') &&
      scheme.id.includes('education')
    ) {
      score += 30;
      reasoning.push(`Education study program aligns with scheme.`);
    } else {
      warnings.push(`Scheme is primarily designed for ${scheme.purposeCategories.join(', ')}.`);
    }

    // 3. Check Project Cost & Loan Limit
    if (profile.projectCost <= scheme.maxProjectCost) {
      score += 25;
      reasoning.push(`Project cost (₹${profile.projectCost.toLocaleString('en-IN')}) is within maximum scheme limit of ₹${scheme.maxProjectCost.toLocaleString('en-IN')}.`);
    } else {
      score += 5;
      warnings.push(`Project cost (₹${profile.projectCost.toLocaleString('en-IN')}) exceeds scheme limit (₹${scheme.maxProjectCost.toLocaleString('en-IN')}). Scheme can provide up to ₹${scheme.maxLoanAmount.toLocaleString('en-IN')}.`);
    }

    // 4. Check Income Eligibility
    let isIncomeEligible = true;
    if (scheme.incomeCeiling !== null) {
      if (profile.annualFamilyIncome <= scheme.incomeCeiling) {
        score += 15;
        reasoning.push(`Family income (₹${profile.annualFamilyIncome.toLocaleString('en-IN')}/yr) is within the income ceiling of ₹${scheme.incomeCeiling.toLocaleString('en-IN')}/yr.`);
      } else {
        isIncomeEligible = false;
        score -= 20;
        warnings.push(`Family income exceeds standard ceiling of ₹${scheme.incomeCeiling.toLocaleString('en-IN')}/yr for subsidized concession.`);
      }
    } else {
      score += 15;
      reasoning.push(`No restrictive annual family income ceiling.`);
    }

    // 5. Gender Specific Boosts
    let effectiveInterestRate = profile.gender === 'female' ? scheme.interestRateFemale : scheme.interestRateMale;
    if (profile.gender === 'female') {
      if (scheme.id === 'nsfdc_mahila_samriddhi') {
        score += 25;
        reasoning.push(`Exclusive Mahila Samriddhi benefit: Special lowest 3.5% interest rate & 1% promoter share for women!`);
      } else {
        score += 5;
        reasoning.push(`Women entrepreneur concession applies (${effectiveInterestRate}% interest p.a.).`);
      }
    } else {
      if (scheme.id === 'nsfdc_mahila_samriddhi') {
        score -= 50;
        warnings.push(`Mahila Samriddhi Yojana is exclusively reserved for women entrepreneurs.`);
      }
    }

    // 6. Educational Loan purpose exclusivity
    if (profile.purpose === 'education_domestic') {
      if (scheme.id === 'nsfdc_education_domestic') {
        score += 40;
      } else if (!scheme.id.includes('education')) {
        score -= 35;
      }
    } else if (profile.purpose === 'education_abroad') {
      if (scheme.id === 'nsfdc_education_abroad') {
        score += 45;
      } else if (!scheme.id.includes('education')) {
        score -= 40;
      }
    } else {
      // If business purpose, downrank education schemes
      if (scheme.id.includes('education')) {
        score -= 40;
        warnings.push(`Educational loan cannot be utilized for business/machinery.`);
      }
    }

    // 7. Sanitation scheme matching
    if (profile.purpose === 'sanitation_vehicle') {
      if (scheme.id === 'swachhata_udyami_yojana') {
        score += 50;
        reasoning.push(`33% capital subsidy (up to ₹5 Lakh) for mechanized sanitation units.`);
      }
    }

    // 8. Green Energy matching
    if (profile.purpose === 'green_energy') {
      if (scheme.id === 'green_business_scheme') {
        score += 45;
        reasoning.push(`Concessional green credit and fast-track clearance for solar/e-vehicles.`);
      }
    }

    // Calculate maximum eligible loan
    const maxEligibleLoan = Math.min(profile.projectCost, scheme.maxLoanAmount);
    const promoterContribution = Math.round(profile.projectCost * (scheme.promoterContributionPercent / 100));
    let estimatedSubsidy = Math.round(profile.projectCost * (scheme.subsidyPercent / 100));
    if (scheme.maxSubsidyAmount > 0 && estimatedSubsidy > scheme.maxSubsidyAmount) {
      estimatedSubsidy = scheme.maxSubsidyAmount;
    }

    // Final score normalization
    const finalScore = Math.max(0, Math.min(100, score));
    const isEligible = finalScore >= 45 && categoryEligible && isIncomeEligible && (profile.gender === 'female' || scheme.id !== 'nsfdc_mahila_samriddhi');

    return {
      scheme,
      isEligible,
      matchScore: finalScore,
      effectiveInterestRate,
      maxEligibleLoan,
      promoterContribution,
      estimatedSubsidy,
      reasoning,
      warnings,
      suggestedTenureYears: Math.min(profile.projectCost > 500000 ? 5 : 3, scheme.maxTenureYears)
    };
  });

  // Sort descending by match score
  matches.sort((a, b) => b.matchScore - a.matchScore);

  const bestMatch = matches.length > 0 && matches[0].isEligible ? matches[0] : (matches[0] || null);

  return {
    bestMatch,
    allMatches: matches
  };
}
