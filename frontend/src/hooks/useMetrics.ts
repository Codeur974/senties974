import {
  BaseMetrics,
  CyclingMetrics,
  RunningMetrics,
  SwimmingMetrics,
  WalkingMetrics,
} from "@/types/metrics";
import { useEffect, useState } from "react";

interface UseMetricsProps {
  time: number;
  distance: number;
  activityType: string;
  isActive: boolean;
  position?: { lat: number; lng: number; altitude?: number };
}

export function useMetrics({
  time,
  distance,
  activityType,
  isActive,
  position,
}: UseMetricsProps) {
  const [metrics, setMetrics] = useState<BaseMetrics>({
    distance: 0,
    time: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    calories: 0,
    elevation: 0,
    activeTime: 0,
    pauseTime: 0,
  });

  // Calculer les calories basées sur l'activité et l'intensité
  const calculateCalories = (
    distance: number,
    time: number,
    activityType: string
  ) => {
    const hours = time / 3600;
    const km = distance / 1000;

    // Métabolisme de base + activité (estimations)
    const caloriesPerHour = {
      marche: 300,
      course: 600,
      velo: 400,
      natation: 500,
      randonnee: 350,
    };

    return Math.round(
      (caloriesPerHour[activityType as keyof typeof caloriesPerHour] || 300) *
        hours
    );
  };

  // Calculer la vitesse moyenne
  const calculateAverageSpeed = (distance: number, time: number) => {
    if (time === 0) return 0;
    return distance / 1000 / (time / 3600); // km/h
  };

  // Simuler des métriques spécifiques selon l'activité
  const generateActivitySpecificMetrics = () => {
    const baseMetrics = {
      distance,
      time,
      averageSpeed: calculateAverageSpeed(distance, time),
      maxSpeed:
        calculateAverageSpeed(distance, time) * (1.2 + Math.random() * 0.3),
      calories: calculateCalories(distance, time, activityType),
      elevation: position?.altitude || 0,
      activeTime: isActive ? time : metrics.activeTime,
      pauseTime: isActive ? metrics.pauseTime : time - metrics.activeTime,
    };

    switch (activityType) {
      case "course":
        return {
          ...baseMetrics,
          cadence: 150 + Math.random() * 30,
          heartRate: 120 + Math.random() * 60,
          currentPace:
            time > 0 && distance > 0 ? time / 60 / (distance / 1000) : 0,
          heartRateZone: "Zone 2 - Endurance",
          splits: [],
        } as RunningMetrics;

      case "velo":
        return {
          ...baseMetrics,
          cadence: 80 + Math.random() * 40,
          power: 150 + Math.random() * 200,
          maxPower: 300 + Math.random() * 100,
          averagePower: 180 + Math.random() * 50,
          gradient: -5 + Math.random() * 10,
          gearRatio: "2:1",
        } as CyclingMetrics;

      case "natation":
        return {
          ...baseMetrics,
          laps: Math.floor(distance / 25), // 25m par longueur
          lapTime: 30 + Math.random() * 20,
          stroke: "Crawl",
          strokeRate: 50 + Math.random() * 20,
          restTime: 0,
          poolLength: 25,
        } as SwimmingMetrics;

      case "marche":
      case "randonnee":
        return {
          ...baseMetrics,
          stepsPerMinute: 100 + Math.random() * 20,
          currentAltitude: position?.altitude || 0,
          totalAscent: Math.max(0, position?.altitude || 0),
          totalDescent: Math.min(0, position?.altitude || 0),
          weather: {
            temperature: 20 + Math.random() * 10,
            conditions: "Ensoleillé",
          },
        } as WalkingMetrics;

      default:
        return baseMetrics;
    }
  };

  useEffect(() => {
    const newMetrics = generateActivitySpecificMetrics();
    setMetrics(newMetrics);
  }, [time, distance, activityType, isActive, position]);

  return metrics;
}
