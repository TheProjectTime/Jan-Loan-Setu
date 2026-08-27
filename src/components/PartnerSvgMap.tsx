import React, { useState, useMemo } from 'react';
import { 
  MapPin, Landmark, Building, ShieldCheck, Compass, 
  ZoomIn, ZoomOut, Layers, Navigation, Info, ExternalLink 
} from 'lucide-react';
import { ChannelPartner } from '../types';

interface PartnerSvgMapProps {
  userPincode: string;
  userLocationName: string;
  userCoords?: { latitude: number; longitude: number };
  partners: ChannelPartner[];
  selectedPartner: ChannelPartner | null;
  onSelectPartner: (partner: ChannelPartner) => void;
  isHindi: boolean;
}

export const PartnerSvgMap: React.FC<PartnerSvgMapProps> = ({
  userPincode,
  userLocationName,
  userCoords = { latitude: 24.1856, longitude: 86.3072 },
  partners,
  selectedPartner,
  onSelectPartner,
  isHindi
}) => {
  const [zoomRangeKm, setZoomRangeKm] = useState<number>(25); // 10km, 25km, 50km, 100km
  const [hoveredPartner, setHoveredPartner] = useState<ChannelPartner | null>(null);

  // SVG Stage Dimensions
  const svgWidth = 560;
  const svgHeight = 320;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const maxRadiusPx = Math.min(centerX, centerY) - 36; // Maximum radius within bounds

  // Calculate polar coordinates for each partner relative to user coordinates
  const plottedPartners = useMemo(() => {
    return partners.map((partner) => {
      const dLat = partner.latitude - userCoords.latitude;
      const dLon = partner.longitude - userCoords.longitude;
      
      // Calculate distance in km if not already present
      const distance = partner.distanceKm !== undefined 
        ? partner.distanceKm 
        : Math.round(Math.sqrt(Math.pow(dLat * 111, 2) + Math.pow(dLon * 111 * Math.cos(userCoords.latitude * Math.PI / 180), 2)) * 10) / 10;

      // Bearing angle in radians
      const angle = Math.atan2(dLon * Math.cos(userCoords.latitude * Math.PI / 180), dLat);

      // Clamp visual distance to zoom range with log scaling for very close/far items
      const normalizedDist = Math.min(distance / zoomRangeKm, 1.15);
      const radiusPx = Math.max(28, normalizedDist * maxRadiusPx);

      const x = centerX + radiusPx * Math.sin(angle);
      const y = centerY - radiusPx * Math.cos(angle);

      return {
        partner,
        distance,
        x: Math.max(30, Math.min(svgWidth - 30, x)),
        y: Math.max(30, Math.min(svgHeight - 30, y)),
        angle
      };
    });
  }, [partners, userCoords, zoomRangeKm, centerX, centerY, maxRadiusPx, svgWidth, svgHeight]);

  // Partner Type Color Coding
  const getPartnerColor = (type: string) => {
    switch (type) {
      case 'SCA':
        return { bg: '#4338ca', stroke: '#312e81', light: '#e0e7ff', text: '#3730a3', label: 'SCA' };
      case 'RRB':
        return { bg: '#0284c7', stroke: '#0369a1', light: '#e0f2fe', text: '#075985', label: 'RRB' };
      case 'NBFC_MFI':
        return { bg: '#d97706', stroke: '#b45309', light: '#fef3c7', text: '#92400e', label: 'NBFC' };
      case 'PublicSectorBank':
      default:
        return { bg: '#059669', stroke: '#047857', light: '#d1fae5', text: '#065f46', label: 'Bank' };
    }
  };

  // Find selected plotted partner coordinates
  const activePlotted = plottedPartners.find(p => p.partner.id === selectedPartner?.id);

  // Concentric radar ring distances based on current zoom range
  const ringDistances = [
    { label: `${Math.round(zoomRangeKm * 0.25)} km`, fraction: 0.25 },
    { label: `${Math.round(zoomRangeKm * 0.5)} km`, fraction: 0.5 },
    { label: `${Math.round(zoomRangeKm * 0.75)} km`, fraction: 0.75 },
    { label: `${zoomRangeKm} km`, fraction: 1.0 }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Header & Range Controls */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>{isHindi ? 'पिनकोड आधारित निकटतम पार्टनर रडार' : 'Pincode-Based Partner Proximity Radar'}</span>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-200">
                PIN: {userPincode || '815301'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {isHindi 
                ? `केंद्र: ${userLocationName || 'गिरिडीह'} • कुल ${partners.length} अधिकृत चैनल पार्टनर मैप किए गए` 
                : `Center: ${userLocationName || 'Current Location'} • ${partners.length} authorized channel partners plotted`}
            </p>
          </div>
        </div>

        {/* Zoom Range Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-semibold text-slate-500 px-1.5 hidden sm:inline">
            {isHindi ? 'दायरा:' : 'Radius:'}
          </span>
          {[10, 25, 50, 100].map(range => (
            <button
              key={range}
              onClick={() => setZoomRangeKm(range)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                zoomRangeKm === range
                  ? 'bg-indigo-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {range} km
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden bg-slate-900/95 flex items-center justify-center p-2 sm:p-4 select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[340px] drop-shadow-md"
          style={{ aspectRatio: `${svgWidth}/${svgHeight}` }}
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Radar Center Glow */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#1d4ed8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>

            {/* Selected Route Beam Gradient */}
            <linearGradient id="routeBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Pulsing Dot Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width={svgWidth} height={svgHeight} fill="url(#radarGrid)" />

          {/* Radar Ambient Radial Background */}
          <circle cx={centerX} cy={centerY} r={maxRadiusPx + 15} fill="url(#centerGlow)" />

          {/* Cardinal Direction Crosshair Lines */}
          <line x1={centerX} y1={centerY - maxRadiusPx - 10} x2={centerX} y2={centerY + maxRadiusPx + 10} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1={centerX - maxRadiusPx - 10} y1={centerY} x2={centerX + maxRadiusPx + 10} y2={centerY} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />

          {/* Cardinal Direction Labels */}
          <text x={centerX} y={centerY - maxRadiusPx - 16} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">N (उत्तर)</text>
          <text x={centerX + maxRadiusPx + 20} y={centerY + 3} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="start">E (पूर्व)</text>
          <text x={centerX} y={centerY + maxRadiusPx + 22} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">S (दक्षिण)</text>
          <text x={centerX - maxRadiusPx - 20} y={centerY + 3} fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">W (पश्चिम)</text>

          {/* Range Concentric Rings */}
          {ringDistances.map((ring, idx) => {
            const r = ring.fraction * maxRadiusPx;
            return (
              <g key={idx}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={r}
                  fill="none"
                  stroke="#334155"
                  strokeWidth={idx === ringDistances.length - 1 ? "1.5" : "1"}
                  strokeDasharray={idx === ringDistances.length - 1 ? "none" : "4 4"}
                  strokeOpacity="0.7"
                />
                <rect
                  x={centerX + 6}
                  y={centerY - r - 8}
                  width="38"
                  height="14"
                  rx="3"
                  fill="#0f172a"
                  fillOpacity="0.8"
                />
                <text
                  x={centerX + 25}
                  y={centerY - r + 3}
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {ring.label}
                </text>
              </g>
            );
          })}

          {/* Dynamic Laser Route to Selected Partner */}
          {activePlotted && (
            <g className="animate-pulse">
              <line
                x1={centerX}
                y1={centerY}
                x2={activePlotted.x}
                y2={activePlotted.y}
                stroke="url(#routeBeam)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
              {/* Distance Tag in Middle of Route */}
              <g transform={`translate(${(centerX + activePlotted.x) / 2}, ${(centerY + activePlotted.y) / 2})`}>
                <rect
                  x="-24"
                  y="-9"
                  width="48"
                  height="18"
                  rx="9"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="3"
                  fill="#ecfdf5"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {activePlotted.distance} km
                </text>
              </g>
            </g>
          )}

          {/* Plotted Partner Nodes */}
          {plottedPartners.map(({ partner, distance, x, y }) => {
            const isSelected = selectedPartner?.id === partner.id;
            const isHovered = hoveredPartner?.id === partner.id;
            const color = getPartnerColor(partner.type);

            return (
              <g
                key={partner.id}
                id={`svg-partner-node-${partner.id}`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectPartner(partner)}
                onMouseEnter={() => setHoveredPartner(partner)}
                onMouseLeave={() => setHoveredPartner(null)}
              >
                {/* Outer Selection / Hover Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? "22" : "18"}
                    fill={color.bg}
                    fillOpacity="0.25"
                    stroke={isSelected ? "#fbbf24" : color.bg}
                    strokeWidth="2"
                    strokeDasharray={isSelected ? "3 3" : "none"}
                    className="animate-spin-slow"
                  />
                )}

                {/* Partner Node Base Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "14" : "11"}
                  fill={isSelected ? "#ffffff" : color.bg}
                  stroke={isSelected ? "#fbbf24" : "#ffffff"}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  filter={isSelected ? "url(#glow)" : undefined}
                />

                {/* Partner Node Label Badge */}
                <text
                  x={x}
                  y={y + 3.5}
                  fill={isSelected ? color.bg : "#ffffff"}
                  fontSize={isSelected ? "9" : "8"}
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {color.label.charAt(0)}
                </text>

                {/* Micro Label Tag below node */}
                <g transform={`translate(${x}, ${y + (isSelected ? 24 : 20)})`}>
                  <rect
                    x="-34"
                    y="-8"
                    width="68"
                    height="16"
                    rx="4"
                    fill="#0f172a"
                    fillOpacity="0.85"
                    stroke={isSelected ? "#fbbf24" : "#334155"}
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y="3.5"
                    fill={isSelected ? "#fef08a" : "#e2e8f0"}
                    fontSize="8"
                    fontWeight={isSelected ? "bold" : "normal"}
                    textAnchor="middle"
                    className="truncate"
                  >
                    {partner.name.length > 10 ? partner.name.slice(0, 9) + '..' : partner.name} ({distance}k)
                  </text>
                </g>
              </g>
            );
          })}

          {/* Center Point: User Location / Pincode Node */}
          <g id="svg-user-center-node">
            {/* Pulsing Beacon Rings */}
            <circle cx={centerX} cy={centerY} r="20" fill="#3b82f6" fillOpacity="0.15" className="animate-ping" />
            <circle cx={centerX} cy={centerY} r="14" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx={centerX} cy={centerY} r="5" fill="#ffffff" />

            {/* Center Pincode Pill */}
            <g transform={`translate(${centerX}, ${centerY - 22})`}>
              <rect
                x="-42"
                y="-10"
                width="84"
                height="20"
                rx="10"
                fill="#1e3a8a"
                stroke="#60a5fa"
                strokeWidth="1.5"
                filter="url(#glow)"
              />
              <text
                x="0"
                y="3.5"
                fill="#ffffff"
                fontSize="9"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                📍 PIN: {userPincode || '815301'}
              </text>
            </g>
          </g>
        </svg>

        {/* Hover / Tooltip Floating Card Overlay */}
        {(hoveredPartner || selectedPartner) && (
          <div className="absolute bottom-2 left-2 right-2 sm:right-auto sm:max-w-xs bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white p-2.5 rounded-xl shadow-xl text-xs z-20 pointer-events-none transition-all">
            {(() => {
              const p = hoveredPartner || selectedPartner!;
              const color = getPartnerColor(p.type);
              return (
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                    <span 
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: color.bg, color: '#ffffff' }}
                    >
                      {p.typeLabel}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold text-[10px]">
                      📍 {p.distanceKm || 'Nearby'} km away
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-100 truncate">{p.name}</h5>
                  <p className="text-[11px] text-slate-400 truncate">{p.branchName} • PIN: {p.pincode}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 mt-1 pt-1 border-t border-slate-800">
                    <span>Nodal: {p.contactPerson}</span>
                    <span className="text-amber-300 font-bold">📞 {p.phone}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Interactive Legend & Filter Bar */}
      <div className="bg-white px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {isHindi ? 'संकेतक (Legend):' : 'Partner Types:'}
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4338ca] inline-block"></span>
            SCA ({isHindi ? 'राज्य एजेंसी' : 'State Agency'})
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] inline-block"></span>
            {isHindi ? 'सार्वजनिक बैंक' : 'Public Bank (SBI/PNB)'}
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] inline-block"></span>
            {isHindi ? 'ग्रामीण बैंक' : 'RRB (Gramin Bank)'}
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] inline-block"></span>
            {isHindi ? 'माइक्रो-फाइनेंस' : 'NBFC-MFI'}
          </span>
        </div>

        <span className="text-[11px] text-slate-500 italic hidden md:inline">
          {isHindi ? '💡 किसी भी नोड पर क्लिक करके सीधे उसका विवरण देखें।' : '💡 Click any SVG node to view branch dossier.'}
        </span>
      </div>
    </div>
  );
};
