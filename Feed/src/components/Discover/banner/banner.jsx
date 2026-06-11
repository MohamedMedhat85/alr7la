import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import HikingIcon from '@mui/icons-material/Hiking';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LanguageIcon from '@mui/icons-material/Language';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import PublicIcon from '@mui/icons-material/Public';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const TravelingBanner = () => {
  const theme = useTheme();
  
  // Array of travel destinations and phrases
  const travelPhrases = [
    { text: "Explore the world", icon: <PublicIcon /> },
    { text: "Adventure awaits", icon: <HikingIcon /> },
    { text: "Discover paradise beaches", icon: <BeachAccessIcon /> },
    { text: "Fly to new destinations", icon: <FlightIcon /> },
    { text: "Sail the oceans", icon: <DirectionsBoatIcon /> },
    { text: "Taste global cuisines", icon: <RestaurantIcon /> },
    { text: "Experience different cultures", icon: <LanguageIcon /> },
    { text: "Relax in luxury", icon: <LocalHotelIcon /> },
    { text: "Discover hidden gems", icon: <ExploreIcon /> },
    { text: "Visit iconic cities", icon: <LocationCityIcon /> },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        my: 4,
        py: 3,
        bgcolor: theme.palette.primary.main,
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* First copy of the content */}
        <Box
          sx={{
            display: 'flex',
            animation: 'marquee 30s linear infinite',
            whiteSpace: 'nowrap',
            '@keyframes marquee': {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-100%)' }
            }
          }}
        >
          {travelPhrases.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
              }}
            >
              <Box 
                sx={{ 
                  mr: 1.5, 
                  display: 'flex', 
                  alignItems: 'center',
                  transform: 'scale(1.2)',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="h6"
                component="span"
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Duplicate to create seamless loop */}
        <Box
          sx={{
            display: 'flex',
            animation: 'marquee2 30s linear infinite',
            whiteSpace: 'nowrap',
            '@keyframes marquee2': {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-100%)' }
            }
          }}
        >
          {travelPhrases.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
              }}
            >
              <Box 
                sx={{ 
                  mr: 1.5, 
                  display: 'flex', 
                  alignItems: 'center',
                  transform: 'scale(1.2)',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="h6"
                component="span"
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Gradient overlays for smooth fade effect on edges */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100px',
          background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '100px',
          background: `linear-gradient(to left, ${theme.palette.primary.main}, transparent)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </Box>
  );
};

// Version with hover to pause
const TravelingBannerWithPause = () => {
  const theme = useTheme();
  
  const travelPhrases = [
    { text: "Explore the world", icon: <PublicIcon /> },
    { text: "Adventure awaits", icon: <HikingIcon /> },
    { text: "Discover paradise beaches", icon: <BeachAccessIcon /> },
    { text: "Fly to new destinations", icon: <FlightIcon /> },
    { text: "Sail the oceans", icon: <DirectionsBoatIcon /> },
    { text: "Taste global cuisines", icon: <RestaurantIcon /> },
    { text: "Experience different cultures", icon: <LanguageIcon /> },
    { text: "Relax in luxury", icon: <LocalHotelIcon /> },
    { text: "Discover hidden gems", icon: <ExploreIcon /> },
    { text: "Visit iconic cities", icon: <LocationCityIcon /> },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        my: 4,
        py: 3,
        bgcolor: theme.palette.primary.main,
        color: 'white',
        overflow: 'hidden',
        '&:hover .marquee-content': {
          animationPlayState: 'paused',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* First copy of the content */}
        <Box
          className="marquee-content"
          sx={{
            display: 'flex',
            animation: 'marquee 30s linear infinite',
            whiteSpace: 'nowrap',
            '@keyframes marquee': {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-100%)' }
            }
          }}
        >
          {travelPhrases.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Box 
                sx={{ 
                  mr: 1.5, 
                  display: 'flex', 
                  alignItems: 'center',
                  transform: 'scale(1.2)',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="h6"
                component="span"
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {/* Duplicate to create seamless loop */}
        <Box
          className="marquee-content"
          sx={{
            display: 'flex',
            animation: 'marquee2 30s linear infinite',
            whiteSpace: 'nowrap',
            '@keyframes marquee2': {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-100%)' }
            }
          }}
        >
          {travelPhrases.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Box 
                sx={{ 
                  mr: 1.5, 
                  display: 'flex', 
                  alignItems: 'center',
                  transform: 'scale(1.2)',
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="h6"
                component="span"
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Gradient overlays for smooth fade effect on edges */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100px',
          background: `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '100px',
          background: `linear-gradient(to left, ${theme.palette.primary.main}, transparent)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default TravelingBannerWithPause; // or export TravelingBanner if you don't want the pause functionality