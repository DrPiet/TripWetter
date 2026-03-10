import { Thermometer, Droplets } from 'lucide-react';
import { roundTemp } from '@/lib/utils/weatherUtils';

interface Props {
  tempMax: number;
  tempMin: number;
  precipitation: number;
  compact?: boolean;
}

export function WeatherBadge({ tempMax, tempMin, precipitation, compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span className="font-medium text-orange-600">{roundTemp(tempMax)}°</span>
        <span className="text-blue-500">{roundTemp(tempMin)}°</span>
        {precipitation > 0 && (
          <span className="flex items-center gap-0.5 text-blue-400">
            <Droplets className="h-3 w-3" />
            {precipitation}mm
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <div className="flex items-center gap-1">
        <Thermometer className="h-4 w-4 text-orange-500" />
        <span className="font-medium text-orange-600">{roundTemp(tempMax)}°C</span>
        <span className="text-gray-400">/</span>
        <span className="text-blue-500">{roundTemp(tempMin)}°C</span>
      </div>
      {precipitation > 0 && (
        <div className="flex items-center gap-1 text-blue-500">
          <Droplets className="h-4 w-4" />
          <span>{precipitation} mm</span>
        </div>
      )}
    </div>
  );
}
