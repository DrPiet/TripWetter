'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchWeatherForStage, fetchHistoricalAverageForStage } from '@/lib/api/openmeteo';
import { useTripStore } from '@/hooks/useTrip';
import type { TripStage } from '@/types/trip';
import { determineWeatherSource } from '@/lib/utils/dateUtils';

export function useWeather(stage: TripStage) {
  const setWeatherForStage = useTripStore((s) => s.setWeatherForStage);
  const source = determineWeatherSource(stage.arrivalDate, stage.departureDate);

  const query = useQuery({
    queryKey: ['weather', stage.coordinates.lat, stage.coordinates.lng, stage.arrivalDate, stage.departureDate],
    queryFn: () =>
      source === 'historical_avg'
        ? fetchHistoricalAverageForStage(
            stage.coordinates.lat,
            stage.coordinates.lng,
            stage.arrivalDate,
            stage.departureDate,
          )
        : fetchWeatherForStage(
            stage.coordinates.lat,
            stage.coordinates.lng,
            stage.arrivalDate,
            stage.departureDate,
          ),
    staleTime: source === 'historical_avg'
      ? 1000 * 60 * 60 * 24 * 7  // Klimadaten: 7 Tage cachen
      : 1000 * 60 * 60,           // Forecast/Archiv: 1 Stunde
    retry: 2,
  });

  useEffect(() => {
    if (query.data) {
      setWeatherForStage(stage.id, query.data);
    }
  }, [query.data, stage.id, setWeatherForStage]);

  return { ...query, source };
}
