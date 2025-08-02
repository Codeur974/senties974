"use client";

interface TimerProps {
  seconds: number;
}

export default function Timer({ seconds }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white">
      <div className="text-3xl font-bold text-center">{formattedTime}</div>
      <div className="text-sm text-center opacity-90">Temps écoulé</div>
    </div>
  );
} 