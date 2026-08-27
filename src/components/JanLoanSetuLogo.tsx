import React from 'react';

interface JanLoanSetuLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isHindi?: boolean;
}

export const JanLoanSetuLogo: React.FC<JanLoanSetuLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  isHindi = false
}) => {
  // Dimension sizing for the SVG Icon
  const getIconDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: 36, height: 36 };
      case 'lg':
        return { width: 68, height: 68 };
      case 'xl':
        return { width: 120, height: 120 };
      case 'md':
      default:
        return { width: 48, height: 48 };
    }
  };

  const { width, height } = getIconDimensions();

  // Pure SVG Emblem Representation
  const EmblemSvg = (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className="shrink-0 drop-shadow-2xs select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for the sweeping outer circle */}
        <linearGradient id="circleArcGrad" x1="20" y1="180" x2="180" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0a3370" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="85%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>

        {/* River Pathway Gradient */}
        <linearGradient id="riverPathGrad" x1="100" y1="100" x2="70" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0c3a72" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Leaf Gradient */}
        <linearGradient id="leafGrad" x1="140" y1="70" x2="180" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>

      {/* 1. Outer Crescent Arc Enclosing Ring */}
      <path
        d="M 64 165 C 24 140 16 75 58 35 C 98 -3 162 5 180 58 C 185 75 185 96 172 118 C 160 138 140 156 116 166"
        stroke="url(#circleArcGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* 2. Sprouting Green Leaf on the Right Rim */}
      <g transform="translate(142, 68) rotate(15)">
        <path
          d="M 0 24 C 5 8 20 0 32 0 C 32 15 25 30 10 32 C 3 32 0 28 0 24 Z"
          fill="url(#leafGrad)"
        />
        <path
          d="M 2 24 C 12 18 20 10 30 2"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
      </g>

      {/* 3. Radiant Sunbeam Dashes above the Rupee Symbol */}
      <g stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
        <line x1="100" y1="18" x2="100" y2="24" />
        <line x1="86" y1="22" x2="90" y2="27" />
        <line x1="114" y1="22" x2="110" y2="27" />
        <line x1="75" y1="31" x2="80" y2="35" />
        <line x1="125" y1="31" x2="120" y2="35" />
      </g>

      {/* 4. Rupee Currency Symbol (₹) Floating at Apex */}
      <text
        x="100"
        y="46"
        fill="#0a3370"
        fontSize="24"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
      >
        ₹
      </text>

      {/* 5. Left Person Figure (Citizen - Deep Blue) */}
      <g fill="#0a3370">
        {/* Head */}
        <circle cx="72" cy="40" r="7.5" />
        {/* Body & Arm reaching for Handshake */}
        <path d="M 62 70 L 62 50 C 62 47 66 45 71 45 C 76 45 80 47 80 50 L 80 58 L 96 66 C 99 67 101 70 99 73 C 98 75 95 76 93 75 L 75 66 L 75 70 Z" />
      </g>

      {/* 6. Right Person Figure (Partner/Advisor - Vibrant Green) */}
      <g fill="#16a34a">
        {/* Head */}
        <circle cx="128" cy="40" r="7.5" />
        {/* Body & Arm reaching for Handshake */}
        <path d="M 138 70 L 138 50 C 138 47 134 45 129 45 C 124 45 120 47 120 50 L 120 58 L 104 66 C 101 67 99 70 101 73 C 102 75 105 76 107 75 L 125 66 L 125 70 Z" />
      </g>

      {/* Handshake Joint Dot */}
      <circle cx="100" cy="71" r="3.5" fill="#15803d" />

      {/* 7. Bridge Structure (Setu) with Pillars & Railings */}
      <g fill="#0a3370">
        {/* Bridge Main Deck Body with 3 Arches Cutout */}
        <path
          d="M 45 77 
             C 70 73, 130 73, 155 77 
             L 155 105 
             C 142 105, 142 85, 130 85 
             C 118 85, 118 105, 100 105 
             C 82 105, 82 85, 70 85 
             C 58 85, 58 105, 45 105 
             Z"
        />

        {/* Bridge Top Railing Line */}
        <path
          d="M 45 75 C 70 71, 130 71, 155 75"
          stroke="#07234d"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bridge Posts / Finials on Railing */}
        <rect x="49" y="69" width="4" height="7" rx="1.5" fill="#0a3370" />
        <circle cx="51" cy="68" r="2.5" fill="#0a3370" />

        <rect x="98" y="67" width="4" height="8" rx="1.5" fill="#0a3370" />
        <circle cx="100" cy="66" r="2.5" fill="#0a3370" />

        <rect x="147" y="69" width="4" height="7" rx="1.5" fill="#0a3370" />
        <circle cx="149" cy="68" r="2.5" fill="#0a3370" />
      </g>

      {/* 8. White Arch Highlights inside the 3 Arches */}
      <path
        d="M 47 105 C 57 105, 57 87, 69 87 C 81 87, 81 105, 91 105"
        fill="#ffffff"
      />
      <path
        d="M 77 105 C 87 105, 87 87, 100 87 C 113 87, 113 105, 123 105"
        fill="#ffffff"
      />
      <path
        d="M 109 105 C 119 105, 119 87, 131 87 C 143 87, 143 105, 153 105"
        fill="#ffffff"
      />

      {/* 9. Flowing River / Road Pathway underneath the Center Arch */}
      <path
        d="M 100 102 
           C 115 106, 145 118, 140 135 
           C 134 152, 95 160, 52 170 
           C 80 162, 112 154, 115 138 
           C 118 122, 92 112, 100 102 Z"
        fill="url(#riverPathGrad)"
      />
      {/* Dynamic Road Curving Swath */}
      <path
        d="M 72 165 C 105 156, 128 142, 125 125 C 122 108, 98 104, 100 102 L 95 103 C 90 106, 108 116, 106 128 C 102 144, 75 155, 55 168 Z"
        fill="#0284c7"
      />
      {/* Front sweeping road lane divider */}
      <path
        d="M 68 163 C 96 153, 116 138, 112 122"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  // Icon only variant
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {EmblemSvg}
      </div>
    );
  }

  // Vertical stacked / full badge variant (Ideal for hero, splash, slip headers)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {EmblemSvg}
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
            <span className="text-[#0a3370]">Jan Loan </span>
            <span className="text-[#16a34a]">Setu</span>
          </div>

          <div className="flex items-center justify-center gap-2 my-1.5 text-slate-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest">
            <span className="h-[1.5px] w-6 bg-slate-800"></span>
            <span>{isHindi ? 'अवसरों से आपका जुड़ाव' : 'CONNECTING YOU TO OPPORTUNITIES'}</span>
            <span className="h-[1.5px] w-6 bg-slate-800"></span>
          </div>

          <div className="text-[11px] sm:text-xs text-slate-600 font-medium tracking-tight">
            {isHindi ? (
              <span>सरकारी ऋण योजनाएं • विश्वसनीय पार्टनर • उज्ज्वल भविष्य</span>
            ) : (
              <span>Sarkari Loan Schemes • Trusted Partners • Better Tomorrow</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal navbar layout variant
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {EmblemSvg}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            <span className="text-[#0a3370]">Jan Loan </span>
            <span className="text-[#16a34a]">Setu</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase tracking-wider">
          <span className="hidden md:inline h-[1px] w-3 bg-slate-400"></span>
          <span className="truncate">
            {isHindi ? 'अवसरों से जुड़ाव' : 'CONNECTING YOU TO OPPORTUNITIES'}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium hidden lg:block leading-tight">
          {isHindi ? 'सरकारी ऋण योजनाएं • अधिकृत पार्टनर' : 'Sarkari Loan Schemes • Trusted Partners'}
        </div>
      </div>
    </div>
  );
};
