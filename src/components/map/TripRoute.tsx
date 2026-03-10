'use client';

import { Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useTripStore } from '@/hooks/useTrip';

// ─── Quadratische Bezier-Kurve ────────────────────────────────────────────────
function getBezierPoints(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
  numPoints = 80,
): [number, number][] {
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  // Kontrollpunkt: Mittelpunkt + seitlicher Versatz (25 % der Strecke, rechts der Fahrtrichtung)
  const controlLat = (lat1 + lat2) / 2 - dLng * 0.25;
  const controlLng = (lng1 + lng2) / 2 + dLat * 0.25;

  return Array.from({ length: numPoints + 1 }, (_, i) => {
    const t = i / numPoints;
    const u = 1 - t;
    const lat = u * u * lat1 + 2 * u * t * controlLat + t * t * lat2;
    const lng = u * u * lng1 + 2 * u * t * controlLng + t * t * lng2;
    return [lat, lng] as [number, number];
  });
}

// ─── Kurswinkel (0° = Nord) ───────────────────────────────────────────────────
function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = lng2 - lng1;
  const dLat = lat2 - lat1;
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return (angle + 360) % 360;
}

// ─── Pfeil-Icon als DivIcon ───────────────────────────────────────────────────
function createArrowIcon(bearing: number): L.DivIcon {
  return L.divIcon({
    html: `
      <svg viewBox="0 0 24 24" width="22" height="22"
           style="transform: rotate(${bearing}deg); transform-origin: 50% 50%; display: block; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3))">
        <polygon points="12,2 21,20 12,15 3,20"
                 fill="#2563eb" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// ─── Nummerierungs-Icon für Etappe ────────────────────────────────────────────
export function createStageNumberIcon(index: number): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        width: 24px; height: 24px;
        background: #2563eb; color: white;
        border: 2px solid white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700; font-family: sans-serif;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${index + 1}</div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
export function TripRoute() {
  const stages           = useTripStore((s) => s.stages);
  const draggingOverrides = useTripStore((s) => s.draggingOverrides);

  // Nach Ankunftsdatum sortieren
  const sorted = [...stages].sort((a, b) =>
    a.arrivalDate.localeCompare(b.arrivalDate),
  );

  if (sorted.length < 2) return null;

  // Ob irgendein Marker gerade gezogen wird
  const isDraggingAny = Object.keys(draggingOverrides).length > 0;

  const routes = sorted.slice(0, -1).map((stage, i) => {
    const next = sorted[i + 1];

    // Aktuelle Koordinaten: Drag-Override hat Vorrang (Live-Position während Drag)
    const coords     = draggingOverrides[stage.id]  ?? stage.coordinates;
    const nextCoords = draggingOverrides[next.id]   ?? next.coordinates;

    // Gleiche Koordinaten überspringen
    if (
      coords.lat === nextCoords.lat &&
      coords.lng === nextCoords.lng
    ) return null;

    const points = getBezierPoints(
      coords.lat, coords.lng,
      nextCoords.lat, nextCoords.lng,
    );

    // Pfeil bei ~65 % der Kurve (deutlich in Fahrtrichtung)
    const arrowIdx = Math.floor(points.length * 0.65);
    const arrowPos = points[arrowIdx];
    const prevPos  = points[arrowIdx - 1];
    const bearing  = getBearing(prevPos[0], prevPos[1], arrowPos[0], arrowPos[1]);

    // Ist diese Verbindung von einem Drag betroffen?
    const segmentDragging =
      stage.id in draggingOverrides || next.id in draggingOverrides;

    return { stage, next, points, arrowPos, bearing, segmentDragging };
  });

  return (
    <>
      {routes.map((route) => {
        if (!route) return null;
        const { stage, next, points, segmentDragging } = route;
        const key = `${stage.id}-${next.id}`;
        return (
          <Polyline
            key={`route-${key}`}
            positions={points}
            pathOptions={{
              color:   segmentDragging ? '#7c3aed' : '#2563eb',
              weight:  segmentDragging ? 3 : 2.5,
              opacity: segmentDragging ? 0.9 : 0.65,
              dashArray: segmentDragging ? '8 5' : undefined,
            }}
          />
        );
      })}
      {/* Pfeil-Marker nur anzeigen wenn kein Drag aktiv (verhindert Flackern) */}
      {!isDraggingAny && routes.map((route) => {
        if (!route) return null;
        const { stage, next, arrowPos, bearing } = route;
        const key = `${stage.id}-${next.id}`;
        return (
          <Marker
            key={`arrow-${key}`}
            position={arrowPos}
            icon={createArrowIcon(bearing)}
            interactive={false}
            zIndexOffset={-100}
          />
        );
      })}
    </>
  );
}
