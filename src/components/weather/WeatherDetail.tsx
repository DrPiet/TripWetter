'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Wind } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '@/lib/api/weatherCodes';
import { roundTemp } from '@/lib/utils/weatherUtils';
import { formatShortDate } from '@/lib/utils/dateUtils';
import type { DailyWeather } from '@/types/trip';

interface Props {
  forecasts: DailyWeather[];
}

export function WeatherDetail({ forecasts }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (forecasts.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-3.5 w-3.5" />
            Tagesdetails ausblenden
          </>
        ) : (
          <>
            <ChevronDown className="h-3.5 w-3.5" />
            Tagesdetails anzeigen
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1 overflow-hidden rounded-md border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          {forecasts.map((day) => {
            const info = getWeatherInfo(day.weatherCode);
            return (
              <div
                key={day.date}
                className="flex items-center gap-2 px-3 py-1.5 text-xs"
              >
                <span className="w-16 text-gray-500 dark:text-slate-400 font-medium flex-shrink-0">
                  {formatShortDate(day.date)}
                </span>
                <WeatherIcon code={day.weatherCode} size={14} className="text-amber-500 flex-shrink-0" />
                <span className="flex-1 text-gray-600 dark:text-slate-300 truncate">{info.label}</span>
                <span className="text-orange-600 font-medium">{roundTemp(day.temperatureMax)}°</span>
                <span className="text-gray-400">/</span>
                <span className="text-blue-500">{roundTemp(day.temperatureMin)}°</span>
                {day.precipitationSum > 0 && (
                  <span className="text-blue-400">{day.precipitationSum}mm</span>
                )}
                {day.windspeedMax > 0 && (
                  <span className="flex items-center gap-0.5 text-gray-400 dark:text-slate-500">
                    <Wind className="h-3 w-3" />
                    {Math.round(day.windspeedMax)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
