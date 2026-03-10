'use client';

import { useRef, useState, useCallback } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useTripStore } from '@/hooks/useTrip';
import { reverseGeocode } from '@/lib/api/geocoding';
import type { TripStage } from '@/types/trip';
import { formatDisplayDate } from '@/lib/utils/dateUtils';

interface Props {
  stage: TripStage;
  stageIndex: number;
}

function createNumberIcon(index: number, isSelected: boolean, isDragging: boolean): L.DivIcon {
  const bg = isDragging ? '#7c3aed' : isSelected ? '#1d4ed8' : '#2563eb';
  const size = isDragging ? 32 : isSelected ? 30 : 26;
  const fontSize = isDragging ? 14 : isSelected ? 13 : 11;
  const shadow = isDragging
    ? '0 6px 20px rgba(124,58,237,0.5)'
    : '0 2px 6px rgba(0,0,0,0.35)';

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${bg}; color: white;
        border: 2.5px solid white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: ${fontSize}px; font-weight: 700; font-family: sans-serif;
        box-shadow: ${shadow};
        cursor: ${isDragging ? 'grabbing' : 'grab'};
        transition: box-shadow 0.15s, background 0.15s;
      ">${index + 1}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

export function StageMarker({ stage, stageIndex }: Props) {
  const selectStage        = useTripStore((s) => s.selectStage);
  const updateStage        = useTripStore((s) => s.updateStage);
  const setDraggingOverride = useTripStore((s) => s.setDraggingOverride);
  const selectedStageId    = useTripStore((s) => s.selectedStageId);
  const isSelected         = selectedStageId === stage.id;

  const [isDragging, setIsDragging]   = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Throttle: Override-Update maximal alle 30ms (≈ 33fps), kein React Query Trigger
  const lastDragUpdate = useRef(0);

  const handleDrag = useCallback(
    (e: L.LeafletEvent) => {
      const now = Date.now();
      if (now - lastDragUpdate.current < 30) return;
      lastDragUpdate.current = now;
      const { lat, lng } = (e.target as L.Marker).getLatLng();
      // Nur den Drag-Override updaten → Linien bewegen sich, Wetter-Queries bleiben stabil
      setDraggingOverride(stage.id, { lat, lng });
    },
    [stage.id, setDraggingOverride],
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    selectStage(null); // Popup schließen
  }, [selectStage]);

  const handleDragEnd = useCallback(
    (e: L.LeafletEvent) => {
      setIsDragging(false);
      const { lat, lng } = (e.target as L.Marker).getLatLng();

      // Drag-Override entfernen + finale Koordinaten dauerhaft speichern
      setDraggingOverride(stage.id, null);
      updateStage(stage.id, {
        coordinates: { lat, lng },
        weather: undefined, // Wetter-Cache leeren → wird neu geladen
      });

      // Neuen Ortsnamen per Reverse Geocoding ermitteln
      setIsGeocoding(true);
      reverseGeocode(lat, lng)
        .then((name) => updateStage(stage.id, { name }))
        .catch(() => {/* alten Namen behalten */})
        .finally(() => setIsGeocoding(false));
    },
    [stage.id, updateStage, setDraggingOverride],
  );

  return (
    <Marker
      position={[stage.coordinates.lat, stage.coordinates.lng]}
      icon={createNumberIcon(stageIndex, isSelected, isDragging)}
      draggable={true}
      eventHandlers={{
        click:     () => !isDragging && selectStage(isSelected ? null : stage.id),
        dragstart: handleDragStart,
        drag:      handleDrag,
        dragend:   handleDragEnd,
      }}
      zIndexOffset={isDragging ? 2000 : isSelected ? 1000 : 0}
    >
      <Popup>
        <div className="min-w-[150px]">
          <p className="font-semibold text-sm leading-tight">{stage.name}</p>
          {isGeocoding && (
            <p className="text-xs text-blue-500 mt-0.5 italic">Ort wird aktualisiert…</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formatDisplayDate(stage.arrivalDate)} – {formatDisplayDate(stage.departureDate)}
          </p>
          {!isSelected && (
            <button
              onClick={() => selectStage(stage.id)}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              Details in Sidebar anzeigen
            </button>
          )}
          <p className="mt-2 text-xs text-gray-400 italic">
            Zum Verschieben ziehen
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
