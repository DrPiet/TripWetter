'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useGeocoding } from '@/hooks/useGeocoding';
import { formatLocationName } from '@/lib/api/geocoding';
import type { GeocodingResult } from '@/types/weather';
import type { Coordinates } from '@/types/trip';

interface Props {
  onSelect: (name: string, coords: Coordinates) => void;
  placeholder?: string;
  initialValue?: string;
  /** Wird von außen gesetzt (z.B. nach Reverse Geocoding) – überschreibt den internen Wert */
  externalValue?: string;
}

export function LocationSearch({ onSelect, placeholder = 'Ort suchen…', initialValue = '', externalValue }: Props) {
  const [inputValue, setInputValue] = useState(initialValue);

  // Externes Update (z.B. Reverse Geocoding) in internen State übernehmen
  useEffect(() => {
    if (externalValue !== undefined) {
      setInputValue(externalValue);
    }
  }, [externalValue]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: results, isLoading } = useGeocoding(debouncedQuery);

  // Debounce
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(value);
      setIsOpen(value.trim().length >= 2);
    }, 350);
  }, []);

  // Außerhalb-Klick schließt Dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(result: GeocodingResult) {
    const name = formatLocationName(result);
    setInputValue(name);
    setIsOpen(false);
    onSelect(name, { lat: result.latitude, lng: result.longitude });
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (inputValue.trim().length >= 2 && results && results.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {isLoading && (
          <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {isOpen && results && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-slate-700"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                <span>
                  <span className="font-medium text-gray-800 dark:text-slate-100">{result.name}</span>
                  {result.admin1 && (
                    <span className="text-gray-500 dark:text-slate-400">, {result.admin1}</span>
                  )}
                  <span className="text-gray-400 dark:text-slate-500">, {result.country}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && !isLoading && results && results.length === 0 && debouncedQuery.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 shadow-md">
          Kein Ort gefunden
        </div>
      )}
    </div>
  );
}
