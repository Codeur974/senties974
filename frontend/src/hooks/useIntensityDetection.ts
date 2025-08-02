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
    const speed = gps.currentSpeed || 0; // m/s
    const acceleration = accelerometer.acceleration?.magnitude || 0;
    const isMoving = accelerometer.isMoving || false;
    const stepRate = accelerometer.stepRate || 0;

    // Score d'effort basé sur multiple facteurs
    let effortScore = 0;

    // Vitesse (70% du score) - ENCORE PLUS IMPORTANT
    if (speed > 0) {
      const speedKmh = speed * 3.6; // Convertir en km/h
      const speedScore = Math.min(speedKmh * 4, 70); // Multiplicateur augmenté, max 70
      effortScore += speedScore;
    }

    // Mouvement détecté (20% du score)
    if (isMoving) {
      effortScore += 20;
    }

    // Taux de pas (10% du score) - RÉDUIT
    if (stepRate > 0) {
      const stepScore = Math.min(stepRate, 10); // Max 10
      effortScore += stepScore;
    }

    // Accélération (0% du score) - SUPPRIMÉ pour plus de réactivité
    // const accelScore = Math.min(acceleration * 2, 5);
    // effortScore += accelScore;

    effortScore = Math.min(effortScore, 100);
    setEffortScore(effortScore);

    // Déterminer le niveau d'intensité - SEUILS ENCORE PLUS BAS
    let level: "low" | "medium" | "high" | "very_high";
    let caloriesPerMinute: number;

    if (effortScore < 8) {
      level = "low";
      caloriesPerMinute = 3;
    } else if (effortScore < 20) {
      level = "medium";
      caloriesPerMinute = 6;
    } else if (effortScore < 40) {
      level = "high";
      caloriesPerMinute = 10;
    } else {
      level = "very_high";
      caloriesPerMinute = 15;
    }

    // Déterminer la zone cardiaque (estimation)
    let zone = "Zone 1 - Repos";
    if (effortScore > 25) zone = "Zone 3 - Endurance";
    else if (effortScore > 12) zone = "Zone 2 - Brûlage graisses";
    else if (effortScore > 3) zone = "Zone 1 - Repos";

    setHeartRateZone(zone);
    setIsActive(effortScore > 2);

    setIntensity({
      level,
      percentage: effortScore,
      caloriesPerMinute,
    });
  };

  // MISE À JOUR PLUS FRÉQUENTE : 500ms au lieu de 1000ms
  useEffect(() => {
    const interval = setInterval(calculateIntensity, 500);
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
