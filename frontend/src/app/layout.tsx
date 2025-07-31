"use client";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface User {
  name: string;
  email: string;
  _id?: string;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier d'abord sessionStorage, puis localStorage
    const sessionToken = sessionStorage.getItem("token");
    const sessionUser = sessionStorage.getItem("user");
    const localToken = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    if (sessionToken && sessionUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(sessionUser));
    } else if (localToken && localUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(localUser));
    }
  }, []);

  const handleLogout = () => {
    // Nettoyer les deux types de stockage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-green-800 text-white">
          {/* Mobile Header */}
          <div className="md:hidden p-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                Sentiers 974
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            {/* Mobile Menu with animation */}
            <div
              className={`mt-4 space-y-2 transition-all duration-300 ${
                isMenuOpen ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              <Link
                href="/"
                className={`block py-2 transition-colors ${
                  isActive("/")
                    ? "text-green-300 font-semibold"
                    : "hover:text-green-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/decouvrir"
                className={`block py-2 transition-colors ${
                  isActive("/decouvrir")
                    ? "text-green-300 font-semibold"
                    : "hover:text-green-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Découvrir
              </Link>
              {/* Private links - displayed only if logged in */}
              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className={`block py-2 transition-colors ${
                      isActive("/dashboard")
                        ? "text-green-300 font-semibold"
                        : "hover:text-green-200"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/activites"
                    className={`block py-2 transition-colors ${
                      isActive("/activites")
                        ? "text-green-300 font-semibold"
                        : "hover:text-green-200"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes Activités
                  </Link>
                  <Link
                    href="/profil"
                    className={`block py-2 transition-colors ${
                      isActive("/profil")
                        ? "text-green-300 font-semibold"
                        : "hover:text-green-200"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                </>
              )}
              {/* Login/Logout state */}
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <span className="py-2 text-green-200">
                    Bonjour, {user?.name || "Utilisateur"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-100 py-2"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`block py-2 transition-colors ${
                    isActive("/login")
                      ? "text-green-300 font-semibold"
                      : "hover:text-green-200"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <nav className="hidden md:flex max-w-6xl mx-auto p-4 justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Sentiers 974
            </Link>
            <div className="flex gap-6 items-center">
              <Link
                href="/"
                className={`transition-colors ${
                  isActive("/")
                    ? "text-green-300 font-semibold"
                    : "hover:text-green-200"
                }`}
              >
                Accueil
              </Link>
              <Link
                href="/decouvrir"
                className={`transition-colors ${
                  isActive("/decouvrir")
                    ? "text-green-300 font-semibold"
                    : "hover:text-green-200"
                }`}
              >
                Découvrir
              </Link>
              {/* Private links - displayed only if logged in */}
              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className={`transition-colors ${
                      isActive("/dashboard")
                        ? "text-green-300 font-semibold"
                        : "hover:text-green-200"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/activites"
                    className={`transition-colors ${
                      isActive("/activites")
                        ? "text-green-300 font-semibold"
                        : "hover:text-green-200"
                    }`}
                  >
                    Mes Activités
                  </Link>
                  <Link
                    href="/profil"
                    className={`transition-colors ${
                      isActive("/profil")
                        ? "text-green-300 font-semibold"
                        : "hover:text-green-200"
                    }`}
                  >
                    Profil
                  </Link>
                </>
              )}
              {/* Login/Logout state */}
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <span className="text-green-200">Bonjour, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-100"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`transition-colors ${
                    isActive("/login")
                      ? "text-green-300 font-semibold"
                      : "hover:text-green-200"
                  }`}
                >
                  Connexion
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
