const Gallery = require('../models/Gallery');
const Blog = require('../models/Blog');

const getMaxGallery = () => parseInt(process.env.MAX_GALLERY_IMAGES) || 30;
const getMaxBlog = () => parseInt(process.env.MAX_BLOG_IMAGES) || 20;
const getMaxTotal = () => parseInt(process.env.MAX_CMS_IMAGES) || 50;

const checkMediaLimits = async (type) => {
  const galleryCount = await Gallery.countDocuments();
  const blogCount = await Blog.countDocuments({ featuredImageUrl: { $ne: null } });
  
  const maxGallery = getMaxGallery();
  const maxBlog = getMaxBlog();
  const maxTotal = getMaxTotal();

  if (galleryCount + blogCount >= maxTotal) {
   throw new Error(`Total media limit reached (${maxTotal} images max across Gallery and Blog). Please delete unused images.`);
  }

  if (type === 'gallery' && galleryCount >= maxGallery) {
   throw new Error(`Gallery limit reached (${maxGallery} images max). Please delete old gallery images.`);
  }
  
  if (type === 'blog' && blogCount >= maxBlog) {
   throw new Error(`Blog featured image limit reached (${maxBlog} images max). Please delete old blog posts or images.`);
  }
};

const getMediaUsage = async () => {
  const galleryCount = await Gallery.countDocuments();
  const blogCount = await Blog.countDocuments({ featuredImageUrl: { $ne: null } });
  return {
    gallery: { current: galleryCount, max: getMaxGallery() },
    blog: { current: blogCount, max: getMaxBlog() },
    total: { current: galleryCount + blogCount, max: getMaxTotal() }
  };
};

module.exports = { checkMediaLimits, getMediaUsage };
