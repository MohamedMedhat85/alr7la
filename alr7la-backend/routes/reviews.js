// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Create a review for a place
router.post('/places/:placeId', authenticateToken, reviewsController.createReview);

// Get all reviews for a place (with pagination)
router.get('/places/:placeId', reviewsController.getReviews);

// Get all reviews by a specific user
router.get('/users/:userId', reviewsController.getUserReviews);

// Update a specific review
router.put('/:reviewId', authenticateToken, reviewsController.updateReview);

// Delete a specific review
router.delete('/:reviewId', authenticateToken, reviewsController.deleteReview);

module.exports = router; 