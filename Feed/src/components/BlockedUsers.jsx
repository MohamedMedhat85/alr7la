import React, { useState, useRef } from 'react';
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
  Slide
} from '@mui/material';
import {
  Block,
  Close as CloseIcon,
  Search,
  Clear,
  PersonRemove
} from '@mui/icons-material';

const BlockedUsersDialog = styled(Dialog)(({ theme }) => ({
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

const EmptyState = ({ message, subtitle, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 4,
    height: '60%',
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

function BlockedUsers({ open, onClose, blockedUsers = [], onUnblock }) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleUnblock = (userId) => {
    if (onUnblock) {
      onUnblock(userId);
    }
  };

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BlockedUsersDialog
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
            px: 2,
            py: 1.5
          }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center">
              <Block sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6">Blocked Users</Typography>
              <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                ({blockedUsers.length})
              </Typography>
            </Box>
            <IconButton
              size="small"
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
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <SearchInput
            fullWidth
            size="small"
            placeholder="Search blocked users..."
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
            maxHeight: 'calc(85vh - 150px)',
            background: theme.palette.background.paper
        }}>
          {filteredUsers.length === 0 ? (
            searchQuery ? (
              <EmptyState
                message="No matching users"
                subtitle={`No blocked users found for "${searchQuery}"`}
                icon={<Search sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />}
              />
            ) : (
              <EmptyState
                message="No blocked users"
                subtitle="You haven't blocked any users yet."
                icon={<Block sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />}
              />
            )
          ) : (
            <List disablePadding sx={{ p: 1 }}>
              {filteredUsers.map((user) => (
                <ListItem
                  key={user.id}
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
                >
                  <ListItemAvatar>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        sx={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${alpha(theme.palette.primary.main, 0.10)}`,
                        }}
                      />
                      {/* Icon circle at bottom right */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.background.paper,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '2px solid',
                        borderColor: theme.palette.background.paper,
                        zIndex: 2
                      }}>
                        <Block fontSize="small" sx={{ color: theme.palette.error.main }} />
                      </Box>
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Blocked on {new Date(user.blockedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Reason: {user.reason}
                        </Typography>
                      </Box>
                    }
                  />
                  <Button
                    variant="outlined"
                    startIcon={<PersonRemove />}
                    onClick={() => handleUnblock(user.id)}
                    sx={{
                      borderRadius: 6,
                      textTransform: 'none',
                      borderColor: 'divider',
                      color: 'text.secondary',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    Unblock
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{
          p: 2,
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
              fontWeight: 600
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </BlockedUsersDialog>
  );
}

export default BlockedUsers;