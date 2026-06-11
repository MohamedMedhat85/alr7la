import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  LinearProgress,
  CircularProgress,
  Link,
  CardActionArea,
  CardActions,
  InputAdornment,
  TextField
} from '@mui/material';
import {
  Public as PublicIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  LocalAtm as LocalAtmIcon,
  Flight as FlightIcon,
  DirectionsCar as DirectionsCarIcon,
  AttachMoney as AttachMoneyIcon,
  Bolt as BoltIcon,
  WbSunny as WbSunnyIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  LocalPhone as LocalPhoneIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Explore as ExploreIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Hero from './Hero/Hero';
import Weather from './Weather/Weather';
import MajorCities from './MajorCities/MajorCities';
import Photos from './Photos/Photos';
import MightAlsoLike from './MightAlsoLike/MightAlsoLike';
import CurrencyConverter from '../Currency';
import ParallaxBanner from './Banner/Banner';
import Activities from './Activities/Activities';
import { countryService } from '../../services/networkService';

// Real API call to fetch country data
const fetchCountryData = async (countryId) => {
  try {
    const response = await countryService.getCountryById(countryId);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch country data');
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
    throw error;
  }
};

// Wrapper for country page: always USD as from, disables from select and swap
function FixedUSDCurrencyConverter({ country }) {
  // Always set USD as fromCurrency by passing a special prop to CurrencyConverter
  // Overlay a div to hide the 'From' and 'To' selectors
  return (
    <div style={{ position: 'relative' }}>
      <CurrencyConverter country={{ ...country, currencies: country.currencies }} />
      {/* Hide the From/To selectors and swap button */}
      <style>{`
        /* Hide the grid containing From/To selectors and swap button */
        .max-w-md .grid.grid-cols-5 {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

// Components

const CityCard = ({ city }) => (
  <Card 
    sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
      }
    }}
  >
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        {city.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {city.description || `Explore ${city.name}`}
      </Typography>
      <Typography variant="subtitle2" color="text.primary" fontWeight="medium">
        Rating: {city.rating || 'N/A'}
      </Typography>
    </CardContent>
    <Box sx={{ p: 2, pt: 0 }}>
      <Button 
        endIcon={<KeyboardArrowRightIcon />}
        variant="outlined" 
        fullWidth
      >
        Explore {city.name}
      </Button>
    </Box>
  </Card>
);

// Helper function to safely get coordinates from country data
const getCountryCoordinates = (country) => {
  const defaultCoordinates = { latitude: 35.6762, longitude: 139.6503 }; // Tokyo default
  // 1. Try country.latitude/longitude
  if (country.latitude != null && country.longitude != null) {
    const lat = parseFloat(country.latitude);
    const lng = parseFloat(country.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }
  // 2. Try first place
  if (country.places && country.places.length > 0) {
    const firstPlace = country.places[0];
    const lat = parseFloat(firstPlace.latitude);
    const lng = parseFloat(firstPlace.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }
  // 3. Fallback
  return defaultCoordinates;
};

const CountryMap = ({ country }) => {
  const coordinates = getCountryCoordinates(country);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Location & Map
      </Typography>
      
      <Box 
        sx={{ 
          mt: 2, 
          height: 400, 
          borderRadius: 1, 
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative'
        }}
      >
        {(() => {
          const deltaLat = 0.5; // Reduced from 2 for higher zoom
          const deltaLng = 1; // Reduced from 4 for higher zoom
          const bbox = [
            coordinates.longitude - deltaLng,
            coordinates.latitude - deltaLat,
            coordinates.longitude + deltaLng,
            coordinates.latitude + deltaLat
          ].join(',');
          const marker = `${coordinates.latitude},${coordinates.longitude}`;
          const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
          return (
            <iframe 
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={mapUrl}
              style={{ border: 'none' }}
            />
          );
        })()}
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            Country: {country.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Coordinates: {coordinates.latitude.toFixed(2)}°N, {coordinates.longitude.toFixed(2)}°E
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          href={`https://www.openstreetmap.org/?mlat=${coordinates.latitude}&mlon=${coordinates.longitude}#map=5/${coordinates.latitude}/${coordinates.longitude}`}
          target="_blank"
          endIcon={<KeyboardArrowRightIcon />}
        >
          View larger map
        </Button>
      </Box>
    </Paper>
  );
};

const TravelTips = ({ country }) => {
  const theme = useTheme();
  
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Essential Travel Information
      </Typography>
      
      <Grid container spacing={3}>
        {/* Currency Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalAtmIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="h6" fontWeight="medium">
                  Currency
                </Typography>
              </Box>
              {country.currencies && country.currencies.length > 0 ? (
                country.currencies.map((currency, index) => (
                  <Typography key={index} variant="body2" paragraph>
                    <strong>{currency.name}</strong> ({currency.code}) - {currency.symbol}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Currency information not available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Electrical Standards */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BoltIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="h6" fontWeight="medium">
                  Electrical Standards
                </Typography>
              </Box>
              {country.electricalStandards && country.electricalStandards.length > 0 ? (
                country.electricalStandards.map((standard, index) => (
                  <Typography key={index} variant="body2" paragraph>
                    <strong>Voltage:</strong> {standard.voltage}V<br/>
                    <strong>Frequency:</strong> {standard.frequency}Hz<br/>
                    <strong>Plug Types:</strong> {standard.plugTypes}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Electrical information not available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Scrollable Places Component with Infinite Scrolling
const ScrollablePlaces = ({ country }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [visiblePlaces, setVisiblePlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const placesPerPage = 12; // Load 12 places at a time

  // Filtered places based on search
  const filteredPlaces = country.places && country.places.length > 0 ? country.places.filter(place => {
    const query = search.toLowerCase();
    return (
      place.name.toLowerCase().includes(query) ||
      (place.city && place.city.toLowerCase().includes(query)) ||
      (place.labels && place.labels.some(label => label.toLowerCase().includes(query)))
    );
  }) : [];

  const handlePlaceClick = (place) => {
    navigate(`/place/${place.id}`);
  };
  
  // Initialize with first batch of places
  useEffect(() => {
    if (filteredPlaces.length > 0) {
      const initialPlaces = filteredPlaces.slice(0, placesPerPage);
      setVisiblePlaces(initialPlaces);
      setCurrentIndex(0);
      setHasMore(filteredPlaces.length > placesPerPage);
    } else {
      setVisiblePlaces([]);
      setCurrentIndex(0);
      setHasMore(false);
    }
  }, [country.places, search]);
  
  // Load more places function
  const loadMorePlaces = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const nextIndex = currentIndex + placesPerPage;
      const nextPlaces = filteredPlaces.slice(nextIndex, nextIndex + placesPerPage);
      setVisiblePlaces(prev => [...prev, ...nextPlaces]);
      setCurrentIndex(nextIndex);
      setHasMore(nextIndex + placesPerPage < filteredPlaces.length);
      setLoading(false);
    }, 500);
  }, [currentIndex, loading, hasMore, filteredPlaces]);
  
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading) {
            loadMorePlaces();
          }
        });
      },
      { threshold: 0.1 }
    );
    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMorePlaces, hasMore, loading]);
  
  if (!country.places || country.places.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No places data available for {country.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check back later for updated information about places and attractions.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search places..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ExploreIcon sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 1.5 }} />
        <Typography variant="h4" component="h2" fontWeight="bold">
          Places to Explore
        </Typography>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Discover {filteredPlaces.length} amazing places in {country.name} and find your perfect adventure.
        {visiblePlaces.length > 0 && (
          <span> Showing {visiblePlaces.length} of {filteredPlaces.length} places.</span>
        )}
      </Typography>
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
        <Grid container spacing={3}>
          {visiblePlaces.map((place, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={place.id}>
              <Card 
                sx={{ 
                  height: 460,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardActionArea sx={{ flexGrow: 0 }} onClick={() => handlePlaceClick(place)}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={place.images && place.images.length > 0 
                      ? place.images[0] 
                      : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"}
                    alt={place.name}
                    sx={{ objectFit: 'cover', height: 220 }}
                  />
                  <CardContent sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {place.name}
                    </Typography>
                    {place.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StarIcon sx={{ color: '#FFC107', fontSize: 18, mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="medium">
                          {place.rating}/5
                        </Typography>
                        {place.numberOfRatings && (
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({place.numberOfRatings} reviews)
                          </Typography>
                        )}
                      </Box>
                    )}
                    {place.labels && place.labels.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {place.labels.slice(0, 3).map((label, idx) => (
                          <Chip
                            key={idx}
                            label={label}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 11 }}
                          />
                        ))}
                      </Box>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                      {place.city && `${place.city}, `}{country.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                    sx={{ 
                      justifyContent: 'space-between',
                      py: 1
                    }}
                    onClick={() => handlePlaceClick(place)}
                  >
                    Explore {place.name}
                  </Button>
                </CardActions>
              </Card>
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
        {!hasMore && visiblePlaces.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              You've reached the end! All {filteredPlaces.length} places have been loaded.
            </Typography>
          </Box>
        )}
        {/* Scroll sentinel for infinite scroll */}
        <Box 
          id="scroll-sentinel"
          sx={{ height: '20px', width: '100%' }}
        />
      </Box>
    </Box>
  );
};

// Main Country Profile Component
const CountryProfile = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  useEffect(() => {
    // Fetch country data when component mounts or when ID changes
    const loadCountryData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchCountryData(id);
        setCountry(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading country data:', error);
        setLoading(false);
      }
    };
    
    loadCountryData();
  }, [id]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!country) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Failed to load country data. Please try again.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', mb: 8 }}>
      {/* Country Hero Banner */}
      <Box>
        <Hero country={country} />
      </Box>
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 8, mb: 8 }}>
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
            <Tab label="Places" />
            <Tab label="Travel Info" />
            <Tab label="Experiences" />
            <Tab label="Map" />
            <Tab label="Photos" />
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
                About {country.name}
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to {country.name}! Explore the rich culture, history, and beautiful landscapes this country has to offer.
              </Typography>
              <Divider sx={{ my: 4 }} />
            </Grid>
            <Grid item xs={12} sx={{ mb: 4 }}>
              <MajorCities country={country} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mb: 4 }}>
              <Weather country={country} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mb: 4 }}>
              <FixedUSDCurrencyConverter country={country} />
            </Grid>
            <Grid item xs={12} sx={{ mb: 4 }}>
              <CountryMap country={country} />
            </Grid>
          </Grid>
        )}
        
        {/* Places Tab Content */}
        {tabValue === 1 && (
          <ScrollablePlaces country={country} />
        )}
        
        {/* Travel Info Tab Content */}
        {tabValue === 2 && (
          <Box>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Travel Information
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TravelTips country={country} />
              </Grid>
              
              <Grid item xs={12}>
                <ScrollablePlaces country={country} />
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Transportation
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6" fontWeight="medium">
                              Getting Around
                            </Typography>
                          </Box>
                          <Typography variant="body2" paragraph>
                            {country.name} offers various transportation options for travelers to explore the country efficiently.
                          </Typography>
                          <Typography variant="body2" paragraph>
                            <strong>Public Transport:</strong> Most countries have extensive public transportation networks including buses, trains, and metros.
                          </Typography>
                          <Typography variant="body2" paragraph>
                            <strong>Rental Cars:</strong> Available in most major cities and airports for flexible travel.
                          </Typography>
                          <Typography variant="body2">
                            <strong>Taxis & Ride-sharing:</strong> Convenient options for short trips and airport transfers.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocalPhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6" fontWeight="medium">
                              Practical Information
                            </Typography>
                          </Box>
                          <Typography variant="body2" paragraph>
                            <strong>Internet & Connectivity:</strong> Most countries have good internet coverage. Consider getting a local SIM card or portable WiFi.
                          </Typography>
                          <Typography variant="body2" paragraph>
                            <strong>Electricity:</strong> Check the electrical standards for {country.name} to ensure you have the right adapters.
                          </Typography>
                          <Typography variant="body2" paragraph>
                            <strong>Tipping:</strong> Tipping customs vary by country. Research local customs before your trip.
                          </Typography>
                          <Typography variant="body2">
                            <strong>Business Hours:</strong> Standard business hours vary by country and region.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Experiences Tab Content */}
        {tabValue === 3 && (
          <Activities country={country} />
        )}
        
        {/* Map Tab Content */}
        {tabValue === 4 && (
          <Box>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Interactive Map
            </Typography>
            
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box 
                sx={{ 
                  height: '70vh', 
                  width: '100%', 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                {(() => {
                  const coordinates = getCountryCoordinates(country);
                  const deltaLat = 0.3; // Much smaller for higher zoom
                  const deltaLng = 0.6; // Much smaller for higher zoom
                  const bbox = [
                    coordinates.longitude - deltaLng,
                    coordinates.latitude - deltaLat,
                    coordinates.longitude + deltaLng,
                    coordinates.latitude + deltaLat
                  ].join(',');
                  const marker = `${coordinates.latitude},${coordinates.longitude}`;
                  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
                  return (
                    <iframe 
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src={mapUrl}
                      style={{ border: 'none' }}
                    />
                  );
                })()}
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Popular Places in {country.name}
                </Typography>
                
                <Grid container spacing={2}>
                  {country.places && country.places.slice(0, 8).map((place) => (
                    <Grid item xs={6} sm={4} md={3} key={place.id}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="120"
                          image={place.images && place.images.length > 0 
                            ? place.images[0] 
                            : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"}
                          alt={place.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {place.name}
                          </Typography>
                          {place.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <StarIcon sx={{ color: '#FFC107', fontSize: 16, mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {place.rating}/5
                              </Typography>
                            </Box>
                          )}
                          {place.labels && place.labels.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {place.labels.slice(0, 2).map((label, idx) => (
                                <Chip
                                  key={idx}
                                  label={label}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: 10 }}
                                />
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Photos Tab Content */}
        <Box sx={{ mt: 4 }}>
          <Photos country={country} />
        </Box>
      </Container>
    </Box>
  );
};

export default CountryProfile; 