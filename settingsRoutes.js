import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Le "gardien" de sécurité
import { getSettings, updateSettings } from '../controllers/settingsController.js'; // Les fonctions que tu as écrites

const router = express.Router(); // Crée un "mini-application" Express pour les routes de paramètres

// --- Route pour récupérer les paramètres du site ---
// GET /api/settings
// Quand quelqu'un fera une requête GET sur /api/settings,
// 1. protect va vérifier le token JWT
// 2. Si c'est bon, getSettings sera appelée pour renvoyer les paramètres
router.get('/', protect, getSettings);

// --- Route pour mettre à jour les paramètres du site ---
// PUT /api/settings
// Quand quelqu'un fera une requête PUT sur /api/settings (pour modifier les paramètres),
// 1. protect va vérifier le token JWT
// 2. Si c'est bon, updateSettings sera appelée pour enregistrer les changements
router.put('/', protect, updateSettings);

export default router; // On exporte ce "mini-application" de routes pour app.js