// routes/comments.js
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments.controller');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Adjust path to your actual auth middleware

// Create a comment or reply on a post
router.post('/posts/:postId', authenticateToken, commentsController.createComment);

// Get all comments for a post (with pagination and replies)
router.get('/posts/:postId', commentsController.getComments);

// Update a specific comment
router.put('/:commentId', authenticateToken, commentsController.updateComment);

// Delete a specific comment
router.delete('/:commentId', authenticateToken, commentsController.deleteComment);

module.exports = router;
