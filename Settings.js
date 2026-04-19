import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Il ne devrait y avoir qu'UN seul document 'Settings' par tenantId
  tenantId: {
    type: String,
    required: [true, "Le tenantId est obligatoire"],
    unique: true, // Clé !
  },
  
  // Studio de thème [cite: 54, 55]
  theme: {
    primaryColor: { type: String, default: '#000000' },
    secondaryColor: { type: String, default: '#FFFFFF' },
    fontFamily: { type: String, default: "'Inter', sans-serif" },
    animationSpeed: { type: Number, default: 0.5 },
  },
  
  // Logos [cite: 57]
  logos: {
    logoDark: { type: String, default: '' }, // URL vers une image
    logoLight: { type: String, default: '' },
    favicon: { type: String, default: '' },
  },

  // (On pourra ajouter les 'Menus' ici plus tard [cite: 59, 61])
  
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;