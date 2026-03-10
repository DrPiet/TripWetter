'use client';

import { Cloud, Sun, Moon } from 'lucide-react';
import { useTripStore } from '@/hooks/useTrip';
import { useTheme } from '@/hooks/useTheme';
import { StageForm } from './StageForm';
import { StageList } from './StageList';
import { TripActions } from './TripActions';

export function TripSidebar() {
  const stages = useTripStore((s) => s.stages);
  const { dark, toggle } = useTheme();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-500" />
          <div>
            <h1 className="font-bold text-gray-800 dark:text-slate-100 leading-tight">TripWetter</h1>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {stages.length} {stages.length === 1 ? 'Etappe' : 'Etappen'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            title={dark ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren'}
            className="rounded p-1.5 text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-200"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <TripActions />
        </div>
      </div>

      {/* Etappen-Formular (erscheint nach Kartenklick) */}
      <StageForm />

      {/* Etappen-Liste */}
      <div className="flex-1 overflow-y-auto">
        <StageList />
      </div>

      {/* Footer-Hinweis */}
      <div className="border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-2 flex-shrink-0">
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center">
          Karte anklicken, um eine Etappe hinzuzufügen
        </p>
      </div>
    </div>
  );
}
