import { useState } from "react";
import { getActiviteById } from "@/data/activites";

type Props = {
  onSave: (name: string) => void;
  onCancel: () => void;
  activityType: string;
};

export default function SaveActivityDialog({
  onSave,
  onCancel,
  activityType,
}: Props) {
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
