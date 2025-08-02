import { create } from "zustand";

interface TrackingState {
  // State
  activiteSelectionnee: string | null;
  isTracking: boolean;
  positionGPS: { lat: number; lng: number } | null;

  // Actions
  selectActivite: (activite: string) => void;
  startTracking: () => void;
  stopTracking: () => void;
  updatePosition: (lat: number, lng: number) => void;
}
export const useTrackingStore = create<TrackingState>((set) => ({
  // state
  activiteSelectionnee: null,
  isTracking: false,
  positionGPS: null,

  // actions
  selectActivite: (activite: string) => set({ activiteSelectionnee: activite }),
  startTracking: () => set({ isTracking: true }),
  stopTracking: () => set({ isTracking: false }),
  updatePosition: (lat: number, lng: number) =>
    set({ positionGPS: { lat, lng } }),
}));
