"use client";

import { useEffect, useState } from "react";
import { useAccelerometer } from "./useAccelerometer";
import { useAdvancedGPS } from "./useAdvancedGPS";

interface IntensityLevel {
  level: "low" | "medium" | "high" | "very_high";
  percentage: number;
  caloriesPerMinute: number;
}

interface UseIntensityDetectionReturn {
  intensity: IntensityLevel;
  isActive: boolean;
  heartRateZone: string;
  effortScore: number; // 0-100
}

export const useIntensityDetection = (): UseIntensityDetectionReturn => {
  const accelerometer = useAccelerometer();
  const gps = useAdvancedGPS();
  const [intensity, setIntensity] = useState<IntensityLevel>({
    level: "low",
    percentage: 0,
    caloriesPerMinute: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const [heartRateZone, setHeartRateZone] = useState("Zone 1 - Repos");
  const [effortScore, setEffortScore] = useState(0);

  const calculateIntensity = () => {
    const speed = gps.currentSpeed; // m/s
    const acceleration = accelerometer.acceleration.magnitude;
    const isMoving = accelerometer.isMoving;
    const stepRate = accelerometer.stepRate;

    // Score d'effort basé sur multiple facteurs
    let effortScore = 0;

    // Vitesse (40% du score)
    if (speed > 0) {
      const speedScore = Math.min(speed * 3.6, 20); // Convertir en km/h, max 20
      effortScore += speedScore * 0.4;
    }

    // Mouvement détecté (30% du score)
    if (isMoving) {
      effortScore += 30;
    }

    // Taux de pas (20% du score)
    if (stepRate > 0) {
      const stepScore = Math.min(stepRate / 2, 20); // Max 20
      effortScore += stepScore * 0.2;
    }

    // Accélération (10% du score)
    const accelScore = Math.min(acceleration * 10, 10);
    effortScore += accelScore * 0.1;

    effortScore = Math.min(effortScore, 100);
    setEffortScore(effortScore);

    // Déterminer le niveau d'intensité
    let level: "low" | "medium" | "high" | "very_high";
    let caloriesPerMinute: number;

    if (effortScore < 25) {
      level = "low";
      caloriesPerMinute = 3;
    } else if (effortScore < 50) {
      level = "medium";
      caloriesPerMinute = 6;
    } else if (effortScore < 75) {
      level = "high";
      caloriesPerMinute = 10;
    } else {
      level = "very_high";
      caloriesPerMinute = 15;
    }

    // Déterminer la zone cardiaque (estimation)
    let zone = "Zone 1 - Repos";
    if (effortScore > 60) zone = "Zone 3 - Endurance";
    else if (effortScore > 40) zone = "Zone 2 - Brûlage graisses";
    else if (effortScore > 20) zone = "Zone 1 - Repos";

    setHeartRateZone(zone);
    setIsActive(effortScore > 10);

    setIntensity({
      level,
      percentage: effortScore,
      caloriesPerMinute,
    });
  };

  useEffect(() => {
    const interval = setInterval(calculateIntensity, 1000);
    return () => clearInterval(interval);
  }, [
    gps.currentSpeed,
    accelerometer.acceleration,
    accelerometer.isMoving,
    accelerometer.stepRate,
  ]);

  return {
    intensity,
    isActive,
    heartRateZone,
    effortScore,
  };
};
