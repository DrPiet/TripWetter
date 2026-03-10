'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { useTripStore } from '@/hooks/useTrip';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { LocationSearch } from '@/components/ui/LocationSearch';
import { reverseGeocode } from '@/lib/api/geocoding';
import { formatDate, todayDate } from '@/lib/utils/dateUtils';
import type { Coordinates } from '@/types/trip';

const todayStr = formatDate(todayDate());

export function StageForm() {
  const pendingCoordinates = useTripStore((s) => s.pendingCoordinates);
  const isFormOpen = useTripStore((s) => s.isFormOpen);
  const setFormOpen = useTripStore((s) => s.setFormOpen);
  const addStage = useTripStore((s) => s.addStage);
  const setPendingCoordinates = useTripStore((s) => s.setPendingCoordinates);

  const [name, setName] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [arrivalDate, setArrivalDate] = useState(todayStr);
  const [departureDate, setDepartureDate] = useState(todayStr);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReversing, setIsReversing] = useState(false);
  const [reverseGeocodeFailed, setReverseGeocodeFailed] = useState(false);
  const lastCoordsRef = useRef<Coordinates | null>(null);

  // Kartenklick → Koordinaten setzen + Ortsname automatisch nachschlagen
  useEffect(() => {
    if (!pendingCoordinates) return;
    setCoordinates(pendingCoordinates);
    lastCoordsRef.current = pendingCoordinates;
    setName('');
    setReverseGeocodeFailed(false);
    setIsReversing(true);

    reverseGeocode(pendingCoordinates.lat, pendingCoordinates.lng)
      .then((foundName) => {
        setName(foundName);
        setReverseGeocodeFailed(false);
      })
      .catch(() => {
        // Fallback: Koordinaten als editierbarer Name
        const fallback = `${pendingCoordinates.lat.toFixed(4)}, ${pendingCoordinates.lng.toFixed(4)}`;
        setName(fallback);
        setReverseGeocodeFailed(true);
      })
      .finally(() => setIsReversing(false));
  }, [pendingCoordinates]);

  // Manueller Retry für Reverse Geocoding
  function handleRetryReverseGeocode() {
    const coords = lastCoordsRef.current;
    if (!coords) return;
    setName('');
    setReverseGeocodeFailed(false);
    setIsReversing(true);

    reverseGeocode(coords.lat, coords.lng)
      .then((foundName) => {
        setName(foundName);
        setReverseGeocodeFailed(false);
      })
      .catch(() => {
        setName(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        setReverseGeocodeFailed(true);
      })
      .finally(() => setIsReversing(false));
  }

  if (!isFormOpen) return null;

  function handleClose() {
    setFormOpen(false);
    setPendingCoordinates(null);
    setName('');
    setErrors({});
  }

  function handleLocationSelect(selectedName: string, coords: Coordinates) {
    setName(selectedName);
    setCoordinates(coords);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Bitte einen Ort eingeben oder auf der Karte wählen.';
    if (!coordinates) errs.coords = 'Koordinaten fehlen.';
    if (!arrivalDate) errs.arrival = 'Ankunftsdatum erforderlich.';
    if (!departureDate) errs.departure = 'Abreisedatum erforderlich.';
    if (departureDate < arrivalDate) errs.departure = 'Abreise muss nach Ankunft liegen.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !coordinates) return;

    addStage({
      name: name.trim(),
      coordinates,
      arrivalDate,
      departureDate,
    });
    handleClose();
  }

  return (
    <div className="border-b border-gray-200 bg-blue-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-semibold text-blue-800 text-sm">
          <MapPin className="h-4 w-4" />
          Neue Etappe hinzufügen
        </h3>
        <button
          onClick={handleClose}
          className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Ortssuche */}
        <div>
          <div className="relative">
            <LocationSearch
              onSelect={handleLocationSelect}
              placeholder="Ort suchen oder Karte anklicken…"
              externalValue={name}
            />
            {/* Lade-Overlay während Reverse Geocoding */}
            {isReversing && (
              <div className="absolute inset-0 flex items-center gap-2 rounded-md bg-white/80 pl-3 text-xs text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                Ort wird ermittelt…
              </div>
            )}
          </div>
          {reverseGeocodeFailed && (
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-amber-600">
                Ort nicht erkannt – Name anpassen oder Suche nutzen.
              </p>
              <button
                type="button"
                onClick={handleRetryReverseGeocode}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
                title="Nochmals versuchen"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            </div>
          )}
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Datumswahl */}
        <DateRangePicker
          arrivalDate={arrivalDate}
          departureDate={departureDate}
          onChange={(a, d) => {
            setArrivalDate(a);
            setDepartureDate(d);
          }}
        />
        {errors.departure && <p className="text-xs text-red-500">{errors.departure}</p>}

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isReversing}
            className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Etappe speichern
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
