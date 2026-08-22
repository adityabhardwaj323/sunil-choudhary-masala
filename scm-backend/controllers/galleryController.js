const Gallery = require('../models/Gallery');
const { checkMediaLimits, getMediaUsage } = require('../utils/mediaLimits');
const { uploadCmsImage, deleteCmsImage } = require('../utils/cloudinaryCms');

const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gallery images', error: error.message });
  }
};

const createGalleryImage = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title and image file are required' });
    }

    await checkMediaLimits('gallery');

    const result = await uploadCmsImage(req.file.buffer, req.file.mimetype, 'scm-gallery');

    const galleryImage = await Gallery.create({
      title,
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

    res.status(201).json(galleryImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);
    if (!galleryImage) return res.status(404).json({ message: 'Image not found' });

    let newImageUrl = galleryImage.imageUrl;
    let newPublicId = galleryImage.publicId;
    let oldPublicId = null;

    if (req.file) {
      // Temporarily bypass limit check as this is an update, 
      // but we do upload the new image first for transactional safety.
      const result = await uploadCmsImage(req.file.buffer, req.file.mimetype, 'scm-gallery');
      newImageUrl = result.secure_url;
      newPublicId = result.public_id;
      oldPublicId = galleryImage.publicId;
    }

    galleryImage.title = req.body.title || galleryImage.title;
    galleryImage.imageUrl = newImageUrl;
    galleryImage.publicId = newPublicId;

    await galleryImage.save();

    if (oldPublicId && oldPublicId !== newPublicId) {
      await deleteCmsImage(oldPublicId);
    }

    res.json(galleryImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);
    if (!galleryImage) return res.status(404).json({ message: 'Image not found' });

    const publicId = galleryImage.publicId;
    await galleryImage.deleteOne();

    await deleteCmsImage(publicId);

    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsage = async (req, res) => {
  try {
    const usage = await getMediaUsage();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage, getUsage };
