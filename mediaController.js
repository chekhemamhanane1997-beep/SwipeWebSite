import Media from '../models/Media.js'
import Card from '../models/Card.js'
import { s3Client } from '../config/s3Upload.js'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' })
    }

    const media = new Media({
      tenantId: req.user.tenantId,
      fileName: req.file.key,     // ✅ pour delete
      url: req.file.key,          // ✅ SEULEMENT le filename
      altText: req.body.altText || '',
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    })

    const saved = await media.save()

    await Card.findByIdAndUpdate(req.params.cardId, {
      $push: { media: saved._id }
    })

    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json({ message: 'Erreur upload', error: err.message })
  }
}


export const getMedia = async (req, res) => {
  try {
    const medias = await Media.find({
      tenantId: req.user.tenantId
    }).sort({ createdAt: -1 })

    res.json(medias)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/* ✅ AJOUT ICI */
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findOneAndDelete({
      _id: req.params.mediaId,
      tenantId: req.user.tenantId,
    })

    if (!media) {
      return res.status(404).json({ message: 'Media introuvable' })
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: media.fileName,
      })
    )

    res.json({ message: 'Media supprimé' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
