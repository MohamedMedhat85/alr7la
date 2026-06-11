import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Alert,
  Stack,
  Fab,
  useTheme,
  useMediaQuery,
  Rating
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { placeService } from "../../../services/networkService";
import { useNavigate } from 'react-router-dom';

const CARDS_PER_PAGE = 4;
const CARD_HEIGHT = 400;
const TRANSITION_DURATION = 500;

const TourCard = ({ place }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/place/${place.id}`);
  };
  
  return (
    <Card 
      sx={{ 
        height: CARD_HEIGHT,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
        }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative', height: '220px' }}>
        <CardMedia
          component="img"
          sx={{
            height: '100%',
            objectFit: 'cover'
          }}
          image={place.PlacesImages[0]?.img_url}
          alt={place.name}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Chip 
          label={place.city} 
          size="small"
          sx={{ 
            bgcolor: 'success.light',
            color: 'success.dark',
            mb: 1,
            fontWeight: 500,
            alignSelf: 'flex-start'
          }}
        /> 
        
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1
          }}
        >
          {place.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" mr={1} fontWeight="medium">
            {Number(place.rating).toFixed(1)}
          </Typography>
          <Rating 
            value={Number(place.rating)} 
            precision={0.5} 
            readOnly
            size="small"
            sx={{
              color: 'secondary.main',
              mr: 0.5
            }}
          />
          <Typography variant="body2" color="text.secondary">
            ({new Intl.NumberFormat().format(place.number_of_ratings)})
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 'auto' }}>
          {place.Labels.map((label) => (
            <Chip 
              key={label.id}
              label={label.label_name}
              size="small"
              sx={{ 
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const RecommendedSection = ({ title, subtitle, country = "Greece", isPopular = false }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Responsive cards per view
  const theme = useTheme();
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  let cardsPerView = 1;
  if (isXl) cardsPerView = 4;
  else if (isLg) cardsPerView = 4;
  else if (isMd) cardsPerView = 3;
  else if (isSm) cardsPerView = 2;
  else cardsPerView = 1;

  const totalWidth = 100; // viewport width percentage
  const gapWidth = 3; // percentage gap between cards
  const cardWidth = (totalWidth - (gapWidth * (cardsPerView - 1))) / cardsPerView;
  const slideDistance = cardWidth + gapWidth; // Distance to slide for each card

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        if (isPopular) {
          // Fetch places from all 4 countries for Popular Experiences
          const targetCountries = ['Egypt', 'Turkey', 'Greece', 'Switzerland'];
          const allPlaces = [];
          
          for (const countryName of targetCountries) {
            try {
              const response = await placeService.getPlacesByCountry(countryName);
              allPlaces.push(...response.data);
            } catch (err) {
              console.error(`Failed to load places from ${countryName}:`, err);
            }
          }
          
          // Sort by rating and number of ratings, then take top places
          const sortedPlaces = allPlaces
            .sort((a, b) => {
              if (b.rating !== a.rating) {
                return b.rating - a.rating;
              }
              return b.number_of_ratings - a.number_of_ratings;
            })
            .slice(0, 20); // Limit to top 20 places
          
          setPlaces(sortedPlaces);
        } else {
          // Fetch places from specific country
          const response = await placeService.getPlacesByCountry(country);
          setPlaces(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError(`Failed to load places`);
        setLoading(false);
      }
    };
    
    fetchPlaces();
  }, [country, isPopular]);

  // Adjust currentIndex if cardsPerView changes and would cause overflow
  useEffect(() => {
    if (currentIndex > Math.max(0, places.length - cardsPerView)) {
      setCurrentIndex(Math.max(0, places.length - cardsPerView));
    }
  }, [cardsPerView, places.length]);

  const handleNext = useCallback(() => {
    if (isAnimating || currentIndex >= places.length - cardsPerView) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
  }, [isAnimating, currentIndex, places.length, cardsPerView]);

  const handlePrevious = useCallback(() => {
    if (isAnimating || currentIndex === 0) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
  }, [isAnimating, currentIndex]);

  return (
    <Box sx={{ mb: 6 }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 3 }}>
          {title && (
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: '2rem',
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: '1rem' }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {loading && (
        <Grid container spacing={3}>
          {Array(cardsPerView).fill(0).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={CARD_HEIGHT} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && places.length === 0 && (
        <Alert severity="info">
          No places found in {country}.
        </Alert>
      )}

      {!loading && !error && places.length > 0 && (
        <Box sx={{ position: 'relative', px: 6 }}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: `${gapWidth}%`,
                transition: isAnimating ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
                transform: `translateX(-${currentIndex * slideDistance}%)`,
              }}
            >
              {places.map((place) => (
                <Box
                  key={place.id}
                  sx={{
                    flexShrink: 0,
                    width: `${cardWidth}%`,
                  }}
                >
                  <TourCard place={place} />
                </Box>
              ))}
            </Box>
          </Box>

          {places.length > cardsPerView && (
            <>
              <Fab
                size="medium"
                color="primary"
                aria-label="previous"
                onClick={handlePrevious}
                disabled={isAnimating || currentIndex === 0}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%)',
                  boxShadow: 3,
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  }
                }}
              >
                <NavigateBeforeIcon />
              </Fab>
              <Fab
                size="medium"
                color="primary"
                aria-label="next"
                onClick={handleNext}
                disabled={isAnimating || currentIndex >= places.length - cardsPerView}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translateY(-50%)',
                  boxShadow: 3,
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  }
                }}
              >
                <NavigateNextIcon />
              </Fab>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RecommendedSection;