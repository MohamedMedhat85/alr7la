const express = require('express');
const router = express.Router();
const visitedCountriesController = require('../controllers/visitedCountries.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/:id', authenticateToken, visitedCountriesController.getVisitedCountries);

router.post('/', authenticateToken, visitedCountriesController.addVisitedCountry);

router.delete('/:country_id', authenticateToken, visitedCountriesController.deleteVisitedCountry);

module.exports = router;
