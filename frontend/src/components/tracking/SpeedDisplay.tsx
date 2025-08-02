"use client";

import { useEffect, useState } from "react";

interface SpeedDisplayProps {
  distance: number; // en mètres
  time: number; // en secondes
}

export default function SpeedDisplay({ distance, time }: SpeedDisplayProps) {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

  useEffect(() => {
    if (time > 0) {
      // Vitesse moyenne en km/h
      const avgSpeedKmh = distance / 1000 / (time / 3600);
      setAverageSpeed(avgSpeedKmh);
    }
  }, [distance, time]);

  // Simuler la vitesse actuelle (dans un vrai app, on utiliserait les données GPS)
  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        // Simulation de vitesse actuelle (entre 0 et 20 km/h)
        const randomSpeed = Math.random() * 20;
        setCurrentSpeed(randomSpeed);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-lg text-white">
      <div className="text-2xl font-bold text-center">
        {currentSpeed.toFixed(1)} km/h
      </div>
      <div className="text-sm text-center opacity-90">Vitesse actuelle</div>
      <div className="text-xs text-center opacity-75 mt-1">
        Moyenne: {averageSpeed.toFixed(1)} km/h
      </div>
    </div>
  );
}
