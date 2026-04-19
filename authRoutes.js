import express from 'express';
// J'importe les fonctions logiques de mon contrôleur
import { register, login } from '../controllers/authController.js';

// Je crée un "mini-serveur" dédié à ces routes
const router = express.Router();

// Quand une requête POST arrive sur /register...
// ... j'exécute la fonction 'register' du contrôleur.
router.post('/register', register);

// Quand une requête POST arrive sur /login...
// ... j'exécute la fonction 'login' du contrôleur.
router.post('/login', login);

// J'exporte le routeur pour que app.js puisse l'utiliser
export default router;