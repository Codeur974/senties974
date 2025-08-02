"use client";

import { useAccelerometer } from "@/hooks/useAccelerometer";
import { useAdvancedGPS } from "@/hooks/useAdvancedGPS";
import { useIntensityDetection } from "@/hooks/useIntensityDetection";
import { useWeather } from "@/hooks/useWeather";
import { CyclingMetrics } from "@/types/metrics";
import { useEffect, useState } from "react";
import DistanceDisplay from "../DistanceDisplay";
import Timer from "../Timer";

interface CyclingInterfaceProps {
  time: number;
  distance: number;
  onReset?: () => void;
  onBack?: () => void;
  isActive?: boolean;
}

export default function CyclingInterface({
  time,
  distance,
  onReset,
  onBack,
  isActive = true,
}: CyclingInterfaceProps) {
  const [metrics, setMetrics] = useState<CyclingMetrics>({
    distance: 0,
    time: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    calories: 0,
    elevation: 0,
    activeTime: 0,
    pauseTime: 0,
    cadence: 0,
    power: 0,
    maxPower: 0,
    averagePower: 0,
    gradient: 0,
    gearRatio: "2:1",
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
    const caloriesPerMinute = intensity.intensity.caloriesPerMinute * 0.8; // Vélo moins intense
    return Math.round(activeMinutes * caloriesPerMinute);
  };

  // Calculer la cadence (estimation basée sur la vitesse et l'accélération)
  const calculateCadence = () => {
    if (gps.currentSpeed < 1) return 0; // Pas de mouvement
    const baseCadence = 60 + gps.currentSpeed * 10; // Plus de vitesse = plus de cadence
    return Math.min(baseCadence + Math.random() * 20, 120); // Max 120 rpm
  };

  // Calculer la puissance (estimation)
  const calculatePower = () => {
    const speed = gps.currentSpeed * 3.6; // km/h
    const gradient = gps.elevation > 0 ? 5 : -2; // Estimation de pente

    // Formule simplifiée : puissance = résistance + pente + accélération
    const basePower = speed * 10; // Résistance de l'air
    const gradientPower = gradient * 20; // Puissance pour la pente
    const accelerationPower = accelerometer.acceleration.magnitude * 50;

    return Math.max(
      0,
      Math.round(basePower + gradientPower + accelerationPower)
    );
  };

  // Mettre à jour les métriques avec les capteurs réels
  useEffect(() => {
    if (isActive) {
      const newMetrics: CyclingMetrics = {
        distance,
        time,
        averageSpeed: gps.averageSpeed * 3.6,
        maxSpeed: gps.maxSpeed * 3.6,
        calories: calculateCalories(),
        elevation: gps.elevation,
        activeTime: isActive ? time : metrics.activeTime,
        pauseTime: isActive ? metrics.pauseTime : time - metrics.activeTime,
        cadence: calculateCadence(),
        power: calculatePower(),
        maxPower: Math.max(metrics.maxPower, calculatePower()),
        averagePower: (metrics.averagePower + calculatePower()) / 2,
        gradient: gps.elevation > 0 ? 5 : -2,
        gearRatio: "2:1", // Fixe pour l'instant
      };

      setMetrics(newMetrics);
    }
  }, [
    time,
    distance,
    isActive,
    gps.currentSpeed,
    gps.averageSpeed,
    gps.maxSpeed,
    gps.elevation,
    intensity,
    accelerometer.acceleration,
  ]);

  // Démarrer le tracking GPS
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">
            {metrics.averageSpeed.toFixed(1)}
          </div>
          <div className="text-sm text-center opacity-90">km/h moyen</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">
            {metrics.calories}
          </div>
          <div className="text-sm text-center opacity-90">calories</div>
        </div>
      </div>

      {/* Statistiques spécifiques vélo - SEULEMENT si actif */}
      {isActive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.floor(metrics.cadence)}
            </div>
            <div className="text-sm text-center opacity-90">rpm</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.floor(metrics.power)}
            </div>
            <div className="text-sm text-center opacity-90">watts</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {Math.floor(metrics.maxPower)}
            </div>
            <div className="text-sm text-center opacity-90">max watts</div>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {metrics.gradient > 0 ? "+" : ""}
              {metrics.gradient}%
            </div>
            <div className="text-sm text-center opacity-90">pente</div>
          </div>
        </div>
      )}

      {/* Métriques GPS avancées */}
      {gps.isTracking && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

          <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {metrics.gearRatio}
            </div>
            <div className="text-sm text-center opacity-90">rapport</div>
          </div>
        </div>
      )}

      {/* Météo réelle pour vélo */}
      {weather.weather && (
        <div className="grid grid-cols-3 gap-4">
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

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
            <div className="text-xl font-bold text-center">
              {weather.isLoading ? "..." : weather.weather.windSpeed} km/h
            </div>
            <div className="text-sm text-center opacity-90">
              {weather.isLoading ? "Chargement..." : "vent"}
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
