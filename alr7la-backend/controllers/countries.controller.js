const { Countries, Places, Currencies, ElectricalStandards } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Get country by ID with all related data
exports.getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Country ID is required' 
      });
    }

    // Fetch country with related data
    const country = await Countries.findByPk(id, {
      attributes: [
        'id', 'name', 'iso_alpha2', 'iso_alpha3', 'dialing_code', 
        'continent', 'language', 'time_zone', 'capital', 'summary', 
        'latitude', 'longitude'
      ],
      include: [
        {
          model: Currencies,
          through: { attributes: [] },
          attributes: ['id', 'name', 'code', 'symbol']
        },
        {
          model: ElectricalStandards,
          attributes: ['id', 'voltage', 'frequency', 'plug_types']
        }
      ]
    });

    if (!country) {
      return res.status(404).json({ 
        success: false, 
        message: 'Country not found' 
      });
    }

    // Get all places for the country using country_id
    const allPlaces = await Places.findAll({
      where: { country_id: id },
      attributes: ['id', 'name', 'city', 'longitude', 'latitude', 'rating', 'number_of_ratings'],
      include: [
        {
          model: require('../models').PlacesImages,
          attributes: ['img_url']
        },
        {
          model: require('../models').Labels,
          through: { attributes: [] },
          attributes: ['id', 'label_name']
        }
      ],
      order: [
        ['number_of_ratings', 'DESC'],
        ['rating', 'DESC']
      ]
    });

    // Transform data for frontend
    const transformedCountry = {
      id: country.id,
      name: country.name,
      flagUrl: `https://flagcdn.com/${country.iso_alpha2.toLowerCase()}.svg`,
      currencies: country.Currencies?.map(c => ({
        name: c.name, code: c.code, symbol: c.symbol
      })) || [],
      electricalStandards: country.ElectricalStandards?.map(e => ({
        id: e.id, voltage: e.voltage, frequency: e.frequency, plugTypes: e.plug_types
      })) || [],
      places: allPlaces.map(place => ({
        id: place.id,
        name: place.name,
        city: place.city,
        longitude: place.longitude,
        latitude: place.latitude,
        rating: place.rating,
        numberOfRatings: place.number_of_ratings,
        images: place.PlacesImages?.map(img => img.img_url) || [],
        labels: place.Labels?.map(label => label.label_name) || []
      })) || [],
      iso_alpha2: country.iso_alpha2,
      iso_alpha3: country.iso_alpha3,
      dialing_code: country.dialing_code,
      continent: country.continent,
      language: country.language,
      time_zone: country.time_zone,
      capital: country.capital,
      summary: country.summary,
      latitude: country.latitude,
      longitude: country.longitude
    };

    res.json({ success: true, data: transformedCountry });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

// Get all countries (for dropdowns, search, etc.)
exports.getAllCountries = async (req, res) => {
  try {
    const { limit = 50, offset = 0, search = '' } = req.query;
    
    const whereClause = search ? {
      name: {
        [Op.like]: `%${search}%`
      }
    } : {};

    const countries = await Countries.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'iso_alpha2', 'iso_alpha3', 'dialing_code'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: countries
    });

  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get country statistics
exports.getCountryStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Country ID is required' 
      });
    }

    const country = await Countries.findByPk(id, {
      include: [
        {
          model: Places,
          as: 'Places',
          attributes: ['id']
        }
      ]
    });

    if (!country) {
      return res.status(404).json({ 
        success: false, 
        message: 'Country not found' 
      });
    }

    const stats = {
      totalPlaces: country.Places?.length || 0,
      // Add more statistics as needed
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching country stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}; 