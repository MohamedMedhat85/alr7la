import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

const PlacePhotos = ({ place, preview = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = place.PlacesImages || [];
  
  // If no images, show placeholder
  if (images.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Photos
        </Typography>
        <Box
          sx={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <PhotoCameraIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No photos available for this place
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  const handleImageClick = (image, index) => {
    setSelectedImage({ ...image, index });
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    if (selectedImage && selectedImage.index < images.length - 1) {
      setSelectedImage({ ...images[selectedImage.index + 1], index: selectedImage.index + 1 });
    }
  };

  const handlePrevImage = () => {
    if (selectedImage && selectedImage.index > 0) {
      setSelectedImage({ ...images[selectedImage.index - 1], index: selectedImage.index - 1 });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleCloseLightbox();
    } else if (event.key === 'ArrowRight') {
      handleNextImage();
    } else if (event.key === 'ArrowLeft') {
      handlePrevImage();
    }
  };

  // For preview mode, show only first 4 images
  const displayImages = preview ? images.slice(0, 4) : images;

  return (
    <>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Photos {preview && `(${images.length} total)`}
        </Typography>
        
        <Grid container spacing={2}>
          {displayImages.map((image, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={preview ? 6 : 4} 
              lg={preview ? 3 : 3} 
              key={index}
            >
              <Card
                sx={{
                  height: preview ? 200 : 250,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={() => handleImageClick(image, index)}
              >
                <CardMedia
                  component="img"
                  height="100%"
                  image={image.img_url}
                  alt={`${place.name} - Photo ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {preview && images.length > 4 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              +{images.length - 4} more photos
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        maxWidth={false}
        fullScreen={isMobile}
        onKeyDown={handleKeyDown}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            boxShadow: 'none',
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {/* Close Button */}
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation Buttons */}
          {selectedImage && selectedImage.index > 0 && (
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
          )}

          {selectedImage && selectedImage.index < images.length - 1 && (
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          )}

          {/* Image */}
          {selectedImage && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                p: 2
              }}
            >
              <Box
                component="img"
                src={selectedImage.img_url}
                alt={`${place.name} - Photo ${selectedImage.index + 1}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}

          {/* Image Counter */}
          {selectedImage && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                px: 2,
                py: 1,
                borderRadius: 1,
                zIndex: 1
              }}
            >
              <Typography variant="body2">
                {selectedImage.index + 1} of {images.length}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlacePhotos; 