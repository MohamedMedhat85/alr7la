const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddnntjykd',
  api_key: process.env.CLOUDINARY_API_KEY || '825542343745135',
  api_secret: process.env.CLOUDINARY_API_SECRET || '8ZEfTvLxoAIc2AGz_UNQvH657Z4',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'auto',
    type: 'authenticated', // protect access, requires signed URL
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

module.exports = upload;
