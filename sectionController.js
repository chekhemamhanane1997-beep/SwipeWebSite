import Section from '../models/Section.js';
import Page from '../models/Page.js'; // On a besoin du modèle Page !

/**
 * @route   POST /api/sections/page/:pageId
 * @desc    Créer une nouvelle section ET l'ajouter à une page
 * @access  Privé (Admin/Éditeur)
 */
export const createSection = async (req, res) => {
  try {
    const { title, layout } = req.body;
    const { pageId } = req.params;
    const tenantId = req.user.tenantId;

    const parentPage = await Page.findOne({
      _id: pageId,
      tenantId,
    });

    if (!parentPage) {
      return res.status(404).json({ message: 'Page non trouvée' });
    }

    const newSection = await Section.create({
      tenantId,
      pageId,           // 🔥 الآن schema يعرفه
      title,
      layout,
      cards: [],
    });

    parentPage.sections.push(newSection._id);
    await parentPage.save();

    res.status(201).json(newSection);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message,
    });
  }
};



/**
 * @route   PUT /api/sections/:sectionId
 * @desc    Mettre à jour une section (titre, layout, ordre des cartes)
 * @access  Privé (Admin/Éditeur)
 */
export const updateSection = async (req, res) => {
  try {
    const { title, layout, cards } = req.body; // 'cards' sera un tableau d'IDs
    const { sectionId } = req.params;

    // On cherche la section ET on vérifie le tenantId
    const section = await Section.findOne({
      _id: sectionId,
      tenantId: req.user.tenantId,
    });

    if (!section) {
      return res.status(404).json({ message: "Section non trouvée" });
    }

    // Mettre à jour les champs fournis
    section.title = title || section.title;
    section.layout = layout || section.layout;
    section.cards = cards || section.cards; // Permet au CMS de réorganiser les cartes

    const updatedSection = await section.save();
    res.status(200).json(updatedSection);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


/**
 * @route   DELETE /api/sections/:sectionId
 * @desc    Supprimer une section (ET la retirer de sa page parente)
 * @access  Privé (Admin/Éditeur)
 */
export const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    // 1. Supprimer la section
    const deletedSection = await Section.findOneAndDelete({
      _id: sectionId,
      tenantId: req.user.tenantId, // Toujours la sécurité !
    });

    if (!deletedSection) {
      return res.status(404).json({ message: "Section non trouvée" });
    }

    // 2. Retirer la référence de la section de sa page parente
    // (Cette étape est cruciale pour garder la base de données propre)
    await Page.findOneAndUpdate(
      { tenantId: req.user.tenantId, sections: sectionId }, // Trouve la page qui contient cette section
      { $pull: { sections: sectionId } } // $pull = retirer un élément d'un tableau
    );

    // (Note: On devrait aussi supprimer toutes les 'Cards' de cette section...)
    // (On le fera plus tard pour ne pas compliquer)

    res.status(200).json({ message: "Section supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};