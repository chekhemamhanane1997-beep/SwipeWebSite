import Settings from '../models/Settings.js'; // Le modèle pour sauvegarder les paramètres

/**
 * @route   GET /api/settings
 * @desc    Récupérer les paramètres du site pour le tenant actuel
 * @access  Privé (Admin/Éditeur)
 *
 * Explication :
 * Quand la Stagiaire 3 (frontend) ouvrira le "Theme Studio", elle aura besoin
 * de charger les paramètres actuels (les couleurs, polices, etc. déjà configurées)
 * pour les afficher dans les formulaires. Cette fonction lui fournit ces données.
 * Si aucun paramètre n'existe encore pour ce tenant, on en crée un par défaut.
 */
export const getSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenantId; // On récupère l'ID du tenant via le token JWT

    // 1. Essayer de trouver les paramètres existants pour ce tenant
    let settings = await Settings.findOne({ tenantId });

    // 2. Si aucun paramètre n'existe, en créer un avec des valeurs par défaut
    if (!settings) {
      settings = new Settings({
        tenantId,
        // Valeurs par défaut initiales
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          background: '#ffffff',
          text: '#212529',
          cardBackground: '#f8f9fa',
        },
        fonts: {
          heading: 'Arial, sans-serif',
          body: 'Verdana, sans-serif',
        },
        logoLight: '', // URL du logo clair
        logoDark: '',  // URL du logo sombre
        // Structure de menu vide par défaut
        menu: {
            desktop: [],
            mobile: []
        }
      });
      await settings.save(); // Sauvegarder les nouveaux paramètres par défaut
    }

    // 3. Renvoyer les paramètres trouvés ou nouvellement créés
    res.status(200).json(settings);

  } catch (error) {
    console.error("Erreur de récupération des paramètres :", error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des paramètres', error: error.message });
  }
};

/**
 * @route   PUT /api/settings
 * @desc    Mettre à jour les paramètres du site pour le tenant actuel
 * @access  Privé (Admin/Éditeur)
 *
 * Explication :
 * Quand la Stagiaire 3 (frontend) a modifié les couleurs, les polices,
 * ou uploadé de nouveaux logos dans le "Theme Studio", elle enverra
 * les nouvelles valeurs à cette fonction.
 * Cette fonction prendra ces nouvelles valeurs et les mettra à jour
 * dans la base de données pour le tenant concerné.
 */
export const updateSettings = async (req, res) => {
  try {
    const tenantId = req.user.tenantId; // ID du tenant
    const { colors, fonts, logoLight, logoDark, menu } = req.body; // Les nouvelles valeurs envoyées par le frontend

    // 1. Trouver et mettre à jour les paramètres existants pour ce tenant
    // Le { new: true } fait en sorte que Mongoose nous renvoie le document MIS À JOUR
    const updatedSettings = await Settings.findOneAndUpdate(
      { tenantId }, // Chercher par tenantId
      {
        colors,      // Les nouvelles couleurs
        fonts,       // Les nouvelles polices
        logoLight,   // Le nouvel URL du logo clair
        logoDark,    // Le nouvel URL du logo sombre
        menu         // Les nouvelles données du menu (pour le Navigation Builder)
      },
      { new: true, upsert: true } // upsert: true => si ça n'existe pas, ça le crée
    );

    // Si, pour une raison étrange, l'update n'a pas marché (très peu probable avec upsert:true)
    if (!updatedSettings) {
      return res.status(404).json({ message: "Paramètres non trouvés ou non mis à jour" });
    }

    // 2. Renvoyer les paramètres mis à jour
    res.status(200).json(updatedSettings);

  } catch (error) {
    console.error("Erreur de mise à jour des paramètres :", error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des paramètres', error: error.message });
  }
};