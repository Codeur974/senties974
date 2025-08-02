"use client";

import { getActiviteById } from "@/data/activites";
import {
  SavedActivity,
  useSavedActivitiesStore,
} from "@/stores/savedActivitiesStore";
import { useState } from "react";

export default function ActivitesSauvegardees() {
  const { activities, deleteActivity, clearAllActivities } =
    useSavedActivitiesStore();
  const [selectedActivity, setSelectedActivity] =
    useState<SavedActivity | null>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      deleteActivity(id);
    }
  };

  const handleClearAll = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer toutes les activités ?")) {
      clearAllActivities();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header simplifié */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            📊 Mes Performances Sauvegardées
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            {activities.length} activité{activities.length > 1 ? "s" : ""}{" "}
            sauvegardée{activities.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Contenu principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6">
          {/* Actions */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
            >
              <span className="mr-1 sm:mr-2">←</span>
              <span className="hidden sm:inline">Retour</span>
            </button>

            {activities.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
              >
                🗑️ <span className="hidden sm:inline">Tout supprimer</span>
              </button>
            )}
          </div>

          {/* Liste des activités */}
          {activities.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">📭</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Aucune activité sauvegardée
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Commence une activité et sauvegarde-la pour la voir ici !
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {activities.map((activity) => {
                const activityInfo = getActiviteById(activity.type);
                const endTime = new Date(
                  new Date(activity.date).getTime() + activity.time * 1000
                );

                return (
                  <div
                    key={activity.id}
                    className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    {/* Layout mobile vs desktop */}
                    <div className="block sm:flex sm:items-center sm:justify-between">
                      {/* Informations de gauche */}
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                        <div className="text-2xl sm:text-3xl">
                          {activityInfo?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
                            {activity.name}
                          </h3>
                          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Début:</span>
                              <span>{formatDateTime(activity.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Fin:</span>
                              <span>
                                {formatDateTime(endTime.toISOString())}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Statistiques de droite */}
                      <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                        <div className="text-center">
                          <div className="text-sm sm:text-lg font-bold text-gray-800">
                            {formatTime(activity.time)}
                          </div>
                          <div className="text-xs text-gray-500">Durée</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm sm:text-lg font-bold text-gray-800">
                            {(activity.distance / 1000).toFixed(1)} km
                          </div>
                          <div className="text-xs text-gray-500">Distance</div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm sm:text-lg font-bold text-gray-800">
                            {activity.calories}
                          </div>
                          <div className="text-xs text-gray-500">Calories</div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(activity.id);
                          }}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onDelete={() => {
            handleDelete(selectedActivity.id);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
}

// Composant modal simplifié
function ActivityDetailsModal({
  activity,
  onClose,
  onDelete,
}: {
  activity: SavedActivity;
  onClose: () => void;
  onDelete: () => void;
}) {
  const activityInfo = getActiviteById(activity.type);
  const endTime = new Date(
    new Date(activity.date).getTime() + activity.time * 1000
  );

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="text-3xl sm:text-4xl">{activityInfo?.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                {activity.name}
              </h3>
              <div className="text-gray-600 text-xs sm:text-sm space-y-1 mt-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Début:</span>
                  <span>{formatDateTime(activity.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Fin:</span>
                  <span>{formatDateTime(endTime.toISOString())}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl ml-2"
          >
            ×
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              {formatTime(activity.time)}
            </div>
            <div className="text-xs sm:text-sm text-blue-600">Durée</div>
          </div>

          <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-lg sm:text-xl font-bold text-green-600">
              {(activity.distance / 1000).toFixed(1)} km
            </div>
            <div className="text-xs sm:text-sm text-green-600">Distance</div>
          </div>

          <div className="bg-orange-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-lg sm:text-xl font-bold text-orange-600">
              {activity.calories}
            </div>
            <div className="text-xs sm:text-sm text-orange-600">Calories</div>
          </div>

          <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
            <div className="text-lg sm:text-xl font-bold text-purple-600">
              {activity.averageSpeed.toFixed(1)} km/h
            </div>
            <div className="text-xs sm:text-sm text-purple-600">
              Vitesse moy
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 sm:space-x-3">
          <button
            onClick={onDelete}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
          >
            🗑️ Supprimer
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
