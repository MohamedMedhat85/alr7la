// controllers/enhancedFeedController.js
const { Posts, Users, Comments, PostsImages, PostLikes, Friends } = require('../models');
const { Op, Sequelize } = require('sequelize');
const feedAlgorithm = require('../services/feedAlgorithmService');

module.exports = {
    // Get personalized feed for user with advanced ranking
    async getSmartFeed(req, res) {
        try {
            const userId = req.params.user_id || 1;
            console.log('User ID:', userId);
            const { page = 1, limit = 20 } = req.query;

            // We'll fetch more posts than needed for better ranking
            const fetchLimit = parseInt(limit) * 3;
            const offset = (page - 1) * fetchLimit;

            // 1. Get posts from various sources

            // a) Posts from followed users (highest priority)
            const following = await Friends.findAll({
                where: {
                    status: 'accepted',
                    [Op.or]: [
                        { user_id: userId },
                        { friend_id: userId }
                    ]
                },
                attributes: ['user_id', 'friend_id']
            });

            const followingIds = following.map(f =>
                f.user_id === parseInt(userId) ? f.friend_id : f.user_id
            );

            // Include user's own posts in the feed
            const allUserIds = [...followingIds, parseInt(userId)];

            const followedPosts = allUserIds.length > 0 ? await Posts.findAll({
                where: { user_id: { [Op.in]: allUserIds } },
                include: [
                    {
                        model: Users,
                        attributes: ['id', 'name', 'profile_picture']
                    },
                    {
                        model: PostsImages,
                        attributes: ['post_id', 'img_url']
                    },
                    {
                        model: Comments,
                        limit: 2,
                        include: [{
                            model: Users,
                            attributes: ['id', 'name', 'profile_picture']
                        }]
                    },
                    {
                        model: PostLikes,
                        as: 'likes',             // <--- Add this alias here
                        attributes: ['id', 'user_id']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: fetchLimit * 0.6
            }) : [];

            const popularPosts = await Posts.findAll({
                where: {
                    user_id: { [Op.notIn]: [userId, ...followingIds] },
                    number_of_likes: { [Op.gt]: 10 }
                },
                include: [
                    {
                        model: Users,
                        attributes: ['id', 'name', 'profile_picture']
                    },
                    {
                        model: PostsImages,
                        attributes: ['post_id', 'img_url']
                    },
                    {
                        model: Comments,
                        limit: 2,
                        include: [{
                            model: Users,
                            attributes: ['id', 'name', 'profile_picture']
                        }]
                    },
                    {
                        model: PostLikes,
                        as: 'likes',             // <--- And here
                        attributes: ['id', 'user_id']
                    }
                ],
                order: [
                    ['number_of_likes', 'DESC'],
                    ['created_at', 'DESC']
                ],
                limit: fetchLimit * 0.4
            });


            // 2. Combine and rank posts
            const allPosts = [...followedPosts, ...popularPosts];

            // Sort by created_at to maintain chronological order
            const sortedPosts = allPosts.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );

            // 3. Apply pagination to the sorted results
            const paginatedPosts = sortedPosts.slice(0, parseInt(limit));

            // 4. Add isLiked property for each post and format images
            const postsWithLikeStatus = paginatedPosts.map(post => {
                const postData = post.toJSON();
                const isLiked = postData.likes && postData.likes.some(like => like.user_id === parseInt(userId));
                delete postData.likes; // Remove the likes array to clean up the response

                // Format images for frontend compatibility
                const formattedImages = postData.PostsImages ? postData.PostsImages.map(img => ({
                    id: img.post_id, // Use post_id as id since there's no separate id column
                    image_url: img.img_url,
                    url: img.img_url,
                    created_at: img.created_at,
                    createdAt: img.created_at
                })) : [];

                return {
                    ...postData,
                    isLiked,
                    images: formattedImages,
                    contentType: formattedImages.length > 0 ? 'image' : 'text',
                    contentSrc: formattedImages.length > 0 ? formattedImages[0].image_url : null
                };
            });

            return res.status(200).json({
                success: true,
                data: {
                    posts: postsWithLikeStatus,
                    currentPage: parseInt(page),
                    hasMorePosts: sortedPosts.length > parseInt(limit)
                }
            });
        } catch (error) {
            console.error('Error fetching smart feed:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch feed',
                error: error.message
            });
        }
    },

    // Record user interaction with feed content
    async recordFeedInteraction(req, res) {
        try {
            const userId = req.user.id;
            const { postId, interactionType } = req.body;

            if (!postId || !interactionType) {
                return res.status(400).json({
                    success: false,
                    message: 'Post ID and interaction type are required'
                });
            }

            // Valid interaction types
            const validInteractions = ['view', 'like', 'comment', 'share', 'save', 'hide', 'report', 'click'];

            if (!validInteractions.includes(interactionType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid interaction type'
                });
            }

            // Record the interaction
            await feedAlgorithm.trackFeedInteraction(userId, postId, interactionType);

            return res.status(200).json({
                success: true,
                message: 'Interaction recorded successfully'
            });
        } catch (error) {
            console.error('Error recording interaction:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to record interaction',
                error: error.message
            });
        }
    }
};