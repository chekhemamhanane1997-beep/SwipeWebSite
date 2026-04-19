import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  sections: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Section',
    default: [], // 🔥 هذا هو الحل
  },

}, { timestamps: true });

export default mongoose.model('Page', pageSchema);
