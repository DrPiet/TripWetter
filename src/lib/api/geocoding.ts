import type { GeocodingResult, OpenMeteoGeocodingResponse } from '@/types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  display_name: string;
  address: NominatimAddress;
}

async function fetchReverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    'accept-language': 'de',
    zoom: '10',
  });

  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'User-Agent': 'TripWetter/1.0' },
  });
  if (!res.ok) throw new Error(`Reverse Geocoding Fehler: ${res.status}`);

  const data: NominatimResponse = await res.json();
  const a = data.address;

  const city = a.city ?? a.town ?? a.village ?? a.municipality ?? a.county;
  const parts = [city, a.state, a.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : data.display_name;
}

/** Reverse Geocoding mit 1 automatischem Retry nach 1,2 s (Nominatim Rate Limit: 1 req/s) */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    return await fetchReverseGeocode(lat, lng);
  } catch {
    // Einmal warten und erneut versuchen
    await new Promise((r) => setTimeout(r, 1200));
    return fetchReverseGeocode(lat, lng);
  }
}

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: '8',
    language: 'de',
    format: 'json',
  });

  const res = await fetch(`${GEOCODING_URL}?${params}`);
  if (!res.ok) throw new Error(`Geocoding-Fehler: ${res.status}`);

  const data: OpenMeteoGeocodingResponse = await res.json();
  return data.results ?? [];
}

export function formatLocationName(result: GeocodingResult): string {
  const parts = [result.name];
  if (result.admin1) parts.push(result.admin1);
  parts.push(result.country);
  return parts.join(', ');
}
