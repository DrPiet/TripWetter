'use client';

import { Cloud } from 'lucide-react';
import { useTripStore } from '@/hooks/useTrip';
import { StageForm } from './StageForm';
import { StageList } from './StageList';
import { TripActions } from './TripActions';

export function TripSidebar() {
  const stages = useTripStore((s) => s.stages);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-500" />
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">TripWetter</h1>
            <p className="text-xs text-gray-400">
              {stages.length} {stages.length === 1 ? 'Etappe' : 'Etappen'}
            </p>
          </div>
        </div>
        <TripActions />
      </div>

      {/* Etappen-Formular (erscheint nach Kartenklick) */}
      <StageForm />

      {/* Etappen-Liste */}
      <div className="flex-1 overflow-y-auto">
        <StageList />
      </div>

      {/* Footer-Hinweis */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex-shrink-0">
        <p className="text-xs text-gray-400 text-center">
          Karte anklicken, um eine Etappe hinzuzufügen
        </p>
      </div>
    </div>
  );
}
