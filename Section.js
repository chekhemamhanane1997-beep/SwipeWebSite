import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },

  // 🔥 لازم تربط Section بالـ Page
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  layout: {
    type: String,
    enum: ['horizontal-swipe', 'grid', 'vertical-list'],
    default: 'horizontal-swipe', // 🔥 مهم
  },

  cards: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Card',
    default: [], // 🔥 يمنع errors
  },

}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);
