// models/Media.js
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },

  altText: {
    type: String,
    default: '',
  },

  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  }

}, { timestamps: true });

export default mongoose.model('Media', mediaSchema);
