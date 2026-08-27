import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, Landmark, Building, ShieldCheck, Compass, 
  ZoomIn, ZoomOut, Layers, Navigation, Info, ExternalLink,
  Maximize2, Minimize2, Eye, Map as MapIcon, Globe, Navigation2,
  Phone, Clock, ArrowRight, Share2, CheckCircle2
} from 'lucide-react';
import { ChannelPartner } from '../types';

interface PartnerMapViewProps {
  userPincode: string;
  userLocationName: string;
  userCoords?: { latitude: number; longitude: number };
  partners: ChannelPartner[];
  selectedPartner: ChannelPartner | null;
  onSelectPartner: (partner: ChannelPartner) => void;
  isHindi: boolean;
}

type MapLayerType = 'streets' | 'satellite' | 'terrain' | 'osm';

export const PartnerMapView: React.FC<PartnerMapViewProps> = ({
  userPincode,
  userLocationName,
  userCoords = { latitude: 24.1856, longitude: 86.3072 },
  partners,
  selectedPartner,
  onSelectPartner,
  isHindi
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const routeDecoratorRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('streets');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(12);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState<boolean>(false);

  // Partner Type Color Coding
  const getPartnerTheme = (type: string) => {
    switch (type) {
      case 'SCA':
        return { 
          color: '#4338ca', 
          borderColor: '#312e81', 
          bgColor: '#e0e7ff', 
          textColor: '#3730a3', 
          label: 'SCA', 
          title: 'State Channelizing Agency' 
        };
      case 'RRB':
        return { 
          color: '#0284c7', 
          borderColor: '#0369a1', 
          bgColor: '#e0f2fe', 
          textColor: '#075985', 
          label: 'RRB', 
          title: 'Regional Rural Bank' 
        };
      case 'NBFC_MFI':
        return { 
          color: '#d97706', 
          borderColor: '#b45309', 
          bgColor: '#fef3c7', 
          textColor: '#92400e', 
          label: 'MFI', 
          title: 'Microfinance / NBFC' 
        };
      case 'PublicSectorBank':
      default:
        return { 
          color: '#059669', 
          borderColor: '#047857', 
          bgColor: '#d1fae5', 
          textColor: '#065f46', 
          label: 'Bank', 
          title: 'Public Sector Bank' 
        };
    }
  };

  // Tile Providers matching Google Maps styles
  const TILE_PROVIDERS: Record<MapLayerType, { url: string; attribution: string; maxZoom: number }> = {
    streets: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
      maxZoom: 17
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.latitude, userCoords.longitude],
        zoom: 12,
        zoomControl: false, // We use custom Google Maps style zoom controls
        attributionControl: false
      });

      // Add default tile layer
      const initialLayer = L.tileLayer(TILE_PROVIDERS.streets.url, {
        attribution: TILE_PROVIDERS.streets.attribution,
        maxZoom: TILE_PROVIDERS.streets.maxZoom
      }).addTo(map);

      tileLayerRef.current = initialLayer;

      // Add Attribution Control bottom right
      L.control.attribution({ position: 'bottomright', prefix: 'Google-style Maps' }).addTo(map);

      // Create Layer Groups
      markersLayerRef.current = L.layerGroup().addTo(map);
      routeDecoratorRef.current = L.layerGroup().addTo(map);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle Layer Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const config = TILE_PROVIDERS[activeLayer];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeLayer]);

  // 3. Render User Pin & Partner Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    // Custom Google-style User Marker (Pulsing Blue Radar Beacon)
    const userIconHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
        <div class="absolute w-12 h-12 bg-blue-500/25 rounded-full animate-ping"></div>
        <div class="absolute w-8 h-8 bg-blue-600/30 rounded-full"></div>
        <div class="relative w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div class="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-slate-700 pointer-events-none">
          📍 ${isHindi ? 'आपका स्थान' : 'You'}: ${userPincode || '815301'}
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userIconHtml,
      className: 'custom-user-pin',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    userMarkerRef.current = L.marker([userCoords.latitude, userCoords.longitude], { icon: userIcon, zIndexOffset: 1000 })
      .bindPopup(`
        <div class="p-1 font-sans">
          <div class="font-bold text-slate-900 text-xs flex items-center gap-1">
            <span>📍</span>
            <span>${isHindi ? 'वर्तमान चयनित केंद्र' : 'Current Selected Center'}</span>
          </div>
          <p class="text-[11px] text-slate-600 font-mono mt-0.5">PIN: ${userPincode} (${userLocationName})</p>
        </div>
      `)
      .addTo(markersGroup);

    // Render Partner Pins
    partners.forEach((partner) => {
      const isSelected = selectedPartner?.id === partner.id;
      const theme = getPartnerTheme(partner.type);

      const partnerPinHtml = `
        <div id="gmap-pin-${partner.id}" class="relative flex flex-col items-center cursor-pointer transition-all duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'}">
          ${isSelected ? `
            <div class="absolute -top-1 w-10 h-10 bg-amber-400/40 rounded-full animate-ping -z-10"></div>
          ` : ''}
          <div class="relative w-8 h-10 flex items-center justify-center">
            <svg viewBox="0 0 32 42" class="w-8 h-10 drop-shadow-md">
              <path 
                d="M16 0C7.163 0 0 7.163 0 16c0 10.5 14.2 24.6 14.8 25.2.6.6 1.8.6 2.4 0C17.8 40.6 32 26.5 32 16 32 7.163 24.837 0 16 0z" 
                fill="${isSelected ? '#f59e0b' : theme.color}" 
                stroke="${isSelected ? '#78350f' : '#ffffff'}" 
                stroke-width="1.5"
              />
              <circle cx="16" cy="15" r="9" fill="#ffffff" />
            </svg>
            <span class="absolute top-2 text-[10px] font-black" style="color: ${isSelected ? '#b45309' : theme.color}">
              ${theme.label.charAt(0)}
            </span>
          </div>
          <div class="mt-0.5 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded border border-slate-700 shadow whitespace-nowrap max-w-[100px] truncate ${isSelected ? 'border-amber-400 text-amber-300 font-extrabold' : ''}">
            ${partner.name.split(' ')[0]} ${partner.distanceKm ? `(${partner.distanceKm}k)` : ''}
          </div>
        </div>
      `;

      const partnerIcon = L.divIcon({
        html: partnerPinHtml,
        className: 'custom-partner-pin',
        iconSize: [36, 46],
        iconAnchor: [18, 42],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([partner.latitude, partner.longitude], { icon: partnerIcon })
        .addTo(markersGroup);

      // Popup Content mimicking Google Maps Place Card
      const popupContent = `
        <div class="p-2 font-sans min-w-[220px] max-w-[260px]">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full" style="background-color: ${theme.bgColor}; color: ${theme.textColor}; border: 1px solid ${theme.color}40">
              ${partner.typeLabel}
            </span>
            <span class="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              📍 ${partner.distanceKm || 'Nearby'} km
            </span>
          </div>
          <h4 class="text-xs font-bold text-slate-900 leading-snug">${partner.name}</h4>
          <p class="text-[11px] text-indigo-900 font-medium">${partner.branchName}</p>
          <p class="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-tight">📍 ${partner.address}</p>
          <div class="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
            <span class="text-slate-700 font-semibold">📞 ${partner.phone}</span>
            <span class="text-emerald-700 font-bold">✓ Active Desk</span>
          </div>
          <div class="mt-2 flex items-center gap-1.5">
            <a 
              href="https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${partner.latitude},${partner.longitude}" 
              target="_blank" 
              rel="noreferrer"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1 shadow-xs transition"
            >
              <span>🧭 Open in Google Maps</span>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectPartner(partner);
      });
    });
  }, [partners, selectedPartner, userCoords, userPincode, userLocationName, isHindi]);

  // 4. Update Navigation Route Line between User and Selected Partner
  useEffect(() => {
    if (!mapInstanceRef.current || !routeDecoratorRef.current) return;

    const map = mapInstanceRef.current;
    const decoratorGroup = routeDecoratorRef.current;
    decoratorGroup.clearLayers();

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (selectedPartner) {
      const startPoint: [number, number] = [userCoords.latitude, userCoords.longitude];
      const endPoint: [number, number] = [selectedPartner.latitude, selectedPartner.longitude];

      // Draw Google Maps-style Blue Navigation Route
      const polyline = L.polyline([startPoint, endPoint], {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeLayerRef.current = polyline;

      // Midpoint Distance Badge
      const midLat = (startPoint[0] + endPoint[0]) / 2;
      const midLng = (startPoint[1] + endPoint[1]) / 2;

      const badgeHtml = `
        <div class="bg-blue-900 text-white text-[10px] font-mono font-black px-2.5 py-1 rounded-full shadow-lg border border-blue-400 flex items-center gap-1 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span>${selectedPartner.distanceKm || '0'} km</span>
          <span class="text-[9px] text-blue-200">(${Math.max(5, Math.round((selectedPartner.distanceKm || 5) * 2.2))} min)</span>
        </div>
      `;

      const badgeIcon = L.divIcon({
        html: badgeHtml,
        className: 'route-badge',
        iconSize: [60, 20],
        iconAnchor: [30, 10]
      });

      L.marker([midLat, midLng], { icon: badgeIcon, interactive: false }).addTo(decoratorGroup);

      // Fit bounds to show both user and selected partner comfortably
      const bounds = L.latLngBounds([startPoint, endPoint]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [selectedPartner, userCoords]);

  // Recenter on User Location
  const handleRecenterUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.latitude, userCoords.longitude], 13, { duration: 1 });
    }
  };

  // Zoom In / Out
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
  };

  // Google Maps Direct Route Link for selected partner
  const googleMapsRouteUrl = useMemo(() => {
    if (!selectedPartner) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userLocationName + ' ' + userPincode)}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${encodeURIComponent(selectedPartner.name + ', ' + selectedPartner.address)}`;
  }, [selectedPartner, userCoords, userLocationName, userPincode]);

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'relative'
    }`}>
      {/* Google Maps Style Header Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>{isHindi ? 'गूगल मैप्स - अधिकृत चैनल पार्टनर लोकेटर' : 'Google-Style Interactive Map Locator'}</span>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-300 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                PIN: {userPincode || '815301'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {isHindi 
                ? `पहचाना गया केंद्र: ${userLocationName || 'गिरिडीह'} • ${partners.length} अधिकृत शाखाएं पिन की गई हैं` 
                : `Center: ${userLocationName || 'Location'} • ${partners.length} authorized partner branches plotted`}
            </p>
          </div>
        </div>

        {/* Action Header Items */}
        <div className="flex items-center gap-2">
          {selectedPartner && (
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Navigation2 className="w-3.5 h-3.5" />
              <span>{isHindi ? 'गूगल मैप्स में रूट देखें' : 'Open Route in Google Maps'}</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          )}

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Canvas with Overlaid Floating Google-Style Controls */}
      <div className="relative w-full overflow-hidden bg-slate-100 flex-1" style={{ height: isFullscreen ? 'calc(100vh - 140px)' : '380px' }}>
        {/* Leaflet Map DOM Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Google Maps Style Top-Left Layer Switcher */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-200/90 text-xs">
          <button
            type="button"
            onClick={() => setActiveLayer('streets')}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer ${
              activeLayer === 'streets' 
                ? 'bg-blue-600 text-white shadow-2xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{isHindi ? 'मैप' : 'Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer ${
              activeLayer === 'satellite' 
                ? 'bg-blue-600 text-white shadow-2xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सैटेलाइट' : 'Satellite'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('terrain')}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer ${
              activeLayer === 'terrain' 
                ? 'bg-blue-600 text-white shadow-2xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isHindi ? 'भूभाग' : 'Terrain'}</span>
          </button>
        </div>

        {/* Floating Google Maps Style Right Controls (Zoom + Recenter) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          <div className="bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-200/90 overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 border-b border-slate-200 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRecenterUser}
            className="p-2.5 bg-white/95 backdrop-blur-xs hover:bg-blue-50 text-slate-800 hover:text-blue-700 rounded-xl shadow-md border border-slate-200/90 transition cursor-pointer group"
            title={isHindi ? "मेरे स्थान पर केंद्रित करें" : "Center on My Location"}
          >
            <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        {/* Floating Selected Partner Mini Card (Bottom Left of Map) */}
        {selectedPartner && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-10 bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl animate-fade-in text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                selectedPartner.type === 'SCA'
                  ? 'bg-purple-100 text-purple-800'
                  : selectedPartner.type === 'RRB'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedPartner.typeLabel}
              </span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                📍 {selectedPartner.distanceKm} km {isHindi ? 'दूरी' : 'away'}
              </span>
            </div>

            <h5 className="font-bold text-slate-900 text-xs leading-snug">
              {selectedPartner.name}
            </h5>
            <p className="text-[11px] text-indigo-900 font-medium">{selectedPartner.branchName}</p>
            <p className="text-[10px] text-slate-600 line-clamp-1">📍 {selectedPartner.address}</p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
              <span className="text-slate-600 font-medium">Nodal: {selectedPartner.contactPerson}</span>
              <a
                href={`tel:${selectedPartner.phone}`}
                className="text-emerald-700 font-bold hover:underline"
              >
                📞 {selectedPartner.phone}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend & Status Bar */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap text-[11px]">
          <span className="font-bold text-slate-500 uppercase tracking-wider">
            {isHindi ? 'मानचित्र संकेतक:' : 'Map Markers:'}
          </span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block border border-white"></span>
            {isHindi ? 'आपका केंद्र' : 'You (Center)'}
          </span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] inline-block"></span>
            {isHindi ? 'सार्वजनिक बैंक' : 'Bank (SBI/PNB)'}
          </span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4338ca] inline-block"></span>
            SCA ({isHindi ? 'राज्य एजेंसी' : 'State Agency'})
          </span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] inline-block"></span>
            {isHindi ? 'ग्रामीण बैंक' : 'RRB (Gramin)'}
          </span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] inline-block"></span>
            NBFC-MFI
          </span>
        </div>

        <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
          {isHindi ? '💡 किसी भी पिन पर क्लिक करके शाखा का विवरण व रूट देखें।' : '💡 Click any pin to inspect branch card and turn-by-turn route.'}
        </span>
      </div>
    </div>
  );
};
