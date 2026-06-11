import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Skeleton,
  Alert,
  Stack
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { placeService } from "../../../services/networkService";
import { useNavigate } from 'react-router-dom';

// Add keyframes for fadeIn animation
const fadeInKeyframes = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const DestinationCard = ({ destination }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/place/${destination.id}`);
  };
  
  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
      onClick={handleCardClick}
    >
      <Box 
        sx={{ 
          position: 'relative',
          width: { xs: '100%', sm: '40%' },
          minHeight: { xs: 200, sm: 'auto' }
        }}
      >
        <CardMedia
          component="img"
          image={destination.PlacesImages[0]?.img_url}
          alt={destination.name}
          sx={{ 
            height: '100%',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'white',
            '&:hover': {
              bgcolor: 'white'
            }
          }}
          onClick={toggleFavorite}
        >
          {isFavorite ? 
            <FavoriteIcon color="primary" /> : 
            <FavoriteBorderIcon />
          }
        </IconButton>
      </Box>
      
      <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            {destination.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {destination.city}, {destination.Country.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Rating: {destination.rating} ({new Intl.NumberFormat().format(destination.number_of_ratings)} reviews)
          </Typography>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {destination.Labels.map((label) => (
              <Chip 
                key={label.id} 
                label={label.label_name} 
                sx={{ 
                  my: 0.5, 
                  bgcolor: 'background.default',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

const TrendingPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await placeService.getAllPlaces();
        setPlaces(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trending places');
        setLoading(false);
      }
    };
    
    fetchPlaces();
  }, []);
  
  return (
    <Box sx={{ mb: 6 }}>
      {/* Add keyframes style */}
      <style>{fadeInKeyframes}</style>
      
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        fontWeight="bold"
        sx={{ mb: 3 }}
      >
        Must-visit trending places
      </Typography>
      
      {loading && (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!loading && !error && (
        <Grid container spacing={3}>
          {places.map((place, index) => (
            <Grid 
              item 
              xs={12} 
              md={6} 
              key={place.id}
              sx={{ 
                opacity: 1,
                animation: `fadeIn 0.5s ease-out forwards`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <DestinationCard destination={place} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TrendingPlaces;