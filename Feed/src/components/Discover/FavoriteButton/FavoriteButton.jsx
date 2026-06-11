import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const FavoriteButton = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <IconButton
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        bgcolor: 'white',
        '&:hover': {
          bgcolor: 'white'
        }
      }}
      onClick={toggleFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? 
        <FavoriteIcon color="primary" /> : 
        <FavoriteBorderIcon />
      }
    </IconButton>
  );
};

export default FavoriteButton;