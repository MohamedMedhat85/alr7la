// Hero/Hero.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  IconButton, 
  Chip, 
  Avatar,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Paper,
  Rating
} from '@mui/material';
import { 
  Flight as FlightIcon, 
  Public as PublicIcon, 
  Language as LanguageIcon, 
  AccessTime as AccessTimeIcon, 
  LocalAtm as LocalAtmIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  ArrowBackIos as ArrowBackIosIcon,
  Hotel as HotelIcon,
  DirectionsCar as DirectionsCarIcon,
  Restaurant as RestaurantIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Hero = ({ country = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scrollIndicator, setScrollIndicator] = useState(true);
  const navigate = useNavigate();
  
  // Default values if country object is incomplete
  const countryName = country.name || "This Country";
  const region = country.continent || "Unknown";
  const languages = country.language ? [country.language] : ["Local"];
  const timezones = country.time_zone ? [country.time_zone] : ["Local Time"];
  const currencies = country.currencies || [{ name: "Local Currency", code: "LOC" }];
  const flagUrl = country.flagUrl || "https://flagcdn.com/xx.svg";
  
  // Get hero image from places if available, otherwise use default
  const getHeroImage = () => {
    if (country.places && country.places.length > 0) {
      // Find the first place with images
      const placeWithImage = country.places.find(place => 
        place.images && place.images.length > 0
      );
      if (placeWithImage) {
        return placeWithImage.images[0];
      }
    }
    return "https://images.unsplash.com/photo-1492571350019-22de08371fd3";
  };
  
  const imageUrl = getHeroImage();
  const rating = country.rating || 4.5;
  const capital = country.capital || null;
  const description = country.summary || `Welcome to ${countryName}, a beautiful country with rich culture and history.`;

  // DEBUG: Log the country object to verify fields
  useEffect(() => {
    console.log('Hero country data:', country);
  }, [country]);
  
  // Load animation effect
  useEffect(() => {
    setLoaded(true);
    
    // Hide scroll indicator after 5 seconds
    const timer = setTimeout(() => {
      setScrollIndicator(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle bookmark toggle
  const toggleSaved = () => {
    setSaved(!saved);
  };
  
  // Format description
  const formattedDescription = description.split('.')[0] + '.';
  
  // Get additional images for slideshow effect
  const getAdditionalImages = () => {
    const placeImages = [];
    
    if (country.places && country.places.length > 0) {
      // Collect images from different places
      country.places.forEach(place => {
        if (place.images && place.images.length > 0) {
          placeImages.push(...place.images.slice(0, 2)); // Take up to 2 images per place
        }
      });
      
      // Return unique images (up to 3 additional ones)
      return [...new Set(placeImages)].slice(0, 3);
    }
    
    // Fallback to default images
    return [
      "https://images.unsplash.com/photo-1528164344705-47542687000d",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9"
    ];
  };
  
  const additionalImages = getAdditionalImages();
  
  // Image slideshow effect
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [imageUrl, ...additionalImages];
  
  // Auto-advance slideshow
  useEffect(() => {
    if (images.length <= 1) return; // Don't auto-advance if only one image
    
    console.log('Starting auto-slide with', images.length, 'images');
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        console.log('Auto-sliding from', prevIndex, 'to', nextIndex);
        return nextIndex;
      });
    }, 6000); // Reduced to 6 seconds for more frequent slides
    
    return () => {
      console.log('Clearing auto-slide interval');
      clearInterval(interval);
    };
  }, [images.length, images]); // Added images dependency
  
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '80vh' },
        overflow: 'hidden',
        mb: 6,
      }}
    >
      {/* Background images with crossfade effect */}
      {images.map((img, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 1.5s ease-in-out',
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: 0,
          }}
        />
      ))}
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          {/* Image indicators */}
          <Fade in={loaded} timeout={1200}>
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                display: 'flex',
                gap: 1
              }}
            >
              {images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.8)',
                    }
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </Box>
          </Fade>
        </>
      )}
      
      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1
        }}
      />
      
      {/* Main content */}
      <Container 
        maxWidth="xl"
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          zIndex: 2,
          pb: 6
        }}
      >
        <Slide direction="up" in={loaded} timeout={800}>
          <Box>
            {/* Country name with flag */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={flagUrl} 
                alt={`${countryName} flag`}
                sx={{ 
                  width: { xs: 60, md: 90 }, 
                  height: { xs: 60, md: 90 },
                  border: '3px solid white',
                  mr: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              />
              <Typography 
                variant={isMobile ? "h3" : "h1"} 
                component="h1"
                sx={{ 
                  fontWeight: 800,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                  color: 'white',
                  letterSpacing: '-0.5px'
                }}
              >
                {countryName}
              </Typography>
            </Box>
            
            {/* Description */}
            <Fade in={loaded} timeout={1200}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ 
                  maxWidth: '800px',
                  mb: 3,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                  color: 'white',
                  fontWeight: isMobile ? 400 : 500,
                  lineHeight: 1.4
                }}
              >
                {formattedDescription}
              </Typography>
            </Fade>
            
            {/* Info chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Fade in={loaded} timeout={1400}>
                <Chip 
                  icon={<PublicIcon />} 
                  label={`Region: ${region}`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)',
                    }
                  }}
                />
              </Fade>
              {capital && (
                <Fade in={loaded} timeout={1600}>
                  <Chip 
                    icon={<PublicIcon />} 
                    label={`Capital: ${capital}`}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      color: 'text.primary',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,1)',
                      }
                    }}
                  />
                </Fade>
              )}
              <Fade in={loaded} timeout={1800}>
                <Chip 
                  icon={<LanguageIcon />} 
                  label={`Language: ${languages[0]}`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)',
                    }
                  }}
                />
              </Fade>
              <Fade in={loaded} timeout={2000}>
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label={`Timezone: ${timezones[0]}`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)',
                    }
                  }}
                />
              </Fade>
              <Fade in={loaded} timeout={2200}>
                <Chip 
                  icon={<LocalAtmIcon />} 
                  label={`Currency: ${currencies[0]?.code || ''}`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,1)',
                    }
                  }}
                />
              </Fade>
            </Box>
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Fade in={loaded} timeout={2400}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<ExploreIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    px: 3,
                    py: 1.5,
                    borderRadius: '28px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => navigate('/discover')}
                >
                  Discover Another Country
                </Button>
              </Fade>
            </Box>
          </Box>
        </Slide>
      </Container>
      
      {/* Scroll indicator */}
      <Fade in={scrollIndicator} timeout={2000}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            opacity: 0.8
          }}
        >
          <Typography variant="caption" sx={{ mb: 1, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Scroll to explore
          </Typography>
          <ArrowDownwardIcon 
            sx={{ 
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                '40%': { transform: 'translateY(-10px)' },
                '60%': { transform: 'translateY(-5px)' }
              }
            }} 
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default Hero;