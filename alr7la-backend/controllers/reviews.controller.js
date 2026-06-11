const { Reviews, Users, Places } = require('../models');

module.exports = {
    // Create a review
    async createReview(req, res) {
        try {
            const { placeId } = req.params;
            const { description, rating } = req.body;
            const userId = req.user.id;

            console.log('User ID:', userId);
            console.log('Place ID:', placeId);
            console.log('Review Description:', description);
            console.log('Rating:', rating);

            // Check if place exists
            const place = await Places.findByPk(placeId);
            if (!place) {
                return res.status(404).json({
                    success: false,
                    message: 'Place not found'
                });
            }

            // Check if user has already reviewed this place
            const existingReview = await Reviews.findOne({
                where: {
                    user_id: userId,
                    place_id: placeId
                }
            });

            if (existingReview) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already reviewed this place'
                });
            }

            // Validate rating
            if (rating < 0 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 0 and 5'
                });
            }

            const review = await Reviews.create({
                place_id: placeId,
                user_id: userId,
                description,
                rating,
                created_at: new Date()
            });

            // Get review with user data
            const reviewWithUser = await Reviews.findByPk(review.id, {
                include: [{
                    model: Users,
                    attributes: ['id', 'name', 'profile_picture']
                }]
            });

            // Update place rating and number of ratings
            try {
                await updatePlaceRating(placeId, rating, 'add');
                console.log(`Place rating updated successfully for place ${placeId}`);
            } catch (error) {
                console.error(`Failed to update place rating for place ${placeId}:`, error);
                // Continue with the response even if rating update fails
            }

            return res.status(201).json({
                success: true,
                message: 'Review added successfully',
                data: reviewWithUser
            });
        } catch (error) {
            console.error('Error creating review:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to add review',
                error: error.message
            });
        }
    },

    // Get reviews for a place
    async getReviews(req, res) {
        try {
            const { placeId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            // Check if place exists
            const place = await Places.findByPk(placeId);
            if (!place) {
                return res.status(404).json({
                    success: false,
                    message: 'Place not found'
                });
            }

            const offset = (page - 1) * limit;

            const reviews = await Reviews.findAndCountAll({
                where: { place_id: placeId },
                include: [{
                    model: Users,
                    attributes: ['id', 'name', 'profile_picture']
                }],
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return res.status(200).json({
                success: true,
                data: {
                    reviews: reviews.rows,
                    totalReviews: reviews.count,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(reviews.count / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch reviews',
                error: error.message
            });
        }
    },

    // Get user's reviews
    async getUserReviews(req, res) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const offset = (page - 1) * limit;

            const reviews = await Reviews.findAndCountAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Users,
                        attributes: ['id', 'name', 'profile_picture']
                    },
                    {
                        model: Places,
                        attributes: ['id', 'name', 'city', 'country']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return res.status(200).json({
                success: true,
                data: {
                    reviews: reviews.rows,
                    totalReviews: reviews.count,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(reviews.count / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user reviews',
                error: error.message
            });
        }
    },

    // Update a review
    async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { description, rating } = req.body;
            const userId = req.user.id;

            const review = await Reviews.findByPk(reviewId);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            if (review.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this review'
                });
            }

            // Validate rating
            if (rating < 0 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 0 and 5'
                });
            }

            const oldRating = review.rating;
            await review.update({ description, rating });

            // Update place rating and number of ratings
            try {
                await updatePlaceRating(review.place_id, rating, 'update', oldRating);
                console.log(`Place rating updated successfully for place ${review.place_id}`);
            } catch (error) {
                console.error(`Failed to update place rating for place ${review.place_id}:`, error);
                // Continue with the response even if rating update fails
            }

            // Get updated review with user data
            const updatedReview = await Reviews.findByPk(reviewId, {
                include: [{
                    model: Users,
                    attributes: ['id', 'name', 'profile_picture']
                }]
            });

            return res.status(200).json({
                success: true,
                message: 'Review updated successfully',
                data: updatedReview
            });
        } catch (error) {
            console.error('Error updating review:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update review',
                error: error.message
            });
        }
    },

    // Delete a review
    async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const userId = req.user.id;

            const review = await Reviews.findByPk(reviewId);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found'
                });
            }

            if (review.user_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this review'
                });
            }

            const placeId = review.place_id;
            const deletedRating = review.rating;
            await review.destroy();

            // Update place rating and number of ratings
            try {
                await updatePlaceRating(placeId, deletedRating, 'delete');
                console.log(`Place rating updated successfully for place ${placeId}`);
            } catch (error) {
                console.error(`Failed to update place rating for place ${placeId}:`, error);
                // Continue with the response even if rating update fails
            }

            return res.status(200).json({
                success: true,
                message: 'Review deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting review:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete review',
                error: error.message
            });
        }
    }
};

// Helper function to update place rating and number of ratings
async function updatePlaceRating(placeId, rating, operation = 'add', oldRating = null) {
    try {
        console.log(`Updating place rating for place ID: ${placeId}, operation: ${operation}, rating: ${rating}`);

        // Get current place data
        const place = await Places.findByPk(placeId, {
            attributes: ['id', 'rating', 'number_of_ratings']
        });

        if (!place) {
            console.error(`Place ${placeId} not found`);
            return;
        }

        console.log(`Current place data: rating=${place.rating}, number_of_ratings=${place.number_of_ratings}`);

        let newRating, newNumberOfRatings;

        if (operation == 'add') {
            // Adding a new review
            if (place.rating && place.number_of_ratings > 0) {
                // Calculate new average: (current_total + new_rating) / (current_count + 1)
                const currentTotal = place.rating * place.number_of_ratings;
                const newTotal = currentTotal + parseFloat(rating);
                newNumberOfRatings = place.number_of_ratings + 1;
                newRating = newTotal / newNumberOfRatings;

                console.log(`Adding review: current_total=${currentTotal}, new_rating=${rating}, new_total=${newTotal}, new_count=${newNumberOfRatings}, new_average=${newRating.toFixed(2)}`);
            } else {
                // First review
                newRating = parseFloat(rating);
                newNumberOfRatings = 1;
                console.log(`First review: rating=${newRating}, count=${newNumberOfRatings}`);
            }
        } else if (operation == 'update') {
            // Updating an existing review
            if (place.rating && place.number_of_ratings > 0) {
                // Calculate new average: (current_total - old_rating + new_rating) / current_count
                const currentTotal = place.rating * place.number_of_ratings;
                const newTotal = currentTotal - parseFloat(oldRating) + parseFloat(rating);
                newNumberOfRatings = place.number_of_ratings; // Count stays the same
                newRating = newTotal / newNumberOfRatings;

                console.log(`Updating review: current_total=${currentTotal}, old_rating=${oldRating}, new_rating=${rating}, new_total=${newTotal}, new_average=${newRating.toFixed(2)}`);
            } else {
                // This shouldn't happen but handle it
                newRating = parseFloat(rating);
                newNumberOfRatings = 1;
                console.log(`No existing data, setting to: rating=${newRating}, count=${newNumberOfRatings}`);
            }
        } else if (operation == 'delete') {
            // Deleting a review
            if (place.rating && place.number_of_ratings > 1) {
                // Calculate new average: (current_total - deleted_rating) / (current_count - 1)
                const currentTotal = place.rating * place.number_of_ratings;
                const newTotal = currentTotal - parseFloat(rating);
                newNumberOfRatings = place.number_of_ratings - 1;
                newRating = newTotal / newNumberOfRatings;

                console.log(`Deleting review: current_total=${currentTotal}, deleted_rating=${rating}, new_total=${newTotal}, new_count=${newNumberOfRatings}, new_average=${newRating.toFixed(2)}`);
            } else {
                // Last review being deleted
                newRating = null;
                newNumberOfRatings = 0;
                console.log(`Last review deleted, resetting to: rating=null, count=0`);
            }
        }

        // Update place with new values
        const updateData = {
            rating: newRating != null ? parseFloat(newRating.toFixed(2)) : null,
            number_of_ratings: parseInt(newNumberOfRatings)
        };

        console.log(`Updating place with data:`, updateData);

        const updatedPlace = await Places.update(updateData, {
            where: { id: placeId }
        });

        console.log(`Place ${placeId} updated successfully. Rows affected: ${updatedPlace[0]}`);

        // Verify the update by fetching the place again
        const verifyPlace = await Places.findByPk(placeId, {
            attributes: ['id', 'rating', 'number_of_ratings']
        });
        console.log(`Verification - Place ${placeId}: rating=${verifyPlace.rating}, number_of_ratings=${verifyPlace.number_of_ratings} (type: ${typeof verifyPlace.number_of_ratings})`);

    } catch (error) {
        console.error('Error updating place rating:', error);
        throw error; // Re-throw to handle in the calling function
    }
} 