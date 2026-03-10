'use client';

import { Trash2, MapPin, Calendar, Clock } from 'lucide-react';
import { useTripStore } from '@/hooks/useTrip';
import { useWeather } from '@/hooks/useWeather';
import { WeatherSummary } from '@/components/weather/WeatherSummary';
import { WeatherDetail } from '@/components/weather/WeatherDetail';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDisplayDate, getDayCount } from '@/lib/utils/dateUtils';
import type { TripStage } from '@/types/trip';

interface Props {
  stage: TripStage;
}

export function StageCard({ stage }: Props) {
  const removeStage = useTripStore((s) => s.removeStage);
  const selectedStageId = useTripStore((s) => s.selectedStageId);
  const selectStage = useTripStore((s) => s.selectStage);

  const { isLoading, isError, data: forecasts, source } = useWeather(stage);

  const isSelected = selectedStageId === stage.id;
  const dayCount = getDayCount(stage.arrivalDate, stage.departureDate);

  return (
    <div
      className={`rounded-lg border p-3 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-400 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={() => selectStage(isSelected ? null : stage.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-800 leading-tight truncate">
              {stage.name}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>
                {formatDisplayDate(stage.arrivalDate)} – {formatDisplayDate(stage.departureDate)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{dayCount} {dayCount === 1 ? 'Tag' : 'Tage'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeStage(stage.id);
          }}
          className="flex-shrink-0 rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-400"
          title="Etappe löschen"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Wetter */}
      <div className="mt-2.5 pl-6">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-xs text-gray-400">Wetter wird geladen…</span>
          </div>
        ) : isError ? (
          <p className="text-xs text-red-400">Wetterdaten konnten nicht geladen werden.</p>
        ) : forecasts && forecasts.length > 0 ? (
          <>
            {source === 'historical_avg' && (
              <div className="mb-2 flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2 py-1">
                <span className="text-amber-500 text-sm">📊</span>
                <p className="text-xs text-amber-700">
                  Ø Klimadaten (letzte 5 Jahre) – kein Forecast für diesen Zeitraum verfügbar.
                </p>
              </div>
            )}
            <WeatherSummary forecasts={forecasts} dayCount={dayCount} />
            <WeatherDetail forecasts={forecasts} />
          </>
        ) : (
          <p className="text-xs text-gray-400 italic">Keine Wetterdaten verfügbar.</p>
        )}
      </div>
    </div>
  );
}
