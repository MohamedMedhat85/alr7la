// controllers/commentsController.js
const { Comments, Users, Posts } = require('../models');

module.exports = {
  // Create a comment or reply
  async createComment(req, res) {
    try {
      const { postId } = req.params;
      const { description, comment_parent_id } = req.body;
      const userId = req.user.id;

      console.log('User ID:', userId);
      console.log('Post ID:', postId);
      console.log('Comment Description:', description);
      console.log('Parent Comment ID:', comment_parent_id);

      // Check if post exists
      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      // If this is a reply, check if parent comment exists
      if (comment_parent_id) {
        const parentComment = await Comments.findByPk(comment_parent_id);
        if (!parentComment) {
          return res.status(404).json({
            success: false,
            message: 'Parent comment not found'
          });
        }
      }

      const comment = await Comments.create({
        post_id: postId,
        user_id: userId,
        parent_comment_id: comment_parent_id || null,
        description,
        created_at: new Date()
      });

      // Get comment with user data
      const commentWithUser = await Comments.findByPk(comment.id, {
        include: [{
          model: Users,
          attributes: ['id', 'name', 'profile_picture']
        }]
      });

      const message = comment_parent_id ? 'Reply added successfully' : 'Comment added successfully';

      return res.status(201).json({
        success: true,
        message: message,
        data: commentWithUser
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add comment',
        error: error.message
      });
    }
  },



  // Get comments for a post
  async getComments(req, res) {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Check if post exists
      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const offset = (page - 1) * limit;

      // Get total count of ALL comments (including replies)
      const totalCount = await Comments.count({
        where: {
          post_id: postId
        }
      });

      // Get only top-level comments (no parent_comment_id) with their replies
      const comments = await Comments.findAndCountAll({
        where: {
          post_id: postId,
          parent_comment_id: null
        },
        include: [
          {
            model: Users,
            attributes: ['id', 'name', 'profile_picture']
          },
          {
            model: Comments,
            as: 'replies',
            include: [{
              model: Users,
              attributes: ['id', 'name', 'profile_picture']
            }],
            order: [['created_at', 'ASC']] // Replies in chronological order
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return res.status(200).json({
        success: true,
        data: {
          comments: comments.rows,
          totalComments: totalCount, // Use total count including replies
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit) // Use total count for pagination
        }
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch comments',
        error: error.message
      });
    }
  },



  // Update a comment
  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { description } = req.body;
      const userId = req.user.id;

      const comment = await Comments.findByPk(commentId);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      if (comment.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this comment'
        });
      }

      await comment.update({ description });

      // Get updated comment with user data
      const updatedComment = await Comments.findByPk(commentId, {
        include: [{
          model: Users,
          attributes: ['id', 'name', 'profile_picture']
        }]
      });

      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update comment',
        error: error.message
      });
    }
  },

  // Delete a comment
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;

      const comment = await Comments.findByPk(commentId);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      // Allow comment owner or post owner to delete
      const post = await Posts.findByPk(comment.post_id);

      if (comment.user_id !== userId && post.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this comment'
        });
      }

      // Delete the comment (replies will be automatically deleted due to CASCADE)
      await comment.destroy();

      const message = comment.parent_comment_id ? 'Reply deleted successfully' : 'Comment deleted successfully';

      return res.status(200).json({
        success: true,
        message: message
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete comment',
        error: error.message
      });
    }
  }
};