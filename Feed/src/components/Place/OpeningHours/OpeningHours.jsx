import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const OpeningHours = ({ place, variant = 'default' }) => {
  const theme = useTheme();

  // Parse opening hours for better display
  const parseOpeningHours = (hoursString) => {
    if (!hoursString) return [];
    
    // Split by semicolon and clean up
    const days = hoursString.split(';').map(day => day.trim());
    return days
      .filter(day => !day.includes('Hide open hours'))
      .map(day => {
        const [dayName, hours] = day.split(',').map(part => part.trim());
        return { day: dayName, hours: hours };
      });
  };

  const openingHours = parseOpeningHours(place.open_hours);

  if (openingHours.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Opening hours not available
        </Typography>
      </Box>
    );
  }

  // Check if all days are 24 hours
  const isAll24Hours = openingHours.every(item => item.hours.includes('24 hours'));

  if (variant === 'compact') {
    return (
      <Box>
        {isAll24Hours ? (
          <Chip
            icon={<AccessTimeIcon />}
            label="Open 24/7"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 'medium' }}
          />
        ) : (
          <Box>
            {openingHours.slice(0, 3).map((item, index) => (
              <Typography key={index} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {item.day}: {item.hours}
              </Typography>
            ))}
            {openingHours.length > 3 && (
              <Typography variant="body2" color="text.secondary">
                +{openingHours.length - 3} more days
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {/* Summary for 24/7 places */}
      {isAll24Hours && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<AccessTimeIcon />}
            label="Open 24/7 - Every Day"
            color="success"
            variant="filled"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '0.9rem',
              py: 1
            }}
          />
        </Box>
      )}

      {/* Weekly Schedule */}
      <Grid container spacing={1}>
        {openingHours.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
            >
              <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 80 }}>
                {item.day}
              </Typography>
              <Typography 
                variant="body2" 
                color={item.hours.includes('24 hours') ? 'success.main' : 'text.primary'}
                sx={{ fontWeight: item.hours.includes('24 hours') ? 'bold' : 'normal' }}
              >
                {item.hours}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OpeningHours; 