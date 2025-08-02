"use client";

import { useEffect, useState } from "react";

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

  const getLocationBasedWeather = (lat: number, lng: number) => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1; // 1-12

    // Détecter la région basée sur les coordonnées
    const isReunion =
      lat >= -21.5 && lat <= -20.5 && lng >= 55.0 && lng <= 56.0;
    const isMetropole =
      lat >= 41.0 && lat <= 51.0 && lng >= -5.0 && lng <= 10.0;
    const isTropical = lat >= -23.5 && lat <= 23.5; // Zone tropicale

    // Heures de la journée
    const isNight = hour < 6 || hour > 22;
    const isMorning = hour >= 6 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;
    const isEvening = hour >= 18 && hour <= 22;

    let temperature, conditions, humidity, windSpeed;

    if (isReunion) {
      // La Réunion - Climat tropical
      const isSummer = month >= 11 || month <= 4; // Été austral

      if (isSummer) {
        temperature = isNight ? 22 + Math.random() * 4 : 28 + Math.random() * 7;
        conditions = isNight ? "Nuit chaude" : "Très chaud";
        humidity = 70 + Math.random() * 20;
      } else {
        temperature = isNight ? 18 + Math.random() * 4 : 24 + Math.random() * 4;
        conditions = isNight ? "Nuit fraîche" : "Agréable";
        humidity = 60 + Math.random() * 20;
      }
      windSpeed = 10 + Math.random() * 15; // Alizés
    } else if (isMetropole) {
      // Métropole - Climat tempéré
      const isSummer = month >= 6 && month <= 8; // Été
      const isWinter = month === 12 || month <= 2; // Hiver

      if (isSummer) {
        temperature = isNight
          ? 15 + Math.random() * 5
          : 25 + Math.random() * 10;
        conditions = isNight ? "Nuit douce" : "Ensoleillé";
        humidity = 50 + Math.random() * 30;
      } else if (isWinter) {
        temperature = isNight
          ? -5 + Math.random() * 10
          : 5 + Math.random() * 10;
        conditions = isNight ? "Nuit froide" : "Frais";
        humidity = 60 + Math.random() * 30;
      } else {
        temperature = isNight ? 8 + Math.random() * 7 : 18 + Math.random() * 8;
        conditions = isNight ? "Nuit fraîche" : "Doux";
        humidity = 55 + Math.random() * 25;
      }
      windSpeed = 5 + Math.random() * 20;
    } else if (isTropical) {
      // Autres zones tropicales
      temperature = isNight ? 20 + Math.random() * 8 : 28 + Math.random() * 8;
      conditions = isNight ? "Nuit chaude" : "Chaud";
      humidity = 65 + Math.random() * 25;
      windSpeed = 8 + Math.random() * 12;
    } else {
      // Zone tempérée générale
      temperature = isNight ? 10 + Math.random() * 10 : 20 + Math.random() * 10;
      conditions = isNight ? "Nuit" : "Ensoleillé";
      humidity = 55 + Math.random() * 25;
      windSpeed = 5 + Math.random() * 15;
    }

    return {
      temperature: Math.round(temperature),
      conditions,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed),
      pressure: 1013,
      icon: isNight ? "01n" : "01d",
    };
  };

  // NOUVEAU : Initialiser la météo au chargement
  useEffect(() => {
    if (!weather) {
      // Détecter automatiquement la position sur mobile
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            console.log("GPS non disponible:", error);
            // Fallback : La Réunion par défaut
            setWeather(getLocationBasedWeather(-21.1, 55.5));
          },
          { timeout: 5000, enableHighAccuracy: true }
        );
      } else {
        // Pas de GPS, utiliser La Réunion par défaut
        setWeather(getLocationBasedWeather(-21.1, 55.5));
      }
    }
  }, []);

  const fetchWeather = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // CORRECTION : Utiliser les coordonnées dans l'API
      const response = await fetch(`https://wttr.in/${lat},${lng}?format=j1&lang=fr`);

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

      // IMPORTANT : Utiliser la nouvelle fonction avec les coordonnées
      setWeather(getLocationBasedWeather(lat, lng));
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
