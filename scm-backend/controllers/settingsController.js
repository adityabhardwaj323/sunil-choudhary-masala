// controllers/settingsController.js
const Settings = require('../models/Settings');

// @route  GET /api/settings  (ADMIN)
const getSettings = async (req, res) => {
  try {
    // Get the singleton document, or create it with defaults
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/settings  (ADMIN)
const updateSettings = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    let settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSettings, updateSettings };
