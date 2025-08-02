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
  const stepCount = useRef(0);
  const lastStepTime = useRef(0);

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

  // NOUVEAU : Estimer la vitesse basée sur les pas
  const estimateSpeedFromSteps = () => {
    const now = Date.now();
    const timeSinceLastStep = now - lastStepTime.current;

    if (timeSinceLastStep < 1000) {
      // Si moins d'1 seconde depuis le dernier pas
      // Vitesse basée sur la fréquence des pas
      const stepsPerSecond = 1000 / timeSinceLastStep;
      const estimatedSpeed = stepsPerSecond * 0.7; // 0.7 m par pas
      return Math.min(estimatedSpeed, 2.0); // Max 2 m/s (7.2 km/h)
    }

    return 0;
  };

  // NOUVEAU : Détecter les pas avec l'accéléromètre
  const detectSteps = () => {
    if ("DeviceMotionEvent" in window) {
      const handleMotion = (event: DeviceMotionEvent) => {
        const acceleration = event.acceleration;
        if (acceleration) {
          const { x, y, z } = acceleration;
          const magnitude = Math.sqrt(
            (x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2
          );

          const now = Date.now();
          const timeDiff = now - lastStepTime.current;

          // Détecter un pas
          if (magnitude > 2.0 && timeDiff > 500) {
            stepCount.current++;
            lastStepTime.current = now;

            // Estimer la vitesse basée sur les pas
            const stepSpeed = estimateSpeedFromSteps();
            setCurrentSpeed(stepSpeed);
            setMaxSpeed((prev) => Math.max(prev, stepSpeed));
          }
        }
      };

      window.addEventListener("devicemotion", handleMotion);
      return () => window.removeEventListener("devicemotion", handleMotion);
    }
  };

  const calculateSpeed = (newPosition: AdvancedPosition) => {
    if (positions.current.length > 0) {
      const lastPos = positions.current[positions.current.length - 1];
      const timeDiff = (newPosition.timestamp - lastPos.timestamp) / 1000; // en secondes

      if (timeDiff > 0) {
        const distance = calculateDistance(lastPos, newPosition);
        const gpsSpeed = distance / timeDiff; // m/s

        // Utiliser GPS pour les vitesses élevées, pas pour les vitesses faibles
        if (gpsSpeed > 1.0) {
          // Plus de 3.6 km/h
          setCurrentSpeed(gpsSpeed);
          setMaxSpeed((prev) => Math.max(prev, gpsSpeed));
        }
        // Sinon, garder la vitesse basée sur les pas

        // Calculer la vitesse moyenne
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
      stepCount.current = 0;
      lastStepTime.current = Date.now();

      // Démarrer la détection des pas
      const cleanupSteps = detectSteps();

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
        if (cleanupSteps) cleanupSteps();
      };
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
