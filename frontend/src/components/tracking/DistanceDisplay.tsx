"use client";

interface DistanceDisplayProps {
  distance: number; // en mètres
}

export default function DistanceDisplay({ distance }: DistanceDisplayProps) {
  const distanceKm = (distance / 1000).toFixed(2);
  const distanceMiles = (distance / 1609.34).toFixed(2);

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
      <div className="text-3xl font-bold text-center">{distanceKm} km</div>
      <div className="text-sm text-center opacity-90">Distance parcourue</div>
      <div className="text-xs text-center opacity-75 mt-1">{distanceMiles} miles</div>
    </div>
  );
} 