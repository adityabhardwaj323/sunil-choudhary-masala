const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed for CMS'));
  }
};

const getMaxSize = () => {
  return (parseInt(process.env.MAX_CMS_IMAGE_SIZE_MB) || 5) * 1024 * 1024;
};

const uploadCms = multer({
  storage,
  fileFilter,
  limits: { fileSize: getMaxSize(), files: 1 } // 1 image per request usually for CMS
});

module.exports = uploadCms;
