const User = require('../models/User');

// @route   GET /api/users/addresses
// @desc    Get all saved addresses for the logged-in user
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/users/addresses
// @desc    Add a new address
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { latitude, longitude, accuracy } = req.body;
    if (latitude !== undefined || longitude !== undefined) {
      if (typeof latitude !== 'number' || latitude < -90 || latitude > 90 || Number.isNaN(latitude)) {
        return res.status(400).json({ message: 'Invalid latitude' });
      }
      if (typeof longitude !== 'number' || longitude < -180 || longitude > 180 || Number.isNaN(longitude)) {
        return res.status(400).json({ message: 'Invalid longitude' });
      }
    }
    if (accuracy !== undefined) {
      if (typeof accuracy !== 'number' || accuracy < 0 || Number.isNaN(accuracy)) {
        return res.status(400).json({ message: 'Invalid accuracy' });
      }
    }

    const newAddress = {
      label: req.body.label || 'Home',
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      phone: req.body.phone,
      latitude,
      longitude,
      accuracy,
      isDefault: req.body.isDefault || false
    };

    if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode || !newAddress.phone) {
      return res.status(400).json({ message: 'Please provide all required address fields' });
    }

    if (newAddress.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    } else if (user.addresses.length === 0) {
      // First address is default automatically
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/users/addresses/:id
// @desc    Update an address
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const { latitude, longitude, accuracy } = req.body;
    if (latitude !== undefined || longitude !== undefined) {
      const lat = latitude !== undefined ? latitude : address.latitude;
      const lng = longitude !== undefined ? longitude : address.longitude;
      if (lat !== undefined && (typeof lat !== 'number' || lat < -90 || lat > 90 || Number.isNaN(lat))) {
        return res.status(400).json({ message: 'Invalid latitude' });
      }
      if (lng !== undefined && (typeof lng !== 'number' || lng < -180 || lng > 180 || Number.isNaN(lng))) {
        return res.status(400).json({ message: 'Invalid longitude' });
      }
    }
    if (accuracy !== undefined) {
      if (typeof accuracy !== 'number' || accuracy < 0 || Number.isNaN(accuracy)) {
        return res.status(400).json({ message: 'Invalid accuracy' });
      }
    }

    if (req.body.label) address.label = req.body.label;
    if (req.body.addressLine1) address.addressLine1 = req.body.addressLine1;
    if (req.body.addressLine2 !== undefined) address.addressLine2 = req.body.addressLine2;
    if (req.body.city) address.city = req.body.city;
    if (req.body.state) address.state = req.body.state;
    if (req.body.pincode) address.pincode = req.body.pincode;
    if (req.body.phone) address.phone = req.body.phone;
    if (latitude !== undefined) address.latitude = latitude;
    if (longitude !== undefined) address.longitude = longitude;
    if (accuracy !== undefined) address.accuracy = accuracy;

    if (req.body.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
      address.isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/users/addresses/:id
// @desc    Delete an address
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const wasDefault = address.isDefault;
    user.addresses.pull(req.params.id);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/users/addresses/:id/default
// @desc    Set an address as default
const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    user.addresses.forEach(addr => (addr.isDefault = false));
    address.isDefault = true;

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
