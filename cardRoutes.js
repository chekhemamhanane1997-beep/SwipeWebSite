import express from 'express';
import {
  createCard,
  updateCardFull,
  deleteCard
} from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js'; // On importe notre "gardien" !


import upload from '../config/s3Upload.js';
import { uploadCardMedia } from '../controllers/cardController.js';

const router = express.Router();

// Route pour créer une carte DANS une section spécifique
// ex: POST /api/cards/section/60f...
router.post('/section/:sectionId', protect, createCard);

// Routes pour modifier ou supprimer une carte par son propre ID
// ex: PUT /api/cards/60f...


router.put(
  '/:cardId',
  protect,
  updateCardFull
);

router.delete('/:cardId', protect, deleteCard);




router.post(
  '/:cardId/media',
  protect,
  upload.single('file'),
  uploadCardMedia
);

// Note: On n'a pas non plus besoin de GET /api/cards/
// On les récupérera via GET /api/pages/:id, qui "populera"
// les sections, qui à leur tour "populeront" les cartes.
// (On ajustera le .populate() de pageController plus tard)

export default router;
