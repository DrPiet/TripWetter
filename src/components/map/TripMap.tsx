'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const TripMapInner = dynamic(() => import('./TripMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500">Karte wird geladen…</p>
      </div>
    </div>
  ),
});

export function TripMap() {
  return <TripMapInner />;
}
