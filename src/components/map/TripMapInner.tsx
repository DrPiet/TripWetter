'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTripStore } from '@/hooks/useTrip';
import { MapClickHandler } from './MapClickHandler';
import { StageMarker } from './StageMarker';
import { TripRoute } from './TripRoute';

// Leaflet Standard-Icon-Bug-Fix für Webpack/Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function TripMapInner() {
  const stages = useTripStore((s) => s.stages);

  // Für nummerierte Marker: Reihenfolge nach Ankunftsdatum
  const sortedStages = [...stages].sort((a, b) =>
    a.arrivalDate.localeCompare(b.arrivalDate),
  );

  return (
    <MapContainer
      center={[20, 10]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />

      {/* Route zuerst rendern (liegt unter den Markern) */}
      <TripRoute />

      {/* Marker mit Reihennummer */}
      {sortedStages.map((stage, index) => (
        <StageMarker key={stage.id} stage={stage} stageIndex={index} />
      ))}
    </MapContainer>
  );
}
