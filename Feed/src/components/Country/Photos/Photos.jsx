// Photos/Photos.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  IconButton, 
  Modal, 
  Fade, 
  Backdrop, 
  Skeleton,
  Paper,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  PhotoLibrary as PhotoLibraryIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Individual Photo Component
const PhotoItem = ({ photo, index, handleOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Fixed dimensions for all boxes
  const cardHeight = 220;

  return (
    <Card 
      elevation={2}
      sx={{
        position: 'relative',
        height: `${cardHeight}px`,
        width: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          '& .zoom-overlay': {
            opacity: 1
          }
        }
      }}
      onClick={() => handleOpen(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            height: `${cardHeight}px`,
            width: '100%'
          }}
        />
      )}
      <CardMedia
        component="img"
        image={photo.imageUrl}
        alt={photo.title || 'Travel photo'}
        sx={{
          height: `${cardHeight}px`,
          width: '100%',
          objectFit: 'cover',
          display: loaded ? 'block' : 'none',
          background: '#f5f5f5'
        }}
        onLoad={() => setLoaded(true)}
      />
      
      {/* Hover Overlay */}
      <Box
        className="zoom-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.4)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <IconButton
          aria-label="zoom"
          sx={{
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
            }
          }}
        >
          <ZoomInIcon />
        </IconButton>
      </Box>
      
      {/* Caption overlay */}
      {photo.title && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1.5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            color: 'white',
            opacity: hovered ? 1 : 0.8,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            maxHeight: '60%', // ensure overlay doesn't add height
            overflow: 'hidden'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 500, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {photo.title}
          </Typography>
          {photo.location && (
            <Typography variant="caption" component="div" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              {photo.location}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

// Photo Viewer Modal Component
const PhotoModal = ({ open, handleClose, currentIndex, photos, setCurrentIndex }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [favorite, setFavorite] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const handlePrev = (e) => {
    e.stopPropagation();
    setLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photos.length - 1));
  };
  
  const handleNext = (e) => {
    e.stopPropagation();
    setLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex < photos.length - 1 ? prevIndex + 1 : 0));
  };
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    setFavorite(!favorite);
  };
  
  // Reset loaded state when photo changes
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          handlePrev(e);
          break;
        case 'ArrowRight':
          handleNext(e);
          break;
        case 'Escape':
          handleClose();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handlePrev, handleNext, handleClose]);
  
  if (!open || !photos[currentIndex]) return null;
  
  const currentPhoto = photos[currentIndex];
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: fullScreen ? '100%' : 'auto',
            height: fullScreen ? '100%' : 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            overflow: 'hidden',
            borderRadius: fullScreen ? 0 : 2
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          {/* Photo Display */}
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {!loaded && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: fullScreen ? '100vh' : '60vh',
                bgcolor: 'grey.100'
              }}>
                <CircularProgress />
              </Box>
            )}
            
            <img
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title || 'Photo'}
              style={{
                width: '100%',
                height: fullScreen ? '100vh' : '60vh',
                objectFit: 'contain',
                display: loaded ? 'block' : 'none'
              }}
              onLoad={() => setLoaded(true)}
            />
            
            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  onClick={handlePrev}
                  aria-label="previous photo"
                >
                  <NavigateBeforeIcon />
                </IconButton>
                
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 16,
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                  onClick={handleNext}
                  aria-label="next photo"
                >
                  <NavigateNextIcon />
                </IconButton>
                
                {/* Photo Counter */}
                <Chip
                  label={`${currentIndex + 1} / ${photos.length}`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    backdropFilter: 'blur(4px)'
                  }}
                />
              </>
            )}
          </Box>
          
          {/* Photo Description */}
          {currentPhoto.title && (
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                {currentPhoto.title}
              </Typography>
              {currentPhoto.location && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentPhoto.location}
                </Typography>
              )}
              {currentPhoto.description && (
                <Typography variant="body1">
                  {currentPhoto.description}
                </Typography>
              )}
              {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentPhoto.tags.map((tag, idx) => (
                    <Chip 
                      key={idx} 
                      label={tag} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontSize: 12 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Fade>
    </Modal>
  );
};

// Main Photos Component with Infinite Scrolling
const Photos = ({ country = {} }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePhotos, setVisiblePhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const photosPerPage = 12; // Load 12 photos at a time
  
  // Collect all photos from places
  const getAllPhotos = useCallback(() => {
    const allPhotos = [];
    
    if (country.places && country.places.length > 0) {
      country.places.forEach(place => {
        if (place.images && place.images.length > 0) {
          place.images.forEach((imageUrl, imageIndex) => {
            allPhotos.push({
              imageUrl: imageUrl,
              title: `${place.name}${place.images.length > 1 ? ` - Photo ${imageIndex + 1}` : ''}`,
              location: `${place.city || place.name}, ${country.name}`,
              description: `Beautiful photo from ${place.name}`,
              tags: place.labels || ['Travel', 'Destination']
            });
          });
        }
      });
    }
    
    return allPhotos;
  }, [country.places, country.name]);
  
  // Initialize with first batch of photos
  useEffect(() => {
    const allPhotos = getAllPhotos();
    if (allPhotos.length > 0) {
      const initialPhotos = allPhotos.slice(0, photosPerPage);
      setVisiblePhotos(initialPhotos);
      setHasMore(allPhotos.length > photosPerPage);
    }
  }, [getAllPhotos]);
  
  // Load more photos function
  const loadMorePhotos = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const allPhotos = getAllPhotos();
      const nextIndex = currentPhotoIndex + photosPerPage;
      const nextPhotos = allPhotos.slice(nextIndex, nextIndex + photosPerPage);
      
      setVisiblePhotos(prev => [...prev, ...nextPhotos]);
      setCurrentPhotoIndex(nextIndex);
      setHasMore(nextIndex + photosPerPage < allPhotos.length);
      setLoading(false);
    }, 500);
  }, [currentPhotoIndex, loading, hasMore, getAllPhotos]);
  
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading) {
            loadMorePhotos();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const sentinel = document.getElementById('photo-scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }
    
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMorePhotos, hasMore, loading]);
  
  const allPhotos = getAllPhotos();
  
  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <PhotoLibraryIcon sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 1.5 }} />
        <Typography variant="h4" component="h2" fontWeight="bold">
          Photo Gallery
        </Typography>
      </Box>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Explore the beauty of {country.name || "this country"} through stunning photos from all our places.
        {visiblePhotos.length > 0 && (
          <span> Showing {visiblePhotos.length} of {allPhotos.length} photos.</span>
        )}
      </Typography>
      
      {visiblePhotos.length > 0 ? (
        <Box sx={{ 
          maxHeight: '70vh', 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}>
          <Grid container spacing={2}>
            {visiblePhotos.map((photo, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={3}
                key={index}
              >
                <PhotoItem 
                  photo={photo}
                  index={index}
                  handleOpen={handleOpen}
                />
              </Grid>
            ))}
          </Grid>
          
          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
            </Box>
          )}
          
          {/* End of content indicator */}
          {!hasMore && visiblePhotos.length > 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                You've reached the end! All {allPhotos.length} photos have been loaded.
              </Typography>
            </Box>
          )}
          
          {/* Scroll sentinel for infinite scroll */}
          <Box 
            id="photo-scroll-sentinel"
            sx={{ height: '20px', width: '100%' }}
          />
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No photos available for {country.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for updated photo gallery.
          </Typography>
        </Box>
      )}
      
      {/* Photo Modal */}
      <PhotoModal
        open={open}
        handleClose={handleClose}
        currentIndex={currentIndex}
        photos={visiblePhotos}
        setCurrentIndex={setCurrentIndex}
      />
    </Box>
  );
};

export default Photos;