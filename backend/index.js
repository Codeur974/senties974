require("dotenv").config(); // ← charger .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("API Backend Sentiers974 fonctionne !");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/user", require("./routes/user"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL) // ← Utiliser MONGO_URL de Railway
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Échec de connexion à MongoDB:", err);
  });
// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur" });
});
