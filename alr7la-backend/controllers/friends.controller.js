const { Op } = require('sequelize');
const { Users, Friends } = require('../models');
const { findAcceptedFriends } = require('../services/friend.service');
const { serializeFriends } = require('../serializers/friend.serializer');

const friendsController = {
  // Endpoint to get mutual friends count between two users
  async getMutualFriendsCount(req, res) {
    try {
      const currentUserId = req.user.id;
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required',
          errors: ['userId is required']
        });
      }

      // Check if target user exists
      const targetUser = await Users.findByPk(userId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is trying to get mutual friends with themselves
      if (currentUserId == parseInt(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot get mutual friends with yourself'
        });
      }

      // Get accepted friends for current user
      const currentUserFriendships = await Friends.findAll({
        where: {
          [Op.or]: [
            { user_id: currentUserId, status: 'accepted' },
            { friend_id: currentUserId, status: 'accepted' }
          ]
        }
      });

      const currentUserFriendIds = new Set();
      currentUserFriendships.forEach(f => {
        if (f.user_id == currentUserId) {
          currentUserFriendIds.add(f.friend_id);
        } else if (f.friend_id == currentUserId) {
          currentUserFriendIds.add(f.user_id);
        }
      });

      // Get accepted friends for target user
      const targetUserFriendships = await Friends.findAll({
        where: {
          [Op.or]: [
            { user_id: userId, status: 'accepted' },
            { friend_id: userId, status: 'accepted' }
          ]
        }
      });

      const targetUserFriendIds = new Set();
      targetUserFriendships.forEach(f => {
        if (f.user_id == userId) {
          targetUserFriendIds.add(f.friend_id);
        } else if (f.friend_id == userId) {
          targetUserFriendIds.add(f.user_id);
        }
      });

      // Find mutual friend IDs and return count
      const mutualFriendIds = Array.from(currentUserFriendIds).filter(id => targetUserFriendIds.has(id));
      const mutualCount = mutualFriendIds.length;

      return res.status(200).json({
        success: true,
        data: {
          mutualFriendsCount: mutualCount
        }
      });
    } catch (error) {
      console.error('Error calculating mutual friends count:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to calculate mutual friends count',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  async getFriends(req, res) {
    try {
      // Get the target user ID from request body or use authenticated user's ID
      const targetUserId = req.params.userId || req.user.id;

      // Get all accepted friends for the target user
      const friends = await findAcceptedFriends(targetUserId);

      // Serialize the friends data
      const serializedFriends = serializeFriends(friends, targetUserId);

      return res.status(200).json({
        success: true,
        data: serializedFriends
      });
    } catch (error) {
      console.error('Error fetching friends:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch friends',
        error: error.message
      });
    }
  },

  async addFriend(req, res) {
    try {
      const currentUserId = req.user.id;
      const { friendId } = req.body;

      if (!friendId) {
        return res.status(400).json({
          success: false,
          message: 'friendId is required',
          errors: ['friendId is required']
        });
      }

      // Check if user is trying to add themselves
      if (currentUserId === parseInt(friendId)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add yourself as a friend'
        });
      }

      // Check if the target user exists
      const targetUser = await Users.findByPk(friendId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if friendship already exists
      const existingFriendship = await Friends.findOne({
        where: {
          [Op.or]: [
            { user_id: currentUserId, friend_id: friendId },
            { user_id: friendId, friend_id: currentUserId }
          ]
        }
      });

      if (existingFriendship) {
        if (existingFriendship.status === 'accepted') {
          return res.status(400).json({
            success: false,
            message: 'You are already friends with this user'
          });
        } else if (existingFriendship.status === 'pending') {
          if (existingFriendship.user_id === currentUserId) {
            return res.status(400).json({
              success: false,
              message: 'Friend request already sent'
            });
          } else {
            return res.status(400).json({
              success: false,
              message: 'You have a pending friend request from this user'
            });
          }
        }
      }

      // Create new friend request
      const newFriendRequest = await Friends.create({
        user_id: currentUserId,
        friend_id: friendId,
        status: 'pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Friend request sent successfully',
        data: {
          user_id: newFriendRequest.user_id,
          friend_id: newFriendRequest.friend_id,
          status: newFriendRequest.status,
          created_at: newFriendRequest.created_at
        }
      });
    } catch (error) {
      console.error('Error adding friend:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send friend request',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  async cancelFriendRequest(req, res) {
    try {
      const currentUserId = req.user.id;
      const { friendId } = req.params;

      if (!friendId) {
        return res.status(400).json({
          success: false,
          message: 'friendId is required',
          errors: ['friendId is required']
        });
      }

      // Find the pending friend request sent by current user
      const friendRequest = await Friends.findOne({
        where: {
          user_id: currentUserId,
          friend_id: friendId,
          status: 'pending'
        }
      });

      if (!friendRequest) {
        return res.status(404).json({
          success: false,
          message: 'No pending friend request found to cancel'
        });
      }

      // Delete the friend request
      await friendRequest.destroy();

      return res.status(200).json({
        success: true,
        message: 'Friend request cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel friend request',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  async getFriendRequests(req, res) {
    try {
      const userID = req.user.id;

      const friends = await Friends.findAll({
        where: {
          [Op.and]: [
            { friend_id: userID },
            { status: 'pending' }
          ]
        },
        attributes: ['status'],
        include: [
          {
            model: Users,
            as: 'User',
            attributes: ['id', 'name', 'profile_picture']
          }
        ]
      });

      res.json({ count: friends.length, friends });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async updateFriendRequest(req, res) {
    try {
      const currentUserId = req.user.id;
      const { user_id, status } = req.body;

      if (!user_id || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user_id or status',
          errors: ['user_id and status (accepted/rejected) are required']
        });
      }

      const friendRequest = await Friends.findOne({
        where: {
          user_id: user_id,
          friend_id: currentUserId,
          status: 'pending'
        }
      });

      if (!friendRequest) {
        return res.status(404).json({
          success: false,
          message: 'Friend request not found or already handled'
        });
      }

      if (status === 'rejected') {
        await friendRequest.destroy();
        return res.status(200).json({
          success: true,
          message: 'Friend request rejected and deleted'
        });
      }

      friendRequest.status = status;
      await friendRequest.save();

      res.status(200).json({
        success: true,
        message: `Friend request ${status} successfully`,
        data: {
          status: friendRequest.status,
          updated_at: friendRequest.updated_at
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to update friend request',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  async removeFriend(req, res) {
    try {
      const currentUserId = req.user.id;
      const { friendId } = req.params;
      if (!friendId) {
        return res.status(400).json({
          success: false,
          message: 'friendId is required',
        });
      }
      const friendship = await Friends.findOne({
        where: {
          [Op.or]: [
            { user_id: currentUserId, friend_id: friendId, status: 'accepted' },
            { user_id: friendId, friend_id: currentUserId, status: 'accepted' },
          ],
        },
      });
      if (!friendship) {
        return res.status(404).json({
          success: false,
          message: 'Friendship not found',
        });
      }
      await friendship.destroy();
      return res.status(200).json({
        success: true,
        message: 'Friend removed successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove friend',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  },

  async checkFriendshipStatus(req, res) {
    try {
      const currentUserId = req.user.id;
      const { friendId } = req.params;

      if (!friendId) {
        return res.status(400).json({
          success: false,
          message: 'friendId is required',
          errors: ['friendId is required']
        });
      }

      // Check if the target user exists
      const targetUser = await Users.findByPk(friendId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user is checking their own status
      if (currentUserId === parseInt(friendId)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot check friendship status with yourself'
        });
      }

      // Find existing friendship
      const friendship = await Friends.findOne({
        where: {
          [Op.or]: [
            { user_id: currentUserId, friend_id: friendId },
            { user_id: friendId, friend_id: currentUserId }
          ]
        }
      });

      let status = 'none';
      let canSendRequest = true;
      let canCancelRequest = false;
      let canAcceptRequest = false;

      if (friendship) {
        status = friendship.status;

        if (status === 'accepted') {
          canSendRequest = false;
        } else if (status === 'pending') {
          canSendRequest = false;
          if (friendship.user_id === currentUserId) {
            canCancelRequest = true;
          } else {
            canAcceptRequest = true;
          }
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          status,
          canSendRequest,
          canCancelRequest,
          canAcceptRequest,
        }
      });
    } catch (error) {
      console.error('Error checking friendship status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check friendship status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  async friendSuggestions(req, res) {
    try {
      const currentUserId = req.user.id;
      // Get all user IDs that are already friends or have pending requests
      const friendships = await Friends.findAll({
        where: {
          [Op.or]: [
            { user_id: currentUserId },
            { friend_id: currentUserId }
          ]
        }
      });
      const excludedIds = new Set([currentUserId]);
      const currentUserFriendIds = new Set();
      friendships.forEach(f => {
        excludedIds.add(f.user_id);
        excludedIds.add(f.friend_id);
        if (f.status === 'accepted') {
          if (f.user_id === currentUserId) {
            currentUserFriendIds.add(f.friend_id);
          } else if (f.friend_id === currentUserId) {
            currentUserFriendIds.add(f.user_id);
          }
        }
      });
      // Find users not in excludedIds
      const candidates = await Users.findAll({
        where: {
          id: { [Op.notIn]: Array.from(excludedIds) }
        },
        attributes: ['id', 'name', 'profile_picture']
      });
      // For each candidate, find mutual friends
      const candidatesWithMutuals = await Promise.all(candidates.map(async (user) => {
        // Get this user's friends
        const userFriendships = await Friends.findAll({
          where: {
            [Op.or]: [
              { user_id: user.id, status: 'accepted' },
              { friend_id: user.id, status: 'accepted' }
            ]
          }
        });
        const userFriendIds = new Set();
        userFriendships.forEach(f => {
          if (f.user_id === user.id) {
            userFriendIds.add(f.friend_id);
          } else if (f.friend_id === user.id) {
            userFriendIds.add(f.user_id);
          }
        });
        // Find mutual friend IDs
        const mutualFriendIds = Array.from(currentUserFriendIds).filter(id => userFriendIds.has(id));
        // Get mutual friends' info
        let mutualFriends = [];
        if (mutualFriendIds.length > 0) {
          mutualFriends = await Users.findAll({
            where: { id: mutualFriendIds },
            attributes: ['id', 'name', 'profile_picture']
          });
        }
        return {
          ...user.toJSON(),
          mutualFriendsCount: mutualFriendIds.length,
          mutualFriends
        };
      }));
      // Sort by mutualFriendsCount descending and take top 10
      candidatesWithMutuals.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);
      const suggestionsWithMutuals = candidatesWithMutuals.slice(0, 10);
      return res.status(200).json({
        success: true,
        data: suggestionsWithMutuals
      });
    } catch (error) {
      console.error('Error fetching friend suggestions:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch friend suggestions',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
};

module.exports = friendsController;
