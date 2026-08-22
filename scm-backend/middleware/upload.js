// middleware/upload.js
// Handles image uploads for products. Files are kept in memory only (never
// written to local disk) and handed off to Cloudinary in the controller —
// see config/cloudinary.js for why: Render's filesystem is ephemeral and
// wipes local files on every redeploy, so disk storage isn't safe here.

const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp, gif) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 } // 5MB per file, up to 8 images
});

module.exports = upload;
