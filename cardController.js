import Card from '../models/Card.js';
import Section from '../models/Section.js';
import Media from '../models/Media.js';

export const createCard = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const parentSection = await Section.findOne({
      _id: sectionId,
      tenantId: req.user.tenantId,
    });

    if (!parentSection) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }

    const newCard = new Card({
      ...req.body,
      tenantId: req.user.tenantId,
    });

    const savedCard = await newCard.save();

    parentSection.cards.push(savedCard._id);
    await parentSection.save();

    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};



export const updateCardFull = async (req, res) => {
  try {
    const { cardId } = req.params;

    const {
      title,
      description,
      action,
      date,
      location,
      duration,
      mediaIds
    } = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Carte introuvable' });
    }

    // 🔁 update champs texte
    card.title = title ?? card.title;
    card.description = description ?? card.description;
    card.action = action ?? card.action;
    card.date = date ?? card.date;
    card.location = location ?? card.location;
    card.duration = duration ?? card.duration;

    // 🔁 update medias (IMPORTANT)
    if (Array.isArray(mediaIds)) {
      card.media = mediaIds;
    }

    await card.save();

    const updatedCard = await Card.findById(cardId).populate('media');

    res.status(200).json({
      message: 'Carte mise à jour avec succès',
      card: updatedCard
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
};


export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const deletedCard = await Card.findOneAndDelete({
      _id: cardId,
      tenantId: req.user.tenantId,
    });

    if (!deletedCard) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    await Section.findOneAndUpdate(
      { tenantId: req.user.tenantId, cards: cardId },
      { $pull: { cards: cardId } }
    );

    res.status(200).json({ message: 'Carte supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};




export const uploadCardMedia = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }

    const card = await Card.findOne({
      _id: cardId,
      tenantId: req.user.tenantId,
    });

    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    const media = await Media.create({
      tenantId: req.user.tenantId,
      fileName: req.file.key,
      url: req.file.key,
      altText: req.body.altText || '',
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    });

    card.media.push(media._id);
    await card.save();

    res.status(201).json({
      message: 'Média uploadé et lié à la carte',
      media,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Erreur upload média carte',
      error: error.message,
    });
  }
};

