import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, Navigation, Phone, Mail, Clock, CheckCircle2, 
  Building, Landmark, ShieldCheck, Search, Filter, ExternalLink, 
  FileText, ArrowUpRight, Compass, AlertTriangle, Layers, Radio,
  Loader2, Award, Zap, ArrowRight
} from 'lucide-react';
import { ChannelPartner, LoanScheme, UserFinancialProfile, PincodeLookupResult } from '../types';
import { searchChannelPartners, resolveLocation, KNOWN_LOCATIONS, lookupPincode, lookupPincodeSync, getNearestPartnerForScheme } from '../utils/locator';
import { PartnerMapView } from './PartnerMapView';

interface PartnerLocatorProps {
  selectedScheme: LoanScheme;
  allSchemes: LoanScheme[];
  onSelectScheme: (scheme: LoanScheme) => void;
  profile: UserFinancialProfile;
  onOpenSlipModalWithPartner: (scheme: LoanScheme, partner: ChannelPartner) => void;
  isHindi: boolean;
}

export const PartnerLocator: React.FC<PartnerLocatorProps> = ({
  selectedScheme,
  allSchemes,
  onSelectScheme,
  profile,
  onOpenSlipModalWithPartner,
  isHindi
}) => {
  const [pincodeInput, setPincodeInput] = useState<string>(profile.pincode || '815301');
  const [detectedLocation, setDetectedLocation] = useState<PincodeLookupResult | null>(() => lookupPincodeSync(profile.pincode || '815301'));
  const [isDetectingPin, setIsDetectingPin] = useState<boolean>(false);
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>(profile.district || 'Giridih');
  const [schemeFilterId, setSchemeFilterId] = useState<string>(selectedScheme?.id || 'all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [activeUserCoords, setActiveUserCoords] = useState<{ latitude: number; longitude: number } | undefined>(
    resolveLocation(profile.pincode || profile.district || 'Giridih') || { latitude: 24.1856, longitude: 86.3072 }
  );

  // Quick PIN Selection Chips
  const QUICK_PINS = [
    { pin: '815301', district: 'Giridih', state: 'Jharkhand' },
    { pin: '834001', district: 'Ranchi', state: 'Jharkhand' },
    { pin: '826001', district: 'Dhanbad', state: 'Jharkhand' },
    { pin: '800001', district: 'Patna', state: 'Bihar' },
    { pin: '226001', district: 'Lucknow', state: 'Uttar Pradesh' },
    { pin: '110001', district: 'Delhi', state: 'Delhi' },
    { pin: '400001', district: 'Mumbai', state: 'Maharashtra' },
    { pin: '302001', district: 'Jaipur', state: 'Rajasthan' },
    { pin: '462001', district: 'Bhopal', state: 'Madhya Pradesh' },
    { pin: '700001', district: 'Kolkata', state: 'West Bengal' },
    { pin: '380001', district: 'Ahmedabad', state: 'Gujarat' },
    { pin: '751001', district: 'Bhubaneswar', state: 'Odisha' },
    { pin: '160017', district: 'Chandigarh', state: 'Punjab' },
    { pin: '560001', district: 'Bengaluru', state: 'Karnataka' },
    { pin: '781001', district: 'Guwahati', state: 'Assam' },
    { pin: '695001', district: 'Thiruvananthapuram', state: 'Kerala' },
  ];

  // Handle Pincode Auto-detection
  const handlePincodeChange = (pin: string) => {
    const cleanPin = pin.replace(/\D/g, '').slice(0, 6);
    setPincodeInput(cleanPin);

    const syncRes = lookupPincodeSync(cleanPin);
    if (syncRes) {
      setDetectedLocation(syncRes);
      setSearchLocationQuery(syncRes.district);
      setActiveUserCoords({ latitude: syncRes.latitude, longitude: syncRes.longitude });
    }

    if (cleanPin.length === 6) {
      setIsDetectingPin(true);
      lookupPincode(cleanPin).then(res => {
        setIsDetectingPin(false);
        if (res) {
          setDetectedLocation(res);
          setSearchLocationQuery(res.district);
          setActiveUserCoords({ latitude: res.latitude, longitude: res.longitude });
        }
      });
    }
  };

  const handleSelectQuickPin = (pinItem: { pin: string; district: string; state: string }) => {
    handlePincodeChange(pinItem.pin);
  };

  // Handle Location Detection via GPS
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert(isHindi ? 'आपका ब्राउज़र जियोलोकेशन समर्थित नहीं करता है।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setActiveUserCoords(coords);
        setSearchLocationQuery(isHindi ? 'वर्तमान जीपीएस स्थान' : 'Current GPS Location');
      },
      (err) => {
        setIsLocatingUser(false);
        const res = resolveLocation(pincodeInput || profile.district || 'Giridih');
        if (res) setActiveUserCoords({ latitude: res.latitude, longitude: res.longitude });
      },
      { timeout: 8000 }
    );
  };

  // Search & Filter Partners
  const filteredPartners = useMemo(() => {
    const resolved = resolveLocation(pincodeInput) || resolveLocation(searchLocationQuery);
    const coords = resolved ? { latitude: resolved.latitude, longitude: resolved.longitude } : activeUserCoords;

    return searchChannelPartners({
      schemeId: schemeFilterId === 'all' ? undefined : schemeFilterId,
      partnerType: partnerTypeFilter === 'all' ? undefined : partnerTypeFilter,
      userCoords: coords,
      searchQuery: searchLocationQuery.toLowerCase() !== 'current gps location' && searchLocationQuery.toLowerCase() !== 'वर्तमान जीपीएस स्थान' ? searchLocationQuery : undefined
    });
  }, [pincodeInput, searchLocationQuery, schemeFilterId, partnerTypeFilter, activeUserCoords]);

  // Derive Current Active Scheme
  const activeScheme = useMemo(() => {
    if (schemeFilterId !== 'all') {
      return allSchemes.find(s => s.id === schemeFilterId) || selectedScheme;
    }
    return selectedScheme;
  }, [schemeFilterId, allSchemes, selectedScheme]);

  // Compute Nearest Institution specifically for activeScheme and location
  const topNearestInstitution = useMemo(() => {
    return getNearestPartnerForScheme(activeScheme.id, {
      latitude: activeUserCoords?.latitude,
      longitude: activeUserCoords?.longitude,
      district: detectedLocation?.district || searchLocationQuery,
      state: detectedLocation?.state || profile.state,
      pincode: pincodeInput
    });
  }, [activeScheme, activeUserCoords, detectedLocation, searchLocationQuery, profile.state, pincodeInput]);

  // Set first partner as default selected if none selected
  const currentPartner = selectedPartner || (filteredPartners.length > 0 ? filteredPartners[0] : null);

  // Derive Active Pincode based on query, profile, or current partner
  const currentPincode = useMemo(() => {
    if (pincodeInput && pincodeInput.trim().length === 6) return pincodeInput.trim();
    const pinMatch = searchLocationQuery.match(/\b\d{6}\b/);
    if (pinMatch) return pinMatch[0];
    if (profile.pincode && profile.pincode.trim().length === 6) return profile.pincode.trim();
    if (currentPartner?.pincode) return currentPartner.pincode;
    return '815301';
  }, [pincodeInput, searchLocationQuery, profile.pincode, currentPartner]);

  return (
    <div id="channel-partner-locator-view" className="space-y-6">
      {/* Search & Location Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs text-slate-900 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              {isHindi ? 'पिन कोड स्वतः पहचान + अधिकृत बैंक/SCA' : 'PIN Code Auto-Detection + Scheme Authorized Institutions'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isHindi 
                ? 'पिन कोड आधारित निकटतम अधिकृत चैनल पार्टनर लोकेटर' 
                : 'PIN Code-Based Nearest Authorized Channel Partner Locator'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {isHindi
                ? '6-अंक पिन कोड दर्ज करते ही यह प्रणाली स्वतः आपके शहर/जिले की पहचान करती है और आपकी चयनित योजना हेतु निकटतम सक्रिय बैंक शाखा सुझाती है।'
                : 'Enter your 6-digit PIN code to automatically detect your district/city and pinpoint the closest authorized financial partner.'}
            </p>
          </div>

          <button
            id="btn-detect-gps-location"
            onClick={handleDetectGPS}
            disabled={isLocatingUser}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 whitespace-nowrap self-start lg:self-auto cursor-pointer"
          >
            <Navigation className={`w-4 h-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span>{isLocatingUser ? (isHindi ? 'स्थान खोज रहे हैं...' : 'Detecting GPS...') : (isHindi ? 'मेरा GPS स्थान उपयोग करें' : 'Use My GPS Location')}</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* PIN Code Input with Auto-Detection (4 cols) */}
          <div className="sm:col-span-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isHindi ? 'पिन कोड (Auto-Detects City)' : 'PIN Code (Auto-Detect)'}</span>
              </label>
              {isDetectingPin && (
                <span className="text-[10px] text-indigo-600 font-semibold animate-pulse flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Detecting...
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="input-partner-pincode"
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={e => handlePincodeChange(e.target.value)}
                placeholder="e.g. 815301, 834001, 800001"
                className="w-full bg-slate-50 border-2 border-indigo-300 focus:border-indigo-600 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          {/* Scheme Filter (4 cols) */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {isHindi ? 'योजना के अनुसार अधिकृत पार्टनर' : 'Scheme Authorization Filter'}
            </label>
            <select
              id="select-partner-scheme-filter"
              value={schemeFilterId}
              onChange={e => {
                setSchemeFilterId(e.target.value);
                const s = allSchemes.find(x => x.id === e.target.value);
                if (s) onSelectScheme(s);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium"
            >
              <option value="all">{isHindi ? 'सभी योजनाएं (All Schemes)' : 'All Schemes'}</option>
              {allSchemes.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Partner Type Filter (4 cols) */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {isHindi ? 'एजेंसी का प्रकार (Partner Type)' : 'Organization Type'}
            </label>
            <select
              id="select-partner-type-filter"
              value={partnerTypeFilter}
              onChange={e => setPartnerTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            >
              <option value="all">{isHindi ? 'सभी प्रकार (SCA, Bank, RRB, MFI)' : 'All Partner Types'}</option>
              <option value="SCA">{isHindi ? 'राज्य चैनलिंग एजेंसियां (SCAs)' : 'State Channelizing Agencies (SCAs)'}</option>
              <option value="PublicSectorBank">{isHindi ? 'राष्ट्रीयकृत बैंक (SBI, PNB, Canara, BoI)' : 'Public Sector Banks'}</option>
              <option value="RRB">{isHindi ? 'क्षेत्रीय ग्रामीण बैंक (RRBs)' : 'Regional Rural Banks (RRBs)'}</option>
              <option value="NBFC_MFI">{isHindi ? 'माइक्रो-फाइनेंस संस्थान (MFIs)' : 'NBFC-MFIs'}</option>
            </select>
          </div>
        </div>

        {/* Quick PIN Code Test Chips */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 font-bold whitespace-nowrap">{isHindi ? 'त्वरित पिन:' : 'Popular PINs:'}</span>
          {QUICK_PINS.map(item => (
            <button
              key={item.pin}
              onClick={() => handleSelectQuickPin(item)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition whitespace-nowrap cursor-pointer border ${
                pincodeInput === item.pin
                  ? 'bg-indigo-900 text-white border-indigo-900 font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {item.pin} ({item.district})
            </button>
          ))}
        </div>

        {/* TOP SUGGESTED NEAREST INSTITUTION BANNER */}
        {topNearestInstitution && (
          <div id="top-suggested-partner-banner" className="mt-2 p-4 rounded-xl bg-linear-to-r from-emerald-900 via-indigo-950 to-slate-900 text-white border-2 border-emerald-400 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-slate-950" />
                  {isHindi ? 'स्वतः पहचानी गई निकटतम संस्था' : 'Auto-Detected Nearest Institution'}
                </span>
                <span className="text-xs text-emerald-300 font-mono font-bold">
                  📍 {detectedLocation?.district || searchLocationQuery}, {detectedLocation?.state || profile.state} (PIN {pincodeInput})
                </span>
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-base font-black text-white tracking-tight">
                  {topNearestInstitution.partner.name}
                </h3>
                <span className="text-xs text-indigo-200 font-medium">
                  • {topNearestInstitution.partner.branchName}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <span>📍 {topNearestInstitution.partner.address}</span>
                <span className="text-emerald-400 font-mono font-black">
                  ({topNearestInstitution.distanceKm} km away {topNearestInstitution.isDistrictMatch ? '• Same District' : ''})
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedPartner(topNearestInstitution.partner)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-700" />
                <span>{isHindi ? 'मैप पर देखें' : 'View on Map'}</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenSlipModalWithPartner(activeScheme, topNearestInstitution.partner)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                <span>{isHindi ? 'आवेदन पर्ची' : 'Get Slip'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List of Partners (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-700" />
              {isHindi ? 'अधिकृत चैनल पार्टनर सूची' : 'Eligible Channel Partners'}
            </h3>
            <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono font-bold">
              {filteredPartners.length} {isHindi ? 'पार्टनर मिले' : 'partners found'}
            </span>
          </div>

          {filteredPartners.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
              {filteredPartners.map((partner, index) => {
                const isSelected = currentPartner?.id === partner.id;
                const isTopNearest = index === 0;

                return (
                  <div
                    key={partner.id}
                    id={`partner-item-${partner.id}`}
                    onClick={() => setSelectedPartner(partner)}
                    className={`cursor-pointer rounded-2xl p-4 transition border ${
                      isSelected
                        ? 'bg-indigo-50/60 border-2 border-indigo-600 shadow-xs text-slate-900'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            partner.type === 'SCA'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : partner.type === 'RRB'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {partner.typeLabel}
                          </span>
                          {isTopNearest && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                              ⭐ {isHindi ? 'निकटतम' : 'Nearest'}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mt-1.5">
                          {partner.name}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium">
                          {partner.branchName}
                        </p>
                      </div>

                      {partner.distanceKm !== undefined && (
                        <div className="bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 text-right whitespace-nowrap">
                          <span className="text-xs font-black text-emerald-800 font-mono flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {partner.distanceKm} km
                          </span>
                          <span className="text-[9px] text-slate-500 block">{isHindi ? 'दूरी' : 'away'}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-1 flex items-center gap-1">
                      <span>📍</span> {partner.address}
                    </p>

                    {/* Verification Badges */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isHindi ? 'योजना अधिकृत' : 'Authorized for Scheme'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">
                        {partner.activeStatus === 'Active' ? '✅ ' + (isHindi ? 'सक्रिय' : 'Active Desk') : partner.activeStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-xs">
              <AlertTriangle className="w-8 h-8 mx-auto text-amber-600 mb-2" />
              <p className="text-sm font-semibold text-slate-800">
                {isHindi ? 'कोई पार्टनर नहीं मिला' : 'No matching partners found'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isHindi ? 'कृपया जिला या योजना फ़िल्टर बदलें।' : 'Try changing district or scheme filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Partner Detailed Profile & Map Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentPartner ? (
            <div id="partner-detail-card" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                    {currentPartner.typeLabel}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {currentPartner.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {currentPartner.branchName} • {currentPartner.district}, {currentPartner.state}
                  </p>
                </div>

                {currentPartner.distanceKm !== undefined && (
                  <div className="bg-emerald-600 text-white font-black text-sm px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
                    <MapPin className="w-4 h-4" />
                    <span>{currentPartner.distanceKm} km {isHindi ? 'दूरी' : 'away'}</span>
                  </div>
                )}
              </div>

              {/* Interactive Google Map Locator */}
              <PartnerMapView
                userPincode={currentPincode}
                userLocationName={searchLocationQuery}
                userCoords={activeUserCoords}
                partners={filteredPartners}
                selectedPartner={currentPartner}
                onSelectPartner={(partner) => setSelectedPartner(partner)}
                isHindi={isHindi}
              />

              {/* Direct Maps & Address Quick Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 gap-2">
                <span className="truncate">📍 <strong>{isHindi ? 'पता:' : 'Address:'}</strong> {currentPartner.address}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentPartner.name + ' ' + currentPartner.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{isHindi ? 'गूगल मैप्स पर दिशा-निर्देश' : 'Get Directions in Maps'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Nodal Officer Contact & Working Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                    {isHindi ? 'नोडल अधिकारी / संपर्क व्यक्ति' : 'Nodal Officer / Contact'}
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {currentPartner.contactPerson}
                  </p>
                  <p className="text-xs text-indigo-700 font-semibold">
                    {currentPartner.designation}
                  </p>
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-700 font-mono">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-indigo-700" />
                      <a href={`tel:${currentPartner.phone}`} className="hover:underline text-slate-900 font-semibold">
                        {currentPartner.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-indigo-700" />
                      <span className="text-slate-700 truncate">{currentPartner.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                    {isHindi ? 'कार्यालय समय व निर्देश' : 'Working Hours & Instructions'}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentPartner.workingHours}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                    💡 {currentPartner.specialInstructions || 'Carry 2 passport photographs and original caste/income certificates for spot verification.'}
                  </p>
                </div>
              </div>

              {/* Supported Schemes Chips */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block mb-2">
                  {isHindi ? 'इस शाखा में स्वीकृत ऋण योजनाएं:' : 'Schemes Handled by this Channel Partner:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentPartner.supportedSchemeIds.map(sid => {
                    const sc = allSchemes.find(x => x.id === sid);
                    return (
                      <span
                        key={sid}
                        className="bg-white text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-medium shadow-xs"
                      >
                        ✅ {sc ? sc.title : sid}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <button
                  id="btn-partner-download-slip"
                  onClick={() => onOpenSlipModalWithPartner(selectedScheme, currentPartner)}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isHindi ? 'इस शाखा हेतु आवेदन पर्ची बनाएं' : 'Generate Application Slip for This Branch'}</span>
                </button>

                <a
                  href={`tel:${currentPartner.phone}`}
                  className="py-3 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{isHindi ? 'नोडल अधिकारी को कॉल करें' : 'Call Nodal Officer'}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
              <Landmark className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p>{isHindi ? 'विवरण देखने के लिए बाईं ओर से कोई चैनल पार्टनर चुनें।' : 'Select a channel partner from the list to view branch details.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
