import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Rating,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import {
  Star as StarIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import OpeningHours from '../OpeningHours/OpeningHours';

const PlaceInfo = ({ place }) => {
  const theme = useTheme();



  // Calculate rating distribution (mock data for now)
  const totalRatings = place.number_of_ratings || 0;
  const ratingDistribution = {
    5: Math.round(totalRatings * 0.6),
    4: Math.round(totalRatings * 0.25),
    3: Math.round(totalRatings * 0.1),
    2: Math.round(totalRatings * 0.03),
    1: Math.round(totalRatings * 0.02)
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        Place Information
      </Typography>
      
      <Grid container spacing={4}>
        {/* Basic Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              About {place.name}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                {place.name} is a notable landmark located in {place.city}, {place.country}. 
                This place offers visitors a unique experience with its rich history and cultural significance.
              </Typography>
            </Box>

            {/* Labels/Categories */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {place.Labels && place.Labels.map((label) => (
                  <Chip
                    key={label.id}
                    label={label.label_name}
                    color="primary"
                    variant="outlined"
                    size="medium"
                  />
                ))}
              </Box>
            </Box>

            {/* Location Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Location Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>City:</strong> {place.city}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Country:</strong> {place.country}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Coordinates:</strong> {place.latitude}, {place.longitude}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Opening Hours */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Opening Hours
            </Typography>
            <OpeningHours place={place} />
          </Paper>
        </Grid>

        {/* Rating and Reviews Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                <StarIcon />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                Ratings & Reviews
              </Typography>
            </Box>

            {/* Overall Rating */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {place.rating || '0.0'}
              </Typography>
              <Rating 
                value={place.rating ? parseFloat(place.rating) : 0} 
                precision={0.1} 
                readOnly 
                size="large"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Based on {place.number_of_ratings || 0} reviews
              </Typography>
            </Box>

            {/* Rating Distribution */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Rating Distribution
              </Typography>
              {[5, 4, 3, 2, 1].map((stars) => (
                <Box key={stars} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 30 }}>
                    {stars}★
                  </Typography>
                  <Box sx={{ flexGrow: 1, mx: 1 }}>
                    <Box
                      sx={{
                        height: 8,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          bgcolor: 'primary.main',
                          width: `${totalRatings > 0 ? (ratingDistribution[stars] / totalRatings) * 100 : 0}%`
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                    {ratingDistribution[stars]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Quick Stats */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                Quick Stats
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {place.rating || '0.0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {place.number_of_ratings || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reviews
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {place.Labels ? place.Labels.length : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {place.PlacesImages ? place.PlacesImages.length : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Photos
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
            <InfoIcon />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Additional Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Best Time to Visit
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The best time to visit {place.name} depends on the season and local events. 
              Consider checking local tourism websites for current information about peak times and special events.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Tips for Visitors
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Check opening hours before your visit
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Consider visiting during off-peak hours for fewer crowds
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Respect local customs and dress codes if applicable
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Bring appropriate footwear for walking and exploring
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PlaceInfo; 