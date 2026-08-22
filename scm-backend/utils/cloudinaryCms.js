const cloudinary = require('../config/cloudinary');
const Gallery = require('../models/Gallery');
const Blog = require('../models/Blog');

const uploadCmsImage = async (buffer, mimetype, folder) => {
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;
  
  return cloudinary.uploader.upload(dataUri, {
    folder: folder,
    resource_type: 'image',
    format: 'webp',
    transformation: [
      { width: 2500, crop: 'limit' },
      { quality: 'auto' }
    ]
  });
};

const deleteCmsImage = async (publicId) => {
  if (!publicId) return;

  // Check if this publicId is still referenced elsewhere in the DB
  const galleryCount = await Gallery.countDocuments({ publicId: publicId });
  const blogCount = await Blog.countDocuments({ featuredImagePublicId: publicId });
  
  // If nothing references it, we can safely delete
  if (galleryCount === 0 && blogCount === 0) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Cloudinary deletion error:', err.message);
    }
  }
};

module.exports = { uploadCmsImage, deleteCmsImage };
