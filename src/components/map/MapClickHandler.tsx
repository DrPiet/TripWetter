'use client';

import { useMapEvents } from 'react-leaflet';
import { useTripStore } from '@/hooks/useTrip';

export function MapClickHandler() {
  const setPendingCoordinates = useTripStore((s) => s.setPendingCoordinates);
  const isFormOpen = useTripStore((s) => s.isFormOpen);

  useMapEvents({
    click(e) {
      if (!isFormOpen) {
        setPendingCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  return null;
}
