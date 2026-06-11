import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Rating,
    Button,
    Alert,
    CircularProgress,
    Avatar,
    Chip,
    Divider
} from '@mui/material';
import { Star, Edit, Send, Cancel } from '@mui/icons-material';
import { reviewService } from '../../services/networkService';
import localStorageService from '../../services/localStorageService';

const ReviewForm = ({
    place,
    onReviewSubmitted,
    onCancel,
    editMode = false,
    existingReview = null
}) => {
    const userData = localStorageService.getItem('userData');
    const user = {
        id: localStorageService.getItem('id'),
        name: userData ? userData.name : 'User',
        profile_picture: localStorageService.getItem('profile_picture')
    };
    const [rating, setRating] = useState(editMode ? existingReview?.rating || 0 : 0);
    const [description, setDescription] = useState(editMode ? existingReview?.description || '' : '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hover, setHover] = useState(-1);

    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please provide a rating');
            return;
        }

        if (!description.trim()) {
            setError('Please provide a review description');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editMode) {
                await reviewService.updateReview(existingReview.id.toString(), description, rating);
            } else {
                await reviewService.createReview(place.id.toString(), description, rating);
            }

            onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setRating(editMode ? existingReview?.rating || 0 : 0);
        setDescription(editMode ? existingReview?.description || '' : '');
        setError('');
        onCancel();
    };

    return (
        <Card
            elevation={2}
            sx={{
                mb: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={user?.profile_picture}
                        sx={{ mr: 2, width: 40, height: 40 }}
                    >
                        {user?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {editMode ? 'Edit Review' : 'Write a Review'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {editMode ? 'Update your review for' : 'Share your experience at'} {place.name}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                    {/* Rating Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Your Rating *
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Rating
                                name="rating"
                                value={rating}
                                precision={0.5}
                                size="large"
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: 'primary.light',
                                    },
                                }}
                            />
                            {rating !== null && (
                                <Chip
                                    label={labels[hover !== -1 ? hover : rating]}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Description Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Your Review *
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            placeholder="Share your experience, what you liked, what could be improved..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={!!error && !description.trim()}
                            helperText={error && !description.trim() ? error : ''}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={loading}
                            startIcon={<Cancel />}
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || rating === 0 || !description.trim()}
                            startIcon={loading ? <CircularProgress size={20} /> : editMode ? <Edit /> : <Send />}
                            sx={{ borderRadius: 2 }}
                        >
                            {loading ? 'Submitting...' : editMode ? 'Update Review' : 'Submit Review'}
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
};

export default ReviewForm; 