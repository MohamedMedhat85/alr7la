/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  ListItemAvatar,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  useMediaQuery,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { usePostContext } from '../context/PostContext';
import { useSavedPostContext } from '../context/SavedPostContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CommentSection from './Comment';
import ExpandView from './ExpandView';
import { commentService, postService } from '../services/networkService';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../services/localStorageService';

// Leaflet icon configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MAX_TEXT_LENGTH = 150;

// Add a function to map backend privacy to UI
const privacyBackendToUI = (value) => {
  if (value === 'private') return 'friends';
  if (value === 'only me') return 'only me';
  return value;
};

function PostCard({ post, onPostUpdated, onPostDeleted }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { user, time, contentType, contentSrc, isFirstPost } = post;
  const { updatePost, deletePost } = usePostContext();
  const { savedPosts, addSavedPost, removeSavedPost } = useSavedPostContext();
  const navigate = useNavigate();

  const [text, setText] = useState(post.text || '');
  const [privacy, setPrivacy] = useState(post.privacy || 'public');
  const [location, setLocation] = useState(post.location);

  const [liked, setLiked] = useState(!!post.isLiked);
  const [likeCount, setLikeCount] = useState(post.number_of_likes || post.likes || 0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [expandedView, setExpandedView] = useState(false);
  const [expandedText, setExpandedText] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [isSaved, setIsSaved] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  // Comment management states
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // NEW: Like synchronization states
  const [likedComments, setLikedComments] = useState({});
  const [likedReplies, setLikedReplies] = useState({});

  // Share functionality states
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Edit/Delete functionality states
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [editPrivacy, setEditPrivacy] = useState('public');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const carouselRef = useRef(null);

  // Handle both old format (contentSrc) and new format (images array)
  const images = post.images || [];
  const hasMedia = contentType === 'image' || contentType === 'video' || images.length > 0;
  const hasMultipleMedia = hasMedia && (Array.isArray(contentSrc) ? contentSrc.length > 1 : images.length > 1);

  // Get current user from localStorage
  const currentUserId = localStorageService.getItem('id');

  // Convert both IDs to strings for comparison to handle different data types
  const currentUserIdStr = currentUserId?.toString();
  const postUserIdStr = user?.id?.toString();
  const postUserIdFromPostStr = post.user?.id?.toString();

  // More robust comparison that handles different data types
  const isCurrentUserPost = currentUserId && (
    (postUserIdStr && currentUserIdStr === postUserIdStr) ||
    (postUserIdFromPostStr && currentUserIdStr === postUserIdFromPostStr) ||
    (post.user_id && currentUserIdStr === post.user_id.toString()) ||
    (post.user?.id && currentUserIdStr === post.user.id.toString()) ||
    (post.user_id && currentUserId === post.user_id) ||
    (post.user?.id && currentUserId === post.user.id) ||
    (post.user_id && currentUserId == post.user_id) ||
    (post.user?.id && currentUserId == post.user.id)
  );

  // Debug only for the first post to avoid spam
  if (post.id && !window.debugLogged) {
    console.log('User ID Debug for post', post.id, ':', {
      currentUserId,
      currentUserIdStr,
      postUserId: user?.id,
      postUserIdStr,
      postUserIdFromPost: post.user?.id,
      postUserIdFromPostStr,
      postUserIdDirect: post.user_id,
      isCurrentUserPost,
      post: { id: post.id, user: post.user, user_id: post.user_id }
    });
    window.debugLogged = true;
  }



  const getCurrentMedia = () => {
    if (!hasMedia) return null;

    // Handle new format with images array
    if (images.length > 0) {
      return images[currentImageIndex]?.image_url || images[currentImageIndex]?.url;
    }

    // Handle old format with contentSrc
    if (Array.isArray(contentSrc)) {
      return contentSrc[currentImageIndex];
    }
    return contentSrc;
  };

  const postWithId = React.useMemo(() => ({
    ...post,
    id: post.id || `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    text: text,
    privacy: privacy,
    location: location
  }), [post, text, privacy, location]);



  useEffect(() => {
    setText(post.text || '');
    setPrivacy(post.privacy || 'public');
    setLocation(post.location);
    setCommentCount(post.commentCount || 0);
    setLiked(!!post.isLiked);
    setLikeCount(post.number_of_likes || post.likes || 0);

    // Cleanup timeout on unmount
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [post, clickTimeout]);

  useEffect(() => {
    if (savedPosts) {
      const isPostSaved = savedPosts.some(savedPost =>
        savedPost.id === postWithId.id ||
        (savedPost.contentSrc === postWithId.contentSrc && savedPost.time === postWithId.time)
      );
      setIsSaved(isPostSaved);
    }
  }, [savedPosts, postWithId.id, postWithId.contentSrc, postWithId.time]);

  useEffect(() => {
    // Fetch comments from backend when post loads
    async function fetchComments() {
      setIsLoadingComments(true);
      try {
        const res = await commentService.getComments(postWithId.id);
        console.log('Comments API response:', res.data);
        const backendComments = res.data?.data?.comments || [];
        setComments(backendComments.map(c => ({
          id: c.id,
          user: c.User?.name || c.user?.name || 'User',
          userId: c.User?.id || c.user?.id || c.user_id,
          avatar: c.User?.profile_picture || c.user?.profile_picture || '',
          text: c.description,
          time: c.created_at,
          replies: (c.replies || []).map(reply => ({
            id: reply.id,
            user: reply.User?.name || 'Unknown User',
            userId: reply.User?.id || reply.user_id,
            avatar: reply.User?.profile_picture || '',
            text: reply.description,
            time: reply.created_at,
            likeCount: reply.likeCount || 0,
            replyingTo: c.User?.name || 'Unknown User'
          })),
          likeCount: c.likeCount || 0
        })));
      } catch (err) {
        setComments([]);
      } finally {
        setIsLoadingComments(false);
      }
    }
    fetchComments();
  }, [postWithId.id]);



  // Handle comment changes
  const handleCommentsChange = (newComments) => {
    setComments(newComments);
  };

  // NEW: Handle liked comments change
  const handleLikedCommentsChange = (newLikedComments) => {
    setLikedComments(newLikedComments);
  };

  // NEW: Handle liked replies change
  const handleLikedRepliesChange = (newLikedReplies) => {
    setLikedReplies(newLikedReplies);
  };

  const isTextLong = text.length > MAX_TEXT_LENGTH;

  // In PostCard, use privacyBackendToUI for privacy
  const privacyUI = privacyBackendToUI(privacy);

  const getPrivacyIcon = (privacyLevel = privacyUI) => {
    switch (privacyLevel) {
      case 'public':
        return <PublicIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
      case 'friends':
        return <PeopleIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
      case 'only me':
        return <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
      default:
        return <PublicIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
    }
  };

  const handleImageNavigation = (direction) => {
    if (!hasMultipleMedia) return;
    setSlideDirection(direction);
    setTimeout(() => {
      const totalImages = images.length > 0 ? images.length : (Array.isArray(contentSrc) ? contentSrc.length : 1);
      if (direction === 'next') {
        setCurrentImageIndex(prev =>
          prev === totalImages - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentImageIndex(prev =>
          prev === 0 ? totalImages - 1 : prev - 1
        );
      }
    }, 10);
  };

  const processMediaSrc = (src) => {
    if (!src) return '';
    try {
      return src.startsWith('/') ? require(`${src}`) : src;
    } catch {
      return src;
    }
  };

  function timeAgo(date) {
    const now = new Date();
    const past = date;
    const seconds = Math.floor((now - past) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }

  const handleLike = async () => {
    try {
      const res = await postService.toggleLike(postWithId.id);
      if (typeof res.data.liked === 'boolean') {
        setLiked(res.data.liked);
        setLikeCount(prevCount => res.data.liked ? prevCount + 1 : Math.max(0, prevCount - 1));
      }
    } catch (err) {
      // Optionally show an error message
    }
  };

  const handleMediaClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);

      // This is a double click
      if (isSmallScreen) {
        // On small screens, like the post instead of expanding
        handleLike();
        // Show like animation
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000);
      } else {
        // On larger screens, expand the image
        setExpandedView(true);
      }
    } else {
      // This is a single click - wait to see if it becomes a double click
      const timeout = setTimeout(() => {
        // Single click confirmed - expand the image
        setExpandedView(true);
        setClickTimeout(null);
      }, 300); // 300ms delay to detect double click

      setClickTimeout(timeout);
    }
  };

  const handleSeeMore = (e) => {
    e.preventDefault();
    setExpandedText(true);
  };

  const handleOpenLocationMap = () => {
    setShowLocationMap(true);
  };

  const handleSavePost = () => {
    if (isSaved) {
      removeSavedPost(postWithId);
    } else {
      addSavedPost(postWithId);
    }
  };

  // Share functionality
  const handleShareClick = (event) => {
    setShareMenuAnchor(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const handleCopyLink = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${postWithId.id}`;
      await navigator.clipboard.writeText(postUrl);
      setShareMessage('Link copied to clipboard!');
      setShareSnackbar(true);
    } catch (error) {
      setShareMessage('Failed to copy link');
      setShareSnackbar(true);
    }
    handleShareClose();
  };

  const handleShareTo = (platform) => {
    const postUrl = `${window.location.origin}/post/${postWithId.id}`;
    const shareText = `Check out this post by ${user.name}: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`;

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    handleShareClose();
  };

  // Edit/Delete handlers
  const handleMoreMenuClick = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const handleEditClick = () => {
    setEditText(text);
    setEditPrivacy(privacy);
    setEditDialogOpen(true);
    setMoreMenuAnchor(null);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    setMoreMenuAnchor(null);
  };

  // In the edit dialog, map privacy to UI value for Select
  const handleEditSubmit = async () => {
    if (!editText.trim()) return;
    setIsEditing(true);
    try {
      // Map UI value to backend value
      const privacyUIToBackend = (value) => {
        if (value === 'friends') return 'private';
        if (value === 'only me') return 'only me';
        return value;
      };
      await postService.updatePost(postWithId.id, editText.trim(), privacyUIToBackend(editPrivacy));
      setText(editText.trim());
      setPrivacy(privacyUIToBackend(editPrivacy));
      setEditDialogOpen(false);
      setShareSnackbar(true);
      setShareMessage('Post updated successfully!');
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setShareSnackbar(true);
      setShareMessage('Failed to update post. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    console.log('Delete attempt:', {
      postId: postWithId.id,
      postIdType: typeof postWithId.id,
      post: postWithId,
      originalPostId: post.id,
      originalPostIdType: typeof post.id
    });
    setIsDeleting(true);
    try {
      // Always send post ID as a number
      const postIdToDelete = Number(post.id || postWithId.id);
      console.log('Using post ID for deletion:', postIdToDelete, typeof postIdToDelete);
      const response = await postService.deletePost(postIdToDelete);
      console.log('Delete success:', response);
      setDeleteConfirmOpen(false);
      // Show success message
      setShareSnackbar(true);
      setShareMessage('Post deleted successfully!');
      // Immediately remove post from UI (Feed)
      deletePost(postIdToDelete.toString());
      // If onPostDeleted is provided (Profile), call it
      if (onPostDeleted) {
        onPostDeleted(postIdToDelete.toString());
      }
      // Call the callback if provided
      if (onPostUpdated) {
        onPostUpdated();
      }
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      setShareSnackbar(true);
      setShareMessage('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderText = (fullText) => {
    if (!isTextLong || expandedText) {
      return (
        <Typography variant="body1" color={isDarkMode ? '#fff' : '#333'}>
          {fullText}
        </Typography>
      );
    } else {
      return (
        <Typography variant="body1" color={isDarkMode ? '#fff' : '#333'}>
          {fullText.substring(0, MAX_TEXT_LENGTH)}
          {fullText.length > MAX_TEXT_LENGTH && '... '}
          <Box
            component="span"
            onClick={handleSeeMore}
            sx={{
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            See more
          </Box>
        </Typography>
      );
    }
  };

  const renderLocationText = () => {
    if (!location) return null;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1.5
        }}
      >
        <Chip
          icon={<LocationOnIcon sx={{ color: '#e57373 !important' }} />}
          label={location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
          size="small"
          sx={{
            maxWidth: '100%',
            height: 'auto',
            py: 0.5,
            borderRadius: '4px',
            '& .MuiChip-label': {
              whiteSpace: 'normal',
              display: 'block',
              fontSize: '0.75rem',
            }
          }}
        />
        <Tooltip title="View on map">
          <IconButton
            size="small"
            color="primary"
            onClick={handleOpenLocationMap}
            sx={{ ml: 1 }}
          >
            <MapIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const renderLocationMap = (size = 'small') => {
    if (!location || !location.lat || !location.lng) return null;

    const position = [location.lat, location.lng];
    const mapHeight = size === 'small' ? 200 : 400;
    const zoom = size === 'small' ? 13 : 14;

    return (
      <Box
        sx={{
          mt: 2,
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #ddd',
          height: mapHeight,
        }}
      >
        <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
          <MapContainer
            center={position}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={size !== 'small'}
            attributionControl={true}
            dragging={size !== 'small'}
            scrollWheelZoom={size !== 'small'}
            doubleClickZoom={size !== 'small'}
            touchZoom={size !== 'small'}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
          </MapContainer>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              p: 1,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LocationOnIcon sx={{ color: '#e57373', mr: 1, fontSize: '1rem' }} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
              {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderMediaCarousel = () => {
    const currentSrc = processMediaSrc(getCurrentMedia());
    const totalImages = images.length > 0 ? images.length : (Array.isArray(contentSrc) ? contentSrc.length : 1);

    return (
      <Box
        position="relative"
        onClick={handleMediaClick}
        ref={carouselRef}
        sx={{
          overflow: 'hidden',
          width: '100%',
          height: '450px',
          cursor: 'pointer',
          userSelect: 'none', // Prevent text selection on double-click
        }}
      >
        {contentType === 'image' || images.length > 0 ? (
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentImageIndex}
              custom={slideDirection}
              initial={(direction) => {
                return {
                  x: direction === 'next' ? '100%' : '-100%',
                  opacity: 0
                };
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={(direction) => {
                return {
                  x: direction === 'next' ? '-100%' : '100%',
                  opacity: 0
                };
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                component="img"
                src={currentSrc}
                alt={`post content ${currentImageIndex + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <CardMedia
            component="video"
            controls
            src={currentSrc}
            alt="post video"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}

        {/* Navigation arrows for multiple images */}
        {hasMultipleMedia && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleImageNavigation('prev');
              }}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleImageNavigation('next');
              }}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </>
        )}

        {/* Image counter */}
        {hasMultipleMedia && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            {currentImageIndex + 1} / {totalImages}
          </Box>
        )}

        {/* Like animation overlay for small screens */}
        {isSmallScreen && showLikeAnimation && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              animation: 'likePulse 1s ease-out',
              '@keyframes likePulse': {
                '0%': {
                  transform: 'translate(-50%, -50%) scale(0)',
                  opacity: 0,
                },
                '50%': {
                  transform: 'translate(-50%, -50%) scale(1.2)',
                  opacity: 1,
                },
                '100%': {
                  transform: 'translate(-50%, -50%) scale(1)',
                  opacity: 0,
                },
              },
            }}
          >
            <FavoriteIcon
              sx={{
                fontSize: '4rem',
                color: '#ff4757',
                filter: 'drop-shadow(0 0 10px rgba(255, 71, 87, 0.5))',
              }}
            />
          </Box>
        )}

        {/* Small screen hint */}
        {isSmallScreen && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              opacity: 0.8,
            }}
          >
            Double-tap to like
          </Box>
        )}
      </Box>
    );
  };

  // Pass a submit handler to CommentSection that posts to backend
  const handleSubmitComment = async (commentText, comment_parent_id = null) => {
    if (!commentText.trim()) return;
    try {
      const res = await commentService.createComment(postWithId.id, commentText.trim(), comment_parent_id);
      console.log('Create comment response:', res.data);
      const c = res.data?.data;
      const newComment = {
        id: c.id,
        user: c.User?.name || c.user?.name || 'User',
        userId: c.User?.id || c.user_id,
        avatar: c.User?.profile_picture || c.user?.profile_picture || '',
        text: c.description,
        time: c.created_at,
        replies: [],
        likeCount: 0
      };

      if (comment_parent_id) {
        // This is a reply - add it to the parent comment's replies
        setComments(prev => prev.map(comment =>
          comment.id === parseInt(comment_parent_id)
            ? { ...comment, replies: [...comment.replies, newComment] }
            : comment
        ));
      } else {
        // This is a top-level comment
        setComments(prev => [newComment, ...prev]);
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      // Optionally show error
    }
  };

  return (
    <>
      <Card sx={{
        maxWidth: 600,
        margin: 'auto',
        mt: isFirstPost ? 8 : 2,
        mb: 2,
        bgcolor: isDarkMode ? '#242526' : '#fff',
        color: isDarkMode ? '#fff' : '#1c1e21',
        '& .MuiTypography-root': {
          color: isDarkMode ? '#fff' : '#1c1e21'
        },
        '& .MuiIconButton-root': {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b',
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
          }
        }
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={2}>
          <Box display="flex" alignItems="center">
            <ListItemAvatar sx={{ minWidth: 0 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                onClick={() => user?.id && navigate(`/profile/${user.id}`)}
              />
            </ListItemAvatar>
            <Typography
              fontWeight="bold"
              variant="subtitle1"
              ml={1}
              color={isDarkMode ? '#fff' : '#1c1e21'}
              sx={{ cursor: 'pointer' }}
              onClick={() => user?.id && navigate(`/profile/${user.id}`)}
            >
              {user.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            {getPrivacyIcon(privacyUI)}
            <Typography variant="caption" color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b'} ml={1}>
              {timeAgo(time)}
            </Typography>
            {isCurrentUserPost && (
              <IconButton
                size="small"
                onClick={handleMoreMenuClick}
                sx={{
                  ml: 1,
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {(contentType === 'image' || contentType === 'video' || images.length > 0) && (
          <>
            <CardContent sx={{ textAlign: 'left', color: isDarkMode ? '#fff' : '#1c1e21' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {expandedText ? text : renderText(text)}
              </Typography>
              {location && renderLocationText()}
            </CardContent>
            {renderMediaCarousel()}
          </>
        )}

        {contentType === 'text' && images.length === 0 && (
          <CardContent sx={{ textAlign: 'left', color: isDarkMode ? '#fff' : '#1c1e21' }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {expandedText ? text : renderText(text)}
            </Typography>
            {location && renderLocationMap('small')}
          </CardContent>
        )}

        <CardActions disableSpacing>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLike} sx={{
              color: liked ? '#e41e3f' : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b'),
              '&:hover': {
                color: '#e41e3f'
              }
            }}>
              {liked ? <FavoriteIcon sx={{ color: '#e41e3f' }} /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                fontSize: 14,
                mr: 1,
                color: liked ? '#e41e3f' : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b')
              }}
            >
              {likeCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setCommentsOpen(true)} sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b' }}>
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography variant="body2" color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b'} sx={{ fontSize: 14, mr: 1 }}>
              {commentCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleShareClick} sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b' }}>
              <ShareIcon />
            </IconButton>
          </Box>

          <IconButton sx={{ marginLeft: 'auto', color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b' }}
            onClick={handleSavePost}
          >
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>

          {contentType !== 'text' && (
            <IconButton onClick={() => setExpandedView(true)} sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b' }}>
              <OpenInFullIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>

      {/* ExpandView Component - UPDATED WITH LIKE SYNCHRONIZATION */}
      <ExpandView
        open={expandedView}
        onClose={() => setExpandedView(false)}
        post={postWithId}
        isDarkMode={isDarkMode}
        liked={liked}
        likeCount={likeCount}
        isSaved={isSaved}
        slideDirection={slideDirection}
        hasMultipleMedia={hasMultipleMedia}
        hasMedia={hasMedia}
        onLike={handleLike}
        onSave={handleSavePost}
        processMediaSrc={processMediaSrc}
        timeAgo={timeAgo}
        onCommentCountChange={setCommentCount}
        onLocationMap={handleOpenLocationMap}
        comments={comments}
        onCommentsChange={handleCommentsChange}
        commentsOpen={commentsOpen}
        onCommentsOpen={setCommentsOpen}
        // NEW: Like synchronization props
        likedComments={likedComments}
        onLikedCommentsChange={handleLikedCommentsChange}
        likedReplies={likedReplies}
        onLikedRepliesChange={handleLikedRepliesChange}
      />

      {/* Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleShareClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShareTo('twitter')}>
          <ListItemText>Share to Twitter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShareTo('facebook')}>
          <ListItemText>Share to Facebook</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleShareTo('whatsapp')}>
          <ListItemText>Share to WhatsApp</ListItemText>
        </MenuItem>
      </Menu>

      {/* More Options Menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={handleMoreMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ zIndex: 9999 }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Post</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#e41e3f' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#e41e3f' }} />
          </ListItemIcon>
          <ListItemText>Delete Post</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Post Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Post content"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Privacy</InputLabel>
            <Select
              value={privacyBackendToUI(editPrivacy)}
              label="Privacy"
              onChange={(e) => setEditPrivacy(e.target.value)}
            >
              <MenuItem value="public">
                <Box display="flex" alignItems="center">
                  <PublicIcon fontSize="small" sx={{ mr: 1 }} />
                  Public
                </Box>
              </MenuItem>
              <MenuItem value="friends">
                <Box display="flex" alignItems="center">
                  <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                  Friends
                </Box>
              </MenuItem>
              <MenuItem value="only me">
                <Box display="flex" alignItems="center">
                  <LockIcon fontSize="small" sx={{ mr: 1 }} />
                  Only me
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={isEditing || !editText.trim()}
          >
            {isEditing ? 'Updating...' : 'Update Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Snackbar */}
      <Snackbar
        open={shareSnackbar}
        autoHideDuration={3000}
        onClose={() => setShareSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShareSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {shareMessage}
        </Alert>
      </Snackbar>

      {/* Comment Section Dialog (for mobile/regular view) - UPDATED WITH LIKE SYNCHRONIZATION */}
      <CommentSection
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        postId={postWithId.id}
        userName={user.name}
        isDarkMode={isDarkMode}
        onCommentCountChange={setCommentCount}
        comments={comments}
        onCommentsChange={handleCommentsChange}
        onSubmitComment={handleSubmitComment}
        // NEW: Like synchronization props
        likedComments={likedComments}
        onLikedCommentsChange={handleLikedCommentsChange}
        likedReplies={likedReplies}
        onLikedRepliesChange={handleLikedRepliesChange}
      />
    </>
  );
}

export default PostCard;