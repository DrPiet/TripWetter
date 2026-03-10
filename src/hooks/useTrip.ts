'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TripStage, Coordinates, DailyWeather, StageWeather } from '@/types/trip';
import { determineWeatherSource } from '@/lib/utils/dateUtils';

interface TripStore {
  stages: TripStage[];
  selectedStageId: string | null;
  pendingCoordinates: Coordinates | null;
  isFormOpen: boolean;
  /** Temporäre Drag-Positionen: werden nur von TripRoute genutzt, nie für Wetter-Queries */
  draggingOverrides: Record<string, Coordinates>;

  addStage: (stage: Omit<TripStage, 'id' | 'createdAt' | 'weather'>) => string;
  updateStage: (id: string, updates: Partial<TripStage>) => void;
  removeStage: (id: string) => void;
  setWeatherForStage: (id: string, forecasts: DailyWeather[]) => void;
  selectStage: (id: string | null) => void;
  setPendingCoordinates: (coords: Coordinates | null) => void;
  setFormOpen: (open: boolean) => void;
  setDraggingOverride: (id: string, coords: Coordinates | null) => void;
  clearAll: () => void;
  importStages: (stages: TripStage[]) => void;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      stages: [],
      selectedStageId: null,
      pendingCoordinates: null,
      isFormOpen: false,
      draggingOverrides: {},

      addStage: (stageData) => {
        const id = crypto.randomUUID();
        set((state) => ({
          stages: [
            ...state.stages,
            { ...stageData, id, createdAt: Date.now() },
          ],
        }));
        return id;
      },

      updateStage: (id, updates) =>
        set((state) => ({
          stages: state.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      removeStage: (id) =>
        set((state) => ({
          stages: state.stages.filter((s) => s.id !== id),
          selectedStageId: state.selectedStageId === id ? null : state.selectedStageId,
        })),

      setWeatherForStage: (id, forecasts) => {
        const stage = get().stages.find((s) => s.id === id);
        if (!stage) return;
        const source = determineWeatherSource(stage.arrivalDate, stage.departureDate);
        const weather: StageWeather = {
          dailyForecasts: forecasts,
          fetchedAt: Date.now(),
          source,
        };
        set((state) => ({
          stages: state.stages.map((s) => (s.id === id ? { ...s, weather } : s)),
        }));
      },

      selectStage: (id) => set({ selectedStageId: id }),

      setDraggingOverride: (id, coords) =>
        set((state) => {
          const overrides = { ...state.draggingOverrides };
          if (coords === null) {
            delete overrides[id];
          } else {
            overrides[id] = coords;
          }
          return { draggingOverrides: overrides };
        }),

      setPendingCoordinates: (coords) =>
        set({ pendingCoordinates: coords, isFormOpen: coords !== null }),

      setFormOpen: (open) =>
        set((state) => ({
          isFormOpen: open,
          pendingCoordinates: open ? state.pendingCoordinates : null,
        })),

      clearAll: () =>
        set({ stages: [], selectedStageId: null, pendingCoordinates: null, isFormOpen: false }),

      importStages: (stages) =>
        set({ stages, selectedStageId: null }),
    }),
    {
      name: 'tripwetter-storage',
      version: 1,
      // Wetterdaten nicht persistieren (werden neu geladen)
      partialize: (state) => ({
        stages: state.stages.map((s) => ({ ...s, weather: undefined })),
      }),
    },
  ),
);
