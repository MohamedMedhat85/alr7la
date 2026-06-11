// MajorCities/MajorCities.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  IconButton,
  Skeleton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
  Zoom,
  CardActionArea
} from '@mui/material';
import { 
  Explore as ExploreIcon,
  LocalAirport as AirportIcon,
  DirectionsWalk as WalkIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  LocationCity as LocationCityIcon
} from '@mui/icons-material';

// City Card Component
const CityCard = ({ city, index, onPlaceClick }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [favorite, setFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setFavorite(!favorite);
  };
  
  const handleCardClick = () => {
    if (onPlaceClick && city.id) {
      onPlaceClick(city);
    }
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card 
        elevation={3}
        sx={{
          height: 460,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px -5px rgba(0,0,0,0.2)',
          }
        }}
      >
        <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 0 }}>
          <Box sx={{ position: 'relative' }}>
            {!imageLoaded && (
              <Skeleton 
                variant="rectangular" 
                height={220} 
                width="100%" 
                animation="wave" 
              />
            )}
            <CardMedia
              component="img"
              height={220}
              image={city.imageUrl}
              alt={city.name}
              onLoad={handleImageLoad}
              sx={{
                display: imageLoaded ? 'block' : 'none',
                objectFit: 'cover',
                objectPosition: 'center',
                height: 220
              }}
            />
            <IconButton
              onClick={handleFavoriteClick}
              aria-label={favorite ? "remove from favorites" : "add to favorites"}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              {favorite ? 
                <FavoriteIcon color="error" /> : 
                <FavoriteBorderIcon />
              }
            </IconButton>
            {city.isCapital && (
              <Chip
                icon={<LocationCityIcon sx={{ fontSize: '16px !important' }} />}
                label="Capital"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            )}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                color: 'white',
                p: 2,
                pt: 3
              }}
            >
              <Typography variant="h5" component="h3" sx={{ fontWeight: 700, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                {city.name}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
        
        <CardContent sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <StarIcon sx={{ color: '#FFC107', fontSize: 20, mr: 0.5 }} />
              <Typography variant="body2" fontWeight="medium">
                {city.rating}/5
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {city.population.toLocaleString()} inhabitants
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
            {city.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {city.airport && (
              <Tooltip title="Has international airport">
                <Chip
                  icon={<AirportIcon fontSize="small" />}
                  label={isXs ? "" : "Airport"}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 12 }}
                />
              </Tooltip>
            )}
            
            {city.walkable && (
              <Tooltip title="Walkable city center">
                <Chip
                  icon={<WalkIcon fontSize="small" />}
                  label={isXs ? "" : "Walkable"}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 12 }}
                />
              </Tooltip>
            )}
            
            {city.tags && city.tags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: 12 }}
              />
            ))}
          </Box>
        </CardContent>
        
        <Divider />
        
        <CardActions>
          <Button 
            size="medium" 
            color="primary"
            endIcon={<ArrowForwardIcon />}
            fullWidth
            sx={{ 
              justifyContent: 'space-between',
              py: 1
            }}
            onClick={() => onPlaceClick(city)}
          >
            Explore {city.name}
          </Button>
        </CardActions>
      </Card>
    </Zoom>
  );
};

// Main MajorCities Component
const MajorCities = ({ country = {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handlePlaceClick = (place) => {
    navigate(`/place/${place.id}`);
  };
  
  // Default cities if none provided
  const defaultCities = [
    {
      name: "Tokyo",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      description: "Japan's bustling capital, mixing ultramodern and traditional, from neon-lit skyscrapers to historic temples.",
      population: 13960000,
      isCapital: true,
      rating: 4.8,
      airport: true,
      walkable: true,
      tags: ["Shopping", "Food"]
    },
    {
      name: "Kyoto",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      description: "Former capital city known for its classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.",
      population: 1475000,
      isCapital: false,
      rating: 4.9,
      airport: false,
      walkable: true,
      tags: ["Historic", "Temples"]
    },
    {
      name: "Osaka",
      imageUrl: "https://images.unsplash.com/photo-1589452271712-64b8e0435613",
      description: "A large port city known for its modern architecture, nightlife and hearty street food.",
      population: 2691000,
      isCapital: false,
      rating: 4.6,
      airport: true,
      walkable: true,
      tags: ["Food", "Nightlife"]
    },
    {
      name: "Hiroshima",
      imageUrl: "https://images.unsplash.com/photo-1575862924838-c846bef945d2",
      description: "A modern city known for its Peace Memorial Park, commemorating the 1945 atomic bomb event.",
      population: 1194000,
      isCapital: false,
      rating: 4.7,
      airport: true,
      walkable: true,
      tags: ["Historic", "Memorial"]
    }
  ];
  
  // Use places from backend if available, otherwise show empty state
  const cities = country.places && country.places.length > 0 
    ? country.places.slice(0, 4).map(place => ({  // Changed back to 4 for homepage
        id: place.id, // Include the place ID for navigation
        name: place.name,
        imageUrl: place.images && place.images.length > 0 
          ? place.images[0] 
          : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf", // Fallback image
        description: `Explore ${place.name}, a beautiful place in ${country.name}`,
        population: 1000000, // Default population
        isCapital: false,
        rating: place.rating || 4.5,
        airport: true,
        walkable: true,
        tags: place.labels && place.labels.length > 0 ? place.labels : ["City", "Travel"]
      }))
    : [];
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ExploreIcon sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 1.5 }} />
        <Typography variant="h4" component="h2" fontWeight="bold">
          Top Places
        </Typography>
      </Box>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Discover the top destinations and attractions in {country.name || "this country"} and find your perfect adventure.
        {country.places && country.places.length > 0 && (
          <span> Found {country.places.length} places to explore!</span>
        )}
      </Typography>
      
      {cities.length > 0 ? (
        <Grid container spacing={3}>
          {cities.map((city, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <CityCard city={city} index={index} onPlaceClick={handlePlaceClick} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No places data available for {country.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for updated information about places and attractions.
          </Typography>
        </Box>
      )}
      
      {cities.length > 4 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="primary"
            endIcon={<ArrowForwardIcon />}
            size="large"
          >
            View All Cities
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MajorCities;