import Page from '../models/Page.js';
import Section from '../models/Section.js';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* =========================
   CREATE PAGE (ADMIN)
========================= */
export const createPage = async (req, res) => {
  try {
    const { title, slug } = req.body;
    const tenantId = req.user.tenantId;

    const page = new Page({
      tenantId,
      title,
      slug,
      sections: [],
    });

    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL PAGES (ADMIN)
========================= */
export const getPages = async (req, res) => {
  const pages = await Page.find({ tenantId: req.user.tenantId });
  res.json(pages);
};

/* =========================
   GET PAGE BY ID (ADMIN)
========================= */
export const getPageById = async (req, res) => {
  const page = await Page.findOne({
    _id: req.params.id,
    tenantId: req.user.tenantId,
  }).populate('sections');

  if (!page) return res.status(404).json({ message: 'Page not found' });
  res.json(page);
};

/* =========================
   UPDATE PAGE
========================= */
export const updatePage = async (req, res) => {
  const page = await Page.findOne({
    _id: req.params.id,
    tenantId: req.user.tenantId,
  });

  if (!page) return res.status(404).json({ message: 'Page not found' });

  page.title = req.body.title ?? page.title;
  page.slug = req.body.slug ?? page.slug;
  page.sections = req.body.sections ?? page.sections;

  await page.save();
  res.json(page);
};

/* =========================
   DELETE PAGE
========================= */
export const deletePage = async (req, res) => {
  await Page.findOneAndDelete({
    _id: req.params.id,
    tenantId: req.user.tenantId,
  });
  res.json({ message: 'Page deleted' });
};

/* =========================
   PUBLIC PAGE BY SLUG (FRONT)
========================= */
export const getPublicPageBySlug = async (req, res) => {
  try {
    const slugOrTitle = decodeURIComponent(req.params.slug).trim();
    let page = await Page.findOne({ slug: slugOrTitle });

    // Fallback: allow `/page/<title>` links if user typed title instead of slug.
    if (!page) {
      page = await Page.findOne({
        title: new RegExp(`^\\s*${escapeRegex(slugOrTitle)}\\s*$`, 'i'),
      });
    }

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    /** Toujours charger les sections par pageId (fiable même si page.sections est désynchronisé). */
    const sections = await Section.find({ pageId: page._id })
      .sort({ createdAt: 1 })
      .populate({
        path: 'cards',
        populate: { path: 'media' },
      });

    const payload = page.toObject();
    payload.sections = sections;

    res.json(payload);
  } catch (err) {
    console.error('PUBLIC PAGE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
