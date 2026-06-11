const { Countries, VisitedCountries } = require('../models');

exports.getVisitedCountries = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await VisitedCountries.findAndCountAll({
      where: {
        user_id: userId,
      },
      attributes: [], // no attributes from VisitedCountries itself
      include: [{
        model: Countries,
        attributes: ['id', 'name'],
      }],
    });

    if (result.count === 0) {
      return res.status(404).json({ message: 'No visited countries found for this user' });
    }

    // Flatten the countries array, extracting the included Country object
    const countries = result.rows.map(row => row.Country);

    res.json({
      count: result.count,
      countries, // now this is an array of country objects directly
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addVisitedCountry = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { country_id, visit_date } = req.body;

    if (!user_id || !country_id) {
      return res.status(400).json({ message: 'user_id and country_id are required' });
    }

    // Create or update (upsert) - but for simplicity, just create here
    const existing = await VisitedCountries.findOne({ where: { user_id, country_id } });
    if (existing) {
      return res.status(409).json({ message: 'Visited country already exists for this user' });
    }

    const visitedCountry = await VisitedCountries.create({
      user_id,
      country_id,
      visit_date: visit_date || null,
    });

    res.status(201).json({
      message: 'Visited country added successfully',
      visitedCountry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteVisitedCountry = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { country_id } = req.params;

    if (!user_id || !country_id) {
      return res.status(400).json({ message: 'user_id and country_id are required' });
    }

    const deletedCount = await VisitedCountries.destroy({
      where: {
        user_id,
        country_id,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Visited country record not found' });
    }

    res.json({ message: 'Visited country removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
