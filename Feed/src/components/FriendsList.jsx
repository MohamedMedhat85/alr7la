import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Groups,
  Search,
  Clear,
  Block as BlockIcon,
  PersonRemove as RemoveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { friendService } from '../services/networkService';

const SearchInput = (props) => (
  <TextField
    {...props}
    fullWidth
    size="small"
    sx={{
      mb: 2,
      '& .MuiInputBase-root': {
        borderRadius: 50,
        backgroundColor: (theme) => alpha(theme.palette.common.black, 0.04),
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
    }}
  />
);

const EmptyState = ({ message, subtitle, icon }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
    minHeight: 200
  }}>
    {icon}
    <Typography variant="h6" gutterBottom>
      {message}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 300 }}>
      {subtitle}
    </Typography>
  </Box>
);

function FriendsList({ userId, friends: friendsProp, isOwnProfile }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [friends, setFriends] = useState(friendsProp || []);
  const [loading, setLoading] = useState(false);
  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'remove' or 'block'
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    if (friendsProp) {
      setFriends(friendsProp);
      setLoading(false);
      return;
    }
    if (userId) {
      setLoading(true);
      friendService.getFriends(userId)
        .then(res => setFriends(res.data))
        .catch(() => setFriends([]))
        .finally(() => setLoading(false));
    }
  }, [userId, friendsProp]);

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleRemove = async (id) => {
    try {
      await friendService.removeFriend(id);
      setFriends(prev => prev.filter(friend => friend.id != id));
    } catch (error) {
      console.error('Error removing friend:', error);
      // You might want to show a notification here
    }
  };

  const filteredFriends = Array.isArray(friends) ? friends.filter(friend =>
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          maxWidth: 600,
          mx: 'auto',
          mt: 3,
          mb: 3,
          background: theme.palette.background.paper
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Groups sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Friends</Typography>
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            ({friends.length})
          </Typography>
        </Box>
        <SearchInput
          placeholder="Search friends..."
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
                <Box
                  component="span"
                  onClick={handleClearSearch}
                  sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Clear fontSize="small" />
                </Box>
              </InputAdornment>
            )
          }}
        />
        <Box>
          {loading ? (
            <EmptyState
              message="Loading..."
              subtitle="Fetching your friends list."
              icon={<Groups sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />}
            />
          ) : filteredFriends.length === 0 ? (
            searchQuery ? (
              <EmptyState
                message="No matching friends"
                subtitle={`No friends found for "${searchQuery}"`}
                icon={<Search sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />}
              />
            ) : (
              <EmptyState
                message="No friends yet"
                subtitle="You don't have any friends yet."
                icon={<Groups sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />}
              />
            )
          ) : (
            <List disablePadding sx={{ p: 1 }}>
              {filteredFriends.map((friend) => (
                <ListItem
                  key={friend.id}
                  sx={{
                    py: 2,
                    px: 1.5,
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
                  secondaryAction={
                    isOwnProfile && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedFriend(friend);
                            setConfirmAction('remove');
                            setConfirmOpen(true);
                          }}
                          title="Remove"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={friend.profile_picture}
                      alt={friend.name}
                      sx={{
                        width: 48,
                        height: 48,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.10)}`,
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/profile/${friend.id}`)}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${friend.id}`)}
                      >
                        {friend.name}
                      </Typography>
                    }

                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          {confirmAction === 'remove' && `Remove ${selectedFriend?.name}?`}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmAction === 'remove' && `Are you sure you want to remove ${selectedFriend?.name} from your friends?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            No
          </Button>
          {confirmAction === 'remove' && (
            <Button
              onClick={() => {
                handleRemove(selectedFriend.id);
                setConfirmOpen(false);
              }}
              color="primary"
              variant="contained"
            >
              Yes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FriendsList; 