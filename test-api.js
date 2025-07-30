const axios = require("axios");

const BASE_URL = "http://localhost:4001";
let authToken = "";

// Fonction pour tester un endpoint
async function testEndpoint(method, endpoint, data = null, description = "") {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      ...(data && { data }),
    };

    console.log(`\n🧪 TEST: ${description}`);
    console.log(`${method.toUpperCase()} ${endpoint}`);

    const response = await axios(config);

    console.log(`✅ SUCCÈS (${response.status})`);
    console.log("📄 Réponse:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.log(`❌ ERREUR (${error.response?.status || "Network"})`);
    console.log("📄 Erreur:", error.response?.data || error.message);
    return null;
  }
}

// Tests complets
async function runAllTests() {
  console.log("🚀 DÉBUT DES TESTS - API SENTIES974");
  console.log("=".repeat(50));

  // 1. Test de l'endpoint de base
  await testEndpoint("GET", "/", null, "Test de l'API de base");

  // 2. Test d'inscription
  const registerData = {
    name: "Test User",
    email: "test@senties974.re",
    password: "password123",
  };

  const registerResult = await testEndpoint(
    "POST",
    "/api/auth/register",
    registerData,
    "Inscription d'un nouvel utilisateur"
  );

  // 3. Test de connexion
  const loginData = {
    email: "test@senties974.re",
    password: "password123",
  };

  const loginResult = await testEndpoint(
    "POST",
    "/api/auth/login",
    loginData,
    "Connexion utilisateur"
  );

  // Récupérer le token pour les tests suivants
  if (loginResult && loginResult.token) {
    authToken = loginResult.token;
    console.log("\n🔑 Token récupéré pour les tests authentifiés");
  }

  // 4. Test du profil utilisateur (avec authentification)
  await testEndpoint(
    "GET",
    "/api/user/profile",
    null,
    "Récupération du profil utilisateur"
  );

  // 5. Test de modification du profil
  const updateProfileData = {
    name: "Test User Updated",
    email: "test@senties974.re",
  };

  await testEndpoint(
    "PUT",
    "/api/user/profile",
    updateProfileData,
    "Modification du profil utilisateur"
  );

  // 6. Test de création d'activité
  const activityData = {
    title: "Course matinale à Saint-Denis",
    activityType: "running",
    distance: 5000,
    duration: 1800,
    elevation: {
      gain: 150,
      loss: 150,
      max: 200,
      min: 50,
    },
    gpsData: [
      {
        lat: -20.8821,
        lng: 55.4504,
        timestamp: Date.now(),
        elevation: 50,
        speed: 8.5,
      },
      {
        lat: -20.8822,
        lng: 55.4505,
        timestamp: Date.now() + 1000,
        elevation: 55,
        speed: 8.2,
      },
    ],
    location: {
      region: "Saint-Denis",
      trail: "Promenade du Barachois",
      difficulty: "facile",
    },
    weather: {
      temperature: 25,
      humidity: 70,
      conditions: "ensoleillé",
    },
    notes: "Belle course matinale avec vue sur l'océan",
  };

  await testEndpoint(
    "POST",
    "/api/activities",
    activityData,
    "Création d'une nouvelle activité"
  );

  // 7. Test de récupération des activités
  await testEndpoint(
    "GET",
    "/api/activities",
    null,
    "Récupération de toutes les activités"
  );

  // 8. Test des statistiques
  await testEndpoint(
    "GET",
    "/api/activities/stats",
    null,
    "Récupération des statistiques"
  );

  console.log("\n" + "=".repeat(50));
  console.log("🏁 FIN DES TESTS - API SENTIES974");
  console.log("✅ Tous les tests ont été exécutés !");
}

// Gestion des erreurs
process.on("unhandledRejection", (error) => {
  console.error("❌ Erreur non gérée:", error.message);
  process.exit(1);
});

// Lancer les tests
runAllTests().catch(console.error);
