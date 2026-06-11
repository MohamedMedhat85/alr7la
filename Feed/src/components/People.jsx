import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar, Box, Divider, Link, IconButton, useTheme, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { friendService } from '../services/networkService';
import FriendButton from './FriendButton';
import localStorageService from '../services/localStorageService';

const friends = [
  { name: 'Mostafa Islam', avatar: '' },
  { name: 'Mohamed Yousry', avatar: '' },
  { name: 'Khalid Osama', avatar: '' },
  { name: 'Mohamed Medhat', avatar: '' },
];

export default function People(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === 'dark';
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    if (props.type === 'suggestions') {
      setLoading(true);
      friendService.getFriendSuggestions()
        .then(res => {
          console.log('Friend suggestions response:', res);
          console.log('Suggestions data:', res.data);
          console.log('Suggestions array:', res.data?.data);
          setSuggestions(res.data?.data || []);
          setError(null);
          setVisibleCount(5);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
          setError('Failed to load suggestions');
          setSuggestions([]);
          setVisibleCount(5);
        })
        .finally(() => setLoading(false));
    } else if (props.type === 'friends') {
      setLoading(true);
      const currentUserId = localStorageService.getItem('id');
      if (currentUserId) {
        friendService.getFriends(currentUserId)
          .then(res => {
            console.log('Friends response:', res);
            console.log('Friends data:', res.data);
            console.log('Friends array:', res.data?.data);
            setSuggestions(res.data?.data || []);
            setError(null);
            setVisibleCount(5);
          })
          .catch((error) => {
            console.error('Error fetching friends:', error);
            setError('Failed to load friends');
            setSuggestions([]);
            setVisibleCount(5);
          })
          .finally(() => setLoading(false));
      } else {
        setError('User not authenticated');
        setSuggestions([]);
        setLoading(false);
      }
    }
  }, [props.type]);

  return (
    <Card sx={{ borderRadius: 3, minWidth: 250, margin: 'auto', position: 'relative', zIndex: 1000 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
        <Typography variant="subtitle1" fontWeight="bold">{props.type === "suggestions" ? "Suggestions +" : "Friends"}</Typography>
      </Box>
      <Divider />
      <CardContent sx={{
        py: 1,
        pb: 0,
        ...((props.type === "suggestions" || props.type === "friends") && {
          height: 250, // fixed height for scroll
          overflowY: 'auto',
          overflowX: 'hidden',
        })
      }}>
        {props.type === "suggestions" ? (
          loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={60}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Typography color="error" variant="body2">{error}</Typography>
          ) : suggestions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No suggestions found</Typography>
          ) : (
            suggestions.slice(0, visibleCount).map((s, i, arr) => (
              <Box key={i} display="flex" alignItems="center" mb={i === arr.length - 1 ? 0 : 2}>
                <Avatar
                  src={s.profile_picture || ''}
                  sx={{
                    width: 35,
                    height: 35,
                    mr: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                  onClick={() => handleProfileClick(s.id || s.userId || s._id)}
                />
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: 'left',
                    ml: 0,
                    cursor: 'pointer',
                    '&:hover': {
                      fontWeight: 'bold'
                    }
                  }}
                  onClick={() => handleProfileClick(s.id || s.userId || s._id)}
                >
                  {s.name}
                </Typography>
                <FriendButton targetUserId={s.id || s.userId || s._id} isOwnProfile={false} size="small" />
              </Box>
            ))
          )
        ) : props.type === 'friends' ? (
          loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={60}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Typography color="error" variant="body2">{error}</Typography>
          ) : suggestions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No friends found</Typography>
          ) : (
            suggestions.slice(0, visibleCount).map((s, i, arr) => (
              <Box key={i} display="flex" alignItems="center" mb={i === arr.length - 1 ? 0 : 2}>
                <Avatar
                  src={s.profile_picture || ''}
                  sx={{
                    width: 35,
                    height: 35,
                    mr: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                  onClick={() => handleProfileClick(s.id)}
                />
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: 'left',
                    ml: 0,
                    cursor: 'pointer',
                    '&:hover': {
                      fontWeight: 'bold'
                    }
                  }}
                  onClick={() => handleProfileClick(s.id)}
                >
                  {s.name}
                </Typography>
              </Box>
            ))
          )
        ) : friends.map((s, i) => (
          <Box key={i} display="flex" alignItems="center" mb={1.5}>
            <Avatar src={s.avatar} sx={{ width: 35, height: 35, mr: 1.5 }} />
            <Typography variant="body2">{s.name}</Typography>
          </Box>
        ))}
      </CardContent>
      {(props.type === 'suggestions' || props.type === 'friends') && suggestions.length > visibleCount && (
        <Box
          textAlign="center"
          py={1}
          sx={isDarkMode ? {
            backgroundColor: '#3a3b3c',
            borderTop: '1px solid #4a4b4c',
            transition: 'background-color 0.3s ease',
            '&:hover': { backgroundColor: '#4a4b4c' }
          } : {
            backgroundColor: '#f6f9ff',
            borderTop: '1px solid #eee'
          }}
        >
          <Link
            href="#"
            underline="hover"
            fontSize={14}
            onClick={e => { e.preventDefault(); setVisibleCount(c => c + 5); }}
            sx={isDarkMode ? {
              color: theme.palette.primary.main,
              fontWeight: 500,
              transition: 'color 0.2s ease',
              '&:hover': { color: '#90caf9' }
            } : {}}
          >
            See More
          </Link>
        </Box>
      )}
    </Card>
  );
}