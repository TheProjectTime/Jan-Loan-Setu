import { CHANNEL_PARTNERS } from '../data/partners';
import { ChannelPartner } from '../types';

export interface LocationCoordinates {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  pincodePrefix: string;
}

export const KNOWN_LOCATIONS: Record<string, LocationCoordinates> = {
  giridih: { name: 'Giridih', state: 'Jharkhand', latitude: 24.1856, longitude: 86.3072, pincodePrefix: '815' },
  ranchi: { name: 'Ranchi', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096, pincodePrefix: '834' },
  dhanbad: { name: 'Dhanbad', state: 'Jharkhand', latitude: 23.7957, longitude: 86.4304, pincodePrefix: '826' },
  bokaro: { name: 'Bokaro', state: 'Jharkhand', latitude: 23.6693, longitude: 86.1511, pincodePrefix: '827' },
  hazaribagh: { name: 'Hazaribagh', state: 'Jharkhand', latitude: 23.9961, longitude: 85.3621, pincodePrefix: '825' },
  jamshedpur: { name: 'Jamshedpur', state: 'Jharkhand', latitude: 22.8046, longitude: 86.2029, pincodePrefix: '831' },
  patna: { name: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, pincodePrefix: '800' },
  gaya: { name: 'Gaya', state: 'Bihar', latitude: 24.7955, longitude: 85.0002, pincodePrefix: '823' },
  muzaffarpur: { name: 'Muzaffarpur', state: 'Bihar', latitude: 26.1209, longitude: 85.3647, pincodePrefix: '842' },
  lucknow: { name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, pincodePrefix: '226' },
  varanasi: { name: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, pincodePrefix: '221' },
  kanpur: { name: 'Kanpur', state: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319, pincodePrefix: '208' },
  agra: { name: 'Agra', state: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, pincodePrefix: '282' },
  delhi: { name: 'New Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, pincodePrefix: '110' },
  mumbai: { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, pincodePrefix: '400' },
  pune: { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, pincodePrefix: '411' },
  jaipur: { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, pincodePrefix: '302' },
  bhopal: { name: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, pincodePrefix: '462' },
  kolkata: { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, pincodePrefix: '700' },
  bengaluru: { name: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, pincodePrefix: '560' },
  hyderabad: { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, pincodePrefix: '500' },
  chennai: { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, pincodePrefix: '600' }
};

/**
 * Haversine formula to calculate great-circle distance between two points in km
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Find coordinates by place name or pincode
 */
export function resolveLocation(query: string): { latitude: number; longitude: number; resolvedName: string } | null {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return null;

  // Check known locations
  for (const [key, loc] of Object.entries(KNOWN_LOCATIONS)) {
    if (cleanQuery.includes(key) || loc.name.toLowerCase().includes(cleanQuery)) {
      return { latitude: loc.latitude, longitude: loc.longitude, resolvedName: `${loc.name}, ${loc.state}` };
    }
  }

  // Check pincode prefix
  for (const loc of Object.values(KNOWN_LOCATIONS)) {
    if (cleanQuery.startsWith(loc.pincodePrefix)) {
      return { latitude: loc.latitude, longitude: loc.longitude, resolvedName: `${loc.name} (${cleanQuery})` };
    }
  }

  // Default to Giridih if no match found for prompt demonstration or general coordinates
  return null;
}

/**
 * Search and rank channel partners
 */
export function searchChannelPartners(params: {
  schemeId?: string;
  partnerType?: string;
  userCoords?: { latitude: number; longitude: number };
  searchQuery?: string;
  district?: string;
  state?: string;
  onlyActive?: boolean;
}): ChannelPartner[] {
  const { schemeId, partnerType, userCoords, searchQuery, district, state, onlyActive } = params;

  let results = [...CHANNEL_PARTNERS];

  // 1. Filter by scheme support if specified
  if (schemeId && schemeId !== 'all') {
    results = results.filter((p) => p.supportedSchemeIds.includes(schemeId));
  }

  // 2. Filter by partner type (SCA, Bank, RRB, NBFC)
  if (partnerType && partnerType !== 'all') {
    results = results.filter((p) => p.type === partnerType);
  }

  // 3. Filter by district or state
  if (district && district !== 'all') {
    results = results.filter((p) => p.district.toLowerCase() === district.toLowerCase());
  }

  if (state && state !== 'all') {
    results = results.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }

  // 4. Text query filter
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.branchName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.pincode.includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.typeLabel.toLowerCase().includes(q)
    );
  }

  if (onlyActive) {
    results = results.filter((p) => p.activeStatus === 'Active');
  }

  // 5. Calculate distance and sort
  if (userCoords) {
    results = results.map((p) => {
      const dist = calculateDistanceKm(
        userCoords.latitude,
        userCoords.longitude,
        p.latitude,
        p.longitude
      );
      return {
        ...p,
        distanceKm: dist
      };
    });

    results.sort((a, b) => (a.distanceKm || 99999) - (b.distanceKm || 99999));
  }

  return results;
}
