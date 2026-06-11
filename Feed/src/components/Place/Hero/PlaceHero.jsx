import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Rating,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Share as ShareIcon,
  BookmarkBorder as BookmarkBorderIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';

const PlaceHero = ({ place }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = place.PlacesImages || [];
  const currentImage = images[currentImageIndex] || { img_url: 'https://via.placeholder.com/1200x600?text=No+Image' };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      {/* Hero Image */}
      <Box
        sx={{
          height: { xs: '300px', md: '500px' },
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 0, md: 2 },
          mx: { xs: 0, md: 2 },
          mt: { xs: 0, md: 2 }
        }}
      >
        <Box
          component="img"
          src={currentImage.img_url}
          alt={place.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        />
        
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          }}
        />
        
        {/* Action Buttons */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <BookmarkBorderIcon />
          </IconButton>
        </Box>
        
        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleImageChange(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'white',
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Content Overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2, md: 4 },
          color: 'white',
        }}
      >
        <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
          {/* Place Name and Rating */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {place.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={place.rating ? parseFloat(place.rating) : 0}
                precision={0.1}
                readOnly
                size="large"
                sx={{ mr: 2, color: 'white' }}
              />
              <Typography variant="h6" sx={{ mr: 1 }}>
                {place.rating || '0.0'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ({place.number_of_ratings || 0} reviews)
              </Typography>
            </Box>
          </Box>

          {/* Location and Labels */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {place.city}, {place.country}
              </Typography>
            </Box>
            
            {place.Labels && place.Labels.map((label) => (
              <Chip
                key={label.id}
                label={label.label_name}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaceHero; 