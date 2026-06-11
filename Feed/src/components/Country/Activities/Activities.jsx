// Activities/Activities.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Zoom,
  Skeleton,
  Divider,
  Rating
} from '@mui/material';
import { 
  Hiking as HikingIcon,
  DirectionsBoat as BoatIcon,
  Restaurant as FoodIcon,
  Museum as CultureIcon,
  Celebration as FestivalIcon,
  NightsStay as NightlifeIcon,
  ShoppingBag as ShoppingIcon,
  FamilyRestroom as FamilyIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Share as ShareIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Activity Category Icons
const categoryIcons = {
  hiking: <HikingIcon />,
  water: <BoatIcon />,
  food: <FoodIcon />,
  culture: <CultureIcon />,
  festivals: <FestivalIcon />,
  nightlife: <NightlifeIcon />,
  shopping: <ShoppingIcon />,
  family: <FamilyIcon />,
};

// Price level component
const PriceLevel = ({ level }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {[1, 2, 3].map((value) => (
        <MoneyIcon 
          key={value}
          sx={{ 
            fontSize: '1rem',
            color: value <= level ? 'text.primary' : 'text.disabled'
          }}
        />
      ))}
    </Box>
  );
};

// Activity Card Component
const ActivityCard = ({ activity, index }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
  };
  
  return (
    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card 
        elevation={2}
        sx={{
          height: 450,
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
        <Box sx={{ position: 'relative', height: 230, overflow: 'hidden' }}>
          {!imageLoaded && (
            <Skeleton 
              variant="rectangular" 
              height={230} 
              width="100%" 
              animation="wave" 
            />
          )}
          <CardMedia
            component="img"
            height={230}
            image={activity.imageUrl}
            alt={activity.title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              display: imageLoaded ? 'block' : 'none',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              p: 1
            }}
          >
            <IconButton
              size="small"
              onClick={handleSave}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,1)',
                }
              }}
            >
              {saved ? 
                <BookmarkIcon color="primary" /> : 
                <BookmarkBorderIcon />
              }
            </IconButton>
          </Box>
          
          {activity.category && (
            <Chip
              icon={categoryIcons[activity.category] || <HikingIcon />}
              label={activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          )}
        </Box>
        
        <CardContent sx={{ flexGrow: 1, pt: 2, height: 150, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" component="h3" fontWeight={600} noWrap>
              {activity.title}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Rating 
              value={activity.rating || 4.5} 
              precision={0.5} 
              size="small" 
              readOnly 
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({activity.reviewCount || "200+"})
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2, 
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              height: '4.5em', // Approximately 3 lines of text
            }}
          >
            {activity.description}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mt: 'auto' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimeIcon sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {activity.duration}
              </Typography>
            </Box>
            
            <PriceLevel level={activity.priceLevel || 2} />
          </Box>
        </CardContent>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            size={isXs ? "small" : "medium"}
            disableElevation
            sx={{ 
              fontWeight: 500,
              borderRadius: 1.5,
              boxShadow: 'none'
            }}
          >
            Book Now
          </Button>
          
          <Box>
            <Tooltip title="Share">
              <IconButton size="small" sx={{ ml: 1 }}>
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add to itinerary">
              <IconButton size="small" sx={{ ml: 1 }}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>
    </Zoom>
  );
};

// Main Activities Component
const Activities = ({ country = {} }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  
  // Default activities if none provided
  const defaultActivities = [
    {
      title: "Mount Fuji Climb",
      description: "Climb Japan's tallest peak for stunning sunrise views. A challenging but rewarding experience with guided tours available.",
      imageUrl: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f",
      category: "hiking",
      duration: "Full day",
      priceLevel: 2,
      rating: 4.8,
      reviewCount: 325
    },
    {
      title: "Tokyo Food Tour",
      description: "Explore Tokyo's culinary scene from street food to Michelin-starred restaurants. Sample authentic Japanese dishes with local guides.",
      imageUrl: "https://images.unsplash.com/photo-1540648639573-8c848de23f0a",
      category: "food",
      duration: "3-4 hours",
      priceLevel: 2,
      rating: 4.9,
      reviewCount: 512
    },
    {
      title: "Traditional Tea Ceremony",
      description: "Experience the ancient art of Japanese tea ceremony in a historic teahouse. Learn about the traditions and philosophy.",
      imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
      category: "culture",
      duration: "1-2 hours",
      priceLevel: 1,
      rating: 4.7,
      reviewCount: 189
    },
    {
      title: "Kyoto Temple Tour",
      description: "Visit Kyoto's most beautiful temples and shrines including Kinkaku-ji (Golden Pavilion) and Fushimi Inari Shrine.",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      category: "culture",
      duration: "Full day",
      priceLevel: 2,
      rating: 4.9,
      reviewCount: 428
    },
    {
      title: "Okinawa Snorkeling",
      description: "Discover vibrant coral reefs and tropical fish in the crystal-clear waters of Okinawa, Japan's southernmost prefecture.",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      category: "water",
      duration: "Half day",
      priceLevel: 2,
      rating: 4.6,
      reviewCount: 156
    },
    {
      title: "Cherry Blossom Festival",
      description: "Join locals for hanami (flower viewing) in spring when cherry blossoms bloom across Japan. Includes picnic and traditional performances.",
      imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951",
      category: "festivals",
      duration: "Flexible",
      priceLevel: 1,
      rating: 5.0,
      reviewCount: 621
    },
    {
      title: "Robot Restaurant Show",
      description: "Experience Tokyo's famous high-energy, futuristic cabaret show featuring giant robots, dancers, and spectacular light displays.",
      imageUrl: "https://images.unsplash.com/photo-1555864326-5cf22ef123cf",
      category: "nightlife",
      duration: "90 minutes",
      priceLevel: 3,
      rating: 4.2,
      reviewCount: 732
    },
    {
      title: "Hakone Hot Springs",
      description: "Relax in natural onsen (hot springs) with views of Mt. Fuji. Experience traditional Japanese bathing culture in a scenic setting.",
      imageUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6",
      category: "culture",
      duration: "Half day",
      priceLevel: 2,
      rating: 4.8,
      reviewCount: 310
    }
  ];
  
  const activities = country.activities && country.activities.length > 0 ? country.activities : [];
  
  // Get unique categories
  const categories = ['all', ...new Set(activities.map(activity => activity.category))];
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Filter activities based on active tab
  const filteredActivities = activeTab === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === activeTab);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: theme.palette.primary.main,
            color: 'white',
            mr: 2
          }}
        >
          <HikingIcon />
        </Box>
        <Typography variant="h4" component="h2" fontWeight="bold">
          Top Activities
        </Typography>
      </Box>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Discover the best experiences and activities in {country.name || "this country"} for your next adventure.
      </Typography>
      
      {activities.length > 0 ? (
        <>
          <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="activity categories"
            >
              {categories.map((category) => (
                <Tab 
                  key={category} 
                  value={category} 
                  label={category === 'all' ? 'All Activities' : category.charAt(0).toUpperCase() + category.slice(1)} 
                  icon={category === 'all' ? null : categoryIcons[category]}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>
          
          <Grid container spacing={3}>
            {filteredActivities.map((activity, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
                <ActivityCard activity={activity} index={index} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No activities data available for {country.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for updated information about activities and experiences.
          </Typography>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          endIcon={<ArrowForwardIcon />}
          size="large"
          sx={{
            borderRadius: 2,
            px: 3
          }}
        >
          View All Activities
        </Button>
      </Box>
    </Box>
  );
};

export default Activities;