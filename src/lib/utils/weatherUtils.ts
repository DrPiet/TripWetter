import type { DailyWeather } from '@/types/trip';

export function getDominantWeatherCode(forecasts: DailyWeather[]): number {
  if (forecasts.length === 0) return 0;
  // Höchster Wettercode = schlechtestes Wetter
  return Math.max(...forecasts.map((f) => f.weatherCode));
}

export function getAverageTemperatureMax(forecasts: DailyWeather[]): number {
  if (forecasts.length === 0) return 0;
  const sum = forecasts.reduce((acc, f) => acc + f.temperatureMax, 0);
  return Math.round(sum / forecasts.length);
}

export function getAverageTemperatureMin(forecasts: DailyWeather[]): number {
  if (forecasts.length === 0) return 0;
  const sum = forecasts.reduce((acc, f) => acc + f.temperatureMin, 0);
  return Math.round(sum / forecasts.length);
}

export function getTotalPrecipitation(forecasts: DailyWeather[]): number {
  return Math.round(forecasts.reduce((acc, f) => acc + f.precipitationSum, 0) * 10) / 10;
}

export function roundTemp(temp: number): number {
  return Math.round(temp);
}
