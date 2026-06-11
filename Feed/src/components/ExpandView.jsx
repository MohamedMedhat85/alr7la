/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react';
import {
  Avatar,
  Box,
  Dialog,
  Typography,
  IconButton,
  ListItemAvatar,
  Chip,
  Tooltip,
  CardMedia,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import LinkIcon from '@mui/icons-material/Link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import CommentSection from './Comment';

const ExpandView = ({
  open,
  onClose,
  post,
  isDarkMode,
  liked,
  likeCount,
  isSaved,
  currentImageIndex: initialImageIndex = 0,
  slideDirection,
  onLike,
  onSave,
  processMediaSrc,
  timeAgo,
  onCommentCountChange,
  onLocationMap,
  comments,
  onCommentsChange,
  commentsOpen,
  onCommentsOpen,
  // NEW: Like synchronization props
  likedComments,
  onLikedCommentsChange,
  likedReplies,
  onLikedRepliesChange
}) => {
  const { user, time, contentType, contentSrc, text, privacy, location } = post;
  
  // Share functionality states
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  // Determine the array of media (images/videos) to display
  const mediaArray = React.useMemo(() => {
    if (Array.isArray(post.images) && post.images.length > 0) {
      // Map to image_url or url for each image object
      return post.images.map(img => img.image_url || img.url).filter(Boolean);
    }
    if (Array.isArray(post.contentSrc)) {
      return post.contentSrc;
    }
    if (post.contentSrc) {
      return [post.contentSrc];
    }
    return [];
  }, [post.images, post.contentSrc]);

  // Add state for current image index
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  useEffect(() => { setCurrentIndex(initialImageIndex); }, [initialImageIndex]);

  // FIXED: Simplified like state management - use parent states directly
  const handleLikedCommentsChange = (newLikedComments) => {
    if (onLikedCommentsChange) {
      onLikedCommentsChange(newLikedComments);
    }
  };

  const handleLikedRepliesChange = (newLikedReplies) => {
    if (onLikedRepliesChange) {
      onLikedRepliesChange(newLikedReplies);
    }
  };

  const getCurrentMedia = () => {
    if (mediaArray.length === 0) return null;
    return mediaArray[currentIndex];
  };

  const getPrivacyIcon = (privacyLevel = privacy) => {
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

  // Share functionality
  const handleShareClick = (event) => {
    setShareMenuAnchor(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const handleCopyLink = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${post.id}`;
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
    const postUrl = `${window.location.origin}/post/${post.id}`;
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

  const renderLocationMap = (size = 'large') => {
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

  // Navigation handlers
  const handlePrev = () => {
    if (mediaArray.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? mediaArray.length - 1 : prev - 1));
  };
  const handleNext = () => {
    if (mediaArray.length === 0) return;
    setCurrentIndex((prev) => (prev === mediaArray.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open || mediaArray.length === 0) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, mediaArray.length]);

  // Touch/swipe support
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    if (mediaArray.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (mediaArray.length === 0 || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) handlePrev();
      else handleNext();
    }
    touchStartX.current = null;
  };

  // FIXED: Comments section with proper alignment to match header spacing
  const renderExpandedComments = () => {
    return (
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        px: 3, // ADDED padding to align comments with content above
        pb: 0  // REMOVED bottom padding
      }}>
        <CommentSection
          open={true}
          onClose={() => {}}
          postId={post.id}
          userName={user.name}
          isDarkMode={isDarkMode}
          onCommentCountChange={onCommentCountChange}
          comments={comments}
          onCommentsChange={onCommentsChange}
          isEmbedded={true}
          // FIXED: Use parent states directly to avoid circular updates
          likedComments={likedComments}
          onLikedCommentsChange={handleLikedCommentsChange}
          likedReplies={likedReplies}
          onLikedRepliesChange={handleLikedRepliesChange}
          // NEW: Add expandView prop to handle different styling
          isExpandView={true}
          // CRITICAL: Pass consistent spacing values to CommentSection
          headerSpacing={{
            paddingLeft: 2, // Same as header section px: 2
            paddingRight: 2, // Same as header section px: 2
            avatarMarginLeft: 2, // Same as header ml: 2 for the Box after ListItemAvatar
            avatarSize: 40, // Same as header Avatar size
          }}
        />
      </Box>
    );
  };

  const renderMediaCarousel = () => {
    const currentSrc = processMediaSrc(getCurrentMedia());
    return (
      <Box
        position="relative"
        sx={{ 
          overflow: 'hidden',
          width: '100%', 
          height: '100%',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mediaArray.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                bgcolor: 'rgba(0,0,0,0.4)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
              aria-label="Previous photo"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                bgcolor: 'rgba(0,0,0,0.4)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
              }}
              aria-label="Next photo"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
        {contentType === 'image' ? (
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentIndex}
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
                alt={`post content ${currentIndex + 1}`}
                sx={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: 'transparent'
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
              objectFit: 'cover'
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <>
      {/* Expanded View Dialog */}
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth={false} 
        PaperProps={{ 
          sx: { 
            width: '90vw', 
            height: '90vh', 
            margin: '20px auto', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            display: 'flex', 
            backgroundColor: isDarkMode ? '#000' : '#fff', 
          }, 
        }} 
        BackdropProps={{ 
          sx: { 
            backdropFilter: 'blur(8px)', 
            backgroundColor: 'rgba(0,0,0,0.9)', 
          }, 
        }} 
      >
        <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
          {/* Media Section - FULL HEIGHT */}
          <Box sx={{ 
            flex: contentType === 'text' ? '0 0 0%' : '1 1 65%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#000', 
            position: 'relative',
            height: '100%' // ENSURE FULL HEIGHT
          }}>
            {contentType !== 'text' && renderMediaCarousel()}
          </Box>

          {/* Comments and Info Section */}
          <Box sx={{ 
            flex: contentType === 'text' ? '1 1 100%' : '1 1 35%',  
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: isDarkMode ? '#242526' : '#fff',
            borderLeft: contentType !== 'text' ? `1px solid ${isDarkMode ? '#333' : '#ddd'}` : 'none',
            height: '100%' // ENSURE FULL HEIGHT
          }}>
            {/* Header Section - CONSISTENT SPACING: px: 2 */}
            <Box sx={{ 
              p: 2, // MAIN PADDING - this sets the standard
              borderBottom: `1px solid ${isDarkMode ? '#333' : '#ddd'}`, 
              display: 'flex', 
              alignItems: 'center',
              flexShrink: 0 // PREVENT SHRINKING
            }}>
              <ListItemAvatar>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 40, height: 40 }} // AVATAR SIZE - passed to CommentSection
                />
              </ListItemAvatar>
              <Box sx={{ ml: 2 }}> {/* MARGIN LEFT - passed to CommentSection */}
                <Typography variant="subtitle1" fontWeight="bold" color={isDarkMode ? '#fff' : '#1c1e21'}>
                  {user.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b'}>
                    {timeAgo(time)}
                  </Typography>
                  {getPrivacyIcon(privacy)}
                </Box>
              </Box>
              <IconButton 
                sx={{ ml: 'auto', color: isDarkMode ? '#fff' : '#65676b' }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Post Content Section - CONSISTENT SPACING: px: 2 */}
            <Box sx={{ 
              p: 2, // SAME PADDING as header
              borderBottom: `1px solid ${isDarkMode ? '#333' : '#ddd'}`,
              flexShrink: 0 // PREVENT SHRINKING
            }}>
              <Typography variant="body1" color={isDarkMode ? '#fff' : '#1c1e21'}>
                {text}
              </Typography>
              
              {mediaArray.length > 1 && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b'} fontWeight="medium">
                    {currentIndex + 1} of {mediaArray.length} photos
                  </Typography>
                </Box>
              )}
              
              {location && (
                <Box sx={{ mt: 2 }}>
                  {mediaArray.length > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        icon={<LocationOnIcon sx={{ color: '#e57373 !important' }}/>}
                        label={location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                        size="small"
                        sx={{
                          maxWidth: '90%', 
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
                          onClick={onLocationMap}
                          sx={{ ml: 1 }}
                        >
                          <MapIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    renderLocationMap('large')
                  )}
                </Box>
              )}
            </Box>

            {/* Action Buttons Section - CONSISTENT SPACING: p: 1 (but different for buttons) */}
            <Box sx={{ 
              display: 'flex', 
              p: 1, // Slightly less padding for buttons section
              borderBottom: `1px solid ${isDarkMode ? '#333' : '#ddd'}`,
              flexShrink: 0 // PREVENT SHRINKING
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={onLike} sx={{ color: liked ? '#e41e3f' : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b') }}>
                  {liked ? <FavoriteIcon sx={{ color: '#e41e3f' }} /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b'}>
                  {likeCount}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleShareClick} sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b' }}>
                  <ShareIcon />
                </IconButton>
              </Box>
              <IconButton 
                sx={{ marginLeft: 'auto', color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#65676b' }} 
                onClick={onSave}
              >
                {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Box>

            {/* Comments Section - NO PADDING, let CommentSection handle alignment */}
            {renderExpandedComments()}
          </Box>
        </Box>
      </Dialog>

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
    </>
  );
};

export default ExpandView;