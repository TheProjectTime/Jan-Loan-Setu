import React, { useState, useEffect } from 'react';
import { 
  X, Download, CheckCircle2, ShieldCheck, 
  Landmark, User, FileText, Sparkles, Building, Calendar, Phone,
  Info, QrCode, AlertCircle, Loader2, Check
} from 'lucide-react';
import { LoanScheme, ChannelPartner, UserFinancialProfile, CalculationResult } from '../types';
import { formatINR, formatINRLakhCrore, calculateLoanFinancials } from '../utils/calculator';
import { JanLoanSetuLogo } from './JanLoanSetuLogo';
import { jsPDF } from 'jspdf';

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
  const [refNumber] = useState<string>(
    `JLS-${profile.state?.slice(0, 2).toUpperCase() || 'IN'}-${profile.district?.slice(0, 3).toUpperCase() || 'DST'}-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGeneratingPdf) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isGeneratingPdf]);

  if (!isOpen) return null;

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

  const formatPdfINR = (num: number): string => {
    if (num === undefined || num === null || isNaN(num)) return 'Rs. 0';
    return 'Rs. ' + Math.round(num).toLocaleString('en-IN');
  };

  const formatPdfLakh = (num: number): string => {
    if (!num) return 'Rs. 0';
    if (num >= 10000000) {
      return `Rs. ${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `Rs. ${(num / 100000).toFixed(2)} Lakh`;
    }
    return `Rs. ${num.toLocaleString('en-IN')}`;
  };

  // Helper to rasterize the official Jan Loan Setu logo emblem to a high-res PNG data URL for jsPDF
  const getLogoDataUrl = (): Promise<string> => {
    return new Promise((resolve) => {
      try {
        const svgString = `<svg viewBox="0 0 200 200" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cArcG" x1="20" y1="180" x2="180" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#0a3370" />
              <stop offset="50%" stop-color="#0284c7" />
              <stop offset="85%" stop-color="#16a34a" />
              <stop offset="100%" stop-color="#22c55e" />
            </linearGradient>
            <linearGradient id="leafG" x1="140" y1="70" x2="180" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#4ade80" />
              <stop offset="100%" stop-color="#15803d" />
            </linearGradient>
            <linearGradient id="rivG" x1="100" y1="100" x2="70" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#0c3a72" />
              <stop offset="60%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="20" fill="#ffffff" />
          <path d="M 64 165 C 24 140 16 75 58 35 C 98 -3 162 5 180 58 C 185 75 185 96 172 118 C 160 138 140 156 116 166" stroke="url(#cArcG)" stroke-width="14" stroke-linecap="round" fill="none" />
          <g transform="translate(142, 68) rotate(15)">
            <path d="M 0 24 C 5 8 20 0 32 0 C 32 15 25 30 10 32 C 3 32 0 28 0 24 Z" fill="url(#leafG)" />
            <path d="M 2 24 C 12 18 20 10 30 2" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          </g>
          <g stroke="#16a34a" stroke-width="3" stroke-linecap="round">
            <line x1="100" y1="18" x2="100" y2="24" />
            <line x1="86" y1="22" x2="90" y2="27" />
            <line x1="114" y1="22" x2="110" y2="27" />
          </g>
          <text x="100" y="46" fill="#0a3370" font-size="22" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">JLS</text>
          <g fill="#0a3370">
            <circle cx="72" cy="40" r="7.5" />
            <path d="M 62 70 L 62 50 C 62 47 66 45 71 45 C 76 45 80 47 80 50 L 80 58 L 96 66 C 99 67 101 70 99 73 C 98 75 95 76 93 75 L 75 66 L 75 70 Z" />
          </g>
          <g fill="#16a34a">
            <circle cx="128" cy="40" r="7.5" />
            <path d="M 138 70 L 138 50 C 138 47 134 45 129 45 C 124 45 120 47 120 50 L 120 58 L 104 66 C 101 67 99 70 101 73 C 102 75 105 76 107 75 L 125 66 L 125 70 Z" />
          </g>
          <circle cx="100" cy="71" r="3.5" fill="#15803d" />
          <g fill="#0a3370">
            <path d="M 45 77 C 70 73, 130 73, 155 77 L 155 105 C 142 105, 142 85, 130 85 C 118 85, 118 105, 100 105 C 82 105, 82 85, 70 85 C 58 85, 58 105, 45 105 Z" />
            <path d="M 45 75 C 70 71, 130 71, 155 75" stroke="#07234d" stroke-width="2.5" stroke-linecap="round" fill="none" />
          </g>
          <path d="M 47 105 C 57 105, 57 87, 69 87 C 81 87, 81 105, 91 105" fill="#ffffff" />
          <path d="M 77 105 C 87 105, 87 87, 100 87 C 113 87, 113 105, 123 105" fill="#ffffff" />
          <path d="M 109 105 C 119 105, 119 87, 131 87 C 143 87, 143 105, 153 105" fill="#ffffff" />
          <path d="M 100 102 C 115 106, 145 118, 140 135 C 134 152, 95 160, 52 170 C 80 162, 112 154, 115 138 C 118 122, 92 112, 100 102 Z" fill="url(#rivG)" />
          <path d="M 68 163 C 96 153, 116 138, 112 122" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </svg>`;

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 300;
          canvas.height = 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 300, 300);
            const dataUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            resolve(dataUrl);
            return;
          }
          URL.revokeObjectURL(url);
          resolve('');
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve('');
        };
        img.src = url;
      } catch {
        resolve('');
      }
    });
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);
      setDownloadSuccess(false);

      // 1. Prepare Logo Image
      const logoDataUrl = await getLogoDataUrl();

      // Create native vector A4 PDF (210mm x 297mm) with strict 1.5cm (15mm) margin
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const margin = 15; // 1.5 cm from all sides
      const contentWidth = pageWidth - (margin * 2); // 180 mm printable width
      let currentY = margin; // 15 mm top margin

      // 1. Top Decorative Government Banner
      doc.setFillColor(30, 27, 75); // Deep Indigo (#1e1b4b)
      doc.rect(margin, currentY, contentWidth, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('GOVERNMENT OF INDIA - NATIONAL CONCESSIONAL CREDIT SCHEME PORTAL', margin + 4, currentY + 4.8);
      doc.text('VERIFIED ELIGIBILITY TOKEN', margin + contentWidth - 48, currentY + 4.8);
      currentY += 9.5;

      // 2. Main Letterhead Header
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

      // Embedded Official Logo / Emblem badge
      if (logoDataUrl) {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin + 2.5, currentY + 2.5, 19, 19, 1.5, 1.5, 'FD');
        doc.addImage(logoDataUrl, 'PNG', margin + 3, currentY + 3, 18, 18);
      } else {
        doc.setFillColor(30, 27, 75);
        doc.roundedRect(margin + 2.5, currentY + 2.5, 19, 19, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('JLS', margin + 5, currentY + 14.5);
      }

      // Title Text (Clean single-line titles with safe right margin bounds)
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('JAN LOAN SETU', margin + 25, currentY + 8.5);

      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Pre-Application Eligibility & Channel Partner Routing Token', margin + 25, currentY + 13.5);
      doc.text('Ministry of Social Justice & Empowerment, Govt. of India', margin + 25, currentY + 18.5);

      // Reference Box (Right side of header)
      const refBoxWidth = 50;
      const refBoxX = margin + contentWidth - refBoxWidth - 2.5;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(148, 163, 184);
      doc.roundedRect(refBoxX, currentY + 2.5, refBoxWidth, 19, 1.5, 1.5, 'FD');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.text('TOKEN REFERENCE NUMBER', refBoxX + 3, currentY + 6.8);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text(refNumber, refBoxX + 3, currentY + 11.8);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, refBoxX + 3, currentY + 16.5);

      currentY += 27;

      // 3. Two-column cards: Applicant Profile & Targeted Scheme
      const colGap = 4;
      const colWidth = (contentWidth - colGap) / 2; // (180 - 4) / 2 = 88mm

      // Card 1: Applicant Profile
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, colWidth, 44, 2, 2, 'FD');

      doc.setFillColor(224, 231, 255);
      doc.rect(margin, currentY, colWidth, 6.5, 'F');
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('1. BENEFICIARY PROFILE', margin + 3, currentY + 4.6);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      const applicantName = (profile.name || 'Beneficiary Applicant').substring(0, 30);
      const targetAct = (profile.businessIdea || profile.purpose || 'Micro Enterprise').substring(0, 30);
      const locStr = `${profile.district || 'Giridih'}, ${profile.state || 'Jharkhand'} (${profile.pincode || '815301'})`.substring(0, 32);

      doc.text(`Name: ${applicantName}`, margin + 3, currentY + 11.5);
      doc.text(`Category: ${profile.category}  |  Gender: ${profile.gender.toUpperCase()}`, margin + 3, currentY + 17);
      doc.text(`Family Income: ${formatPdfINR(profile.annualFamilyIncome)} / year`, margin + 3, currentY + 22.5);
      doc.text(`Location: ${locStr}`, margin + 3, currentY + 28);
      doc.text(`Target Activity: ${targetAct}`, margin + 3, currentY + 33.5);
      doc.text(`Eligible Concession: Applicable under Guidelines`, margin + 3, currentY + 39);

      // Card 2: Recommended Scheme
      const col2X = margin + colWidth + colGap; // 15 + 88 + 4 = 107mm
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(col2X, currentY, colWidth, 44, 2, 2, 'FD');

      doc.setFillColor(224, 231, 255);
      doc.rect(col2X, currentY, colWidth, 6.5, 'F');
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('2. SANCTIONED SCHEME SPECIFICATIONS', col2X + 3, currentY + 4.6);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const schemeTitleTrunc = scheme.title.length > 28 ? scheme.title.substring(0, 28) + '...' : scheme.title;
      doc.text(`${schemeTitleTrunc} (${scheme.code})`, col2X + 3, currentY + 11.5);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      // Truncate apex corporation cleanly to avoid line-wrapping collision
      const apexName = scheme.corporation.includes('(')
        ? `${scheme.corporation.split('(')[0].trim()} (${scheme.corporation.split('(')[1].replace(')', '').substring(0, 18)}...)`
        : scheme.corporation.substring(0, 30);

      doc.text(`Apex Body: ${apexName}`, col2X + 3, currentY + 17);
      doc.text(`Concessional Interest: ${interestRate}% p.a. (Subsidized)`, col2X + 3, currentY + 22.5);
      doc.text(`Max Scheme Limit: ${formatPdfLakh(scheme.maxLoanAmount)}`, col2X + 3, currentY + 28);
      doc.text(`Promoter Contribution: ${scheme.promoterContributionPercent}% (${formatPdfINR(financials.promoterShare)})`, col2X + 3, currentY + 33.5);
      doc.text(`Moratorium Period: ${scheme.moratoriumMonths} Months Grace Period`, col2X + 3, currentY + 39);

      currentY += 47.5;

      // 4. Financial Sanction & Installment Schedule Breakdown
      doc.setFillColor(236, 253, 245); // Emerald-50
      doc.setDrawColor(5, 150, 105); // Emerald-600
      doc.roundedRect(margin, currentY, contentWidth, 36, 2, 2, 'FD');

      doc.setFillColor(5, 150, 105);
      doc.rect(margin, currentY, contentWidth, 6.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('3. FINANCIAL SANCTION & EMI BREAKDOWN', margin + 3, currentY + 4.6);

      const metricGap = 2;
      const metricBoxWidth = (contentWidth - 6 - (3 * metricGap)) / 4;
      const metrics = [
        { label: 'Total Project Cost', val: formatPdfINR(financials.projectCost) },
        { label: 'Sanctioned Loan', val: formatPdfINR(financials.loanAmount) },
        { label: 'Monthly EMI', val: `${formatPdfINR(financials.monthlyEMI)} / mo` },
        { label: 'Repayment Tenure', val: `${financials.tenureYears} Yrs (${financials.tenureYears * 12} Mos)` }
      ];

      metrics.forEach((m, idx) => {
        const boxX = margin + 3 + idx * (metricBoxWidth + metricGap);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(167, 243, 208);
        doc.roundedRect(boxX, currentY + 8.5, metricBoxWidth, 15, 1.5, 1.5, 'FD');

        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(m.label, boxX + 2, currentY + 13);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(m.val, boxX + 2, currentY + 19.5);
      });

      doc.setTextColor(4, 120, 87);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(`* Total Interest Payable: ${formatPdfINR(financials.totalInterestPaid)}  |  Government Subsidy / Concession: ${formatPdfINR(financials.subsidyAmount)}`, margin + 3, currentY + 30.5);

      currentY += 39.5;

      // 5. Assigned Channel Partner Desk
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

      doc.setFillColor(224, 231, 255);
      doc.rect(margin, currentY, contentWidth, 6.5, 'F');
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('4. DESIGNATED PROCESSING CHANNEL PARTNER BRANCH', margin + 3, currentY + 4.6);

      if (partner) {
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const partnerTitle = `${partner.name} - ${partner.branchName} (${partner.typeLabel})`.substring(0, 82);
        doc.text(partnerTitle, margin + 3, currentY + 11.8);

        doc.setTextColor(51, 65, 85);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        const addr = partner.address.length > 85 ? partner.address.substring(0, 85) + '...' : partner.address;
        doc.text(`Address: ${addr}`, margin + 3, currentY + 17);
        doc.text(`Nodal Desk: ${partner.contactPerson} (${partner.designation})  |  Phone: ${partner.phone}`, margin + 3, currentY + 22.2);
        doc.text(`Operating Hours: ${partner.workingHours}  |  Authorized Scope: ${scheme.code} Lending`, margin + 3, currentY + 27.5);
      } else {
        doc.setTextColor(51, 65, 85);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(`Nearest District Lead Bank / State Channelizing Agency (SCA) Office in ${profile.district || 'Giridih'}, ${profile.state || 'Jharkhand'}.`, margin + 3, currentY + 15);
        doc.text('Please present this token at the Special Concessional Lending Desk for direct verification.', margin + 3, currentY + 21);
      }

      currentY += 37.5;

      // 6. Mandatory Documents Checklist with Empty Checkboxes
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, contentWidth, 30, 2, 2, 'FD');

      doc.setFillColor(241, 245, 249);
      doc.rect(margin, currentY, contentWidth, 6.5, 'F');
      doc.setTextColor(30, 27, 75);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('5. MANDATORY ATTACHMENTS TO BRING (CHECKLIST)', margin + 3, currentY + 4.6);

      const docsList = [
        'Aadhaar Card / Voter ID Proof',
        'Category / Caste / Minority Certificate',
        'Family Income Certificate / Self-Declaration',
        'Bank Passbook / Active Account Statement',
        'Project Quotation / Machinery Cost Invoice',
        '2 Recent Passport Size Photographs'
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      
      docsList.forEach((d, idx) => {
        const isRight = idx >= 3;
        const colBaseX = isRight ? margin + colWidth + colGap + 2 : margin + 3;
        const rowY = currentY + 12 + (idx % 3) * 5.5;

        // Draw crisp empty square checkbox
        doc.setDrawColor(100, 116, 139);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(colBaseX, rowY - 2.6, 3, 3, 0.4, 0.4, 'FD');

        // Document description next to empty checkbox
        doc.setTextColor(51, 65, 85);
        doc.text(d, colBaseX + 4.8, rowY);
      });

      currentY += 33.5;

      // 7. Signature & Verification Boxes
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, currentY, margin + contentWidth, currentY);
      currentY += 3;

      // Left: Applicant Signature
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, currentY, colWidth, 18, 1.5, 1.5, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('BENEFICIARY APPLICANT SIGNATURE', margin + 3, currentY + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Date: ________________________', margin + 3, currentY + 14);

      // Right: Channel Partner / SCA Verification Stamp
      const stampX = margin + colWidth + colGap;
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(stampX, currentY, colWidth, 18, 1.5, 1.5, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('BANK BRANCH / NODAL DESK VERIFICATION STAMP', stampX + 3, currentY + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Officer Sign & Seal: ________________________', stampX + 3, currentY + 14);

      currentY += 21.5;

      // 8. Footer Note & Security Hash
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(`Digitally Generated via Jan Loan Setu Portal - Security Token: ${refNumber} - Valid across all authorized SCAs & Banks.`, margin, currentY);

      // Save PDF file directly to user device
      const fileName = `JanLoanSetu_Application_Slip_${refNumber}.pdf`;
      doc.save(fileName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isGeneratingPdf) onClose();
      }}
    >
      <div 
        className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-slate-900 relative animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Top Controls Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
              {isHindi ? 'जन ऋण सेतु • आधिकारिक पूर्व-आवेदन पर्ची' : 'Jan Loan Setu • Pre-Application Eligibility Slip'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-slip-header-download-pdf"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              title="Download official PDF document"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                {isGeneratingPdf 
                  ? (isHindi ? 'पीडीएफ बन रहा है...' : 'Generating PDF...') 
                  : downloadSuccess
                  ? (isHindi ? 'डाउनलोड हुआ!' : 'Downloaded!')
                  : (isHindi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF')}
              </span>
            </button>

            <button
              id="btn-slip-header-close"
              onClick={onClose}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1 px-3 py-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'बंद करें' : 'Close'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100/50">
          
          {/* Printable Official Slip Document Container */}
          <div 
            className="p-5 sm:p-7 md:p-8 space-y-5 text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs mx-auto max-w-3xl" 
            id="printable-slip"
          >
            {/* Slip Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <JanLoanSetuLogo
                  size="md"
                  variant="icon"
                />
                <div>
                  <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                    <span className="text-[#0a3370]">Jan Loan</span>
                    <span className="text-[#16a34a]">Setu</span>
                    <span className="text-slate-500 font-bold text-sm">(जन ऋण सेतु)</span>
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold leading-tight">
                    {isHindi 
                      ? 'राष्ट्रीय सरकारी रियायती ऋण योजना एवं चैनल पार्टनर पूर्व-आवेदन टोकन' 
                      : 'National Concessional Loan Scheme & Channel Partner Eligibility Token'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">
                    CONNECTING YOU TO OPPORTUNITIES • SARKARI LOAN SCHEMES
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono bg-slate-50 p-2 sm:p-0 rounded-lg sm:bg-transparent border sm:border-0 border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Token Ref Number</span>
                <span className="text-xs sm:text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 inline-block">
                  {refNumber}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Issue Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Section 1: Beneficiary Profile & Recommended Scheme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 sm:p-4.5 rounded-xl border border-slate-200">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-700" />
                  1. Applicant Profile (लाभार्थी विवरण)
                </h3>
                <div className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                  <p><strong>Name:</strong> {profile.name || '(Applicant Name to be written)'}</p>
                  <p><strong>Category:</strong> <span className="font-bold text-slate-900">{profile.category}</span> • <strong>Gender:</strong> {profile.gender.toUpperCase()}</p>
                  <p><strong>Annual Family Income:</strong> {formatINR(profile.annualFamilyIncome)}/year</p>
                  <p><strong>Location:</strong> {profile.district ? `${profile.district}, ` : ''}{profile.state}{profile.pincode ? ` (PIN: ${profile.pincode})` : ''}</p>
                  <p><strong>Project Activity:</strong> {profile.businessIdea || profile.purpose.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 sm:p-4.5 rounded-xl border border-slate-200">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-indigo-700" />
                  2. Targeted Scheme (अनुशंसित योजना)
                </h3>
                <div className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                  <p className="font-bold text-slate-900">{scheme.title} ({scheme.code})</p>
                  <p className="text-xs text-slate-600">Apex Corp: {scheme.corporation}</p>
                  <p><strong>Concessional Interest:</strong> <span className="text-emerald-700 font-bold">{interestRate}% p.a.</span></p>
                  <p><strong>Max Entitlement:</strong> {formatINRLakhCrore(scheme.maxLoanAmount)}</p>
                  <p><strong>Promoter Margin:</strong> {scheme.promoterContributionPercent}% ({formatINR(financials.promoterShare)})</p>
                </div>
              </div>
            </div>

            {/* Section 2: Calculated Loan Financials */}
            <div className="bg-emerald-50/70 border-2 border-emerald-600 p-4 sm:p-4.5 rounded-xl">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-950 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                3. Financial Sanction Breakdown (ऋण व ईएमआई सारांश)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-sans block">Total Project Cost</span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{formatINR(financials.projectCost)}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-sans block">Sanctioned Loan</span>
                  <span className="font-bold text-emerald-700 text-sm sm:text-base">{formatINR(financials.loanAmount)}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-sans block">Monthly Installment</span>
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base">{formatINR(financials.monthlyEMI)}/mo</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-sans block">Repayment Tenure</span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{financials.tenureYears} Years</span>
                </div>
              </div>
            </div>

            {/* Section 3: Assigned Channel Partner Branch */}
            <div className="bg-slate-50 p-4 sm:p-4.5 rounded-xl border border-slate-200">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-indigo-700" />
                4. Assigned Channel Partner (अधिकृत बैंक शाखा / एससीए कार्यालय)
              </h3>
              {partner ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-[13px] text-slate-700">
                  <div>
                    <p className="font-bold text-slate-900 text-sm sm:text-base">{partner.name}</p>
                    <p className="font-medium text-slate-700">{partner.branchName} ({partner.typeLabel})</p>
                    <p className="text-slate-600 mt-1">📍 {partner.address}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p><strong>Nodal Officer:</strong> {partner.contactPerson} ({partner.designation})</p>
                    <p><strong>Phone:</strong> {partner.phone} • <strong>Hours:</strong> {partner.workingHours}</p>
                    <p className="text-emerald-700 font-bold">✅ Authorized Processing Desk for {scheme.code}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600">
                  Designated District Branch / Lead Bank in {profile.district || 'Giridih'}, {profile.state || 'Jharkhand'}.
                </p>
              )}
            </div>

            {/* Section 4: Mandatory Document Checklist */}
            <div className="border border-slate-200 p-4 sm:p-4.5 rounded-xl bg-white">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-3">
                5. Mandatory Documents Checklist (साथ ले जाने वाले आवश्यक दस्तावेज)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px] text-slate-700">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded border-2 border-slate-400 bg-white inline-block shrink-0 mt-0.5 shadow-2xs" />
                    <span>{doc}</span>
                  </div>
                ))}
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded border-2 border-slate-400 bg-white inline-block shrink-0 mt-0.5 shadow-2xs" />
                  <span>2 Recent Passport Size Photographs</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded border-2 border-slate-400 bg-white inline-block shrink-0 mt-0.5 shadow-2xs" />
                  <span>Project Quotation / Estimated Machinery Cost Invoice</span>
                </div>
              </div>
            </div>

            {/* Verification Footer & Signatures */}
            <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
              <span className="font-medium">Digitally verified through Jan Loan Setu Portal (जन ऋण सेतु)</span>
              <span className="font-semibold text-slate-700">Beneficiary Signature: _______________________</span>
            </div>
          </div>

          {/* Direct PDF File Guide Banner */}
          <div className="mt-4 p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5 max-w-3xl mx-auto print:hidden">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {isHindi ? 'सीधे पीडीएफ डाउनलोड:' : 'Direct PDF File Export:'}
              </span>{' '}
              {isHindi
                ? '"पीडीएफ डाउनलोड करें" बटन दबाते ही आधिकारिक डिजिटल पर्ची आपकी डिवाइस में सीधे सेव हो जाएगी।'
                : 'Clicking "Download PDF" generates and saves a crystal-clear official A4 document directly to your device.'}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden">
          <button
            id="btn-slip-bottom-close"
            onClick={onClose}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto px-5 py-2.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer text-center disabled:opacity-50"
          >
            {isHindi ? 'बंद करें' : 'Close Slip'}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="btn-slip-bottom-download-pdf"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {isGeneratingPdf 
                  ? (isHindi ? 'पीडीएफ फाइल तैयार हो रही है...' : 'Generating PDF File...') 
                  : downloadSuccess
                  ? (isHindi ? 'पीडीएफ डाउनलोड हो गया!' : 'PDF Downloaded!')
                  : (isHindi ? 'आवेदन पर्ची डाउनलोड करें (PDF)' : 'Download Application Slip (PDF)')}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
