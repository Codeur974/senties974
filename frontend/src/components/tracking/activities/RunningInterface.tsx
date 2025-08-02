"use client";

import { useAccelerometer } from "@/hooks/useAccelerometer";
import { useAdvancedGPS } from "@/hooks/useAdvancedGPS";
import { useIntensityDetection } from "@/hooks/useIntensityDetection";
import { useWeather } from "@/hooks/useWeather";
import { RunningMetrics } from "@/types/metrics";
import { useEffect, useState } from "react";
import DistanceDisplay from "../DistanceDisplay";
import Timer from "../Timer";

interface RunningInterfaceProps {
  time: number;
  distance: number;
  onReset?: () => void;
  onBack?: () => void;
  isActive?: boolean;
}

export default function RunningInterface({
  time,
  distance,
  onReset,
  onBack,
  isActive = true,
}: RunningInterfaceProps) {
  const [metrics, setMetrics] = useState<RunningMetrics>({
    distance: 0,
    time: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    calories: 0,
    elevation: 0,
    activeTime: 0,
    pauseTime: 0,
    cadence: 0,
    heartRate: 0,
    currentPace: 0,
    heartRateZone: "Zone 1 - Repos",
    splits: [],
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
    const caloriesPerMinute = intensity.intensity.caloriesPerMinute;
    return Math.round(activeMinutes * caloriesPerMinute);
  };

  // Calculer l'allure (min/km)
  const calculatePace = () => {
    if (distance === 0 || time === 0) return 0;
    return time / 60 / (distance / 1000); // min/km
  };

  // Générer des splits
  const generateSplits = () => {
    const splits = [];
    const kmCount = Math.floor(distance / 1000);

    for (let i = 0; i < kmCount; i++) {
      splits.push({
        km: i + 1,
        time: 5 * 60 + Math.random() * 60, // Simulation pour l'instant
      });
    }
    return splits;
  };

  // Mettre à jour les métriques avec les capteurs réels
  useEffect(() => {
    if (isActive) {
      const newMetrics: RunningMetrics = {
        distance,
        time,
        averageSpeed: gps.averageSpeed * 3.6, // Convertir en km/h
        maxSpeed: gps.maxSpeed * 3.6,
        calories: calculateCalories(),
        elevation: gps.elevation,
        activeTime: isActive ? time : metrics.activeTime,
        pauseTime: isActive ? metrics.pauseTime : time - metrics.activeTime,
        cadence: accelerometer.stepRate,
        heartRate: Math.round(60 + intensity.effortScore * 0.8), // Estimation basée sur l'effort
        currentPace: calculatePace(),
        heartRateZone: intensity.heartRateZone,
        splits: generateSplits(),
      };

      setMetrics(newMetrics);
    }
  }, [
    time,
    distance,
    isActive,
    accelerometer.stepRate,
    gps.averageSpeed,
    gps.maxSpeed,
    gps.elevation,
    intensity,
  ]);

  // Démarrer le tracking GPS quand l'activité commence
  useEffect(() => {
    if (isActive && time > 0 && !gps.isTracking) {
      gps.startTracking();
    }
  }, [isActive, time]);

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
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">
            {metrics.currentPace.toFixed(1)}
          </div>
          <div className="text-sm text-center opacity-90">min/km</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">
            {metrics.calories}
          </div>
          <div className="text-sm text-center opacity-90">calories</div>
        </div>
      </div>

      {/* Statistiques spécifiques course - SEULEMENT si actif */}
      {isActive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.floor(metrics.cadence)}
            </div>
            <div className="text-sm text-center opacity-90">pas/min</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.floor(metrics.heartRate)}
            </div>
            <div className="text-sm text-center opacity-90">bpm</div>
            <div className="text-xs text-center opacity-75 mt-1">
              {metrics.heartRateZone}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {metrics.averageSpeed.toFixed(1)}
            </div>
            <div className="text-sm text-center opacity-90">km/h</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {metrics.maxSpeed.toFixed(1)}
            </div>
            <div className="text-sm text-center opacity-90">max km/h</div>
          </div>
        </div>
      )}

      {/* Métriques GPS avancées */}
      {gps.isTracking && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.round(gps.elevation)}
            </div>
            <div className="text-sm text-center opacity-90">m altitude</div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.round(gps.totalAscent)}
            </div>
            <div className="text-sm text-center opacity-90">m montée</div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.round(gps.totalDescent)}
            </div>
            <div className="text-sm text-center opacity-90">m descente</div>
          </div>
        </div>
      )}

      {/* Météo réelle pour course */}
      {weather.weather && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {weather.isLoading ? "..." : weather.weather.temperature}°C
            </div>
            <div className="text-sm text-center opacity-90">
              {weather.isLoading ? "Chargement..." : "température"}
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {weather.isLoading ? "..." : weather.weather.conditions}
            </div>
            <div className="text-sm text-center opacity-90">
              {weather.isLoading ? "Chargement..." : "conditions"}
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

      {/* Splits */}
      {metrics.splits.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Splits</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {metrics.splits.slice(0, 3).map((split, index) => (
              <div key={index} className="text-center">
                <div className="font-bold">{split.km}er km</div>
                <div className="text-gray-600">
                  {Math.floor(split.time / 60)}:
                  {(split.time % 60).toString().padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
