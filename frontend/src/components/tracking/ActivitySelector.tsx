"use client";

import { activites } from "@/data/activites";

interface ActivitySelectorProps {
  onActivitySelect: (activityId: string) => void;
}

export default function ActivitySelector({
  onActivitySelect,
}: ActivitySelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">
        Choisir une activité individuelle
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {activites.map((activite) => (
          <button
            key={activite.id}
            onClick={() => onActivitySelect(activite.id)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors bg-white shadow-sm hover:shadow-md"
          >
            <div className="text-2xl mb-2">{activite.icon}</div>
            <div className="font-medium">{activite.nom}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
