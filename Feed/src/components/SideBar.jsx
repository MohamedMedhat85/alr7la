import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Search, PersonAdd, AddBox, BookmarkBorder
} from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import UserAvatar from './UserAvatar';
import CreatePost from './CreatePost';
import FriendRequests from './FriendRequests';
import { usePostContext } from '../context/PostContext';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { friendService } from '../services/networkService';

function Sidebar({ page }) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
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

  const getHoverStyle = (isSelected = false) => ({
    borderRadius: '8px',
    mx: 1,
    '&.Mui-selected': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : '#e6f0ff',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.12)' : '#d9e6ff'
      }
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f0f2f5'
    }
  });

  return (
    <Box
      sx={{
        position: { xs: 'static', sm: 'fixed' },
        top: 60,
        left: 0,
        width: {
          xs: '0px',
          sm: '60px',
          md: '200px',
          lg: '300px'
        },
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        bgcolor: 'background.paper',
        zIndex: 100,
        borderRight: '1px solid #dbdbdb',
        transition: 'width 0.3s ease',
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between'
      }}>
        {/* Main Navigation Items */}
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
          {/* Home */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/feed' || page === 'feed'}
              onClick={() => navigate('/feed')}
              sx={getHoverStyle(true)}
            >
              <ListItemIcon sx={{ minWidth: { xs: '40px', sm: '40px', md: '40px' } }}>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem>

          {/* Search */}
          <ListItem disablePadding>
            <ListItemButton
              selected={page === 'search'}
              onClick={() => navigate('/search')}
              sx={getHoverStyle()}
            >
              <ListItemIcon sx={{ minWidth: { xs: '40px', sm: '40px', md: '40px' } }}>
                <Search />
              </ListItemIcon>
              <ListItemText primary="Search" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem>



          {/* Friend Requests */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleOpenFriendRequests}
              sx={getHoverStyle()}
            >
              <ListItemIcon sx={{ minWidth: { xs: '40px', sm: '40px', md: '40px' } }}>
                <Badge
                  badgeContent={friendRequestCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#FF4458',
                      color: 'white',
                      fontWeight: 700,
                      minWidth: '18px',
                      height: '18px',
                      fontSize: '11px'
                    }
                  }}
                >
                  <PersonAdd />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Friend Requests" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem>

          {/* Groups
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/groups'}
              onClick={() => navigate('/groups')}
              sx={getHoverStyle(true)}
            >
              <ListItemIcon sx={{ minWidth: { xs: '40px', sm: '40px', md: '40px' } }}>
                <Groups />
              </ListItemIcon>
              <ListItemText primary="Groups" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem> */}

          {/* Saved Posts */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/saved-posts'}
              onClick={() => navigate('/saved-posts')}
              sx={getHoverStyle(true)}
            >
              <ListItemIcon sx={{ minWidth: { xs: '40px', sm: '40px', md: '40px' } }}>
                <BookmarkBorder />
              </ListItemIcon>
              <ListItemText primary="Saved Posts" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem>

          {/* Post Button */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleOpenCreatePost}
              sx={getHoverStyle()}
            >
              <ListItemIcon sx={{ minWidth: { xs: '40px', sm: '40px', md: '40px' } }}>
                <AddBox />
              </ListItemIcon>
              <ListItemText primary="Post" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem>

          {/* Profile Button */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/profile' || page === 'profile'}
              onClick={() => navigate('/profile')}
              sx={getHoverStyle(true)}
            >
              <ListItemIcon sx={{ minWidth: { xs: '40px', sm: '40px', md: '40px' } }}>
                <UserAvatar size={24} />
              </ListItemIcon>
              <ListItemText primary="Profile" sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Bottom Section with Dark Mode Toggle */}
        <List sx={{ mt: 'auto', mb: 2 }}>
          <ListItem disablePadding>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              px: 2, 
              py: 1,
              width: '100%',
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleColorMode}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#1877f2',
                        '&:hover': {
                          backgroundColor: 'rgba(24, 119, 242, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#1877f2',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                      {mode === 'dark' ? 'Light' : 'Dark'}
                    </Box>
                  </Box>
                }
                sx={{
                  margin: 0,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    color: theme.palette.mode === 'dark' ? '#e4e6eb' : '#1c1e21',
                  }
                }}
              />
            </Box>
          </ListItem>
        </List>
      </Box>

      {/* Create Post Dialog */}
      <CreatePost
        open={showCreatePost}
        onClose={handleCloseCreatePost}
        onPostCreated={(newPost) => {
          console.log('Post created in Sidebar:', newPost);
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


    </Box>
  );
}

export default Sidebar;