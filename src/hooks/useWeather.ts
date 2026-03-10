'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchWeatherForStage } from '@/lib/api/openmeteo';
import { useTripStore } from '@/hooks/useTrip';
import type { TripStage } from '@/types/trip';
import { determineWeatherSource } from '@/lib/utils/dateUtils';

export function useWeather(stage: TripStage) {
  const setWeatherForStage = useTripStore((s) => s.setWeatherForStage);
  const source = determineWeatherSource(stage.arrivalDate, stage.departureDate);
  const enabled = source !== 'out_of_range';

  const query = useQuery({
    queryKey: ['weather', stage.coordinates.lat, stage.coordinates.lng, stage.arrivalDate, stage.departureDate],
    queryFn: () =>
      fetchWeatherForStage(
        stage.coordinates.lat,
        stage.coordinates.lng,
        stage.arrivalDate,
        stage.departureDate,
      ),
    staleTime: 1000 * 60 * 60, // 1 Stunde
    enabled,
    retry: 2,
  });

  useEffect(() => {
    if (query.data) {
      setWeatherForStage(stage.id, query.data);
    }
  }, [query.data, stage.id, setWeatherForStage]);

  return { ...query, source };
}
