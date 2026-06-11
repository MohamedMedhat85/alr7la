const express = require('express');
const router = express.Router();
const packingListController = require('../controllers/packingList.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Create a new packing list for a trip
router.post('/user/:userId/trip/:tripId', authenticateToken, packingListController.createPackingList);

// Get a packing list for a trip
router.get('/user/:userId/trip/:tripId', authenticateToken, packingListController.getPackingList);

// Update a packing list
router.put('/user/:userId/trip/:tripId', authenticateToken, packingListController.updatePackingList);

// Delete a packing list
router.delete('/user/:userId/trip/:tripId', authenticateToken, packingListController.deletePackingList);

module.exports = router; 