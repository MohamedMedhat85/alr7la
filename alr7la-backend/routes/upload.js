// routes/upload.js or your main route file

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const uploadController = require('../controllers/upload.controller');
const { authenticateToken } = require('../middlewares/authMiddleware'); 
// Handle single file upload (name must match form field name)
router.post('/profilePicture', authenticateToken ,upload.single('file'),uploadController.uploadProfilePicture );
router.post('/wallpaper', authenticateToken ,upload.single('file'),uploadController.uploadWallpaper );
router.get('/', authenticateToken ,uploadController.getProfilePicture );
router.delete('/profilePicture', authenticateToken, uploadController.deleteProfilePicture);
router.delete('/wallpaper', authenticateToken, uploadController.deleteWallpaper);

module.exports = router;
