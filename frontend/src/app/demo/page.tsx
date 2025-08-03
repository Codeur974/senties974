// app/demo/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function DemoGPS() {
  const [speed, setSpeed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speedInMps = position.coords.speed; // vitesse en m/s

        if (speedInMps !== null) {
          const speedKmh = speedInMps * 3.6;
          setSpeed(speedKmh);
        } else {
          setSpeed(null); // vitesse inconnue (peut arriver si capteur lent)
        }
      },
      (err) => {
        setError("Erreur GPS : " + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-xl font-bold mb-4">Vitesse réelle (GPS)</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="text-4xl">
        {speed !== null ? `${speed.toFixed(1)} km/h` : "Recherche GPS..."}
      </div>
    </div>
  );
}
