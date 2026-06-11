import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  InputBase,
  Paper,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { alpha } from '@mui/material/styles';
import { api } from "../../../services/api";
import { placeService, countryService } from '../../../services/networkService';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  
  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await countryService.getAllCountries();
        // Filter for the 4 specific countries
        const targetCountries = ['Egypt', 'Turkey', 'Greece', 'Switzerland'];
        const filteredCountries = response.data.filter(country => 
          targetCountries.includes(country.name)
        );
        setCountries(filteredCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      setIsSearching(true);
      setShowResults(true);
      
      try {
        const response = await placeService.searchPlacesByName(query);
        console.log('Search response:', response);
        if (response.data && Array.isArray(response.data)) {
          setSearchResults(response.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleCountryClick = (country) => {
    // Navigate to country page or search for places in that country
    navigate(`/country/${country.id}`);
  };

  const handlePlaceClick = (place) => {
    // Navigate to place details page
    setShowResults(false);
    setSearchQuery('');
    navigate(`/place/${place.id}`);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 400, md: 500 },
        backgroundImage: 'url(https://img.freepik.com/free-photo/traveling-with-off-road-car_23-2151473062.jpg?ga=GA1.1.551707588.1747933504&semt=ais_hybrid&w=740)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 800,
          px: 2,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Book traveler-backed things to do
        </Typography>
        
        <Box sx={{ position: 'relative', mb: 4 }} ref={searchRef}>
          <Paper
            elevation={3}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 50,
              height: { xs: 50, md: 60 }
            }}
          >
            <SearchIcon sx={{ mx: 2, color: 'text.secondary' }} />
            <InputBase
              placeholder="Search by destination"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1 }}
            />
          </Paper>
          
          {/* Show specific countries when search is empty */}
          {!searchQuery && countries.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                Popular destinations:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {countries.map((country) => (
                  <Chip
                    key={country.id}
                    label={`${country.name}`}
                    onClick={() => handleCountryClick(country)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      color: 'text.primary',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {isSearching && showResults && (
            <Paper 
              sx={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                right: 0, 
                maxWidth: 600, 
                mx: 'auto',
                mt: 1,
                p: 2,
                textAlign: 'center',
                color: 'text.secondary',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10
              }}
            >
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Searching...
            </Paper>
          )}
          
          {searchResults.length > 0 && showResults && (
            <Card
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxWidth: 600,
                mx: 'auto',
                mt: 1,
                maxHeight: 300,
                overflow: 'auto',
                zIndex: 10
              }}
            >
              <List>
                {searchResults.map(result => (
                  <ListItem 
                    key={result.id} 
                    button 
                    onClick={() => handlePlaceClick(result)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={result.PlacesImages?.[0]?.img_url}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={result.name}
                      secondary={result.city ? `${result.city}, ${result.country}` : result.country}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}

          {searchQuery.length > 2 && !isSearching && searchResults.length === 0 && showResults && (
            <Card
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxWidth: 600,
                mx: 'auto',
                mt: 1,
                p: 2,
                textAlign: 'center',
                color: 'text.secondary',
                zIndex: 10
              }}
            >
              <Typography variant="body2">
                No places found for "{searchQuery}"
              </Typography>
            </Card>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: index === 0 ? 'white' : alpha('#fff', 0.5),
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;