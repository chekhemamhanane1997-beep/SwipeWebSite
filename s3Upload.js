import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,

    // ✅ هذا هو السطر المهم
    contentType: multerS3.AUTO_CONTENT_TYPE,

    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },

    key: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `${req.user.tenantId}-${unique}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Images et vidéos uniquement'), false);
    }
  },


  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
export { s3Client };
