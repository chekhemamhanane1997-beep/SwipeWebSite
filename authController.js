import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/** Normalise le rôle (UTF-8, alias EN, encodage cassé) vers l'enum Mongoose */
const normalizeRole = (role) => {
  if (role == null || typeof role !== 'string') return 'Éditeur';
  const r = role.trim();
  const lower = r.toLowerCase().normalize('NFC');
  if (lower === 'admin') return 'Admin';
  if (r === 'Admin') return 'Admin';
  if (lower === 'editor' || lower === 'éditeur' || lower === 'editeur') return 'Éditeur';
  if (r === 'Éditeur') return 'Éditeur';
  if (/diteur$/i.test(r) || r.includes('?diteur')) return 'Éditeur';
  return 'Éditeur';
};

// Fonction pour générer un Token JWT
// J'ai mis cette fonction à part pour éviter la répétition (principe DRY)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tenantId: user.tenantId,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};


/**
 * @route   POST /api/auth/register
 * @desc    Enregistrer un nouvel utilisateur
 */
export const register = async (req, res) => {
  try {
    const { email, password, role: rawRole } = req.body;
    const role = normalizeRole(rawRole);

    // 1. Je vérifie si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // 2. Je crée le nouvel utilisateur
    // Note : Le mot de passe sera automatiquement crypté grâce au
    // hook 'pre-save' que j'ai défini dans le modèle User.js !
    const user = await User.create({
      email,
      password,
      role,
      // Pour l'instant, je mets un tenantId par défaut
      // Je le gérerai mieux en Phase 5
      tenantId: 'default_tenant_id',
    });

    // 3. Je génère un token et je le renvoie
    const token = generateToken(user);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token: token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


/**
 * @route   POST /api/auth/login
 * @desc    Connecter un utilisateur et renvoyer un token
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Je cherche l'utilisateur par email
    const user = await User.findOne({ email });

    // 2. Je vérifie si l'utilisateur existe ET si le mot de passe est correct
    //    J'utilise la méthode 'comparePassword' que j'ai créée dans le modèle User.js
    if (user && (await user.comparePassword(password))) {

      // 3. Si tout est bon, je génère un token et je le renvoie
      const token = generateToken(user);

      res.status(200).json({
        message: 'Connexion réussie',
        token: token,
      });

    } else {
      // Si l'email n'existe pas OU si le mot de passe est incorrect
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};