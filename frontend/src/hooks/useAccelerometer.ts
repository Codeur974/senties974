"use client";

import { useEffect, useState } from "react";

interface Acceleration {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

interface UseAccelerometerReturn {
  acceleration: Acceleration;
  isAvailable: boolean;
  isMoving: boolean;
  stepCount: number;
  stepRate: number; // pas par minute
}

export const useAccelerometer = (): UseAccelerometerReturn => {
  const [acceleration, setAcceleration] = useState<Acceleration>({
    x: 0,
    y: 0,
    z: 0,
    magnitude: 0,
  });
  const [isAvailable, setIsAvailable] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [stepRate, setStepRate] = useState(0);
  const [lastStepTime, setLastStepTime] = useState(0);

  // Détecter les pas basés sur l'accélération
  const detectStep = (currentAcceleration: Acceleration) => {
    const threshold = 1.2; // Seuil pour détecter un pas
    const now = Date.now();

    if (currentAcceleration.magnitude > threshold && now - lastStepTime > 300) {
      // Min 300ms entre les pas
      setStepCount((prev) => prev + 1);
      setLastStepTime(now);

      // Calculer le taux de pas par minute
      const stepsInLastMinute = stepCount + 1;
      setStepRate(stepsInLastMinute);
    }
  };

  // Détecter le mouvement
  const detectMovement = (currentAcceleration: Acceleration) => {
    const movementThreshold = 0.5;
    setIsMoving(currentAcceleration.magnitude > movementThreshold);
  };

  useEffect(() => {
    if ("DeviceMotionEvent" in window) {
      setIsAvailable(true);

      const handleMotion = (event: DeviceMotionEvent) => {
        // Correction : Gestion des valeurs null
        const acceleration = event.acceleration;
        const x = acceleration?.x ?? 0;
        const y = acceleration?.y ?? 0;
        const z = acceleration?.z ?? 0;
        
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        const newAcceleration = { x, y, z, magnitude };
        setAcceleration(newAcceleration);

        detectStep(newAcceleration);
        detectMovement(newAcceleration);
      };

      window.addEventListener("devicemotion", handleMotion);

      return () => {
        window.removeEventListener("devicemotion", handleMotion);
      };
    } else {
      setIsAvailable(false);
    }
  }, [lastStepTime, stepCount]);

  return {
    acceleration,
    isAvailable,
    isMoving,
    stepCount,
    stepRate,
  };
};
