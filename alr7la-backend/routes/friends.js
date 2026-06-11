// routes/friends.js 
const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends.controller');
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');

router.get('/get-friends/:userId', optionalAuth, friendsController.getFriends);
router.get('/check-status/:friendId', authenticateToken, friendsController.checkFriendshipStatus);
router.post('/add-friend', authenticateToken, friendsController.addFriend);
router.delete('/cancel-friend-request/:friendId', authenticateToken, friendsController.cancelFriendRequest);
router.get('/friendRequests', authenticateToken, friendsController.getFriendRequests);
router.put('/friendRequests', authenticateToken, friendsController.updateFriendRequest);
router.delete('/remove-friend/:friendId', authenticateToken, friendsController.removeFriend);
router.get('/friend-suggestions', authenticateToken, friendsController.friendSuggestions);
router.get('/mutual-friends-count/:userId', authenticateToken, friendsController.getMutualFriendsCount);

module.exports = router;
