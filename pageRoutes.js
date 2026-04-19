import express from 'express';
import {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
  getPublicPageBySlug
} from '../controllers/pageController.js';

import Page from '../models/Page.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ADMIN
router.post('/pages', protect, createPage);
router.get('/pages', protect, getPages);
router.get('/pages/:id', protect, getPageById);
router.put('/pages/:id', protect, updatePage);
router.delete('/pages/:id', protect, deletePage);

// ✅ PUBLIC – PAGE BY SLUG
router.get('/public/slug/:slug', getPublicPageBySlug);

// ✅ PUBLIC – LIST PAGES (HOME)
router.get('/public/pages', async (req, res) => {
  try {
    console.log('Fetching public pages...');
    const pages = await Page.find({}, 'title slug');
    console.log('Found pages:', pages.length);
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
