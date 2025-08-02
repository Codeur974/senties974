"use client";

import { useState } from "react";

interface WeatherData {
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lng: number) => Promise<void>;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // API gratuite sans clé (wttr.in)
      const response = await fetch(`https://wttr.in/?format=j1&lang=fr`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la météo");
      }

      const data = await response.json();
      const current = data.current_condition[0];

      const weatherData: WeatherData = {
        temperature: parseInt(current.temp_C),
        conditions: current.lang_fr[0].value,
        humidity: parseInt(current.humidity),
        windSpeed: parseInt(current.windspeedKmph),
        pressure: parseInt(current.pressure),
        icon: current.weatherIconUrl[0].value,
      };

      setWeather(weatherData);
    } catch (err) {
      console.error("Erreur météo:", err);
      setError("Impossible de récupérer la météo");

      // Fallback : météo simulée basée sur l'heure
      const hour = new Date().getHours();
      let conditions = "Ensoleillé";
      let temperature = 20;

      if (hour < 6 || hour > 20) {
        conditions = "Nuit claire";
        temperature = 15;
      } else if (hour < 12) {
        conditions = "Ensoleillé";
        temperature = 22;
      } else {
        conditions = "Nuageux";
        temperature = 25;
      }

      setWeather({
        temperature: temperature + Math.random() * 5,
        conditions,
        humidity: 60 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 15,
        pressure: 1013,
        icon: "01d",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    weather,
    isLoading,
    error,
    fetchWeather,
  };
};
