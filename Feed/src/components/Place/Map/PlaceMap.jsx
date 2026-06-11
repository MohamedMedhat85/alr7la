import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const PlaceMap = ({ place, preview = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const coordinates = {
    lat: parseFloat(place.latitude),
    lng: parseFloat(place.longitude)
  };

  // Tighter bounding box for more zoom
  const delta = 0.005;
  const mapHeight = preview ? 300 : 500;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Location & Map
      </Typography>
      
      <Box 
        sx={{ 
          mt: 2, 
          height: mapHeight, 
          borderRadius: 1, 
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative'
        }}
      >
        {/* OpenStreetMap iframe with tighter bounding box and marker */}
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng-delta}%2C${coordinates.lat-delta}%2C${coordinates.lng+delta}%2C${coordinates.lat+delta}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`}
          style={{ border: 'none' }}
          title={`Map of ${place.name}`}
        />
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="body2" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon sx={{ mr: 1, fontSize: 16 }} />
            {place.city}, {place.country}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Coordinates: {coordinates.lat.toFixed(6)}°N, {coordinates.lng.toFixed(6)}°E
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            href={`https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=15/${coordinates.lat}/${coordinates.lng}`}
            target="_blank"
            endIcon={<KeyboardArrowRightIcon />}
            size={isMobile ? 'small' : 'medium'}
          >
            View larger map
          </Button>
          
          <Button 
            variant="contained" 
            href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
            target="_blank"
            endIcon={<KeyboardArrowRightIcon />}
            size={isMobile ? 'small' : 'medium'}
          >
            Open in Google Maps
          </Button>
        </Box>
      </Box>

      {/* Additional Location Information */}
      {!preview && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Getting There
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                By Public Transport
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check local bus, metro, or train schedules to reach {place.name}. 
                Most major attractions are well-connected by public transportation.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                By Car
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the coordinates above for GPS navigation. 
                Check for parking availability near the location.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PlaceMap; 