// controllers/wishlistController.js
// Handles: Add/remove products from wishlist, view wishlist

const User = require('../models/User');

// @route   GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/wishlist/:productId
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // NOTE: Array.includes() compares ObjectId objects to a string with
    // strict equality, which is always false, so the previous version
    // never actually detected duplicates. Use .some() with .toString()
    // comparison instead, same pattern already used in removeFromWishlist.
    const alreadyWishlisted = user.wishlist.some(id => id.toString() === req.params.productId);
    if (!alreadyWishlisted) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }
    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
