import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté avec succès");
    console.log("📡 Serveur prêt à recevoir des requêtes");
  })
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB:", err.message);
    process.exit(1);
  });

app.get("/api/test", (req, res) => {
  res.json({
    status: "✅ API WebForge",
    message: "Serveur opérationnel",
    port: PORT,
    mongodb: "connecté",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", pageRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/settings", settingsRoutes);

console.log("🚀 Tentative de démarrage du serveur sur le port", PORT);
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
