// controllers/postsController.js
const { Posts, Users, Comments, PostsImages, PostLikes, SavedPosts } = require('../models');
const { Op } = require('sequelize');
const { findAcceptedFriends } = require('../services/friend.service');

module.exports = {
  // Create a new post
  async createPost(req, res) {
    try {
      const { description, visibility } = req.body;
      const userId = req.user.id;

      // Create post first
      const post = await Posts.create({
        user_id: userId,
        description,
        created_at: new Date(),
        visibility,
      });

      let uploadedImages = [];

      // req.files contains uploaded images info from multer+Cloudinary
      if (req.files && req.files.length > 0) {
        const postImages = req.files.map(file => ({
          post_id: post.id,
          img_url: file.path // or file.secure_url depending on your multer-cloudinary version
        }));

        const createdImages = await PostsImages.bulkCreate(postImages);
        
        // Get the created images
        uploadedImages = await PostsImages.findAll({
          where: { post_id: post.id },
          attributes: ['post_id', 'img_url', 'created_at']
        });
      }

      // Get the complete post data with images
      const completePost = await Posts.findByPk(post.id, {
        include: [
          {
            model: Users,
            attributes: ['id', 'name', 'profile_picture']
          },
          {
            model: PostsImages,
            attributes: ['post_id', 'img_url', 'created_at']
          }
        ]
      });

      return res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: completePost
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message || error });
    }
  },

  // Get a specific post with details
  // async getPost(req, res) {
  //   try {
  //     const { postId } = req.params;
  //     const userId = req.user?.id; // Optional for guest viewing

  //     const post = await Posts.findByPk(postId, {
  //       include: [
  //         {
  //           model: Users,
  //           attributes: ['id', 'name', 'profile_picture']
  //         },
  //         {
  //           model: PostsImages,
  //           attributes: ['img_url']
  //         },
  //         {
  //           model: Comments,
  //           limit: 3,
  //           order: [['created_at', 'DESC']],
  //           include: [{
  //             model: Users,
  //             attributes: ['id', 'name', 'profile_picture']
  //           }]
  //         },
  //         {
  //           model: PostLikes,
  //           as: 'likes',
  //           attributes: ['id', 'user_id', 'reaction_type']
  //         }
  //       ]
  //     });

  //     if (!post) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Post not found'
  //       });
  //     }

  //     // Add a flag if the current user has liked this post
  //     const userHasLiked = userId ?
  //       post.likes.some(like => like.user_id === userId) :
  //       false;

  //     const postData = post.toJSON();
  //     delete postData.likes; // Remove the likes array

  //     return res.status(200).json({
  //       success: true,
  //       data: {
  //         ...postData,
  //         userHasLiked
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error fetching post:', error);
  //     return res.status(500).json({
  //       success: false,
  //       message: 'Failed to fetch post',
  //       error: error.message
  //     });
  //   }
  // },

  // Update a post
  async updatePost(req, res) {
    try {
      const { postId } = req.params;
      const { description, visibility } = req.body;
      const userId = req.user.id;

      const post = await Posts.findByPk(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      if (post.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this post'
        });
      }

      await post.update({ description, visibility });

      return res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: post
      });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update post',
        error: error.message
      });
    }
  },

  // Delete a post
  async deletePost(req, res) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const post = await Posts.findByPk(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      if (post.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this post'
        });
      }

      // This should cascade delete PostsImages, Comments, Likes
      await post.destroy();

      return res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete post',
        error: error.message
      });
    }
  },

  // Like/unlike a post
  async toggleLike(req, res) {
    try {
      const { postId } = req.params;
      const { reactionType = 'like' } = req.body;
      const userId = req.user.id;

      // Check if post exists
      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // Check if user already liked the post
      const existingLike = await PostLikes.findOne({
        where: { post_id: postId, user_id: userId }
      });

      if (existingLike) {
        // Unlike
        await existingLike.destroy();
        await post.decrement('number_of_likes');

        return res.status(200).json({
          success: true,
          message: 'Post unliked successfully',
          liked: false
        });
      } else {
        // Like
        await PostLikes.create({
          post_id: postId,
          user_id: userId,
          reaction_type: reactionType,
          created_at: new Date()
        });

        await post.increment('number_of_likes');

        return res.status(200).json({
          success: true,
          message: 'Post liked successfully',
          liked: true
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to like/unlike post',
        error: error.message
      });
    }
  },
  async getUserPosts(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      // First get all posts for the target user
      const posts = await Posts.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit,
        offset,
        attributes: ['id', 'description', 'created_at', 'number_of_likes', 'visibility'],
        include: [
          {
            model: Users,
            attributes: ['id', 'name', 'profile_picture']
          },
          {
            model: PostsImages,
            attributes: ['img_url']
          },
          {
            model: PostLikes,
            as: 'likes',
            attributes: ['id'],
            where: req.user ? { user_id: req.user.id } : { user_id: -1 }, // Only get likes from authenticated user
            required: false // Make it a LEFT JOIN
          },
          {
            model: SavedPosts,
            attributes: ['id'],
            where: req.user ? { user_id: req.user.id } : { user_id: -1 }, // Only get saves from authenticated user
            required: false // Make it a LEFT JOIN
          }
        ],
      });

      // Add isLiked flag to each post and remove the likes array
      const postsWithLikeStatus = posts.map(post => {
        const postData = post.toJSON();
        const isLiked = postData.likes && postData.likes.length > 0;
        const isSaved = postData.SavedPosts && postData.SavedPosts.length > 0;
        delete postData.likes; // Remove the likes array
        delete postData.SavedPosts; // Remove the saved posts array
        return {
          ...postData,
          isLiked,
          isSaved
        };
      });

      // If user is not authenticated, only return public posts
      if (!req.user) {
        const publicPosts = postsWithLikeStatus.filter(post => post.visibility === 'public');
        return res.status(200).json({
          success: true,
          data: publicPosts
        });
      }

      // If the requesting user is not the post owner, filter private posts
      if (userId !== req.user.id) {
        // Get accepted friends between the requesting user and post owner
        const friends = await findAcceptedFriends(req.user.id);
        const isFriend = friends.some(friend =>
          friend.user_id === userId || friend.friend_id === userId
        );

        // Filter posts based on visibility and friendship
        const filteredPosts = postsWithLikeStatus.filter(post => {
          return post.visibility === 'public' || (post.visibility === 'private' && isFriend);
        });

        return res.status(200).json({
          success: true,
          data: filteredPosts
        });
      }

      // If requesting user is the post owner, return all posts
      return res.status(200).json({
        success: true,
        data: postsWithLikeStatus
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user posts',
        error: error.message
      });
    }
  },

  async getSavedPosts(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      // Get saved posts for the user
      const savedPosts = await SavedPosts.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit,
        offset,
        include: [
          {
            model: Posts,
            as: 'Post',
            include: [
              {
                model: Users,
                attributes: ['id', 'name', 'profile_picture']
              },
              {
                model: PostsImages,
                attributes: ['img_url']
              },
              {
                model: PostLikes,
                as: 'likes',
                attributes: ['id'],
                where: { user_id: userId },
                required: false
              }
            ]
          }
        ]
      });

      // Transform the response to include isLiked flag
      const transformedPosts = savedPosts.map(savedPost => {
        const post = savedPost.Post;
        const postData = post.toJSON();
        const isLiked = postData.likes && postData.likes.length > 0;
        delete postData.likes; // Remove the likes array
        return {
          ...postData,
          isLiked
        };
      });

      return res.status(200).json({
        success: true,
        data: transformedPosts
      });
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch saved posts',
        error: error.message
      });
    }
  },

  async toggleSavePost(req, res) {
    try {
      const userId = req.user.id;
      const postId = parseInt(req.params.postId);

      // Check if the post exists and get its details
      const post = await Posts.findByPk(postId, {
        include: [{
          model: Users,
          attributes: ['id']
        }]
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // Check post visibility and permissions
      if (post.visibility === 'only me' && post.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to save this post'
        });
      }

      if (post.visibility === 'private') {
        // Get accepted friends between the requesting user and post owner
        const friends = await findAcceptedFriends(userId);
        const isFriend = friends.some(friend =>
          friend.user_id === post.user_id || friend.friend_id === post.user_id
        );

        if (!isFriend && post.user_id !== userId) {
          return res.status(403).json({
            success: false,
            message: 'You do not have permission to save this post'
          });
        }
      }

      // Check if the post is already saved
      const existingSavedPost = await SavedPosts.findOne({
        where: {
          user_id: userId,
          post_id: postId
        }
      });

      if (existingSavedPost) {
        // If post is saved, unsave it
        await existingSavedPost.destroy();
        return res.status(200).json({
          success: true,
          message: 'Post unsaved successfully',
          saved: false
        });
      } else {
        // If post is not saved, save it
        await SavedPosts.create({
          user_id: userId,
          post_id: postId,
          created_at: new Date()
        });
        return res.status(200).json({
          success: true,
          message: 'Post saved successfully',
          saved: true
        });
      }
    } catch (error) {
      console.error('Error toggling save post:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to toggle save post',
        error: error.message
      });
    }
  }
};  