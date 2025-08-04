"use client";

import ActionButtons from "@/components/tracking/ActionButtons";
import ActivitySelector from "@/components/tracking/ActivitySelector";
import { getActiviteById } from "@/data/activites";
import { useSavedActivitiesStore } from "@/stores/savedActivitiesStore";
import { useActivitySession } from "@/hooks/useActivitySession";
import { useState } from "react";
import Link from "next/link";

// Interfaces spécifiques par activité
import CyclingInterface from "@/components/tracking/activities/CyclingInterface";
import RunningInterface from "@/components/tracking/activities/RunningInterface";
import SwimmingInterface from "@/components/tracking/activities/SwimmingInterface";
import WalkingInterface from "@/components/tracking/activities/WalkingInterface";
import SaveActivityDialog from "@/components/tracking/SaveActivityDialog";

export default function ActiviteEnCours() {
  const [activiteSelectionnee, setActiviteSelectionnee] = useState<
    string | null
  >(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { addActivity } = useSavedActivitiesStore();
  const activitySession = useActivitySession();

  const handleStart = () => activitySession.startSession();
  const handleStop = () => {
    activitySession.stopSession();
    if (activitySession.time > 0) setShowSaveDialog(true);
  };

  const handlePause = () => activitySession.pauseSession();
  const handleResume = () => activitySession.resumeSession();
  const handleReset = () => activitySession.resetSession();

  const handleBack = () => {
    setActiviteSelectionnee(null);
    if (activitySession.isRunning) handleStop();
  };

  const handleActivitySelect = (activityId: string) =>
    setActiviteSelectionnee(activityId);

  const handleSaveActivity = (activityName: string) => {
    const activity = getActiviteById(activiteSelectionnee!);

    addActivity({
      type: activiteSelectionnee!,
      name: activityName,
      date: new Date().toISOString(),
      time: activitySession.time,
      distance: activitySession.distance,
      calories: Math.round(600 * (activitySession.time / 3600)),
      averageSpeed:
        activitySession.distance > 0
          ? activitySession.distance / 1000 / (activitySession.time / 3600)
          : 0,
      maxSpeed:
        activitySession.distance > 0
          ? (activitySession.distance / 1000 / (activitySession.time / 3600)) *
            1.2
          : 0,
      metrics: {
        activityType: activiteSelectionnee,
        icon: activity?.icon,
      },
    });

    setShowSaveDialog(false);
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🏃‍♂️ Sentiers 974
          </h1>
          <p className="text-white/80 text-sm sm:text-lg">
            {activiteSelectionnee
              ? `Activité: ${getActiviteById(activiteSelectionnee)?.nom}`
              : "Choisis ton activité"}
          </p>

          <div className="mt-4">
            <Link
              href="/activites-sauvegardees"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg text-sm sm:text-base"
            >
              📊 Mes performances
            </Link>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8">
          {!activiteSelectionnee && (
            <ActivitySelector onActivitySelect={handleActivitySelect} />
          )}

          {activiteSelectionnee && (
            <>
              {activiteSelectionnee === "course" && (
                <RunningInterface
                  time={activitySession.time}
                  distance={activitySession.distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={activitySession.isRunning}
                />
              )}

              {activiteSelectionnee === "velo" && (
                <CyclingInterface
                  time={activitySession.time}
                  distance={activitySession.distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={activitySession.isRunning}
                />
              )}

              {activiteSelectionnee === "natation" && (
                <SwimmingInterface
                  time={activitySession.time}
                  distance={activitySession.distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={activitySession.isRunning}
                />
              )}

              {(activiteSelectionnee === "marche" ||
                activiteSelectionnee === "randonnee") && (
                <WalkingInterface
                  time={activitySession.time}
                  distance={activitySession.distance}
                  onReset={handleReset}
                  onBack={handleBack}
                  isActive={activitySession.isRunning}
                />
              )}

              <ActionButtons
                isTracking={activitySession.isRunning}
                isPaused={activitySession.isPaused}
                onStart={handleStart}
                onStop={handleStop}
                onPause={handlePause}
                onResume={handleResume}
                onPhoto={() => console.log("Photo prise !")}
              />

              {showSaveDialog && (
                <SaveActivityDialog
                  onSave={handleSaveActivity}
                  onCancel={() => setShowSaveDialog(false)}
                  activityType={activiteSelectionnee!}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-4 bg-black text-white p-2 z-50 rounded-lg shadow-lg">
        <div>Distance: {activitySession.distance.toFixed(2)} m</div>
        <div>Temps: {activitySession.time} s</div>
        <div>
          Vitesse:{" "}
          {(
            activitySession.distance /
            1000 /
            (activitySession.time / 3600)
          ).toFixed(2)}{" "}
          km/h
        </div>
        {activitySession.gpsError && (
          <div className="text-red-400">
            Erreur GPS: {activitySession.gpsError}
          </div>
        )}
      </div>
    </div>
  );
}
