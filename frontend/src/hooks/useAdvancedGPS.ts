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
    // SOLUTION AMÉLIORÉE : Combiner vitesse native + calcul manuel
    const nativeSpeed = newPosition.speed; // m/s

    if (positions.current.length > 0) {
      const lastPos = positions.current[positions.current.length - 1];
      const timeDiff = (newPosition.timestamp - lastPos.timestamp) / 1000; // en secondes

      if (timeDiff > 0) {
        const distance = calculateDistance(lastPos, newPosition);
        const calculatedSpeed = distance / timeDiff; // m/s

        // UTILISER LA MEILLEURE VITESSE
        let finalSpeed = 0;

        if (nativeSpeed && nativeSpeed > 0.5) {
          // Si vitesse native fiable (> 0.5 m/s), l'utiliser
          finalSpeed = nativeSpeed;
        } else if (calculatedSpeed > 0.1) {
          // Sinon, utiliser notre calcul si mouvement détecté
          finalSpeed = calculatedSpeed;
        }

        // LISSAGE pour éviter les sauts
        if (finalSpeed > 0) {
          const smoothingFactor = 0.7; // 70% de la nouvelle valeur
          const smoothedSpeed =
            currentSpeed * (1 - smoothingFactor) + finalSpeed * smoothingFactor;

          setCurrentSpeed(smoothedSpeed);
          setMaxSpeed((prev) => Math.max(prev, smoothedSpeed));
        }
      }
    }

    // Calculer la vitesse moyenne sur tout le trajet
    if (positions.current.length > 0) {
      const totalDistance = positions.current.reduce((total, pos, index) => {
        if (index > 0) {
          return total + calculateDistance(positions.current[index - 1], pos);
        }
        return total;
      }, 0);

      const totalTime =
        (newPosition.timestamp - positions.current[0].timestamp) / 1000;
      setAverageSpeed(totalTime > 0 ? totalDistance / totalTime : 0);
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

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition: AdvancedPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || 0,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0, // VITESSE NATIVE
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
