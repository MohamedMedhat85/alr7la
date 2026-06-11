const express = require('express');
const router = express.Router();
const countriesController = require('../controllers/countries.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Get country by ID with all related data
router.get('/:id', countriesController.getCountryById);

// Get all countries (optional authentication)
router.get('/', countriesController.getAllCountries);

// Get country statistics
router.get('/:id/stats', countriesController.getCountryStats);

module.exports = router; 