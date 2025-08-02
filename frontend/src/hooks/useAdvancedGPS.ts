"use client";

import { useRef, useState } from "react";

interface AdvancedPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  timestamp: number;
}

interface UseAdvancedGPSReturn {
  position: AdvancedPosition | null;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  elevation: number;
  totalAscent: number;
  totalDescent: number;
  currentSpeed: number;
  averageSpeed: number;
  maxSpeed: number;
}

export const useAdvancedGPS = (): UseAdvancedGPSReturn => {
  const [position, setPosition] = useState<AdvancedPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [elevation, setElevation] = useState(0);
  const [totalAscent, setTotalAscent] = useState(0);
  const [totalDescent, setTotalDescent] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);

  const positions = useRef<AdvancedPosition[]>([]);
  const lastAltitude = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const totalDistance = useRef<number>(0);

  const calculateElevation = (newAltitude: number) => {
    if (lastAltitude.current !== null) {
      const altitudeDiff = newAltitude - lastAltitude.current;

      if (altitudeDiff > 0) {
        setTotalAscent((prev) => prev + altitudeDiff);
      } else if (altitudeDiff < 0) {
        setTotalDescent((prev) => prev + Math.abs(altitudeDiff));
      }
    }

    lastAltitude.current = newAltitude;
    setElevation(newAltitude);
  };

  const calculateSpeed = (newPosition: AdvancedPosition) => {
    if (positions.current.length > 0) {
      const lastPos = positions.current[positions.current.length - 1];
      const timeDiff = (newPosition.timestamp - lastPos.timestamp) / 1000; // en secondes

      if (timeDiff > 0) {
        const distance = calculateDistance(lastPos, newPosition);
        totalDistance.current += distance;

        // Calculer la vitesse instantanée
        const instantSpeed = distance / timeDiff; // m/s

        // Calculer la vitesse moyenne sur tout le trajet
        const totalTime = (newPosition.timestamp - startTime.current) / 1000;
        const averageSpeedValue =
          totalTime > 0 ? totalDistance.current / totalTime : 0;

        // Utiliser la vitesse instantanée si elle est fiable, sinon la moyenne
        let finalSpeed = instantSpeed;

        // Si la vitesse instantanée est trop faible mais qu'on a bougé, utiliser une estimation
        if (instantSpeed < 0.1 && totalDistance.current > 5) {
          // Plus de 5m parcourus
          finalSpeed = averageSpeedValue;
        }

        // Filtrer les vitesses aberrantes
        if (finalSpeed > 0.01) {
          // Seuil très bas
          setCurrentSpeed(finalSpeed);
          setMaxSpeed((prev) => Math.max(prev, finalSpeed));
        }

        setAverageSpeed(averageSpeedValue);
      }
    }
  };

  const calculateDistance = (
    pos1: AdvancedPosition,
    pos2: AdvancedPosition
  ) => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = (pos1.latitude * Math.PI) / 180;
    const φ2 = (pos2.latitude * Math.PI) / 180;
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startTracking = () => {
    if ("geolocation" in navigator) {
      setIsTracking(true);
      positions.current = [];
      lastAltitude.current = null;
      startTime.current = Date.now();
      totalDistance.current = 0;

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition: AdvancedPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || 0,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            timestamp: position.timestamp,
          };

          setPosition(newPosition);
          positions.current.push(newPosition);

          calculateElevation(newPosition.altitude);
          calculateSpeed(newPosition);
        },
        (error) => {
          console.error("Erreur GPS:", error);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  return {
    position,
    isTracking,
    startTracking,
    stopTracking,
    elevation,
    totalAscent,
    totalDescent,
    currentSpeed,
    averageSpeed,
    maxSpeed,
  };
};
