import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Rating, 
  Stack,
  Avatar,
  Link
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';

// Award badge component
const AwardBadge = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 12,
      left: 12,
      bgcolor: '#ffcf00',
      borderRadius: '4px',
      p: 0.5,
      px: 1,
      fontWeight: 'bold',
      fontSize: '12px',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}
  >
    <span>2024</span>
  </Box>
);

// Featured card with large image
const FeaturedCard = () => (
  <Box 
    sx={{ 
      position: 'relative',
      height: '100%',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }}
  >
    <Box 
      sx={{ 
        position: 'relative', 
        height: '100%',
        width: '100%',
        backgroundImage: `url('https://img.freepik.com/free-photo/beautiful-tropical-beach_1203-6653.jpg?ga=GA1.1.551707588.1747933504&semt=ais_hybrid&w=740')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Typography 
          variant="h4" 
          component="h3"
          sx={{ 
            color: 'white', 
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            mb: 1
          }}
        >
          Vespa Sidecar Tour in Rome
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            sx={{ width: 32, height: 32, mr: 1, border: '2px solid white' }}
          />
          <Typography 
            variant="body2" 
            sx={{ color: 'white', fontWeight: 500 }}
          >
            @Wanderer682601209
          </Typography>
        </Box>
      </Box>
      
      <AwardBadge />
    </Box>
  </Box>
);

// Experience card
const ExperienceCard = ({ 
  image, 
  title, 
  location, 
  rating, 
  reviews, 
  price
}) => (
  <Card 
    sx={{ 
      borderRadius: 2,
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
      }
    }}
  >
    <Box sx={{ position: 'relative' }}>
      <CardMedia
        component="img"
        height="180"
        image={image}
        alt={title}
      />
      <IconButton 
        aria-label="add to favorites"
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.9)',
          }
        }}
      >
        <FavoriteIcon />
      </IconButton>
      <AwardBadge />
    </Box>
    <CardContent sx={{ p: 2, flexGrow: 1 }}>
      <Typography 
        variant="subtitle2" 
        color="text.secondary"
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        {location}
      </Typography>
      <Typography 
        variant="h6" 
        component="h3"
        gutterBottom
        sx={{ 
          fontWeight: 600,
          fontSize: '1rem',
          lineHeight: 1.3,
          mb: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Rating 
          value={rating} 
          readOnly 
          precision={0.5} 
          size="small" 
          sx={{ color: '#00aa6c', mr: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          ({reviews.toLocaleString()})
        </Typography>
      </Box>
      <Typography variant="body1" fontWeight={500}>
        From ${price}
      </Typography>
    </CardContent>
  </Card>
);

// Main Collage component
const Collage = () => {
  // Sample data for experiences
  const experiences = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=664&q=80",
      title: "Cappadocia Hot Air Balloon Ride / Royal Balloon",
      location: "Goreme",
      rating: 5.0,
      reviews: 5699,
      price: 128
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=664&q=80",
      title: "Chicago Architecture River Cruise",
      location: "Chicago",
      rating: 4.8,
      reviews: 14375,
      price: 49
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=664&q=80",
      title: "Douro Valley 3 Wine Experiences with Lunch & Optional Boat Cruise",
      location: "Porto",
      rating: 4.9,
      reviews: 1619,
      price: 148
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=664&q=80",
      title: "Ultimate Island Jeep Safari with Natural Pool, Baby Beach & Lunch",
      location: "Aruba",
      rating: 5.0,
      reviews: 7613,
      price: 130
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Travelers' Choice Awards
        </Typography>
        <Link 
          href="#" 
          underline="hover" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500,
            '&:hover': { color: 'primary.main' }
          }}
        >
          See all
        </Link>
      </Box>
      
      <Grid container spacing={3}>
        {/* Featured large card - takes full height */}
        <Grid item xs={12} md={5} sx={{ height: { xs: 'auto' } }}>
          <Box sx={{ height: { md: '100%', xs: 400 } }}>
            <FeaturedCard />
          </Box>
        </Grid>
        
        {/* Right side content */}
        <Grid item xs={12} md={7}>
          {/* Section title */}
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h5" 
              component="h3"
              sx={{ fontWeight: 700, mb: 0.5 }}
            >
              Best of the Best
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Among our top 1% of experiences—decided by travelers
            </Typography>
          </Box>
          
          {/* Experience cards grid */}
          <Grid container spacing={2}>
            {experiences.map((experience) => (
              <Grid item xs={12} sm={6} key={experience.id}>
                <ExperienceCard {...experience} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Collage;