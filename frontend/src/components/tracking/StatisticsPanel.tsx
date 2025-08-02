"use client";

import DistanceDisplay from "./DistanceDisplay";
import SpeedDisplay from "./SpeedDisplay";
import Timer from "./Timer";

interface StatisticsPanelProps {
  time: number;
  distance: number;
}

export default function StatisticsPanel({
  time,
  distance,
}: StatisticsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Timer seconds={time} />
        <DistanceDisplay distance={distance} />
        <SpeedDisplay distance={distance} time={time} />
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">
            {time > 0 ? (distance / 1000 / (time / 3600)).toFixed(1) : "0.0"}
          </div>
          <div className="text-sm text-center opacity-90">km/h moyen</div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4 rounded-lg text-white">
          <div className="text-2xl font-bold text-center">
            {Math.floor((distance / 1000) * 60)} {/* Calories estimées */}
          </div>
          <div className="text-sm text-center opacity-90">calories</div>
        </div>
      </div>
    </div>
  );
}
