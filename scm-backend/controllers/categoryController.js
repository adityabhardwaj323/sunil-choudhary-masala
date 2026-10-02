// controllers/categoryController.js
const Category = require('../models/Category');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const BASE_CATEGORIES = [
  'Chilli Powders',
  'Ground Spices',
  'Dry Fruits & Nuts',
  'Healthy Snacks',
  'Cooking Oils',
  'Combos',
];

// @route   GET /api/categories/available
// @desc    Get all available category names from base categories + product usage
const getAvailableCategories = async (req, res) => {
  try {
    const products = await Product.find({}, 'category');
    const categoryNamesSet = new Set(BASE_CATEGORIES);

    products.forEach((p) => {
      if (p.category && typeof p.category === 'string' && p.category.trim()) {
        categoryNamesSet.add(p.category.trim());
      }
    });

    const categories = await Category.find({}, 'name');
    categories.forEach((c) => {
      if (c.name && typeof c.name === 'string' && c.name.trim()) {
        categoryNamesSet.add(c.name.trim());
      }
    });

    const allCategoryNames = Array.from(categoryNamesSet);
    res.json(allCategoryNames);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/categories
// @desc    Get all categories metadata
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/categories
// @desc    Create category metadata
const createCategory = async (req, res) => {
  try {
    const { name, description, isActive, displayOrder } = req.body;
    let customSlug = req.body.slug;
    
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    let slug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    
    // Check if exists
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return res.status(400).json({ message: 'Category metadata already exists for this name or slug' });
    }

    let image = { url: '', publicId: '' };
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'scm/categories',
        resource_type: 'image'
      });
      image = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }

    const categoryData = { name, slug, image };
    if (description !== undefined) categoryData.description = description;
    if (isActive !== undefined) categoryData.isActive = isActive === 'true' || isActive === true;
    if (displayOrder !== undefined) categoryData.displayOrder = Number(displayOrder) || 0;

    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/categories/:id
// @desc    Update category metadata and optionally replace image
const updateCategory = async (req, res) => {
  const mongoose = require('mongoose');
  const session = await mongoose.startSession();
  
  try {
    let categoryToReturn;
    let oldPublicId = null;

    await session.withTransaction(async () => {
      const category = await Category.findById(req.params.id).session(session);
      if (!category) {
        throw new Error('Category not found');
      }

      const { name, description, isActive, displayOrder, updateProducts } = req.body;
      let customSlug = req.body.slug;
      
      let nameChanged = false;
      let oldName = category.name;

      if (name && name !== category.name) {
        nameChanged = true;
        category.name = name;
        let slug = customSlug ? generateSlug(customSlug) : generateSlug(name);
        
        const existing = await Category.findOne({ 
          $or: [{ name }, { slug }], 
          _id: { $ne: category._id } 
        }).session(session);
        if (existing) {
          throw new Error('Category name or slug already in use');
        }
        category.slug = slug;
      } else if (customSlug && customSlug !== category.slug) {
        let slug = generateSlug(customSlug);
        const existing = await Category.findOne({ slug, _id: { $ne: category._id } }).session(session);
        if (existing) {
          throw new Error('Slug already in use');
        }
        category.slug = slug;
      }

      if (description !== undefined) category.description = description;
      if (isActive !== undefined) category.isActive = isActive === 'true' || isActive === true;
      if (displayOrder !== undefined) category.displayOrder = Number(displayOrder) || 0;

      if (req.file) {
        const base64 = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64}`;
        
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: 'scm/categories',
          resource_type: 'image'
        });

        if (category.image && category.image.publicId) {
          oldPublicId = category.image.publicId;
        }

        category.image = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        };
      }

      await category.save({ session });

      if (nameChanged && (updateProducts === 'true' || updateProducts === true)) {
        await Product.updateMany(
          { category: oldName }, 
          { $set: { category: category.name } },
          { session }
        );
      }
      
      categoryToReturn = category;
    });

    if (oldPublicId) {
      // Cloudinary deletion is safe to do after transaction commits
      await cloudinary.uploader.destroy(oldPublicId);
    }

    res.json(categoryToReturn);
  } catch (error) {
    const status = error.message === 'Category not found' ? 404 : (error.message.includes('already in use') ? 400 : 500);
    res.status(status).json({ message: error.message || 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// @route   GET /api/categories/:id/usage
// @desc    Get category usage in products
const getCategoryUsage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const productCount = await Product.countDocuments({ category: category.name });
    res.json({ category: category.name, productCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/categories/:id/image
// @desc    Remove category image without deleting the category
const removeCategoryImage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.image && category.image.publicId) {
      await cloudinary.uploader.destroy(category.image.publicId);
    }

    category.image = { url: '', publicId: '' };
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAvailableCategories,
  getCategories,
  createCategory,
  updateCategory,
  removeCategoryImage,
  getCategoryUsage
};
