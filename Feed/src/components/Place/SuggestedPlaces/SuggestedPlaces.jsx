import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SuggestedPlaces = ({ places }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!places || places.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No other places found in this country.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {places.map((place) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={place.id}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }
            }}
          >
            {/* Place Image */}
            <CardMedia
              component="img"
              image={place.PlacesImages && place.PlacesImages.length > 0 
                ? place.PlacesImages[0].img_url 
                : 'https://via.placeholder.com/400x220?text=No+Image'}
              alt={place.name}
              sx={{
                height: 220,
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: '#f5f5f5',
              }}
            />
            
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              {/* Place Name */}
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.2,
                  height: '2.4em'
                }}
              >
                {place.name}
              </Typography>
              
              {/* Location */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {place.city}
                </Typography>
              </Box>
              
              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={place.rating ? parseFloat(place.rating) : 0}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {place.rating} ({place.number_of_ratings || 0})
                </Typography>
              </Box>
              
              {/* Labels/Categories */}
              <Box sx={{ mb: 3 }}>
                {place.Labels && place.Labels.slice(0, 2).map((label) => (
                  <Chip
                    key={label.id}
                    label={label.label_name}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
                {place.Labels && place.Labels.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{place.Labels.length - 2} more
                  </Typography>
                )}
              </Box>
              
              {/* View Details Button */}
              <Button
                component={Link}
                to={`/place/${place.id}`}
                variant="outlined"
                fullWidth
                endIcon={<KeyboardArrowRightIcon />}
                sx={{
                  mt: 'auto',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  }
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SuggestedPlaces; 