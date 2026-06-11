import React, { useState, useEffect } from 'react';
import {
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Typography, 
  Container,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Divider
} from '@mui/material';
import Hero from './Hero/Hero';
import RecommendedSection from "./Reccomended/ReccomendedSection";
import { countryService } from '../../services/networkService';
import { useNavigate } from 'react-router-dom';

// Enhanced theme with more personality
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5a5f',
      light: '#ff8a8f',
      dark: '#e0292e',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00a680',
      light: '#33b899',
      dark: '#00735a',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#6c757d',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

function Discover() {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        const response = await countryService.getAllCountries();
        console.log('Countries response:', response.data);
        // Filter for the 4 specific countries
        const targetCountries = ['Egypt', 'Turkey', 'Greece', 'Switzerland'];
        const filteredCountries = response.data.filter(country => 
          targetCountries.includes(country.name)
        );
        console.log('Filtered countries:', filteredCountries);
        setCountries(filteredCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback to hardcoded countries if API fails
        const fallbackCountries = [
          { id: 52, name: 'Egypt', iso_alpha2: 'EG' },
          { id: 181, name: 'Turkey', iso_alpha2: 'TR' },
          { id: 67, name: 'Greece', iso_alpha2: 'GR' },
          { id: 170, name: 'Switzerland', iso_alpha2: 'CH' }
        ];
        setCountries(fallbackCountries);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = (country) => {
    navigate(`/country/${country.id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Main Content */}
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
        {/* Hero Section with Parallax Effect */}
        <Box 
          sx={{ 
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -1,
              left: 0,
              right: 0,
              height: '100px',
              background: 'linear-gradient(to top, rgba(248,249,250,1), rgba(248,249,250,0))',
            }
          }}
        >
          <Hero />
        </Box>
        
        {/* Content Sections */}
        <Container 
          maxWidth="xl" 
          sx={{ 
            mt: -5, 
            position: 'relative', 
          }}
        >
          {/* Countries Section */}
          <Box 
            sx={{ 
              mt: 8, 
              p: 4, 
              bgcolor: 'background.paper', 
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              mb: 6
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Popular Destinations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore our top-rated travel destinations
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {countriesLoading ? (
                // Loading skeletons
                Array(4).fill(0).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="40%" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : countries.length > 0 ? (
                countries.map((country) => (
                  <Grid item xs={12} sm={6} md={3} key={country.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        height: '100%',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                      onClick={() => handleCountryClick(country)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`https://flagcdn.com/${country.iso_alpha2.toLowerCase()}.svg`}
                        alt={`${country.name} flag`}
                        sx={{ 
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '100%',
                          aspectRatio: '3/2',
                          backgroundColor: '#f5f5f5'
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                          {country.name}
                        </Typography>
                        <Chip 
                          label="Explore" 
                          size="small"
                          sx={{ 
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                // Fallback countries if API fails
                [
                  { id: 52, name: 'Egypt', iso_alpha2: 'EG' },
                  { id: 181, name: 'Turkey', iso_alpha2: 'TR' },
                  { id: 67, name: 'Greece', iso_alpha2: 'GR' },
                  { id: 170, name: 'Switzerland', iso_alpha2: 'CH' }
                ].map((country) => (
                  <Grid item xs={12} sm={6} md={3} key={country.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        height: '100%',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                      onClick={() => handleCountryClick(country)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`https://flagcdn.com/${country.iso_alpha2.toLowerCase()}.svg`}
                        alt={`${country.name} flag`}
                        sx={{ 
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '100%',
                          aspectRatio: '3/2',
                          backgroundColor: '#f5f5f5'
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                          {country.name}
                        </Typography>
                        <Chip 
                          label="Explore" 
                          size="small"
                          sx={{ 
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>

          {/* Animated Red Stripe */}
          <Box sx={{
            my: 6,
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(90deg, #ff5a5f 0%, #ff5a5f 100%)',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {/* Left gradient fade */}
            <Box sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: 'linear-gradient(90deg, #ff5a5f 60%, transparent)',
              zIndex: 2,
            }} />
            {/* Right gradient fade */}
            <Box sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: 'linear-gradient(270deg, #ff5a5f 60%, transparent)',
              zIndex: 2,
            }} />
            {/* Marquee content */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                animation: 'marquee 30s linear infinite',
                fontWeight: 700,
                fontSize: { xs: 18, md: 22 },
                color: 'white',
                width: 'max-content',
                zIndex: 1,
              }}
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="cultures" style={{ fontSize: 28, marginRight: 8 }}>🌍</span>
                Different cultures
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="luxury" style={{ fontSize: 28, marginRight: 8 }}>🛏️</span>
                Relax in luxury
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="gems" style={{ fontSize: 28, marginRight: 8 }}>🧭</span>
                Discover hidden gems
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="cities" style={{ fontSize: 28, marginRight: 8 }}>🏙️</span>
                Visit iconic cities
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="world" style={{ fontSize: 28, marginRight: 8 }}>🌐</span>
                Explore the world
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="adventure" style={{ fontSize: 28, marginRight: 8 }}>🥾</span>
                Adventure
              </Box>
              {/* Repeat for smooth marquee */}
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="cultures" style={{ fontSize: 28, marginRight: 8 }}>🌍</span>
                Different cultures
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="luxury" style={{ fontSize: 28, marginRight: 8 }}>🛏️</span>
                Relax in luxury
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="gems" style={{ fontSize: 28, marginRight: 8 }}>🧭</span>
                Discover hidden gems
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="cities" style={{ fontSize: 28, marginRight: 8 }}>🏙️</span>
                Visit iconic cities
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="world" style={{ fontSize: 28, marginRight: 8 }}>🌐</span>
                Explore the world
              </Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', mx: 4 }}>
                <span role="img" aria-label="adventure" style={{ fontSize: 28, marginRight: 8 }}>🥾</span>
                Adventure
              </Box>
            </Box>
            {/* Marquee animation keyframes */}
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </Box>

          {/* Popular Experiences Section */}
          <Box 
            sx={{ 
              p: 4, 
              bgcolor: 'background.paper', 
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Popular Experiences
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Top-rated activities loved by travelers worldwide
              </Typography>
            </Box>
            
            <RecommendedSection
              isPopular={true}
              title=""
              subtitle=""
            />
          </Box>
        </Container>
      </Box>
      
      {/* Loading Overlay */}
      <Backdrop
        sx={{ color: '#fff', zIndex: 9999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Global Animations */}
      <style jsx global>{`
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
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </ThemeProvider>
  );
}

export default Discover;