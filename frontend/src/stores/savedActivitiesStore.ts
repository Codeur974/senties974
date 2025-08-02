import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedActivity {
  id: string;
  type: string;
  name: string;
  date: string;
  time: number;
  distance: number;
  calories: number;
  averageSpeed: number;
  maxSpeed: number;
  metrics: any; // Métriques spécifiques selon l'activité
}

interface SavedActivitiesState {
  activities: SavedActivity[];
  addActivity: (activity: Omit<SavedActivity, "id">) => void;
  deleteActivity: (id: string) => void;
  clearAllActivities: () => void;
}

export const useSavedActivitiesStore = create<SavedActivitiesState>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (activity) => {
        const newActivity: SavedActivity = {
          ...activity,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));
      },

      deleteActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
        }));
      },

      clearAllActivities: () => {
        set({ activities: [] });
      },
    }),
    {
      name: "saved-activities",
    }
  )
);
