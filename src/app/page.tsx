import { TripSidebar } from '@/components/trip/TripSidebar';
import { TripMap } from '@/components/map/TripMap';

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-96 flex-shrink-0 overflow-hidden border-r border-gray-200 bg-white shadow-sm">
        <TripSidebar />
      </aside>

      {/* Karte */}
      <div className="relative flex-1">
        <TripMap />
      </div>
    </main>
  );
}
