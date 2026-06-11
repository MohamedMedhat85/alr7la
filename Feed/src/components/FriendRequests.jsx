import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  styled,
  Slide,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import {
  PersonAdd,
  Close as CloseIcon,
  Search,
  Clear,
  Check
} from '@mui/icons-material';
import { friendService } from '../services/networkService';

const FriendRequestsDialog = styled(Dialog)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiPaper-root': {
    width: '680px',
    maxWidth: '95%',
    height: '85vh',
    maxHeight: '950px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
    margin: '40px auto',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 32px)',
      maxWidth: 'calc(100% - 32px)',
      height: '85vh',
      maxHeight: '85vh',
      margin: '16px',
      borderRadius: '16px',
    },
  },
  '& .MuiBackdrop-root': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(0, 0, 0, 0.7)'
      : 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(8px)'
  }
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: 50,
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.08)
      : alpha(theme.palette.common.black, 0.04),
    transition: theme.transitions.create([
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.12)
        : alpha(theme.palette.common.black, 0.06),
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.12)
        : alpha(theme.palette.common.black, 0.06),
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EmptyState = ({ message, subtitle, icon }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: isMobile ? 2 : 4,
      height: '60%',
      minHeight: isMobile ? 150 : 200
    }}>
      {icon}
      <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
        {message}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          textAlign: 'center', 
          maxWidth: isMobile ? 250 : 300,
          fontSize: isMobile ? '0.875rem' : undefined
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

function FriendRequests({ open, onClose, onRequestCountChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await friendService.getFriendRequests();
      console.log('Friend requests API response:', response.data);
      const requests = response.data?.friends || [];
      setFriendRequests(requests);
      if (onRequestCountChange) {
        onRequestCountChange(response.data?.count || 0);
      }
    } catch (err) {
      setError('Failed to fetch friend requests');
      console.error('Error fetching friend requests:', err);
      setFriendRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFriendRequests();
    }
  }, [open]);

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleAcceptRequest = async (user_id) => {
    try {
      await friendService.updateFriendRequest(user_id, 'accepted');
      setFriendRequests(prev => prev.filter(request => request.User.id != user_id));
      if (onRequestCountChange) {
        onRequestCountChange(friendRequests.length - 1);
      }
    } catch (err) {
      console.error('Error accepting friend request:', err);
      setError('Failed to accept friend request');
    }
  };

  const handleDeclineRequest = async (user_id) => {
    try {
      await friendService.updateFriendRequest(user_id, 'rejected');
      setFriendRequests(prev => prev.filter(request => request.User.id != user_id));
      if (onRequestCountChange) {
        onRequestCountChange(friendRequests.length - 1);
      }
    } catch (err) {
      console.error('Error declining friend request:', err);
      setError('Failed to decline friend request');
    }
  };

  const filteredRequests = Array.isArray(friendRequests)
    ? friendRequests.filter(request =>
      request?.User?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <FriendRequestsDialog
      open={open}
      onClose={onClose}
      transitionComponent={SlideTransition}
      keepMounted
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          px: isMobile ? 1.5 : 2,
          py: isMobile ? 1 : 1.5
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center">
              <PersonAdd sx={{ mr: 1, color: 'primary.main', fontSize: isMobile ? 20 : 24 }} />
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                Friend Requests
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  ml: 1, 
                  color: 'text.secondary',
                  fontSize: isMobile ? '0.75rem' : undefined
                }}
              >
                ({friendRequests.length} new)
              </Typography>
            </Box>
            <IconButton
              size={isMobile ? "medium" : "small"}
              onClick={onClose}
              sx={{
                color: theme.palette.text.secondary,
                background: alpha(theme.palette.text.primary, 0.05),
                '&:hover': {
                  background: alpha(theme.palette.text.primary, 0.12),
                  color: theme.palette.error.main
                }
              }}
            >
              <CloseIcon fontSize={isMobile ? "medium" : "small"} />
            </IconButton>
          </Box>

          <SearchInput
            fullWidth
            size={isMobile ? "medium" : "small"}
            placeholder="Search friend requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            inputRef={searchInputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end" size="small">
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: isMobile ? 'calc(85vh - 180px)' : 'calc(85vh - 150px)',
          background: theme.palette.background.paper
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <EmptyState
              message="Error"
              subtitle={error}
              icon={<CloseIcon sx={{ fontSize: isMobile ? 50 : 60, color: 'error.main', opacity: 0.4, mb: 2 }} />}
            />
          ) : filteredRequests.length === 0 ? (
            searchQuery ? (
              <EmptyState
                message="No matching requests"
                subtitle={`No friend requests found for "${searchQuery}"`}
                icon={<Search sx={{ fontSize: isMobile ? 50 : 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />}
              />
            ) : (
              <EmptyState
                message="No friend requests"
                subtitle="You don't have any pending friend requests at the moment."
                icon={<PersonAdd sx={{ fontSize: isMobile ? 50 : 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />}
              />
            )
          ) : (
            <List disablePadding sx={{ p: isMobile ? 0.5 : 1 }}>
              {filteredRequests.map((request) => (
                <ListItem
                  key={request.User.id}
                  sx={{
                    py: isMobile ? 1.5 : 2,
                    px: isMobile ? 1 : 1.5,
                    mb: 0.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    position: 'relative',
                    transition: 'background 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.10),
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={request.User.profile_picture}
                        alt={request.User.name}
                        sx={{
                          width: isMobile ? 40 : 48,
                          height: isMobile ? 40 : 48,
                          border: `2px solid ${alpha(theme.palette.primary.main, 0.10)}`,
                        }}
                      />
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography 
                          variant={isMobile ? "body2" : "subtitle2"} 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: isMobile ? '0.875rem' : undefined,
                            lineHeight: isMobile ? 1.2 : undefined
                          }}
                        >
                          {request.User.name}
                        </Typography>
                      </Box>
                    }
                    sx={{ pr: isMobile ? 0.5 : 1 }}
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    gap: isMobile ? 0.5 : 1,
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'center'
                  }}>
                    <Button
                      variant="contained"
                      size={isMobile ? "small" : "small"}
                      startIcon={<Check fontSize={isMobile ? "small" : "medium"} />}
                      onClick={() => handleAcceptRequest(request.User.id)}
                      sx={{
                        borderRadius: 6,
                        textTransform: 'none',
                        bgcolor: 'primary.main',
                        fontWeight: 600,
                        boxShadow: 'none',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        minWidth: isMobile ? 'auto' : undefined,
                        py: isMobile ? 0.5 : undefined,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        }
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      size={isMobile ? "small" : "small"}
                      startIcon={<CloseIcon fontSize={isMobile ? "small" : "medium"} />}
                      onClick={() => handleDeclineRequest(request.User.id)}
                      sx={{
                        borderRadius: 6,
                        textTransform: 'none',
                        borderColor: 'divider',
                        color: 'text.secondary',
                        fontWeight: 600,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        minWidth: isMobile ? 'auto' : undefined,
                        py: isMobile ? 0.5 : undefined,
                        '&:hover': {
                          borderColor: theme.palette.error.main,
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.1)
                        }
                      }}
                    >
                      Decline
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{
          p: isMobile ? 1.5 : 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.background.paper
        }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: 6,
              textTransform: 'none',
              fontWeight: 600,
              py: isMobile ? 1 : undefined
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </FriendRequestsDialog>
  );
}

export default FriendRequests;