// app/demo/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function DemoPage() {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

  // Données de test
  const distance = 2450; // 2,45 km
  const time = 600; // 10 min = 600 secondes

  useEffect(() => {
    const avgSpeedKmh = distance / 1000 / (time / 3600);
    setAverageSpeed(avgSpeedKmh);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedSpeed = 5 + Math.random() * 15; // entre 5 et 20 km/h
      setCurrentSpeed(simulatedSpeed);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
      <h1 className="text-3xl font-bold mb-4">Demo - Activité Simulée</h1>

      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-center w-64">
        <div className="text-4xl font-bold">{currentSpeed.toFixed(1)} km/h</div>
        <div className="text-sm opacity-90">Vitesse actuelle</div>
        <div className="text-xs mt-2 opacity-70">
          Moyenne: {averageSpeed.toFixed(1)} km/h
        </div>
      </div>

      <p className="mt-6 text-sm opacity-60">
        Données simulées : 2,45 km en 10 min
      </p>
    </div>
  );
}
