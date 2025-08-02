"use client";

import { useAccelerometer } from "@/hooks/useAccelerometer";
import { useAdvancedGPS } from "@/hooks/useAdvancedGPS";
import { useIntensityDetection } from "@/hooks/useIntensityDetection";
import { useWeather } from "@/hooks/useWeather";
import { SwimmingMetrics } from "@/types/metrics";
import { useEffect, useState } from "react";
import DistanceDisplay from "../DistanceDisplay";
import Timer from "../Timer";

interface SwimmingInterfaceProps {
  time: number;
  distance: number;
  onReset?: () => void;
  onBack?: () => void;
  isActive?: boolean;
}

export default function SwimmingInterface({
  time,
  distance,
  onReset,
  onBack,
  isActive = true,
}: SwimmingInterfaceProps) {
  const [metrics, setMetrics] = useState<SwimmingMetrics>({
    distance: 0,
    time: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    calories: 0,
    elevation: 0,
    activeTime: 0,
    pauseTime: 0,
    laps: 0,
    lapTime: 0,
    stroke: "Crawl",
    strokeRate: 0,
    restTime: 0,
    poolLength: 25,
  });

  // Capteurs avancés
  const accelerometer = useAccelerometer();
  const gps = useAdvancedGPS();
  const intensity = useIntensityDetection();
  const weather = useWeather();

  // Récupérer la météo quand on a une position GPS
  useEffect(() => {
    if (gps.position && !weather.weather) {
      weather.fetchWeather(gps.position.latitude, gps.position.longitude);
    }
  }, [gps.position]);

  // Calculer les calories basées sur l'intensité réelle
  const calculateCalories = () => {
    if (!isActive) return metrics.calories;

    const activeMinutes = time / 60;
    const caloriesPerMinute = intensity.intensity.caloriesPerMinute * 1.2; // Natation plus intense
    return Math.round(activeMinutes * caloriesPerMinute);
  };

  // Calculer les longueurs
  const calculateLaps = () => {
    return Math.floor(distance / metrics.poolLength);
  };

  // Calculer le temps par longueur
  const calculateLapTime = () => {
    const laps = calculateLaps();
    if (laps === 0) return 0;
    return time / laps;
  };

  // Détecter le style de nage basé sur l'accélération
  const detectStroke = () => {
    const { x, y, z } = accelerometer.acceleration;
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // Logique simplifiée de détection
    if (magnitude > 2) return "Papillon";
    if (magnitude > 1.5) return "Crawl";
    if (magnitude > 1) return "Brasse";
    return "Dos";
  };

  // Calculer le taux de coups
  const calculateStrokeRate = () => {
    if (!isActive) return 0;
    const baseRate = 50 + intensity.effortScore * 0.5;
    return Math.round(baseRate + Math.random() * 20);
  };

  // Mettre à jour les métriques avec les capteurs réels
  useEffect(() => {
    if (isActive) {
      const newMetrics: SwimmingMetrics = {
        distance,
        time,
        averageSpeed: gps.averageSpeed * 3.6,
        maxSpeed: gps.maxSpeed * 3.6,
        calories: calculateCalories(),
        elevation: gps.elevation,
        activeTime: isActive ? time : metrics.activeTime,
        pauseTime: isActive ? metrics.pauseTime : time - metrics.activeTime,
        laps: calculateLaps(),
        lapTime: calculateLapTime(),
        stroke: detectStroke(),
        strokeRate: calculateStrokeRate(),
        restTime: 0, // À implémenter avec détection de pause
        poolLength: 25,
      };

      setMetrics(newMetrics);
    }
  }, [
    time,
    distance,
    isActive,
    gps.averageSpeed,
    gps.maxSpeed,
    intensity,
    accelerometer.acceleration,
  ]);

  return (
    <div className="space-y-6">
      {/* Bouton retour en haut */}
      {onBack && (
        <div className="flex justify-start mb-4">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            <span className="mr-2">←</span>
            Retour
          </button>
        </div>
      )}

      {/* Message de pause */}
      {!isActive && time > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⏸️</span>
            <span className="text-yellow-800 font-medium">
              Activité en pause
            </span>
          </div>
        </div>
      )}

      {/* Indicateur de capteurs */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`p-2 rounded ${
            accelerometer.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          📱 Accéléromètre:{" "}
          {accelerometer.isAvailable ? "Disponible" : "Non disponible"}
        </div>
        <div
          className={`p-2 rounded ${
            gps.isTracking
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          🗺️ GPS: {gps.isTracking ? "Actif" : "Inactif"}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Timer seconds={time} />
        <DistanceDisplay distance={distance} />
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">{metrics.laps}</div>
          <div className="text-sm text-center opacity-90">longueurs</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">
            {metrics.calories}
          </div>
          <div className="text-sm text-center opacity-90">calories</div>
        </div>
      </div>

      {/* Statistiques spécifiques natation - SEULEMENT si actif */}
      {isActive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.floor(metrics.lapTime)}
            </div>
            <div className="text-sm text-center opacity-90">sec/longueur</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {metrics.stroke}
            </div>
            <div className="text-sm text-center opacity-90">style</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.floor(metrics.strokeRate)}
            </div>
            <div className="text-sm text-center opacity-90">coups/min</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {metrics.averageSpeed.toFixed(1)}
            </div>
            <div className="text-sm text-center opacity-90">km/h</div>
          </div>
        </div>
      )}

      {/* Informations bassin */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 rounded-lg text-white">
          <div className="text-xl font-bold text-center">
            {metrics.poolLength}m
          </div>
          <div className="text-sm text-center opacity-90">longueur bassin</div>
        </div>

        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-4 rounded-lg text-white">
          <div className="text-xl font-bold text-center">
            {Math.floor(metrics.restTime)}
          </div>
          <div className="text-sm text-center opacity-90">sec repos</div>
        </div>
      </div>

      {/* Météo réelle pour natation */}
      {weather.weather && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {weather.isLoading ? "..." : weather.weather.temperature}°C
            </div>
            <div className="text-sm text-center opacity-90">
              {weather.isLoading ? "Chargement..." : "température air"}
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {weather.isLoading
                ? "..."
                : Math.round(weather.weather.temperature * 0.8)}
              °C
            </div>
            <div className="text-sm text-center opacity-90">
              {weather.isLoading ? "Chargement..." : "température eau"}
            </div>
          </div>
        </div>
      )}

      {/* Indicateur d'intensité */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Intensité de l'effort</span>
          <span className="text-sm text-gray-600">
            {intensity.effortScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              intensity.intensity.level === "low"
                ? "bg-green-500"
                : intensity.intensity.level === "medium"
                ? "bg-yellow-500"
                : intensity.intensity.level === "high"
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
            style={{ width: `${intensity.effortScore}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Niveau: {intensity.intensity.level.replace("_", " ")}
        </div>
      </div>

      {/* Bouton retour en bas */}
      {onBack && (
        <div className="flex justify-start mt-6">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            <span className="mr-2">←</span>
            Retour
          </button>
        </div>
      )}
    </div>
  );
}
