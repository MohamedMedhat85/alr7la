// services/feedAlgorithmService.js

// You can use a real DB table to store interactions later
// This can be enhanced with ML-based ranking or collaborative filtering

const { Op } = require('sequelize');

module.exports = {
    /**
     * Rank feed posts using simple heuristics.
     * You can improve this with machine learning or scoring algorithms.
     * @param {Array} posts - Array of post objects
     * @param {Number} userId - ID of the user requesting the feed
     * @returns {Array} - Ranked list of posts
     */
    async rankFeedPosts(posts, userId) {
        // Example simple scoring:
        // Give more score to newer posts, and posts with more likes/comments

        const scoredPosts = posts.map(post => {
            const ageInHours = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
            const likes = post.PostLikes ? post.PostLikes.length : 0;
            const comments = post.Comments ? post.Comments.length : 0;

            const score = (likes * 2) + (comments * 1.5) - (ageInHours * 0.1); // simple weighting

            return { post, score };
        });

        scoredPosts.sort((a, b) => b.score - a.score);

        return scoredPosts.map(p => p.post);
    },

    /**
     * Track user interaction with a post (for future ranking improvements)
     * @param {Number} userId - ID of the interacting user
     * @param {Number} postId - ID of the post interacted with
     * @param {String} interactionType - Type of interaction
     */
    async trackFeedInteraction(userId, postId, interactionType) {
        console.log(`User ${userId} performed "${interactionType}" on post ${postId}`);

        // Optional: Save to DB for personalization/analytics
        // Example: Insert into FeedInteractions table
        // await FeedInteraction.create({ userId, postId, interactionType, timestamp: new Date() });
    }
};
