"use client";

interface ActionButtonsProps {
  isTracking: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onPhoto: () => void;
}

export default function ActionButtons({
  isTracking,
  isPaused,
  onStart,
  onStop,
  onPause,
  onResume,
  onPhoto,
}: ActionButtonsProps) {
  if (!isTracking) {
    return (
      <div className="flex gap-3">
        <button
          onClick={onStart}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <div className="text-lg">🚀</div>
          <div>Démarrer</div>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {isPaused ? (
        <button
          onClick={onResume}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <div className="text-lg">▶️</div>
          <div>Reprendre</div>
        </button>
      ) : (
        <button
          onClick={onPause}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <div className="text-lg">⏸️</div>
          <div>Pause</div>
        </button>
      )}

      <button
        onClick={onPhoto}
        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <div className="text-lg">📸</div>
        <div>Photo</div>
      </button>

      <button
        onClick={onStop}
        className="col-span-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <div className="text-lg">⏹️</div>
        <div>Arrêter</div>
      </button>
    </div>
  );
}
