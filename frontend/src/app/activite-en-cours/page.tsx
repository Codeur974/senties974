"use client";

import ActionButtons from "@/components/tracking/ActionButtons";
import ActivitySelector from "@/components/tracking/ActivitySelector";
import { getActiviteById } from "@/data/activites";
import { useGPS } from "@/hooks/useGPS";
import { useTimer } from "@/hooks/useTimer";
import { useSavedActivitiesStore } from "@/stores/savedActivitiesStore";
import { useTrackingStore } from "@/stores/trackingStore";
import { useState } from "react";
import Link from "next/link";

// Interfaces spécifiques par activité
import CyclingInterface from "@/components/tracking/activities/CyclingInterface";
import RunningInterface from "@/components/tracking/activities/RunningInterface";
import SwimmingInterface from "@/components/tracking/activities/SwimmingInterface";
import WalkingInterface from "@/components/tracking/activities/WalkingInterface";

export default function ActiviteEnCours() {
  // États locaux
  const [activiteSelectionnee, setActiviteSelectionnee] = useState<
    string | null
  >(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Store Zustand
  const { isTracking, startTracking, stopTracking, updatePosition } =
    useTrackingStore();
  const { addActivity } = useSavedActivitiesStore();

  // Hooks personnalisés
  const { time, resetTimer } = useTimer(isTracking && !isPaused);
  const { distance, resetGPS } = useGPS(
    isTracking && !isPaused,
    updatePosition
  );

  // Gestionnaires d'événements
  const handleStart = () => {
    startTracking();
    setIsPaused(false);
  };

  const handleStop = () => {
    stopTracking();
    setIsPaused(false);
    // Afficher le dialogue de sauvegarde
    if (time > 0) {
      setShowSaveDialog(true);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handlePhoto = () => {
    console.log("Photo prise !");
  };

  const handleActivitySelect = (activityId: string) => {
    setActiviteSelectionnee(activityId);
  };

  const handleReset = () => {
    resetTimer();
    resetGPS();
    setIsPaused(false);
    setShowSaveDialog(false);
  };

  const handleBack = () => {
    setActiviteSelectionnee(null);
    if (isTracking) {
      handleStop();
    }
  };

  // Sauvegarder l'activité
  const handleSaveActivity = (activityName: string) => {
    const activity = getActiviteById(activiteSelectionnee!);

    addActivity({
      type: activiteSelectionnee!,
      name: activityName,
      date: new Date().toISOString(),
      time,
      distance,
      calories: Math.round(600 * (time / 3600)), // Estimation
      averageSpeed: distance > 0 ? distance / 1000 / (time / 3600) : 0,
      maxSpeed: distance > 0 ? (distance / 1000 / (time / 3600)) * 1.2 : 0,
      metrics: {
        // Métriques spécifiques selon l'activité
        activityType: activiteSelectionnee,
        icon: activity?.icon,
      },
    });

    setShowSaveDialog(false);
    handleReset(); // Réinitialiser après sauvegarde
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header avec bouton performances */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🏃‍♂️ Sentiers 974
          </h1>
          <p className="text-white/80 text-sm sm:text-lg">
            {activiteSelectionnee
              ? `Activité: ${getActiviteById(activiteSelectionnee)?.nom}`
              : "Choisis ton activité"}
          </p>

          {/* Bouton performances historiques */}
          <div className="mt-4">
            <Link
              href="/activites-sauvegardees"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg text-sm sm:text-base"
            >
              📊 Mes performances
            </Link>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8">
          {/* Sélection d'activité */}
          {!activiteSelectionnee && (
            <ActivitySelector onActivitySelect={handleActivitySelect} />
          )}

          {/* Interface de tracking */}
          {activiteSelectionnee && (
            <div className="space-y-6 sm:space-y-8">
              {/* Activité sélectionnée */}
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-4">
                  {getActiviteById(activiteSelectionnee)?.icon}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {getActiviteById(activiteSelectionnee)?.nom}
                </h2>
              </div>

              {/* Interface adaptée selon l'activité */}
              {activiteSelectionnee === "course" && (
                <RunningInterface
                  time={time}
                  distance={distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={isTracking && !isPaused}
                />
              )}
              {activiteSelectionnee === "velo" && (
                <CyclingInterface
                  time={time}
                  distance={distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={isTracking && !isPaused}
                />
              )}
              {activiteSelectionnee === "natation" && (
                <SwimmingInterface
                  time={time}
                  distance={distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={isTracking && !isPaused}
                />
              )}
              {activiteSelectionnee === "marche" && (
                <WalkingInterface
                  time={time}
                  distance={distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={isTracking && !isPaused}
                />
              )}
              {activiteSelectionnee === "randonnee" && (
                <WalkingInterface
                  time={time}
                  distance={distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={isTracking && !isPaused}
                />
              )}

              {/* Boutons d'action */}
              <ActionButtons
                isTracking={isTracking}
                isPaused={isPaused}
                onStart={handleStart}
                onStop={handleStop}
                onPause={handlePause}
                onResume={handleResume}
                onPhoto={handlePhoto}
              />

              {/* Message d'état */}
              {isTracking && (
                <div className="text-center">
                  <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm sm:text-base">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Tracking en cours...
                  </div>
                </div>
              )}

              {/* Message quand arrêté */}
              {!isTracking && time > 0 && !showSaveDialog && (
                <div className="text-center">
                  <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm sm:text-base">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Activité terminée - Données conservées
                  </div>
                </div>
              )}

              {/* Dialogue de sauvegarde */}
              {showSaveDialog && (
                <SaveActivityDialog
                  onSave={handleSaveActivity}
                  onCancel={() => setShowSaveDialog(false)}
                  activityType={activiteSelectionnee!}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bouton flottant pour les performances */}
      <Link
        href="/activites-sauvegardees"
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-colors z-50 flex items-center space-x-2"
      >
        <span>📊</span>
        <span>Mes performances</span>
      </Link>
    </div>
  );
}

// Composant dialogue de sauvegarde optimisé
function SaveActivityDialog({
  onSave,
  onCancel,
  activityType,
}: {
  onSave: (name: string) => void;
  onCancel: () => void;
  activityType: string;
}) {
  const [activityName, setActivityName] = useState("");
  const activity = getActiviteById(activityType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
        <div className="text-center mb-4">
          <div className="text-3xl sm:text-4xl mb-2">{activity?.icon}</div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Sauvegarder l'activité
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Donne un nom à ton activité pour la retrouver plus tard
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'activité
          </label>
          <input
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder={`${
              activity?.nom
            } - ${new Date().toLocaleDateString()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            autoFocus
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            onClick={() =>
              onSave(
                activityName ||
                  `${activity?.nom} - ${new Date().toLocaleDateString()}`
              )
            }
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
