import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Divider,
  Chip,
  Button,
  Paper,
  useTheme,
  Avatar,
  IconButton,
  LinearProgress,
  CircularProgress,
  Rating,
  Link
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkBorderIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Explore as ExploreIcon,
  PhotoCamera as PhotoCameraIcon,
  Info as InfoIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { placeService } from '../../services/networkService';
import PlaceHero from './Hero/PlaceHero';
import PlaceMap from './Map/PlaceMap';
import PlacePhotos from './Photos/PlacePhotos';
import PlaceInfo from './Info/PlaceInfo';
import SuggestedPlaces from './SuggestedPlaces/SuggestedPlaces';
import OpeningHours from './OpeningHours/OpeningHours';
import ReviewsList from './ReviewsList';

// Main Place Profile Component
const Place = () => {
  const [place, setPlace] = useState(null);
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { id } = useParams();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const loadPlaceData = async () => {
    try {
      setLoading(true);
      const placeData = await placeService.getPlace(id);

      if (placeData && placeData.data) {
        setPlace(placeData.data);

        // Load suggested places from the same country
        if (placeData.data.country) {
          try {
            const suggestedData = await placeService.getPlacesByCountry(placeData.data.country);
            if (suggestedData && suggestedData.data) {
              setSuggestedPlaces(suggestedData.data.filter(p => p.id !== placeData.data.id).slice(0, 6));
            }
          } catch (suggestedError) {
            console.error('Error loading suggested places:', suggestedError);
            setSuggestedPlaces([]);
          }
        }
      } else {
        console.error('Invalid place data received');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading place data:', error);
      setLoading(false);
    }
  };

  const handleReviewsUpdate = async () => {
    // Refresh place data to get updated rating and review count
    await loadPlaceData();
  };

  useEffect(() => {
    if (id) {
      loadPlaceData();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!place) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Failed to load place data. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Place Hero Banner */}
      <Box>
        <PlaceHero place={place} />
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl">
        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
                py: 2,
                px: { xs: 2, md: 3 }
              }
            }}
          >
            <Tab label="Overview" />
            <Tab label="Reviews" />
            <Tab label="Photos" />
            <Tab label="Map" />
            <Tab label="Info" />
          </Tabs>
        </Box>

        {/* Overview Tab Content */}
        {tabValue === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 3 }}
              >
                About {place.name}
              </Typography>

              {/* Rating and Reviews */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating
                  value={place.rating ? parseFloat(place.rating) : 0}
                  precision={0.1}
                  readOnly
                  size="large"
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6" sx={{ mr: 1 }}>
                  {place.rating || '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({place.number_of_ratings || 0} reviews)
                </Typography>
              </Box>

              {/* Labels/Categories */}
              <Box sx={{ mb: 3 }}>
                {place.Labels && place.Labels.map((label, index) => (
                  <Chip
                    key={label.id}
                    label={label.label_name}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 4 }} />
            </Grid>

            {/* Quick Info Cards */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                      <LocationIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Location
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    <strong>City:</strong> {place.city}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Country:</strong> {place.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coordinates: {place.latitude}, {place.longitude}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                      <AccessTimeIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Opening Hours
                    </Typography>
                  </Box>
                  <OpeningHours place={place} variant="compact" />
                </CardContent>
              </Card>
            </Grid>

            {/* Photos Preview */}
            <Grid item xs={12}>
              <PlacePhotos place={place} preview={true} />
            </Grid>

            {/* Map Preview */}
            <Grid item xs={12}>
              <PlaceMap place={place} preview={true} />
            </Grid>
          </Grid>
        )}

        {/* Reviews Tab Content */}
        {tabValue === 1 && (
          <ReviewsList place={place} onReviewsUpdate={handleReviewsUpdate} />
        )}

        {/* Photos Tab Content */}
        {tabValue === 2 && (
          <PlacePhotos place={place} />
        )}

        {/* Map Tab Content */}
        {tabValue === 3 && (
          <PlaceMap place={place} />
        )}

        {/* Info Tab Content */}
        {tabValue === 4 && (
          <PlaceInfo place={place} />
        )}

        {/* Suggested Places */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            More Places in {place.country}
          </Typography>
          <SuggestedPlaces places={suggestedPlaces} />
        </Box>
      </Container>
    </Box>
  );
};

export default Place;
