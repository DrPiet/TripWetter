'use client';

import { Download, Upload, Trash2 } from 'lucide-react';
import { useTripStore } from '@/hooks/useTrip';
import type { TripStage } from '@/types/trip';

interface ExportData {
  version: number;
  exportedAt: number;
  stages: Omit<TripStage, 'weather'>[];
}

export function TripActions() {
  const stages = useTripStore((s) => s.stages);
  const clearAll = useTripStore((s) => s.clearAll);
  const importStages = useTripStore((s) => s.importStages);

  function handleExport() {
    const data: ExportData = {
      version: 1,
      exportedAt: Date.now(),
      stages: stages.map(({ weather: _, ...rest }) => rest),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tripwetter-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as ExportData;
          if (Array.isArray(data.stages)) {
            importStages(data.stages as TripStage[]);
          } else {
            alert('Ungültiges Dateiformat.');
          }
        } catch {
          alert('Fehler beim Lesen der Datei.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function handleClear() {
    if (stages.length === 0) return;
    if (confirm(`Alle ${stages.length} Etappe(n) löschen?`)) {
      clearAll();
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleExport}
        disabled={stages.length === 0}
        title="Reiseplan exportieren"
        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="h-4 w-4" />
      </button>
      <button
        onClick={handleImport}
        title="Reiseplan importieren"
        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        <Upload className="h-4 w-4" />
      </button>
      <button
        onClick={handleClear}
        disabled={stages.length === 0}
        title="Alle Etappen löschen"
        className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
