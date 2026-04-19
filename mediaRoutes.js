// routes/mediaRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../config/s3Upload.js';
import {
  uploadMedia,
  getMedia,
  deleteMedia,
} from '../controllers/mediaController.js';

const router = express.Router();

router.post(
  '/upload',
  protect,
  upload.single('image'),
  uploadMedia
);

router.get('/', protect, getMedia);

router.delete('/:mediaId', protect, deleteMedia);

export default router;
