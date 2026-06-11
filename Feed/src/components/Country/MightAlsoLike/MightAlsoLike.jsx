// MightAlsoLike/MightAlsoLike.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Button, 
  Chip,
  Avatar,
  Rating,
  Divider,
  useTheme,
  CardActionArea,
  Stack,
  Tooltip,
  Skeleton,
  Slide
} from '@mui/material';
import { 
  TravelExplore as TravelExploreIcon,
  Flight as FlightIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  ArrowRightAlt as ArrowRightAltIcon,
  Place as PlaceIcon,
  EmojiFlags as EmojiFlagsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Individual Country Card Component
const CountryCard = ({ country, index }) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  // Distance description based on range
  const getDistanceLabel = (distance) => {
    if (distance < 500) return "Very Close";
    if (distance < 2000) return "Nearby";
    if (distance < 5000) return "Same Region";
    return "Worth the Journey";
  };
  
  return (
    <Slide direction="up" in={true} style={{ transitionDelay: `${index * 150}ms` }}>
      <Card 
        elevation={2}
        sx={{
          height: '100%',
          maxHeight: 450,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px -5px rgba(0,0,0,0.2)',
          }
        }}
      >
        <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
            {!imageLoaded && (
              <Skeleton 
                variant="rectangular" 
                height={160} 
                width="100%" 
                animation="wave" 
              />
            )}
            <CardMedia
              component="img"
              height={160}
              image={country.imageUrl}
              alt={`Scenic view of ${country.name}`}
              onLoad={() => setImageLoaded(true)}
              sx={{
                display: imageLoaded ? 'block' : 'none',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            
            {/* Flag badge */}
            <Avatar
              src={country.flagUrl}
              alt={`${country.name} flag`}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 40,
                height: 40,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            />
            
            {/* Distance chip */}
            {country.distance && (
              <Chip
                icon={<PlaceIcon sx={{ fontSize: '16px !important', color: 'inherit' }} />}
                label={getDistanceLabel(country.distance)}
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  backdropFilter: 'blur(4px)',
                  fontWeight: 500,
                  '& .MuiChip-icon': {
                    color: 'inherit'
                  }
                }}
              />
            )}
          </Box>
          
          <CardContent sx={{ 
            flexGrow: 1, 
            pt: 2, 
            display: 'flex', 
            flexDirection: 'column',
            height: 220 // Fixed height for card content
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" component="h3" fontWeight={600}>
                {country.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating 
                  value={country.rating || 4.5} 
                  precision={0.5} 
                  size="small" 
                  readOnly 
                  sx={{ mr: 0.5 }}
                />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {country.rating || 4.5}
                </Typography>
              </Box>
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                height: 60,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {country.description}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {country.tags && country.tags.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: 24
                  }}
                />
              ))}
            </Stack>
            
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push the similarity reason to bottom */}
            
            {country.similarityReason && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 'auto', 
                pt: 1,
                color: theme.palette.text.secondary,
                fontSize: '0.8rem'
              }}>
                <Tooltip title="Why we recommend this">
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}>
                    <ArrowRightAltIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                    {country.similarityReason}
                  </Box>
                </Tooltip>
              </Box>
            )}
          </CardContent>
        </CardActionArea>
        
        <Divider />
        
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            startIcon={<FlightIcon />}
            size="small"
            color="primary"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.8rem'
            }}
          >
            Explore {country.name}
          </Button>
          
          {country.directFlight && (
            <Tooltip title="Direct flights available">
              <Chip
                size="small"
                label="Direct Flight"
                color="success"
                variant="outlined"
                sx={{ 
                  height: 24, 
                  fontSize: '0.7rem',
                  fontWeight: 500
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Card>
    </Slide>
  );
};

// Main MightAlsoLike Component
const MightAlsoLike = ({ country = {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Default recommended countries if none provided
  const defaultRecommendations = [
    {
      name: "South Korea",
      flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/255px-Flag_of_South_Korea.svg.png",
      imageUrl: "https://images.unsplash.com/photo-1538485399081-7191377e8241",
      description: "Modern technology meets ancient traditions in this dynamic East Asian nation known for K-pop, Korean cuisine, and historic temples.",
      rating: 4.7,
      distance: 950,
      tags: ["Culture", "Food", "Urban"],
      similarityReason: "Similar cultural experiences",
      directFlight: true
    },
    {
      name: "Thailand",
      flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/255px-Flag_of_Thailand.svg.png",
      imageUrl: "https://images.unsplash.com/photo-1528181304800-259b08848526",
      description: "Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins and ornate temples displaying Buddha figures.",
      rating: 4.8,
      distance: 4500,
      tags: ["Beaches", "Temples", "Food"],
      similarityReason: "Popular Asian destination",
      directFlight: true
    },
    {
      name: "New Zealand",
      flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/255px-Flag_of_New_Zealand.svg.png",
      imageUrl: "https://images.unsplash.com/photo-1469521669194-babb45599def",
      description: "Island country in the South Pacific known for stunning landscapes, Maori culture, and outdoor adventure activities.",
      rating: 4.9,
      distance: 8800,
      tags: ["Nature", "Adventure", "Scenery"],
      similarityReason: "Island nation with unique culture",
      directFlight: false
    },
    {
      name: "Singapore",
      flagUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/255px-Flag_of_Singapore.svg.png",
      imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
      description: "Modern city-state known for its ultramodern skyline, multicultural food scene, and meticulously maintained gardens and parks.",
      rating: 4.6,
      distance: 5200,
      tags: ["Urban", "Food", "Shopping"],
      similarityReason: "Asian culture with modern amenities",
      directFlight: true
    }
  ];
  
  const recommendations = country.relatedCountries && country.relatedCountries.length > 0 
    ? country.relatedCountries 
    : [];
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TravelExploreIcon sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 1.5 }} />
        <Typography variant="h4" component="h2" fontWeight="bold">
          You Might Also Like
        </Typography>
      </Box>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ mb: 3 }}>
        If you enjoyed {country.name || "this country"}, here are some other destinations you may want to explore on your next adventure.
      </Typography>
      
      {recommendations.length > 0 ? (
        <Grid container spacing={3}>
          {recommendations.map((recommendedCountry, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', height: 450 }}>
              <CountryCard country={recommendedCountry} index={index} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No recommendations available for {country.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for travel recommendations.
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: 4,
            px: 3,
            py: 1
          }}
          onClick={() => navigate('/discover')}
        >
          Discover More Destinations
        </Button>
      </Box>
    </Box>
  );
};

export default MightAlsoLike;