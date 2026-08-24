import { CalculationResult, AmortizationRow } from '../types';

/**
 * Calculates standard Equated Monthly Installment (EMI) using reducing balance method:
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where:
 * P = Principal loan amount (Project cost minus promoter contribution minus capital subsidy, or as per scheme rule)
 * r = Monthly interest rate (Annual rate / 12 / 100)
 * n = Tenure in months
 */
export function calculateLoanFinancials(params: {
  projectCost: number;
  promoterPercentage: number;
  subsidyPercentage: number;
  maxSubsidyCap: number;
  annualInterestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
}): CalculationResult {
  const {
    projectCost,
    promoterPercentage,
    subsidyPercentage,
    maxSubsidyCap,
    annualInterestRate,
    tenureYears,
    moratoriumMonths
  } = params;

  // 1. Calculate promoter contribution
  const promoterShare = Math.round(projectCost * (promoterPercentage / 100));

  // 2. Calculate capital subsidy (if applicable, capped by maxSubsidyCap)
  let calculatedSubsidy = Math.round(projectCost * (subsidyPercentage / 100));
  if (maxSubsidyCap > 0 && calculatedSubsidy > maxSubsidyCap) {
    calculatedSubsidy = maxSubsidyCap;
  }
  const subsidyAmount = calculatedSubsidy;

  // 3. Principal Loan amount to be borrowed
  // Loan amount = Project Cost - Promoter Share (Government subsidies are often back-ended or front-ended to reduce principal)
  let loanAmount = projectCost - promoterShare;
  if (loanAmount <= 0) {
    loanAmount = 10000;
  }

  const tenureMonths = Math.max(6, Math.round(tenureYears * 12));
  const monthlyRate = annualInterestRate > 0 ? annualInterestRate / 12 / 100 : 0;

  // Calculate Monthly EMI (excluding moratorium months if principal is deferred)
  // Active repayment months = tenureMonths - moratoriumMonths
  const repaymentMonths = Math.max(1, tenureMonths - moratoriumMonths);

  let monthlyEMI = 0;
  if (monthlyRate === 0) {
    monthlyEMI = Math.round(loanAmount / repaymentMonths);
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, repaymentMonths);
    monthlyEMI = Math.round((loanAmount * monthlyRate * compoundFactor) / (compoundFactor - 1));
  }

  // 4. Generate Amortization Schedule
  const schedule: AmortizationRow[] = [];
  let currentBalance = loanAmount;
  let totalInterestAccumulated = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const year = Math.ceil(month / 12);
    const isMoratorium = month <= moratoriumMonths;

    let interestPayment = Math.round(currentBalance * monthlyRate);
    let principalPayment = 0;
    let emi = 0;

    if (isMoratorium) {
      // In moratorium, beneficiary might only pay simple interest or 0 payment
      emi = interestPayment; // simple interest servicing during grace
      principalPayment = 0;
      totalInterestAccumulated += interestPayment;
    } else {
      emi = monthlyEMI;
      principalPayment = Math.min(currentBalance, monthlyEMI - interestPayment);
      if (principalPayment < 0) principalPayment = 0;
      currentBalance = Math.max(0, currentBalance - principalPayment);
      totalInterestAccumulated += interestPayment;
    }

    schedule.push({
      month,
      year,
      beginningBalance: isMoratorium ? currentBalance : currentBalance + principalPayment,
      emi,
      principalPayment,
      interestPayment,
      endingBalance: currentBalance,
      isMoratorium
    });
  }

  const totalRepayment = loanAmount + totalInterestAccumulated;
  const netBenefit = subsidyAmount + (loanAmount * 0.08 * tenureYears - totalInterestAccumulated); // compared to standard 14% commercial bank rate

  return {
    projectCost,
    loanAmount,
    promoterShare,
    subsidyAmount,
    annualInterestRate,
    tenureYears,
    tenureMonths,
    moratoriumMonths,
    monthlyEMI,
    totalInterestPaid: totalInterestAccumulated,
    totalRepayment,
    netBenefit: Math.max(0, Math.round(netBenefit)),
    schedule
  };
}

/**
 * Format Indian Rupee currency with standard Indian Numbering System (Lakh / Crore)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });
  return formatter.format(amount);
}

/**
 * Format amount into Lakh / Crore text
 */
export function formatINRLakhCrore(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(amount);
}
