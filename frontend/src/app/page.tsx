"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(
        "La géolocalisation n'est pas supportée par votre navigateur"
      );
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Impossible de récupérer votre position";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Permission refusée. Veuillez autoriser la géolocalisation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé";
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const simulateLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    // Simule une position sur La Réunion (Saint-Denis)
    setTimeout(() => {
      setUserLocation({ lat: -20.8821, lng: 55.4507 });
      setIsLocating(false);
    }, 1500);
  };

  const getMapUrl = () => {
    if (userLocation) {
      // Carte centrée sur la position de l'utilisateur
      return `https://www.openstreetmap.org/export/embed.html?bbox=${
        userLocation.lng - 0.1
      },${userLocation.lat - 0.1},${userLocation.lng + 0.1},${
        userLocation.lat + 0.1
      }&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`;
    }
    // Carte par défaut centrée sur La Réunion
    return "https://www.openstreetmap.org/export/embed.html?bbox=55.2,-21.4,55.9,-20.8&layer=mapnik&marker=-21.1,55.5";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section avec arrière-plan hybride */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Photo de La Réunion en arrière-plan */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: "url('/reunion-bg.jpg')",
            filter: "brightness(0.7) contrast(1.1)",
          }}
        />

        {/* Overlay dégradé original */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-blue-900/80">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Contenu centré avec animations */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div
            className={`transform transition-all duration-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Sentiers 974
            </h1>
          </div>

          {/* Carte OpenStreetMap avec géolocalisation */}
          <div
            className={`mb-8 transform transition-all duration-400 delay-200 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* Bouton de géolocalisation */}
            <div className="mb-4 flex gap-2 justify-center">
              <button
                onClick={getUserLocation}
                disabled={isLocating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-150 transform hover:scale-105 disabled:transform-none"
              >
                {isLocating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Localisation...
                  </span>
                ) : (
                  <span className="flex items-center">📍 Où suis-je ?</span>
                )}
              </button>

              {/* Bouton Mode Test pour localhost */}
              <button
                onClick={simulateLocation}
                disabled={isLocating}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-150 transform hover:scale-105 disabled:transform-none"
              >
                {isLocating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Test...
                  </span>
                ) : (
                  <span className="flex items-center">🧪 Mode Test</span>
                )}
              </button>
            </div>

            {/* Message d'erreur */}
            {locationError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {locationError}
              </div>
            )}

            {/* Message de succès */}
            {userLocation && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
                ✅ Position détectée ! Carte centrée sur votre position.
              </div>
            )}

            {/* Carte */}
            <iframe
              src={getMapUrl()}
              width="320"
              height="240"
              className="rounded-2xl shadow-2xl"
              style={{ border: "none" }}
              title="Carte de La Réunion"
            />
          </div>

          <div
            className={`transform transition-all duration-400 delay-300 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-100">
              Découvre les plus beaux sentiers de La Réunion. Track tes
              activités, rejoins la communauté locale et explore l'île intense.
            </p>
          </div>

          <div
            className={`transform transition-all duration-400 delay-500 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-150 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 border-2 border-green-500/20 hover:border-green-400/40">
              <span className="flex items-center justify-center">
                Commencer une activité
                <svg
                  className="ml-2 w-5 h-5 transform hover:translate-x-1 transition-transform duration-150"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Particules flottantes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-400/50 rounded-full animate-ping" />
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-bounce" />
        </div>
      </section>

      {/* Section Découvrir avec animations */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transform transition-all duration-400 delay-600 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Découvrir La Réunion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore les sentiers, participe aux événements, rejoins la
              communauté locale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte Sentiers avec hover traditionnel */}
            <div
              className={`bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-200 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 hover:border-green-200 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-100">
                <span className="text-3xl">🏔️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 hover:text-green-600 transition-colors duration-100">
                Sentiers
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                GR R1, GR R2, sentiers du Piton de la Fournaise, Maïdo et plus
                encore. Des parcours pour tous les niveaux.
              </p>
              <button className="flex items-center text-green-600 font-semibold hover:text-green-700 hover:translate-x-2 transition-all duration-100">
                Explorer
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Carte Événements avec hover traditionnel */}
            <div
              className={`bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-200 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 hover:border-blue-200 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-100">
                <span className="text-3xl">🏃</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 hover:text-blue-600 transition-colors duration-100">
                Événements
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Grand Raid, Trail de Bourbon, Diagonale des Fous. Découvre et
                participe aux événements sportifs locaux.
              </p>
              <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700 hover:translate-x-2 transition-all duration-100">
                Voir les événements
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Carte Communauté avec hover traditionnel */}
            <div
              className={`bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-200 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 hover:border-orange-200 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "900ms" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-100">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 hover:text-orange-600 transition-colors duration-100">
                Communauté
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Rejoins les sportifs locaux, partage tes expériences, découvre
                de nouveaux parcours avec la communauté.
              </p>
              <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 hover:translate-x-2 transition-all duration-100">
                Rejoindre
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques avec animations */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`transform transition-all duration-400 delay-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
              La communauté Sentiers 974
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2 hover:scale-110 transition-transform duration-100">
                  1,247
                </div>
                <div className="text-gray-300">Sportifs actifs</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 hover:scale-110 transition-transform duration-100">
                  89
                </div>
                <div className="text-gray-300">Sentiers explorés</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 hover:scale-110 transition-transform duration-100">
                  15,420
                </div>
                <div className="text-gray-300">Km parcourus</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
