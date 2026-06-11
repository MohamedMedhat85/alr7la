import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Avatar,
  Typography,
  IconButton,
  Fade,
  CircularProgress,
  useTheme,
  styled,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  alpha,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Person,
  TravelExplore,
  Clear,
  History,
  AccessTime,
  Check,
  Groups,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';
import { api, friendService } from '../../services/networkService';

// Styled search input
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

function Search() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [mutualFriendsData, setMutualFriendsData] = useState({});
  const [loadingMutualFriends, setLoadingMutualFriends] = useState({});
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Get saved searches from localStorage
  const getSavedSearches = () => {
    const savedSearches = localStorage.getItem('recentSearches');
    const searches = savedSearches ? JSON.parse(savedSearches) : [];

    // Filter out unwanted terms (case-insensitive)
    const unwantedTerms = ['omar ahmed', 'Omar Ahmed'];
    const filteredSearches = searches.filter(term =>
      !unwantedTerms.some(unwanted =>
        term.toLowerCase() === unwanted.toLowerCase()
      )
    );

    // Update localStorage with filtered results
    if (filteredSearches.length !== searches.length) {
      localStorage.setItem('recentSearches', JSON.stringify(filteredSearches));
    }

    return filteredSearches;
  };

  const [recentSearches, setRecentSearches] = useState(getSavedSearches);

  // Support keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Arrow navigation for search results
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();

        if (searchResults.length === 0) return;

        if (e.key === 'ArrowDown') {
          setSelectedResultIndex(prev =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
        } else {
          setSelectedResultIndex(prev =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
        }

        // Scroll the result into view if needed
        if (resultsRef.current) {
          const selectedElement = resultsRef.current.querySelector(`[data-selected="true"]`);
          if (selectedElement) {
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }

      // Enter selects the highlighted result
      if (e.key === 'Enter' && selectedResultIndex >= 0) {
        handleProfileClick(searchResults[selectedResultIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchResults, selectedResultIndex]);

  // Auto focus the search input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cancelTokenSource = api.CancelToken ? api.CancelToken.source() : undefined;
    const token = localStorageService.getItem('token');
    if (searchQuery.trim() !== '') {
      setIsLoading(true);
      setSelectedResultIndex(-1);
      const timer = setTimeout(async () => {
        try {
          const response = await api.get(
            '/users/users',
            {
              params: { name: searchQuery },
              cancelToken: cancelTokenSource ? cancelTokenSource.token : undefined,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          setSearchResults(response.data.users || []);
        } catch (error) {
          if (!(api.isCancel ? api.isCancel(error) : false)) {
            setSearchResults([]);
          }
        } finally {
          setIsLoading(false);
        }
      }, 400);
      return () => {
        clearTimeout(timer);
        if (cancelTokenSource) cancelTokenSource.cancel('Operation canceled due to new request');
      };
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Optimized mutual friends fetching with caching and batch processing
  const fetchMutualFriendsCount = useCallback(async (userIds) => {
    // Filter out users we already have data for or are currently loading
    const usersToFetch = userIds.filter(userId =>
      mutualFriendsData[userId] === undefined && !loadingMutualFriends[userId]
    );

    if (usersToFetch.length === 0) {
      return;
    }

    console.log('Fetching mutual friends for users:', usersToFetch);

    // Mark these users as loading
    setLoadingMutualFriends(prev => {
      const newLoading = { ...prev };
      usersToFetch.forEach(userId => {
        newLoading[userId] = true;
      });
      return newLoading;
    });

    try {
      // Make batch request for all users
      const promises = usersToFetch.map(userId =>
        friendService.getMutualFriendsCount(userId)
          .then(response => {
            console.log(`Raw response for user ${userId}:`, response);
            console.log(`Response data for user ${userId}:`, response.data);
            return { userId, data: response.data };
          })
          .catch(error => ({ userId, error }))
      );

      const results = await Promise.all(promises);

      // Update state with all results
      setMutualFriendsData(prev => {
        const newData = { ...prev };
        results.forEach(result => {
          if (result.error) {
            console.error(`Error fetching mutual friends for user ${result.userId}:`, result.error);
            newData[result.userId] = 0;
          } else {
            console.log(`Mutual friends response for user ${result.userId}:`, result.data);
            console.log(`Extracted mutualFriendsCount for user ${result.userId}:`, result.data.mutualFriendsCount);
            console.log(`Full result object for user ${result.userId}:`, result);
            // Try different possible response structures
            const count = result.data.mutualFriendsCount ||
              result.data.data?.mutualFriendsCount ||
              result.data.count ||
              result.data.data?.count ||
              0;
            console.log(`Final extracted count for user ${result.userId}:`, count);
            newData[result.userId] = count;
          }
        });
        return newData;
      });
    } catch (error) {
      console.error('Error in batch mutual friends fetch:', error);
    } finally {
      // Clear loading state for all users
      setLoadingMutualFriends(prev => {
        const newLoading = { ...prev };
        usersToFetch.forEach(userId => {
          delete newLoading[userId];
        });
        return newLoading;
      });
    }
  }, [mutualFriendsData, loadingMutualFriends]);

  // Fetch mutual friends for new search results
  useEffect(() => {
    if (searchResults.length > 0) {
      // Fetch mutual friends for all users in the search results in batch
      const userIds = searchResults.map(user => user.id);
      fetchMutualFriendsCount(userIds);
    }
  }, [searchResults, fetchMutualFriendsCount]);


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleRecentSearch = (term) => {
    setSearchQuery(term);

    // Move this search to the top of recent searches
    if (recentSearches.includes(term)) {
      const updatedSearches = [
        term,
        ...recentSearches.filter(s => s !== term)
      ];
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const saveToRecentSearches = (term) => {
    if (!term.trim()) return;

    // Add to recent searches if not already present, or move to top if it is
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 8); // Keep only latest 8

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSubmitSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      // If we have results, navigate to the first result
      if (searchResults.length > 0) {
        handleProfileClick(searchResults[0].id);
      }
    }
  };

  const handleProfileClick = (userId) => {
    // Find the user from search results and save their name to recent searches
    const user = searchResults.find(user => user.id === userId);
    if (user) {
      saveToRecentSearches(user.name);
    }

    navigate(`/profile/${userId}`);
  };

  const handleRemoveRecentSearch = (e, term) => {
    e.stopPropagation();

    // Remove this term from recent searches
    const updatedSearches = recentSearches.filter(s => s !== term);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.setItem('recentSearches', JSON.stringify([]));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        px: { xs: 2, sm: 3 }, // Reduced padding on mobile
        py: 2
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Person sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Search</Typography>
          </Box>
        </Box>

        {/* Centered search input container */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <SearchInput
            id="search-input"
            fullWidth
            size="medium"
            placeholder="Search for people by name or username..."
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleSubmitSearch}
            autoComplete="off"
            inputRef={searchInputRef}
            sx={{
              maxWidth: { xs: '100%', sm: 'none' }, // Full width on mobile
              mx: 'auto' // Center horizontally
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end" size="small">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>

      <Box sx={{
        p: 3,
        pt: 2,
        overflowY: 'auto',
        flex: 1,
        bgcolor: theme.palette.mode === 'dark' ? '#242526' : 'transparent'
      }}>
        {!searchQuery ? (
          <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
              <Box display="flex" alignItems="center">
                <AccessTime fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="subtitle2">Recent Searches</Typography>
              </Box>
              {recentSearches.length > 0 && (
                <Button
                  size="small"
                  onClick={handleClearAllRecentSearches}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  Clear all
                </Button>
              )}
            </Box>
            {recentSearches.length > 0 ? (
              <List disablePadding sx={{ '& .MuiListItem-root': { px: 1 } }}>
                {recentSearches.map((term, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleRecentSearch(term)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main'
                        }}
                      >
                        <History fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={term}
                      sx={{ m: 0 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleRemoveRecentSearch(e, term)}
                      sx={{
                        opacity: 0.6,
                        '&:hover': {
                          opacity: 1,
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                        }
                      }}
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  height: 200,
                  color: 'text.secondary'
                }}
              >
                <History sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                <Typography variant="body2" color="inherit">
                  No recent searches
                </Typography>
              </Box>
            )}
          </Box>
        ) : isLoading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 5,
            height: 200
          }}>
            <CircularProgress size={36} />
          </Box>
        ) : searchResults.length > 0 ? (
          <Fade in>
            <List disablePadding ref={resultsRef}>
              {searchResults.map((user, index) => (
                <ListItem
                  key={user.id}
                  button
                  divider
                  onClick={() => handleProfileClick(user.id)}
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    px: 1.5,
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: selectedResultIndex === index ?
                      alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      cursor: 'pointer'
                    }
                  }}
                  data-selected={selectedResultIndex === index}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Avatar
                      src={user.profile_picture}
                      alt={user.name}
                      sx={{
                        width: 48,
                        height: 48,
                        border: user.verified ? `2px solid ${theme.palette.primary.main}` : 'none',
                        mr: 2
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        {user.verified && (
                          <Check
                            sx={{
                              ml: 0.5,
                              color: 'primary.main',
                              fontSize: 16,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              borderRadius: '50%',
                              p: 0.1
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        {(() => {
                          console.log(`Display debug for user ${user.id}:`, {
                            loading: loadingMutualFriends[user.id],
                            data: mutualFriendsData[user.id],
                            hasData: mutualFriendsData[user.id] !== undefined
                          });

                          if (loadingMutualFriends[user.id]) {
                            return <CircularProgress size={12} sx={{ mr: 1 }} />;
                          } else if (mutualFriendsData[user.id] !== undefined) {
                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Groups sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                                <Typography variant="caption" color="text.secondary">
                                  {mutualFriendsData[user.id]} mutual friend{mutualFriendsData[user.id] !== 1 ? 's' : ''}
                                </Typography>
                              </Box>
                            );
                          } else {
                            return null;
                          }
                        })()}
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Fade>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            height: '60%',
            minHeight: 200
          }}>
            <TravelExplore sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4, mb: 2 }} />
            <Typography variant="h6" gutterBottom>No people found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 300, mb: 2 }}>
              We couldn't find anyone matching "{searchQuery}".
              Try different keywords or check spelling.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearSearch}
              startIcon={<Clear />}
              sx={{
                borderRadius: 6,
                textTransform: 'none',
                px: 2
              }}
            >
              Clear search
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Search;