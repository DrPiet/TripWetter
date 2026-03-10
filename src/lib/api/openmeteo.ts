import type { DailyWeather } from '@/types/trip';
import type { OpenMeteoForecastResponse } from '@/types/weather';
import { formatDate, todayDate } from '@/lib/utils/dateUtils';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

const DAILY_PARAMS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'weather_code',
  'windspeed_10m_max',
].join(',');

async function fetchFromEndpoint(
  url: string,
  lat: number,
  lng: number,
  startDate: string,
  endDate: string,
): Promise<OpenMeteoForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: DAILY_PARAMS,
    start_date: startDate,
    end_date: endDate,
    timezone: 'auto',
  });
  const res = await fetch(`${url}?${params}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Open-Meteo Fehler ${res.status}: ${text}`);
  }
  return res.json();
}

function parseDailyWeather(data: OpenMeteoForecastResponse): DailyWeather[] {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, weather_code, windspeed_10m_max } = data.daily;
  return time.map((date, i) => ({
    date,
    temperatureMax: temperature_2m_max[i] ?? 0,
    temperatureMin: temperature_2m_min[i] ?? 0,
    precipitationSum: precipitation_sum[i] ?? 0,
    weatherCode: weather_code[i] ?? 0,
    windspeedMax: windspeed_10m_max[i] ?? 0,
  }));
}

function deduplicateByDate(forecasts: DailyWeather[]): DailyWeather[] {
  const seen = new Map<string, DailyWeather>();
  for (const f of forecasts) {
    seen.set(f.date, f);
  }
  return Array.from(seen.values());
}

export async function fetchWeatherForStage(
  lat: number,
  lng: number,
  arrivalDate: string,
  departureDate: string,
): Promise<DailyWeather[]> {
  const today = todayDate();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const maxForecast = new Date(today);
  maxForecast.setDate(today.getDate() + 15); // 16 Tage inkl. heute

  const start = new Date(arrivalDate);
  const end = new Date(departureDate);

  const results: DailyWeather[] = [];

  // Archive: Vergangenheit
  if (start < today) {
    const archiveEnd = end < yesterday ? end : yesterday;
    if (archiveEnd >= start) {
      try {
        const data = await fetchFromEndpoint(
          ARCHIVE_URL, lat, lng,
          formatDate(start), formatDate(archiveEnd),
        );
        results.push(...parseDailyWeather(data));
      } catch (e) {
        console.error('Archive-Fehler:', e);
      }
    }
  }

  // Forecast: Gegenwart/Zukunft (bis 16 Tage)
  if (end >= today) {
    const forecastStart = start >= today ? start : today;
    const forecastEnd = end <= maxForecast ? end : maxForecast;
    if (forecastStart <= forecastEnd) {
      try {
        const data = await fetchFromEndpoint(
          FORECAST_URL, lat, lng,
          formatDate(forecastStart), formatDate(forecastEnd),
        );
        results.push(...parseDailyWeather(data));
      } catch (e) {
        console.error('Forecast-Fehler:', e);
      }
    }
  }

  return deduplicateByDate(results).sort((a, b) => a.date.localeCompare(b.date));
}
