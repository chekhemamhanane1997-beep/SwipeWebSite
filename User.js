import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Définition du Schéma (la structure)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true, // Je m'assure qu'on ne peut pas créer 2 comptes avec le même email
    lowercase: true,
    trim: true, // J'enlève les espaces inutiles au début et à la fin
  },

  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit faire au moins 6 caractères"],
  },

  role: {
    type: String,
    enum: ['Admin', 'Éditeur'], // L'utilisateur ne peut être que l'un de ces rôles
    default: 'Éditeur',
  },

  // Ce champ sera essentiel pour le multi-tenant plus tard
  // Pour l'instant, je le laisse simple
  tenantId: {
    type: String, // Plus tard, ce sera peut-être un mongoose.Schema.Types.ObjectId
    required: false, // Je le rendrai obligatoire plus tard
  },

}, {
  // Ajoute automatiquement 'createdAt' et 'updatedAt'
  timestamps: true,
});


// 2. Middleware "pre-save" (Avant de sauvegarder)
//    C'est un "hook" qui s'exécute automatiquement AVANT qu'un nouvel
//    utilisateur ne soit sauvegardé dans la base de données.
userSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas été modifié (ex: mise à jour de l'email),
  // je ne le crypte pas à nouveau.
  if (!this.isModified('password')) {
    return next();
  }

  // "Saler" le mot de passe (ajoute une chaîne aléatoire)
  // 10 est le "coût" du cryptage. Plus c'est haut, plus c'est sécurisé mais lent.
  const salt = await bcrypt.genSalt(10);
  // Crypter le mot de passe
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// 3. Méthode pour comparer les mots de passe
//    J'ajoute une méthode "comparePassword" à chaque document utilisateur
//    pour vérifier si le mot de passe fourni lors du login est correct.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


// 4. Création et Exportation du Modèle
//    Mongoose va créer une collection "users" (au pluriel) dans MongoDB
const User = mongoose.model('User', userSchema);

export default User;