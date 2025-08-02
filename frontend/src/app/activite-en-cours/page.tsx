"use client";

import { activites, getActiviteById } from "@/data/activites";
import { useTrackingStore } from "@/stores/trackingStore";
import { useEffect, useState } from "react";

export default function ActiviteEnCours() {
  // États locaux
  const [activiteSelectionnee, setActiviteSelectionnee] = useState<
    string | null
  >(null);
  const [tempsEcoule, setTempsEcoule] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pointsGPS, setPointsGPS] = useState<
    Array<{ lat: number; lng: number }>
  >([]);

  // Store Zustand
  const {
    isTracking,
    positionGPS,
    startTracking,
    stopTracking,
    updatePosition,
  } = useTrackingStore();

  // Fonction pour calculer la distance entre deux points GPS
  const calculerDistance = (
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

  // Timer pour compter le temps écoulé
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking) {
      interval = setInterval(() => {
        setTempsEcoule((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTracking]);

  // GPS pour suivre la position
  useEffect(() => {
    if (!isTracking) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updatePosition(latitude, longitude);

        // Ajouter le point GPS et calculer la distance
        setPointsGPS((prev) => {
          const newPoints = [...prev, { lat: latitude, lng: longitude }];
          if (newPoints.length > 1) {
            const lastPoint = newPoints[newPoints.length - 2];
            const distanceAjoutee = calculerDistance(
              lastPoint.lat,
              lastPoint.lng,
              latitude,
              longitude
            );
            setDistance((prev) => prev + distanceAjoutee);
          }
          return newPoints;
        });
      },
      (error) => {
        console.error("Erreur GPS:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking, updatePosition]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Activité en cours
        </h1>

        {/* Sélection d'activité */}
        {!activiteSelectionnee && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Choisir une activité</h2>
            <div className="grid grid-cols-2 gap-3">
              {activites.map((activite) => (
                <button
                  key={activite.id}
                  onClick={() => setActiviteSelectionnee(activite.id)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                >
                  <div className="text-2xl mb-2">{activite.icon}</div>
                  <div className="font-medium">{activite.nom}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interface de tracking */}
        {activiteSelectionnee && (
          <div className="space-y-4">
            {/* Activité sélectionnée */}
            <div className="text-center">
              <div className="text-3xl mb-2">
                {getActiviteById(activiteSelectionnee)?.icon}
              </div>
              <h2 className="text-xl font-bold">
                {getActiviteById(activiteSelectionnee)?.nom}
              </h2>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-2xl font-bold">
                  {Math.floor(tempsEcoule / 60)}:
                  {(tempsEcoule % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600">Temps</div>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-2xl font-bold">
                  {(distance / 1000).toFixed(2)} km
                </div>
                <div className="text-sm text-gray-600">Distance</div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              {!isTracking ? (
                <button
                  onClick={startTracking}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Démarrer
                </button>
              ) : (
                <>
                  <button
                    onClick={stopTracking}
                    className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Arrêter
                  </button>
                  <button className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                    Photo
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
