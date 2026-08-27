import React, { useState, useMemo } from 'react';
import { 
  MapPin, Navigation, Phone, Mail, Clock, CheckCircle2, 
  Building, Landmark, ShieldCheck, Search, Filter, ExternalLink, 
  FileText, ArrowUpRight, Compass, AlertTriangle, Layers, Radio
} from 'lucide-react';
import { ChannelPartner, LoanScheme, UserFinancialProfile } from '../types';
import { searchChannelPartners, resolveLocation, KNOWN_LOCATIONS } from '../utils/locator';
import { PartnerSvgMap } from './PartnerSvgMap';

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
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>(profile.district || 'Giridih');
  const [schemeFilterId, setSchemeFilterId] = useState<string>(selectedScheme?.id || 'all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [activeUserCoords, setActiveUserCoords] = useState<{ latitude: number; longitude: number } | undefined>(
    resolveLocation(profile.district || 'Giridih') || { latitude: 24.1856, longitude: 86.3072 }
  );

  // Quick District Selection Chips
  const QUICK_DISTRICTS = ['Giridih', 'Ranchi', 'Dhanbad', 'Patna', 'Lucknow', 'Varanasi', 'Delhi', 'Mumbai', 'Jaipur', 'Bhopal', 'Kolkata', 'Bengaluru'];

  // Handle Location Detection
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
        // Fallback to district
        const res = resolveLocation(profile.district || 'Giridih');
        if (res) setActiveUserCoords({ latitude: res.latitude, longitude: res.longitude });
      },
      { timeout: 8000 }
    );
  };

  const handleSelectQuickDistrict = (district: string) => {
    setSearchLocationQuery(district);
    const resolved = resolveLocation(district);
    if (resolved) {
      setActiveUserCoords({ latitude: resolved.latitude, longitude: resolved.longitude });
    }
  };

  // Search & Filter Partners
  const filteredPartners = useMemo(() => {
    // Resolve search location coordinates if query changes
    const resolved = resolveLocation(searchLocationQuery);
    const coords = resolved ? { latitude: resolved.latitude, longitude: resolved.longitude } : activeUserCoords;

    return searchChannelPartners({
      schemeId: schemeFilterId === 'all' ? undefined : schemeFilterId,
      partnerType: partnerTypeFilter === 'all' ? undefined : partnerTypeFilter,
      userCoords: coords,
      searchQuery: searchLocationQuery.toLowerCase() !== 'current gps location' && searchLocationQuery.toLowerCase() !== 'वर्तमान जीपीएस स्थान' ? searchLocationQuery : undefined
    });
  }, [searchLocationQuery, schemeFilterId, partnerTypeFilter, activeUserCoords]);

  // Set first partner as default selected if none selected
  const currentPartner = selectedPartner || (filteredPartners.length > 0 ? filteredPartners[0] : null);

  // Derive Active Pincode based on query, profile, or current partner
  const currentPincode = useMemo(() => {
    const pinMatch = searchLocationQuery.match(/\b\d{6}\b/);
    if (pinMatch) return pinMatch[0];
    if (profile.pincode && profile.pincode.trim().length === 6) return profile.pincode.trim();
    if (currentPartner?.pincode) return currentPartner.pincode;
    return '815301';
  }, [searchLocationQuery, profile.pincode, currentPartner]);

  return (
    <div id="channel-partner-locator-view" className="space-y-8">
      {/* Search & Location Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              {isHindi ? 'Google Maps + ऋण पात्रता' : 'Google Maps + Loan Eligibility'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isHindi 
                ? 'निकटतम अधिकृत चैनल पार्टनर (बैंक / SCA) खोजें' 
                : 'Locate Nearest Authorized Channel Partner for Application'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {isHindi
                ? 'Jan Loan Setu केवल निकटतम बैंक नहीं दिखाता, बल्कि वह बैंक/एजेंसी ढूंढता है जो आपकी चयनित योजना को प्रोसेस करने हेतु अधिकृत और सक्रिय है।'
                : 'Finds partners that are: Nearby + Authorized for your Scheme + Currently accepting applications.'}
            </p>
          </div>

          <button
            id="btn-detect-gps-location"
            onClick={handleDetectGPS}
            disabled={isLocatingUser}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 whitespace-nowrap self-start lg:self-auto"
          >
            <Navigation className={`w-4 h-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span>{isLocatingUser ? (isHindi ? 'स्थान खोज रहे हैं...' : 'Detecting GPS...') : (isHindi ? 'मेरा वर्तमान स्थान उपयोग करें' : 'Use My GPS Location')}</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Location Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'जिला / शहर या पिनकोड' : 'District, City or Pincode'}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-partner-search"
                type="text"
                value={searchLocationQuery}
                onChange={e => {
                  setSearchLocationQuery(e.target.value);
                  const res = resolveLocation(e.target.value);
                  if (res) setActiveUserCoords({ latitude: res.latitude, longitude: res.longitude });
                }}
                placeholder="e.g. Giridih, Ranchi, Patna, 815301..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Scheme Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            >
              <option value="all">{isHindi ? 'सभी योजनाएं (All Schemes)' : 'All Schemes'}</option>
              {allSchemes.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Partner Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'एजेंसी का प्रकार (Partner Type)' : 'Organization Type'}
            </label>
            <select
              id="select-partner-type-filter"
              value={partnerTypeFilter}
              onChange={e => setPartnerTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
            >
              <option value="all">{isHindi ? 'सभी प्रकार (SCA, Bank, RRB, MFI)' : 'All Partner Types'}</option>
              <option value="SCA">{isHindi ? 'राज्य चैनलिंग एजेंसियां (SCAs)' : 'State Channelizing Agencies (SCAs)'}</option>
              <option value="PublicSectorBank">{isHindi ? 'राष्ट्रीयकृत बैंक (SBI, PNB, Canara)' : 'Public Sector Banks'}</option>
              <option value="RRB">{isHindi ? 'क्षेत्रीय ग्रामीण बैंक (RRBs)' : 'Regional Rural Banks (RRBs)'}</option>
              <option value="NBFC_MFI">{isHindi ? 'माइक्रो-फाइनेंस संस्थान (MFIs)' : 'NBFC-MFIs'}</option>
            </select>
          </div>
        </div>

        {/* Quick District Buttons */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">{isHindi ? 'त्वरित शहर:' : 'Popular Districts:'}</span>
          {QUICK_DISTRICTS.map(d => (
            <button
              key={d}
              onClick={() => handleSelectQuickDistrict(d)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition whitespace-nowrap ${
                searchLocationQuery.toLowerCase() === d.toLowerCase()
                  ? 'bg-indigo-900 text-white border-indigo-900 font-bold'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
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

              {/* Interactive SVG-based Partner Proximity Radar */}
              <PartnerSvgMap
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
