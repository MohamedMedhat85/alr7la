import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Pagination,
    Chip,
    Divider,
    Skeleton,
    Card,
    CardContent,
    Rating
} from '@mui/material';
import { Add, Star, RateReview } from '@mui/icons-material';
import { reviewService } from '../../services/networkService';
import localStorageService from '../../services/localStorageService';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

const ReviewsList = ({ place, onReviewsUpdate }) => {
    const rawUserData = localStorageService.getItem('userData');
    let userData = null;
    if (rawUserData) {
        if (typeof rawUserData === 'string') {
            try {
                userData = JSON.parse(rawUserData);
            } catch (e) {
                userData = null;
            }
        } else if (typeof rawUserData === 'object') {
            userData = rawUserData;
        }
    }
    const user = {
        id: localStorageService.getItem('id'),
        name: userData && userData.name ? userData.name : 'User',
        profile_picture: localStorageService.getItem('profile_picture')
    };
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [userReview, setUserReview] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const limit = 10;

    const fetchReviews = async (page = 1) => {
        try {
            setLoading(true);
            const response = await reviewService.getReviews(place.id.toString(), page, limit);
            setReviews(response.data.data.reviews);
            setTotalPages(response.data.data.totalPages);
            setTotalReviews(response.data.data.totalReviews);

            // Check if user has already reviewed this place
            const userReview = response.data.data.reviews.find(review => review.User?.id === user?.id);
            setUserReview(userReview || null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
        fetchReviews(page);
    };

    const handleReviewSubmitted = async () => {
        setShowForm(false);
        setRefreshing(true);
        await fetchReviews(currentPage);
        setRefreshing(false);
        if (onReviewsUpdate) {
            onReviewsUpdate();
        }
    };

    const handleReviewUpdated = async () => {
        setRefreshing(true);
        await fetchReviews(currentPage);
        setRefreshing(false);
        if (onReviewsUpdate) {
            onReviewsUpdate();
        }
    };

    const handleReviewDeleted = async () => {
        setRefreshing(true);
        await fetchReviews(currentPage);
        setRefreshing(false);
        setUserReview(null);
        if (onReviewsUpdate) {
            onReviewsUpdate();
        }
    };

    useEffect(() => {
        if (place?.id) {
            fetchReviews();
        }
    }, [place?.id]);

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
        return (total / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            const rating = Math.floor(review.rating);
            if (distribution[rating] !== undefined) {
                distribution[rating]++;
            }
        });
        return distribution;
    };

    const ratingDistribution = getRatingDistribution();

    if (loading && reviews.length === 0) {
        return (
            <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Reviews
                </Typography>
                {[...Array(3)].map((_, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="40%" />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Reviews ({totalReviews})
                    </Typography>
                    {totalReviews > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating
                                value={parseFloat(getAverageRating())}
                                precision={0.1}
                                readOnly
                                size="small"
                            />
                            <Typography variant="body1" fontWeight="bold">
                                {getAverageRating()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                average rating
                            </Typography>
                        </Box>
                    )}
                </Box>

                {user && !userReview && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setShowForm(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Write Review
                    </Button>
                )}
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Rating Distribution */}
            {totalReviews > 0 && (
                <Card sx={{ mb: 3, p: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Rating Distribution
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                        {rating}
                                    </Typography>
                                    <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                </Box>
                                <Box sx={{ flex: 1, bgcolor: 'grey.100', borderRadius: 1, height: 8, position: 'relative' }}>
                                    <Box
                                        sx={{
                                            bgcolor: 'warning.main',
                                            height: '100%',
                                            borderRadius: 1,
                                            width: `${(ratingDistribution[rating] / totalReviews) * 100}%`,
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ minWidth: 40 }}>
                                    {ratingDistribution[rating]}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Card>
            )}

            {/* User's Review Form */}
            {showForm && (
                <ReviewForm
                    place={place}
                    onReviewSubmitted={handleReviewSubmitted}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* User's Existing Review */}
            {userReview && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Your Review
                    </Typography>
                    <ReviewCard
                        review={userReview}
                        onReviewUpdated={handleReviewUpdated}
                        onReviewDeleted={handleReviewDeleted}
                    />
                    <Divider sx={{ my: 2 }} />
                </Box>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <Box>
                    {!userReview && (
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            All Reviews
                        </Typography>
                    )}

                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onReviewUpdated={handleReviewUpdated}
                            onReviewDeleted={handleReviewDeleted}
                        />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </Box>
            ) : (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <RateReview sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No reviews yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Be the first to share your experience at {place.name}
                    </Typography>
                    {user && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setShowForm(true)}
                            sx={{ mt: 2, borderRadius: 2 }}
                        >
                            Write the First Review
                        </Button>
                    )}
                </Card>
            )}

            {/* Loading Overlay */}
            {refreshing && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default ReviewsList; 