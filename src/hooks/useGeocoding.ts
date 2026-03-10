'use client';

import { useQuery } from '@tanstack/react-query';
import { searchLocations } from '@/lib/api/geocoding';

export function useGeocoding(query: string) {
  return useQuery({
    queryKey: ['geocoding', query],
    queryFn: () => searchLocations(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // 5 Minuten
    retry: 1,
  });
}
