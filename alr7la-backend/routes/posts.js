const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const upload = require('../middlewares/uploadMiddleware');
// Import both authentication middlewares
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');

// Routes

// Create a new post
router.post('/create-post', authenticateToken, upload.array('images', 5), postsController.createPost);

// Get a specific post
// router.get('/:postId', optionalAuth, postsController.getPost);

// Update a post
router.put('/update-post/:postId', authenticateToken, postsController.updatePost);

// Delete a post
router.delete('/delete-post/:postId', authenticateToken, postsController.deletePost);

// Like or unlike a post
router.post('/:postId/like', authenticateToken, postsController.toggleLike);

// Get user posts - authentication is optional, will only show public posts if not authenticated
router.get('/user/:userId', optionalAuth, postsController.getUserPosts);

// Get saved posts for authenticated user
router.get('/saved-posts', authenticateToken, postsController.getSavedPosts);
router.post('/toggle-save/:postId', authenticateToken, postsController.toggleSavePost);

module.exports = router;
