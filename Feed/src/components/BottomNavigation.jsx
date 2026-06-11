import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Search, PersonAdd, AddBox, BookmarkBorder
} from '@mui/icons-material';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  useTheme
} from '@mui/material';
import UserAvatar from './UserAvatar';
import CreatePost from './CreatePost';
import FriendRequests from './FriendRequests';
import { usePostContext } from '../context/PostContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { friendService } from '../services/networkService';

function BottomNav() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [value, setValue] = useState(0);
  const { addPost } = usePostContext();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleColorMode } = useCustomTheme();

  // Fetch friend request count when component mounts and set up periodic refresh
  useEffect(() => {
    const fetchFriendRequestCount = async () => {
      try {
        const response = await friendService.getFriendRequests();
        const count = response.data?.count || 0;
        setFriendRequestCount(count);
      } catch (error) {
        console.error('Error fetching friend request count:', error);
        setFriendRequestCount(0);
      }
    };

    // Initial fetch
    fetchFriendRequestCount();

    // Set up periodic refresh every 2 minutes
    const interval = setInterval(fetchFriendRequestCount, 2 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleOpenCreatePost = () => setShowCreatePost(true);
  const handleCloseCreatePost = () => setShowCreatePost(false);
  
  const handleOpenFriendRequests = async () => {
    // Refresh friend request count when opening the modal
    try {
      const response = await friendService.getFriendRequests();
      const count = response.data?.count || 0;
      setFriendRequestCount(count);
    } catch (error) {
      console.error('Error refreshing friend request count:', error);
    }
    setShowFriendRequests(true);
  };
  
  const handleCloseFriendRequests = () => setShowFriendRequests(false);
  
  const handleFriendRequestCountChange = (count) => {
    setFriendRequestCount(count);
  };

  const handleNavigation = (newValue) => {
    setValue(newValue);
    
    switch (newValue) {
      case 0: // Home
        navigate('/feed');
        break;
      case 1: // Search
        navigate('/search');
        break;
      case 2: // Friend Requests
        handleOpenFriendRequests();
        setValue(0); // Reset to home after opening modal
        break;
      case 3: // Saved Posts
        navigate('/saved-posts');
        break;
      case 4: // Create Post
        handleOpenCreatePost();
        setValue(0); // Reset to home after opening modal
        break;
      case 5: // Profile
        navigate('/profile');
        break;
      case 6: // Dark Mode Toggle
        toggleColorMode();
        setValue(0); // Reset to home after toggling
        break;
      default:
        break;
    }
  };

  // Update value based on current location
  useEffect(() => {
    if (location.pathname === '/feed') {
      setValue(0);
    } else if (location.pathname === '/search') {
      setValue(1);
    } else if (location.pathname === '/saved-posts') {
      setValue(3);
    } else if (location.pathname === '/profile') {
      setValue(5);
    }
  }, [location.pathname]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: { xs: 'block', md: 'none' },
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: 3
        }}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => handleNavigation(newValue)}
          sx={{
            height: 60,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
              '&.Mui-selected': {
                color: 'primary.main'
              }
            }
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<Home />}
            sx={{ fontSize: '0.75rem' }}
          />
          <BottomNavigationAction
            label="Search"
            icon={<Search />}
            sx={{ fontSize: '0.75rem' }}
          />
          <BottomNavigationAction
            label="Requests"
            icon={
              <Badge
                badgeContent={friendRequestCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FF4458',
                    color: 'white',
                    fontWeight: 700,
                    minWidth: '16px',
                    height: '16px',
                    fontSize: '10px'
                  }
                }}
              >
                <PersonAdd />
              </Badge>
            }
            sx={{ fontSize: '0.75rem' }}
          />
          <BottomNavigationAction
            label="Saved"
            icon={<BookmarkBorder />}
            sx={{ fontSize: '0.75rem' }}
          />
          <BottomNavigationAction
            label="Post"
            icon={<AddBox />}
            sx={{ fontSize: '0.75rem' }}
          />
          <BottomNavigationAction
            label="Profile"
            icon={<UserAvatar size={20} />}
            sx={{ fontSize: '0.75rem' }}
          />
          <BottomNavigationAction
            label="Theme"
            icon={mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            sx={{ fontSize: '0.75rem' }}
          />
        </BottomNavigation>
      </Box>

      {/* Create Post Dialog */}
      <CreatePost
        open={showCreatePost}
        onClose={handleCloseCreatePost}
        onPostCreated={(newPost) => {
          console.log('Post created in BottomNav:', newPost);
          addPost(newPost);
          handleCloseCreatePost();
          navigate('/feed');
        }}
      />

      {/* Friend Requests Modal */}
      <FriendRequests
        open={showFriendRequests}
        onClose={handleCloseFriendRequests}
        onRequestCountChange={handleFriendRequestCountChange}
      />


    </>
  );
}

export default BottomNav; 