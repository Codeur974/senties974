"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      // Vérifier d'abord sessionStorage, puis localStorage
      const sessionToken = sessionStorage.getItem("token");
      const sessionUser = sessionStorage.getItem("user");
      const localToken = localStorage.getItem("token");
      const localUser = localStorage.getItem("user");

      let token = null;
      let userData = null;

      if (sessionToken && sessionUser) {
        token = sessionToken;
        userData = sessionUser;
      } else if (localToken && localUser) {
        token = localToken;
        userData = localUser;
      }

      if (!token) {
        window.location.href = "/login";
        return;
      }

      // TEMPORAIRE : Désactiver la vérification côté serveur
      if (userData) {
        setUser(JSON.parse(userData));
        setIsValid(true);
      } else {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      setIsLoading(false);

      /* VÉRIFICATION CÔTÉ SERVEUR (TEMPORAIREMENT DÉSACTIVÉE)
      try {
        // Vérifier le token côté serveur
        const response = await fetch(
          "http://192.168.1.12:4001/api/auth/verify",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          if (userData) {
            setUser(JSON.parse(userData));
            setIsValid(true);
          }
        } else {
          // Token invalide, nettoyer et rediriger
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Erreur de vérification:", error);
        // En cas d'erreur réseau, on accepte temporairement le token local
        if (userData) {
          setUser(JSON.parse(userData));
          setIsValid(true);
        } else {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
      */
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Vérification de sécurité...</div>
      </div>
    );
  }

  if (!isValid) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900">
      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tableau de bord
          </h1>
          <p className="text-xl text-gray-200">
            Bienvenue sur Sentiers 974, {user?.name} !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte Commencer une activité */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏃</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Commencer une activité
              </h3>
              <p className="text-gray-600 mb-4">
                Lance le tracking GPS et commence ton parcours
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                Démarrer
              </button>
            </div>
          </div>

          {/* Carte Mes activités */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Mes activités
              </h3>
              <p className="text-gray-600 mb-4">
                Consulte ton historique et tes statistiques
              </p>
              <Link
                href="/activites"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
              >
                Voir
              </Link>
            </div>
          </div>

          {/* Carte Découvrir */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Découvrir
              </h3>
              <p className="text-gray-600 mb-4">
                Explore de nouveaux sentiers et événements
              </p>
              <Link
                href="/decouvrir"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
              >
                Explorer
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
