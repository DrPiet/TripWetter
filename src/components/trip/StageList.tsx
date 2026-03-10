import { useTripStore } from '@/hooks/useTrip';
import { StageCard } from './StageCard';

export function StageList() {
  const stages = useTripStore((s) => s.stages);

  const sortedStages = [...stages].sort(
    (a, b) => a.arrivalDate.localeCompare(b.arrivalDate),
  );

  if (stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="mb-3 text-4xl">🗺️</div>
        <p className="font-medium text-gray-600 dark:text-slate-300 text-sm">Noch keine Etappen</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
          Klicke auf die Karte oder nutze die Suche, um eine Etappe hinzuzufügen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3">
      {sortedStages.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  );
}
