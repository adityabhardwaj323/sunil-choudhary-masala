// controllers/settingsController.js
const Settings = require('../models/Settings');

// @route  GET /api/settings/public  (PUBLIC)
const getPublicSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().select('deliveryRanges codEnabled codCharge deliveryDays');
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
    const { deliveryRanges } = req.body;
    
    // Validate delivery ranges
    if (deliveryRanges && Array.isArray(deliveryRanges)) {
      let unlimitedCount = 0;
      for (let i = 0; i < deliveryRanges.length; i++) {
        const range = deliveryRanges[i];
        
        if (range.minOrderValue < 0 || range.charge < 0) {
          return res.status(400).json({ message: 'Negative values are not allowed in delivery ranges' });
        }
        
        if (range.maxOrderValue !== null) {
          if (range.maxOrderValue < 0) {
            return res.status(400).json({ message: 'Negative maximum value is not allowed' });
          }
          if (range.maxOrderValue < range.minOrderValue) {
            return res.status(400).json({ message: 'Maximum order value cannot be less than minimum' });
          }
        } else {
          unlimitedCount++;
          if (unlimitedCount > 1) {
            return res.status(400).json({ message: 'Only one unlimited range (max = null) is allowed' });
          }
        }
        
        // Check for overlaps with other ranges
        for (let j = i + 1; j < deliveryRanges.length; j++) {
          const other = deliveryRanges[j];
          
          const max1 = range.maxOrderValue === null ? Infinity : range.maxOrderValue;
          const max2 = other.maxOrderValue === null ? Infinity : other.maxOrderValue;
          
          if (range.minOrderValue <= max2 && other.minOrderValue <= max1) {
            return res.status(400).json({ message: 'Delivery ranges cannot overlap' });
          }
        }
      }
    }

    req.body.updatedAt = new Date();
    let settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getPublicSettings, getSettings, updateSettings };
