// routes/travelRoutes.js
const express = require('express');
const travelInfoController = require('../controllers/trip.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/travel-info', authenticateToken, travelInfoController.getTravelInfo);
router.post('/', authenticateToken, travelInfoController.createTrip);
router.get('/:id', authenticateToken, travelInfoController.getTrip);
router.put('/:id', authenticateToken, travelInfoController.updateTrip);
router.get('/user/:userId', authenticateToken, travelInfoController.getUserTrips);
router.delete('/user/:tripId', authenticateToken, travelInfoController.deleteUserTrip);

module.exports = router;