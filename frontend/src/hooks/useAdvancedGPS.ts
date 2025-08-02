"use client";

import { useEffect, useRef, useState } from "react";

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
  const lastPosition = useRef<AdvancedPosition | null>(null);
  const speedInterval = useRef<NodeJS.Timeout | null>(null);

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

  // NOUVEAU : Simuler une vitesse basée sur le temps
  const simulateSpeed = () => {
    if (!isTracking || !lastPosition.current) return;

    const now = Date.now();
    const timeElapsed = (now - startTime.current) / 1000; // secondes

    // Vitesse simulée : 1.2 m/s (4.3 km/h) - vitesse de marche normale
    const simulatedSpeed = 1.2;

    setCurrentSpeed(simulatedSpeed);
    setMaxSpeed((prev) => Math.max(prev, simulatedSpeed));

    // Vitesse moyenne basée sur le temps écoulé
    const averageSpeedValue =
      timeElapsed > 0 ? totalDistance.current / timeElapsed : simulatedSpeed;
    setAverageSpeed(averageSpeedValue);
  };

  const calculateSpeed = (newPosition: AdvancedPosition) => {
    if (positions.current.length > 0) {
      const lastPos = positions.current[positions.current.length - 1];
      const timeDiff = (newPosition.timestamp - lastPos.timestamp) / 1000; // en secondes

      if (timeDiff > 0) {
        const distance = calculateDistance(lastPos, newPosition);
        totalDistance.current += distance;

        // Si on a bougé significativement, utiliser le GPS
        if (distance > 2) {
          // Plus de 2m
          const gpsSpeed = distance / timeDiff;
          setCurrentSpeed(gpsSpeed);
          setMaxSpeed((prev) => Math.max(prev, gpsSpeed));
        }
        // Sinon, garder la vitesse simulée

        lastPosition.current = newPosition;
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
      lastPosition.current = null;

      // Démarrer la simulation de vitesse
      speedInterval.current = setInterval(simulateSpeed, 1000); // Mise à jour toutes les secondes

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

      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (speedInterval.current) {
          clearInterval(speedInterval.current);
        }
      };
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (speedInterval.current) {
      clearInterval(speedInterval.current);
    }
  };

  // Nettoyer l'intervalle quand le composant se démonte
  useEffect(() => {
    return () => {
      if (speedInterval.current) {
        clearInterval(speedInterval.current);
      }
    };
  }, []);

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
