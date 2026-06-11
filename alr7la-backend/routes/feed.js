const express = require('express');
const router = express.Router();
const enhancedFeedController = require('../controllers/enhancedFeed.Controller');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Updated import

// @route   GET /api/feed/:user_id
// @desc    Get personalized smart feed for specific user
// @access  Private
router.get('/:user_id', authenticateToken, enhancedFeedController.getSmartFeed);

// @route   POST /api/feed/interactions
// @desc    Record interaction with a post (view, like, etc.)
// @access  Private
router.post('/interactions', authenticateToken, enhancedFeedController.recordFeedInteraction);

module.exports = router;
