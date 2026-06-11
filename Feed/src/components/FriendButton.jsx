import React, { useState, useEffect } from 'react';
import {
    Button,
    CircularProgress,
    useTheme,
    alpha,
    Tooltip
} from '@mui/material';
import {
    PersonAdd as AddIcon,
    PersonRemove as RemoveIcon,
    Schedule as PendingIcon,
    Check as FriendsIcon
} from '@mui/icons-material';
import { friendService } from '../services/networkService';

const FriendButton = ({ targetUserId, isOwnProfile, onStatusChange, size = 'medium' }) => {
    const theme = useTheme();
    const [friendshipData, setFriendshipData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!targetUserId || isOwnProfile) return;

        const checkFriendshipStatus = async () => {
            try {
                setLoading(true);
                const response = await friendService.checkFriendshipStatus(targetUserId);
                if (response.data?.success) {
                    setFriendshipData(response.data.data);
                }
            } catch (error) {
                console.error('Error checking friendship status:', error);
                setFriendshipData({
                    status: 'none',
                    canSendRequest: true,
                    canCancelRequest: false,
                    canAcceptRequest: false
                });
            } finally {
                setLoading(false);
            }
        };

        checkFriendshipStatus();
    }, [targetUserId, isOwnProfile]);

    const handleAddFriend = async () => {
        try {
            setActionLoading(true);
            await friendService.addFriend(targetUserId);
            // Refresh friendship status after adding friend
            const response = await friendService.checkFriendshipStatus(targetUserId);
            if (response.data?.success) {
                setFriendshipData(response.data.data);
                if (onStatusChange) {
                    onStatusChange(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error adding friend:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelRequest = async () => {
        try {
            setActionLoading(true);
            await friendService.cancelFriendRequest(targetUserId);
            // Refresh friendship status after cancelling request
            const response = await friendService.checkFriendshipStatus(targetUserId);
            if (response.data?.success) {
                setFriendshipData(response.data.data);
                if (onStatusChange) {
                    onStatusChange(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        try {
            setActionLoading(true);
            await friendService.updateFriendRequest(targetUserId, 'accepted');
            // Refresh friendship status after accepting request
            const response = await friendService.checkFriendshipStatus(targetUserId);
            if (response.data?.success) {
                setFriendshipData(response.data.data);
                if (onStatusChange) {
                    onStatusChange(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            setActionLoading(true);
            await friendService.removeFriend(targetUserId);
            // Refresh friendship status after removing friend
            const response = await friendService.checkFriendshipStatus(targetUserId);
            if (response.data?.success) {
                setFriendshipData(response.data.data);
                if (onStatusChange) {
                    onStatusChange(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error removing friend:', error);
        } finally {
            setActionLoading(false);
        }
    };

    // Don't show button if it's own profile
    if (isOwnProfile) {
        return null;
    }

    // Compact button style
    const compactSx = {
        borderRadius: 999,
        px: size === 'small' ? 0.5 : 2,
        py: size === 'small' ? 0.5 : 1,
        minWidth: size === 'small' ? 32 : 40,
        fontSize: size === 'small' ? '1rem' : '0.95rem',
        fontWeight: 600,
        boxShadow: '0 2px 8px 0 rgba(60,60,60,0.08)',
        transition: 'all 0.2s',
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Show loading state while checking friendship status
    if (loading) {
        return (
            <Button
                variant="outlined"
                disabled
                sx={{
                    ...compactSx,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.text.secondary
                }}
            >
                <CircularProgress size={14} sx={{ mr: 1 }} />
                Loading...
            </Button>
        );
    }

    // If no friendship data yet, show loading
    if (!friendshipData) {
        return (
            <Button
                variant="outlined"
                disabled
                sx={{
                    ...compactSx,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.text.secondary
                }}
            >
                <CircularProgress size={14} sx={{ mr: 1 }} />
                Loading...
            </Button>
        );
    }

    const { status, canSendRequest, canCancelRequest, canAcceptRequest } = friendshipData;

    // Render button based on status and permissions
    if (status === 'accepted') {
        return (
            <Tooltip title="Remove Friend">
                <span>
                    <Button
                        variant="outlined"
                        size={size}
                        startIcon={null}
                        onClick={handleRemoveFriend}
                        disabled={actionLoading}
                        sx={compactSx}
                    >
                        {actionLoading ? <CircularProgress size={16} /> : <FriendsIcon fontSize="small" />}
                    </Button>
                </span>
            </Tooltip>
        );
    }

    if (canSendRequest) {
        return (
            <Tooltip title="Add Friend">
                <span>
                    <Button
                        variant="contained"
                        size={size}
                        startIcon={null}
                        onClick={handleAddFriend}
                        disabled={actionLoading}
                        sx={compactSx}
                    >
                        {actionLoading ? <CircularProgress size={16} /> : <AddIcon fontSize="small" />}
                    </Button>
                </span>
            </Tooltip>
        );
    }

    if (canCancelRequest) {
        return (
            <Tooltip title="Cancel Friend Request">
                <span>
                    <Button
                        variant="outlined"
                        size={size}
                        startIcon={null}
                        onClick={handleCancelRequest}
                        disabled={actionLoading}
                        sx={compactSx}
                    >
                        {actionLoading ? <CircularProgress size={16} /> : <PendingIcon fontSize="small" />}
                    </Button>
                </span>
            </Tooltip>
        );
    }

    if (canAcceptRequest) {
        return (
            <Tooltip title="Accept Friend Request">
                <span>
                    <Button
                        variant="outlined"
                        size={size}
                        startIcon={null}
                        onClick={handleAcceptRequest}
                        disabled={actionLoading}
                        sx={compactSx}
                    >
                        {actionLoading ? <CircularProgress size={16} /> : <PendingIcon fontSize="small" />}
                    </Button>
                </span>
            </Tooltip>
        );
    }

    // Default fallback
    return (
        <Tooltip title="Add Friend">
            <span>
                <Button
                    variant="contained"
                    size={size}
                    startIcon={null}
                    onClick={handleAddFriend}
                    disabled={actionLoading}
                    sx={compactSx}
                >
                    {actionLoading ? <CircularProgress size={16} /> : <AddIcon fontSize="small" />}
                </Button>
            </span>
        </Tooltip>
    );
};

export default FriendButton; 