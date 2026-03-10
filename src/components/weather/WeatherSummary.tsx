import { WeatherIcon } from './WeatherIcon';
import { WeatherBadge } from './WeatherBadge';
import { getWeatherInfo } from '@/lib/api/weatherCodes';
import {
  getDominantWeatherCode,
  getAverageTemperatureMax,
  getAverageTemperatureMin,
  getTotalPrecipitation,
} from '@/lib/utils/weatherUtils';
import type { DailyWeather } from '@/types/trip';

interface Props {
  forecasts: DailyWeather[];
  dayCount: number;
}

export function WeatherSummary({ forecasts, dayCount }: Props) {
  if (forecasts.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic">Keine Wetterdaten verfügbar</p>
    );
  }

  const dominantCode = getDominantWeatherCode(forecasts);
  const avgMax = getAverageTemperatureMax(forecasts);
  const avgMin = getAverageTemperatureMin(forecasts);
  const totalPrecip = getTotalPrecipitation(forecasts);
  const info = getWeatherInfo(dominantCode);
  const coveredDays = forecasts.length;

  return (
    <div className="flex items-center gap-3">
      <WeatherIcon code={dominantCode} size={28} className="text-amber-500 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{info.label}</p>
        <WeatherBadge
          tempMax={avgMax}
          tempMin={avgMin}
          precipitation={totalPrecip}
          compact
        />
        {coveredDays < dayCount && (
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            ({coveredDays} von {dayCount} Tagen)
          </p>
        )}
      </div>
    </div>
  );
}
