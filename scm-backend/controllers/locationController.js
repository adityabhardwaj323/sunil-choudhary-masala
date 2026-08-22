const axios = require('axios'); // We might need to install axios or use fetch

exports.reverseGeocode = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (
      latitude === undefined || longitude === undefined ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Missing GOOGLE_MAPS_API_KEY');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Using built-in fetch available in Node 18+
    const googleRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
    const data = await googleRes.json();

    if (!googleRes.ok || data.status !== 'OK') {
      console.error('Google Geocoding failed:', data.status, data.error_message);
      return res.status(500).json({ message: 'Failed to reverse geocode' });
    }

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ message: 'No address found for these coordinates' });
    }

    const components = data.results[0].address_components;
    
    let street_number = '';
    let route = '';
    let sublocality = '';
    let sublocality_level_1 = '';
    let sublocality_level_2 = '';
    let neighborhood = '';
    let locality = '';
    let administrative_area_level_2 = '';
    let administrative_area_level_1 = '';
    let postal_code = '';

    components.forEach(c => {
      if (c.types.includes('street_number')) street_number = c.long_name;
      if (c.types.includes('route')) route = c.long_name;
      if (c.types.includes('sublocality')) sublocality = c.long_name;
      if (c.types.includes('sublocality_level_1')) sublocality_level_1 = c.long_name;
      if (c.types.includes('sublocality_level_2')) sublocality_level_2 = c.long_name;
      if (c.types.includes('neighborhood')) neighborhood = c.long_name;
      if (c.types.includes('locality')) locality = c.long_name;
      if (c.types.includes('administrative_area_level_2')) administrative_area_level_2 = c.long_name;
      if (c.types.includes('administrative_area_level_1')) administrative_area_level_1 = c.long_name;
      if (c.types.includes('postal_code')) postal_code = c.long_name;
    });

    const addressLine1 = [street_number, route].filter(Boolean).join(', ') || data.results[0].formatted_address.substring(0, 50);
    const addressLine2 = [sublocality, neighborhood, sublocality_level_1].filter(Boolean).join(', ');
    const city = locality || administrative_area_level_2 || '';
    const state = administrative_area_level_1 || '';
    const pincode = postal_code || '';
    const formattedAddress = data.results[0].formatted_address || '';

    res.status(200).json({
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      formattedAddress
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ message: 'Server error during geocoding' });
  }
};
