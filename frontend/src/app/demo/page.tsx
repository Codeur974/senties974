// app/demo/page.tsx

"use client";

import { useEffect, useState } from "react";

interface GPSPoint {
  lat: number;
  lon: number;
  timestamp: number;
}

export default function RealGPSVitesse() {
  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPoint, setLastPoint] = useState<GPSPoint | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Le GPS n'est pas disponible.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now: GPSPoint = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          timestamp: Date.now(),
        };

        if (lastPoint) {
          const d = getDistanceFromLatLonInMeters(
            lastPoint.lat,
            lastPoint.lon,
            now.lat,
            now.lon
          );
          const dt = (now.timestamp - lastPoint.timestamp) / 1000; // secondes
          if (dt > 0 && d > 0) {
            const speedMps = d / dt;
            const speedKmh = speedMps * 3.6;
            setCurrentSpeed(speedKmh);
          }
        }

        setLastPoint(now);
      },
      (err) => {
        setError("Erreur GPS : " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [lastPoint]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Vitesse réelle (calculée)</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="text-5xl font-bold">
        {currentSpeed !== null
          ? `${currentSpeed.toFixed(1)} km/h`
          : "En attente..."}
      </div>
    </div>
  );
}

// 📐 Fonction pour calculer la distance entre deux points GPS (Haversine)
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // rayon de la Terre en mètres
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
