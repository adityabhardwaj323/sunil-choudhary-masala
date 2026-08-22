// config/cloudinary.js
// Cloudinary client for storing product images. We switched to this from
// local disk storage because Render's filesystem is ephemeral — any files
// written to disk (via multer.diskStorage) get wiped on every redeploy and
// on service restarts, which meant uploaded product images silently
// disappeared. Cloudinary's free tier gives persistent, CDN-backed image
// hosting that survives deploys.
//
// Requires these three environment variables (see .env.example):
//   CLOUDINARY_CLOUD_NAME
//   CLOUDINARY_API_KEY
//   CLOUDINARY_API_SECRET
// Get them from your Cloudinary dashboard: https://cloudinary.com/console

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
