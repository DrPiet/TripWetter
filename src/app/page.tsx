import { TripSidebar } from '@/components/trip/TripSidebar';
import { TripMap } from '@/components/map/TripMap';

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-96 flex-shrink-0 overflow-hidden border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <TripSidebar />
      </aside>

      {/* Karte */}
      <div className="relative flex-1">
        <TripMap />
      </div>
    </main>
  );
}
