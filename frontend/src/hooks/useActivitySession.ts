import { useEffect, useRef, useState } from "react";

type SessionStatus = "idle" | "running" | "paused" | "stopped";

export function useActivitySession() {
  // 1️⃣ ÉTATS INTERNES
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [points, setPoints] = useState<
    { lat: number; lng: number; time: number }[]
  >([]);

  const [gpsError, setGpsError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0); // vitesse instantanée

  // 2️⃣ EFFETS (useEffect) clairement groupés :

  // ▶️ Effet pour gérer le TIMER
  useEffect(() => {
    if (status === "running" && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    if (status !== "running" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  // ▶️ Effet pour gérer clairement le GPS (à ajouter ici précisément)
  useEffect(() => {
    let watchId: number | null = null;

    if (status === "running" && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            time: Date.now(),
          };

          setPosition(newPosition);
          setPoints((prevPoints) => {
            const updatedPoints = [...prevPoints, newPosition];

            if (prevPoints.length > 0) {
              const lastPoint = prevPoints[prevPoints.length - 1];
              const distAdded = calculateDistance(lastPoint, newPosition);

              if (distAdded > 2) {
                setDistance((prevDist) => prevDist + distAdded);

                const timeDiff = (newPosition.time - lastPoint.time) / 1000;
                const speed = distAdded / 1000 / (timeDiff / 3600);
                setCurrentSpeed(speed);
              } else {
                setCurrentSpeed(0);
              }
            } else {
              // ✅ Cas spécial : Premier point GPS reçu
              setCurrentSpeed(0);
            }

            return updatedPoints;
          });
        },
        (error) => setGpsError(error.message),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [status]);

  // 3️⃣ FONCTIONS clairement groupées :
  const startSession = () => {
    setTime(0);
    setDistance(0);
    setStatus("running");
    setPoints([]);
    setPosition(null);
    setGpsError(null);
  };

  const pauseSession = () => status === "running" && setStatus("paused");
  const resumeSession = () => status === "paused" && setStatus("running");
  const stopSession = () =>
    (status === "running" || status === "paused") && setStatus("stopped");
  const resetSession = () => {
    setStatus("idle");
    setTime(0);
    setDistance(0);
    setPoints([]);
    setPosition(null);
    setGpsError(null);
  };

  // 4️⃣ RETURN clair et explicite :
  return {
    status,
    time,
    distance,
    position,
    points,
    gpsError,
    currentSpeed,
    isRunning: status === "running",
    isPaused: status === "paused",
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
  };
}

// 🛠️ Fonction externe claire (même fichier, juste sous le hook)

function calculateDistance(
  pointA: { lat: number; lng: number },
  pointB: { lat: number; lng: number }
): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(pointB.lat - pointA.lat);
  const dLng = toRad(pointB.lng - pointA.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(pointA.lat)) *
      Math.cos(toRad(pointB.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
