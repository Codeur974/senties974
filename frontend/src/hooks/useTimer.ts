import { useEffect, useState } from "react";

export function useTimer(isActive: boolean) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const resetTimer = () => {
    setTime(0);
  };

  const pauseTimer = () => {
    // Le timer se met en pause automatiquement quand isActive devient false
  };

  return { time, resetTimer, pauseTimer };
}
