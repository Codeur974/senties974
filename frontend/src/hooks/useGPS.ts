import { useEffect, useState } from "react";

interface GPSPosition {
  lat: number;
  lng: number;
}

interface GPSData {
  position: GPSPosition | null;
  distance: number;
  points: GPSPosition[];
  error: string | null;
}

export function useGPS(
  isActive: boolean,
  onPositionUpdate?: (lat: number, lng: number) => void
) {
  const [gpsData, setGpsData] = useState<GPSData>({
    position: null,
    distance: 0,
    points: [],
    error: null,
  });

  // Fonction pour calculer la distance entre deux points GPS
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance en mètres
  };

  useEffect(() => {
    if (!isActive) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };

        setGpsData((prev) => {
          const newPoints = [...prev.points, newPosition];
          let newDistance = prev.distance;

          if (newPoints.length > 1) {
            const lastPoint = newPoints[newPoints.length - 2];
            const distanceAdded = calculateDistance(
              lastPoint.lat,
              lastPoint.lng,
              latitude,
              longitude
            );
            newDistance = prev.distance + distanceAdded;
          }

          return {
            position: newPosition,
            distance: newDistance,
            points: newPoints,
            error: null,
          };
        });

        // Appeler la fonction de callback si fournie
        if (onPositionUpdate) {
          onPositionUpdate(latitude, longitude);
        }
      },
      (error) => {
        console.error("Erreur GPS:", error);
        setGpsData((prev) => ({
          ...prev,
          error: `Erreur GPS: ${error.message}`,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isActive, onPositionUpdate]);

  const resetGPS = () => {
    setGpsData({
      position: null,
      distance: 0,
      points: [],
      error: null,
    });
  };

  return {
    position: gpsData.position,
    distance: gpsData.distance,
    points: gpsData.points,
    error: gpsData.error,
    resetGPS,
  };
}
