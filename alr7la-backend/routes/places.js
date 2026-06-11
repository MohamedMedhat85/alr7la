const express = require('express');
const placeController = require('../controllers/places.controller');
const router = express.Router();
const fs = require('fs');


// Post route
router.post('/',placeController.create);

// Get all places route
router.get('/', placeController.getAll);
//get places by country
router.get('/country/:country', placeController.getByCountry);

//get places by city
router.get('/city/:city', placeController.getByCity);

// Get a specific place by ID route
router.get('/:id', placeController.getById);

// update a specific place
router.put('/:id',placeController.update);

// delete a specific place
router.delete('/:id', placeController.delete);

module.exports = router;
