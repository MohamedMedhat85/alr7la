// ParallaxBanner/ParallaxBanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Grow
} from '@mui/material';
import { 
  FlightTakeoff as FlightTakeoffIcon,
  Explore as ExploreIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';

const ParallaxBanner = ({ country = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const bannerRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [inView, setInView] = useState(false);
  
  // Default values if country data is incomplete
  const countryName = country.name || "Japan";
  const parallaxImage = country.parallaxImage || "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80";
  
  const highlights = country.highlights || [
    "Rich cultural heritage spanning thousands of years",
    "Breathtaking natural landscapes from mountains to beaches",
    "World-renowned cuisine recognized by UNESCO",
    "Blend of ancient traditions and cutting-edge technology",
    "Exceptional transportation infrastructure for easy travel"
  ];
  
  const stats = country.stats || [
    { value: "98%", label: "Visitor Satisfaction" },
    { value: "4.8/5", label: "Safety Rating" },
    { value: "Top 10", label: "Global Destination" }
  ];
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      
      const rect = bannerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      setInView(isVisible);
      
      if (isVisible) {
        // Calculate how far the section is from the viewport center
        const windowHeight = window.innerHeight;
        const sectionHeight = rect.height;
        
        // Calculate the center position of both the window and the section
        const windowCenter = windowHeight / 2;
        const sectionCenter = rect.top + sectionHeight / 2;
        
        // Calculate the offset as a function of the section's position relative to window center
        // This creates a proper parallax effect that moves as the section enters and leaves view
        const normalizedOffset = (windowCenter - sectionCenter) / windowHeight * 40; // Reduced from 50 to 40
        
        // Limit the parallax effect to reasonable bounds
        const boundedOffset = Math.max(-40, Math.min(40, normalizedOffset));
        
        setOffset(boundedOffset);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Floating animation for decorative elements
  const floatingAnimation = {
    '@keyframes floating': {
      '0%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
      '100%': { transform: 'translateY(0px)' }
    }
  };
  
  return (
    <Box 
      ref={bannerRef}
      sx={{
        position: 'relative',
        height: { xs: '650px', md: '500px' },
        my: 8,
        ...floatingAnimation,
        overflow: 'hidden', // Changed back to hidden to contain everything
        width: '100%',
        maxWidth: '100vw', // Ensure it doesn't exceed viewport width
      }}
    >
      {/* Parallax Background */}
      <Box
        sx={{
          position: 'absolute',
          top: '-100px', // Extend above to prevent white space
          left: 0,
          right: 0,
          bottom: '-100px', // Extend below to prevent white space
          backgroundImage: `url(${parallaxImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${offset}px) scale(1.3)`, // Reduced scale slightly
          transition: 'transform 0.05s linear',
          width: '100%',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1
          }
        }}
      />
      
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          color: 'rgba(255,255,255,0.2)',
          fontSize: 120,
          animation: 'floating 6s ease-in-out infinite',
          display: { xs: 'none', md: 'block' },
          zIndex: 2
        }}
      >
        <ExploreIcon fontSize="inherit" />
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          color: 'rgba(255,255,255,0.1)',
          fontSize: 80,
          animation: 'floating 8s ease-in-out infinite',
          animationDelay: '1s',
          display: { xs: 'none', md: 'block' },
          zIndex: 2
        }}
      >
        <FlightTakeoffIcon fontSize="inherit" />
      </Box>
      
      {/* Content */}
      <Container 
        maxWidth="xl" // Changed to xl for better control
        sx={{ 
          height: '100%',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 6, md: 8 }, // Increased padding to prevent text cropping
          px: { xs: 2, md: 4 }, // Reduced horizontal padding
        }}
      >
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid item xs={12} md={7}>
            <Fade in={inView} timeout={1000}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: theme.palette.primary.light, 
                    fontWeight: 600,
                    letterSpacing: 2
                  }}
                >
                  DISCOVER THE BEAUTY OF
                </Typography>
                
                <Typography 
                  variant={isMobile ? "h3" : "h2"} 
                  component="h2" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 800,
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)'
                  }}
                >
                  Why {countryName} Should Be Your Next Destination
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  {highlights.slice(0, 4).map((highlight, index) => ( // Limit to 4 highlights to avoid overflow
                    <Grow 
                      in={inView} 
                      key={index}
                      timeout={1000 + (index * 200)}
                      style={{ transformOrigin: '0 0 0' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                        <CheckCircleOutlineIcon 
                          sx={{ 
                            color: theme.palette.primary.light,
                            mr: 1.5,
                            mt: 0.3
                          }} 
                        />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'white',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            fontWeight: 500
                          }}
                        >
                          {highlight}
                        </Typography>
                      </Box>
                    </Grow>
                  ))}
                </Box>
                
                <Fade in={inView} timeout={2000}>
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    }}
                  >
                    Start Planning Your Trip
                  </Button>
                </Fade>
              </Box>
            </Fade>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: { xs: 2, md: 4 }
              }}
            >
              {stats.map((stat, index) => (
                <Grow
                  in={inView}
                  timeout={1500 + (index * 300)}
                  key={index}
                >
                  <Box 
                    sx={{ 
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      backdropFilter: 'blur(8px)',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      width: { xs: 'calc(50% - 16px)', md: '100%' },
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      component="p"
                      sx={{ 
                        color: 'white',
                        fontWeight: 700,
                        mb: 1,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="subtitle1"
                      sx={{ 
                        color: theme.palette.primary.light,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grow>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ParallaxBanner;