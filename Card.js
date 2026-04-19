import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  // 🔥 IMPORTANT: عدة صور لكل Card
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    }
  ],

  action: {
    type: String,
    enum: ['participer', 'sinscrire', 'acheter'],
    default: 'participer',
  },

  // معلومات إضافية (events / activities)
  date: String,
  duration: String,
  location: String,

}, { timestamps: true });

export default mongoose.model('Card', cardSchema);
