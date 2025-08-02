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

    // Vitesse (50% du score) - AUGMENTÉ
    if (speed > 0) {
      const speedKmh = speed * 3.6; // Convertir en km/h
      const speedScore = Math.min(speedKmh * 2, 50); // Multiplicateur augmenté, max 50
      effortScore += speedScore;
    }

    // Mouvement détecté (25% du score) - RÉDUIT
    if (isMoving) {
      effortScore += 25;
    }

    // Taux de pas (15% du score) - RÉDUIT
    if (stepRate > 0) {
      const stepScore = Math.min(stepRate, 15); // Max 15
      effortScore += stepScore;
    }

    // Accélération (10% du score)
    const accelScore = Math.min(acceleration * 5, 10); // Multiplicateur réduit
    effortScore += accelScore;

    effortScore = Math.min(effortScore, 100);
    setEffortScore(effortScore);

    // Déterminer le niveau d'intensité - SEUILS RÉDUITS
    let level: "low" | "medium" | "high" | "very_high";
    let caloriesPerMinute: number;

    if (effortScore < 15) { // RÉDUIT de 25 à 15
      level = "low";
      caloriesPerMinute = 3;
    } else if (effortScore < 35) { // RÉDUIT de 50 à 35
      level = "medium";
      caloriesPerMinute = 6;
    } else if (effortScore < 60) { // RÉDUIT de 75 à 60
      level = "high";
      caloriesPerMinute = 10;
    } else {
      level = "very_high";
      caloriesPerMinute = 15;
    }

    // Déterminer la zone cardiaque (estimation) - SEUILS RÉDUITS
    let zone = "Zone 1 - Repos";
    if (effortScore > 40) zone = "Zone 3 - Endurance"; // RÉDUIT de 60 à 40
    else if (effortScore > 25) zone = "Zone 2 - Brûlage graisses"; // RÉDUIT de 40 à 25
    else if (effortScore > 10) zone = "Zone 1 - Repos"; // RÉDUIT de 20 à 10

    setHeartRateZone(zone);
    setIsActive(effortScore > 5); // RÉDUIT de 10 à 5

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
