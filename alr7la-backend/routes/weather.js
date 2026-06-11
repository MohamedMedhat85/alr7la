const express = require('express');
const router = express.Router();
const { getWeatherByCity } = require('../services/weatherApiService');


router.get('/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const weather = await getWeatherByCity(city);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
