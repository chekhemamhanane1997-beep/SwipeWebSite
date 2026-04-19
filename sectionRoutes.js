// 📄 routes/sectionRoutes.js
import express from 'express';
import Section from '../models/Section.js';
import {
  createSection,
  updateSection,
  deleteSection
} from '../controllers/sectionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/* ======================================================
   CREATE SECTION IN PAGE
   POST /api/sections/page/:pageId
====================================================== */
router.post('/page/:pageId', protect, createSection);

/* ======================================================
   GET ALL SECTIONS OF A PAGE (+ cards)
   GET /api/sections/page/:pageId
====================================================== */
router.get('/page/:pageId', protect, async (req, res) => {
  try {
    const sections = await Section.find({
      pageId: req.params.pageId,
      tenantId: req.user.tenantId,
    }).populate({
      path: 'cards',
      populate: { path: 'media' },
    });

    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    });
  }
});

/* ======================================================
   GET ONE SECTION (+ cards)
   GET /api/sections/:sectionId
====================================================== */
router.get('/:sectionId', protect, async (req, res) => {
  try {
    const section = await Section.findOne({
      _id: req.params.sectionId,
      tenantId: req.user.tenantId,
    }).populate('cards');

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    });
  }
});

/* ======================================================
   UPDATE SECTION
   PUT /api/sections/:sectionId
====================================================== */
router.put('/:sectionId', protect, updateSection);

/* ======================================================
   DELETE SECTION
   DELETE /api/sections/:sectionId
====================================================== */
router.delete('/:sectionId', protect, deleteSection);

export default router;
