const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Profile routes
router.get('/:userId', profileController.getMyProfile);
router.put('/edit-profile', authenticateToken, profileController.editProfile);
router.get('/user-id-and-profile-picture', authenticateToken, profileController.getUserIdAndProfilePicture);

module.exports = router;