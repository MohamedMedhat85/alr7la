import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Rating,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import {
    MoreVert,
    Edit,
    Delete,
    AccessTime
} from '@mui/icons-material';
import { reviewService } from '../../services/networkService';
import localStorageService from '../../services/localStorageService';
import ReviewForm from './ReviewForm';

const ReviewCard = ({ review, onReviewUpdated, onReviewDeleted }) => {
    const userData = localStorageService.getItem('userData');
    const user = {
        id: localStorageService.getItem('id'),
        name: userData ? userData.name : 'User',
        profile_picture: localStorageService.getItem('profile_picture')
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isOwner = user?.id === review.User?.id;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        setShowEditForm(true);
    };

    const handleDelete = () => {
        handleMenuClose();
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        setLoading(true);
        setError('');

        try {
            await reviewService.deleteReview(review.id.toString());
            onReviewDeleted(review.id);
            setShowDeleteDialog(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete review');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = () => {
        setShowEditForm(false);
        onReviewUpdated();
    };

    const handleEditCancel = () => {
        setShowEditForm(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'success';
        if (rating >= 3) return 'warning';
        return 'error';
    };

    return (
        <>
            <Card
                elevation={1}
                sx={{
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main'
                    }
                }}
            >
                <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <Avatar
                                src={review.User?.profile_picture}
                                sx={{ mr: 2, width: 48, height: 48 }}
                            >
                                {review.User?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {review.User?.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(review.created_at)}
                                    </Typography>
                                    {review.updated_at !== review.created_at && (
                                        <Chip
                                            label="Edited"
                                            size="small"
                                            variant="outlined"
                                            color="info"
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Rating and Menu Container */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
                            {/* Rating */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Rating
                                    value={review.rating}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: `${getRatingColor(review.rating)}.main`,
                                        },
                                    }}
                                />
                                <Chip
                                    label={review.rating}
                                    color={getRatingColor(review.rating)}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>

                            {/* Menu */}
                            {isOwner && (
                                <IconButton onClick={handleMenuOpen} size="small">
                                    <MoreVert />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {/* Review Content */}
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {review.description}
                    </Typography>

                    {/* Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleEdit}>
                            <Edit sx={{ mr: 1 }} />
                            Edit Review
                        </MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                            <Delete sx={{ mr: 1 }} />
                            Delete Review
                        </MenuItem>
                    </Menu>
                </CardContent>
            </Card>

            {/* Edit Form Dialog */}
            {showEditForm && (
                <ReviewForm
                    place={review.Place || { id: review.place_id, name: 'this place' }}
                    onReviewSubmitted={handleEditSubmit}
                    onCancel={handleEditCancel}
                    editMode={true}
                    existingReview={review}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogTitle>Delete Review</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete your review? This action cannot be undone.
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowDeleteDialog(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReviewCard; 