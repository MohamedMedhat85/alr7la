import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardMedia, 
  Avatar, 
  IconButton,
  Dialog,
  // DialogContent,  // not used
  // Paper,          // not used
  // TextField,      // not used
  // Button,         // not used
  useTheme,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';

// Updated imports with correct paths
import Sidebar from '../../components/SideBar';
import CommentSection from '../../components/Comment';
import { useSavedPostContext } from '../../context/SavedPostContext';
import ResponsiveAppBar from '../../components/ResponsiveAppBar';
import LeftSider from '../../components/LeftSider';


function SavedPosts() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const { savedPosts, removeSavedPost } = useSavedPostContext();
  const [selectedPost, setSelectedPost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  // Get privacy icon based on post privacy
  const getPrivacyIcon = (privacy = 'public') => {
    switch (privacy) {
      case 'public':
        return <PublicIcon fontSize="small" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary' }} />;
      case 'friends':
        return <PeopleIcon fontSize="small" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary' }} />;
      case 'only me':
        return <LockIcon fontSize="small" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary' }} />;
      default:
        return <PublicIcon fontSize="small" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary' }} />;
    }
  };

  function timeAgo(date) {
    const now = new Date();
    const past = date instanceof Date ? date : new Date(date);
    const seconds = Math.floor((now - past) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }

  const handleUnsavePost = (post, e) => {
    e.stopPropagation();
    removeSavedPost(post);
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setLiked(false);
    setLikeCount(post.likeCount || 0);
    setComments(post.comments || []);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prevCount => newLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
  };

  // Fixed image loading function
  const getImageSrc = (post) => {
    try {
      if (!post.contentSrc) return null;
      let mediaSrc = post.contentSrc;
      try {
        if (post.contentSrc.startsWith('/')) {
          mediaSrc = require(`${post.contentSrc}`);
        }
      } catch (error) {
        mediaSrc = post.contentSrc; // Fallback to direct path
      }
      return mediaSrc;
    } catch (error) {
      return null;
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      user: { name: 'You', avatar: '/path/to/your/avatar.jpg' },
      text: comment,
      time: new Date(),
      replies: []
    };
    setComments(prev => [...prev, newComment]);
    setComment('');
  };

  const getTotalCommentCount = () => {
    let total = comments.length;
    comments.forEach(comment => {
      if (comment.replies && Array.isArray(comment.replies)) {
        total += comment.replies.length;
      }
    });
    return total;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      bgcolor: isDarkMode ? '#242526' : '#ffffff', 
      ml: { xs: 0, md: 5 },
      color: isDarkMode ? '#e4e6eb' : 'inherit',
      paddingBottom: { xs: '5rem', md: '0' },
    }}>
      {/* Header - Fixed at top */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, width: '100vw', left: 0 }}>
        <ResponsiveAppBar />
      </Box>
      
      <Container 
        disableGutters
        maxWidth="lg" 
        sx={{ 
          display: 'flex', 
          flexGrow: 1,
          p: 0,
          pt: 2,
          flexDirection: 'row'
        }}
      >
        {/* Left sidebar - Hidden on mobile */}
        <LeftSider sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sidebar page="SavedPosts" />
        </LeftSider>
  
        {/* Main content */}
        <Box sx={{
          ml: { md: '40px', xs: 0 },
          pt: 2,
          mt: { xs: 4, md: 2 },
          px: { xs: 1, sm: 2, md: 3 },
          maxWidth: { xs: '100%', md: '100%' },
          width: '100%',
          mx: 'auto',
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: { xs: 1.2, sm: 2.5 },
            mt: { xs: 2, md: 5 },
            mb: { xs: 2, md: 3 },
            bgcolor: isDarkMode ? '#1a1a1a' : 'white',
            borderRadius: 3,
            boxShadow: isDarkMode 
              ? '0 2px 12px rgba(0,0,0,0.2)' 
              : '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            <BookmarkIcon sx={{ fontSize: { xs: 24, sm: 28 }, mr: 2, color: '#1877f2' }} />
            <Typography variant="h5" fontWeight="bold" color={isDarkMode ? '#e4e6eb' : '#1c1e21'} sx={{ fontSize: { xs: 21, sm: 24 } }}>
              Saved
            </Typography>
          </Box>

          {savedPosts.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: { xs: '200px', sm: '300px' },
                bgcolor: isDarkMode ? '#242526' : 'white',
                borderRadius: 3,
                p: { xs: 3, sm: 5 },
                boxShadow: isDarkMode 
                  ? '0 2px 12px rgba(0,0,0,0.2)' 
                  : '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              <BookmarkIcon sx={{ fontSize: { xs: 48, sm:72 }, color: isDarkMode ? '#4e4f50' : '#ddd', mb: 3 }} />
              <Typography variant="h5" color={isDarkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary'} align="center" fontWeight="medium" sx={{ fontSize: { xs: 17, sm: 22 } }}>
                No saved items
              </Typography>
              <Typography variant="body1" color={isDarkMode ? 'rgba(255,255,255,0.65)' : 'text.secondary'} align="center" sx={{ mt: 2, maxWidth: 400, fontSize: { xs: '14px', sm: '16px' } }}>
                To save photos and posts, tap the bookmark icon beneath posts.
              </Typography>
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fill, minmax(340px, 1fr))' },
                gap: { xs: 2, sm: 3 },
                width: '100%',
                pb: { xs: 6, md: 4 }
              }}>
              {savedPosts.map((post, index) => (
                <Card 
                  key={post.id || index} 
                  onClick={() => handleOpenPost(post)}
                  elevation={0}
                  sx={{ 
                    borderRadius: 3,
                    cursor: 'pointer',
                    boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                    bgcolor: isDarkMode ? '#1a1a1a' : '#ffffff',
                    transition: 'all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    border: isDarkMode ? '1px solid #3a3b3c' : '1px solid #f0f0f0',
                    overflow: 'hidden',
                    transform: 'translateY(0)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#3a3b3c' : '#fafafa',
                      boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.12)',
                      transform: 'translateY(-6px)',
                      borderColor: '#1877f2',
                      '& .thumbnail-container': {
                        transform: 'scale(1.05)',
                      },
                      '& .post-text': {
                        color: '#1877f2',
                      }
                    }
                  }}
                >
                  <Box 
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'stretch' },
                      p: { xs: 1.5, sm: 3 },
                      flex: 1
                    }}
                  >
                    {/* Thumbnail on the left/top */}
                    {(post.contentType === 'image' || post.contentType === 'video') && (
                      <Box 
                        className="thumbnail-wrapper"
                        sx={{ 
                          borderRadius: 2,
                          overflow: 'hidden',
                          position: 'relative',
                          flexShrink: 0,
                          mr: { xs: 0, sm: 2.5 },
                          mb: { xs: 2, sm: 0 },
                          width: { xs: '100%', sm: '140px' },
                          height: { xs: '160px', sm: '140px' },
                          boxShadow: isDarkMode ? '0 3px 10px rgba(0,0,0,0.4)' : '0 3px 10px rgba(0,0,0,0.1)',
                          border: isDarkMode ? '1px solid #3a3b3c' : '1px solid #f0f0f0',
                        }}
                      >
                        {post.contentSrc && (
                          <Box
                            className="thumbnail-container"
                            sx={{
                              width: '100%', 
                              height: '100%',
                              transition: 'transform 0.5s ease',
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={getImageSrc(post)}
                              alt={post.text || "Post content"}
                              sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                        )}
                        {post.contentType === 'video' && (
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'rgba(0,0,0,0.3)',
                              transition: 'background-color 0.3s ease',
                              '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.5)',
                              }
                            }}
                          >
                            <PlayArrowIcon sx={{ color: 'white', fontSize: 48, filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.5))' }} />
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Text-only post with improved styling */}
                    {post.contentType === 'text' && !post.contentSrc && (
                      <Box 
                        sx={{ 
                          width: { xs: '100%', sm: '140px' },
                          height: { xs: '100px', sm: '140px' },
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mr: { xs: 0, sm: 2.5 },
                          mb: { xs: 2, sm: 0 },
                          background: isDarkMode 
                            ? 'linear-gradient(135deg, #2c2d2e 0%, #3e4042 100%)'
                            : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
                          boxShadow: isDarkMode ? '0 3px 10px rgba(0,0,0,0.2)' : '0 3px 10px rgba(0,0,0,0.05)',
                          border: isDarkMode ? '1px solid #3a3b3c' : '1px solid #eef2f7',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: isDarkMode
                              ? 'linear-gradient(135deg, #3e4042 0%, #2c2d2e 100%)'
                              : 'linear-gradient(135deg, #e4e8eb 0%, #f5f7fa 100%)',
                          }
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          color={isDarkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary'} 
                          sx={{ p: 1.5, textAlign: 'center', fontWeight: 500, fontSize: { xs: '13px', sm: '14px' } }}
                        >
                          Text Post
                        </Typography>
                      </Box>
                    )}

                    {/* Post content with improved styling */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        className="post-text"
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          mb: 1.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          color: isDarkMode ? '#e4e6eb' : '#1c1e21',
                          textAlign: 'left',
                          transition: 'color 0.3s ease',
                          fontSize: { xs: '15px', sm: '16px' }
                        }}
                      >
                        {post.text || "No caption"}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isDarkMode ? '#b0b3b8' : '#65676B',
                          fontSize: '13px',
                          mb: 'auto',
                          opacity: 0.9
                        }}
                        >
                        Saved {post.savedAt ? timeAgo(post.savedAt) : 'recently'}
                      </Typography>
                      
                      <Box sx={{ 
                        mt: 1.5, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pt: 1.5,
                        borderTop: isDarkMode ? '1px solid #3a3b3c' : '1px solid #f0f2f5'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={post.user?.avatar} 
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              mr: 1,
                              border: isDarkMode ? '2px solid #242526' : '2px solid #fff',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }} 
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '13px', 
                                fontWeight: 500, 
                                color: isDarkMode ? '#b0b3b8' : '#65676B'
                              }}
                            >
                              {post.user?.name || "Unknown user"} · {timeAgo(post.time)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                              {getPrivacyIcon(post.privacy)}
                            </Box>
                          </Box>
                        </Box>
                        <IconButton 
                          size="small"
                          onClick={(e) => handleUnsavePost(post, e)}
                          sx={{ 
                            color: isDarkMode ? '#b0b3b8' : '#65676B',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: '#ff5252',
                              backgroundColor: isDarkMode ? 'rgba(255,82,82,0.15)' : 'rgba(255,82,82,0.1)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Container>

      {/* Post View Dialog with dark mode styling & responsive stacking */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xs: '100vw', md: '90vw' },
            height: { xs: '100vh', md: '90vh' },
            margin: { xs: 0, md: '20px auto' },
            borderRadius: { xs: 0, md: '12px' },
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: isDarkMode ? '#000' : '#fff',
            flexDirection: 'row',
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0,0,0,0.9)',
          },
        }}
      >
        {selectedPost && (
          <Box
            sx={{
              display: { xs: 'block', md: 'flex' },
              width: '100%',
              height: '100%',
            }}
          >
            {/* Media side (image/video left on desktop, top on xs) */}
            <Box
              sx={{
                width: { xs: '100%', md: '65%' },
                height: { xs: 260, md: '100%' },
                display: selectedPost.contentType === 'text' ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                p: 0,
              }}
            >
              {selectedPost.contentType === 'image' && selectedPost.contentSrc && (
                <Box
                  component="img"
                  src={getImageSrc(selectedPost)}
                  alt={selectedPost.text || "Post content"}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
              {selectedPost.contentType === 'video' && selectedPost.contentSrc && (
                <Box
                  component="video"
                  controls
                  src={getImageSrc(selectedPost)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Box>

            {/* Info/comments side (right for md+, below for xs) */}
            <Box sx={{ 
              flex: selectedPost.contentType === 'text' ? { xs: '1 1 100%', md: '1 1 100%' } : { xs: 'unset', md: '1 1 35%' },
              width: { xs: '100vw', md: '35%' },
              minHeight: { xs: 'calc(100vh - 260px)', md: '100%' },
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: isDarkMode ? '#1a1a1a' : '#fff',
              borderLeft: selectedPost.contentType !== 'text' ? 
                { xs: 'none', md: isDarkMode ? '1px solid #3a3b3c' : '1px solid #ddd' } : 'none',
            }}>
              {/* Header with user info */}
              <Box sx={{ 
                p: { xs: 1.2, sm: 2 }, 
                borderBottom: isDarkMode ? '1px solid #3a3b3c' : '1px solid #eee',
                display: 'flex', 
                alignItems: 'center' 
              }}>
                <Avatar 
                  src={selectedPost.user?.avatar} 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    border: isDarkMode ? '2px solid #3a3b3c' : '2px solid #fff',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                  }}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    color={isDarkMode ? '#e4e6eb' : '#000'}
                  >
                    {selectedPost.user?.name || "Unknown user"}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getPrivacyIcon(selectedPost.privacy)}
                    <Typography 
                      variant="caption" 
                      color={isDarkMode ? '#b0b3b8' : 'text.secondary'} 
                      sx={{ ml: 0.5 }}
                    >
                      {timeAgo(selectedPost.time)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  sx={{ 
                    ml: 'auto',
                    color: isDarkMode ? '#e4e6eb' : 'inherit',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      transform: 'rotate(90deg)'
                    }
                  }}
                  onClick={handleCloseDialog}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Caption/text */}
              <Box sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderBottom: isDarkMode ? '1px solid #3a3b3c' : '1px solid #eee', 
                textAlign: 'left' 
              }}>
                <Typography 
                  variant="body1" 
                  color={isDarkMode ? '#e4e6eb' : '#000'} 
                  sx={{ lineHeight: 1.6 }}
                >
                  {selectedPost.text || "No caption"}
                </Typography>
                
                {/* Display privacy text alongside the icon for better understanding */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  {getPrivacyIcon(selectedPost.privacy)}
                  <Typography 
                    variant="caption" 
                    color={isDarkMode ? '#b0b3b8' : 'text.secondary'} 
                    sx={{ ml: 0.5 }}
                  >
                    {selectedPost.privacy === 'public' ? 'Public' : 
                      selectedPost.privacy === 'friends' ? 'Friends only' : 
                      selectedPost.privacy === 'only me' ? 'Only me' : 'Public'}
                  </Typography>
                </Box>
              </Box>

              {/* Action buttons */}
              <Box sx={{ 
                display: 'flex', 
                p: { xs: 1.2, sm: 1.5 }, 
                borderBottom: isDarkMode ? '1px solid #3a3b3c' : '1px solid #eee',
                alignItems: 'center',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    onClick={handleLike} 
                    sx={{ 
                      color: liked ? '#f44336' : isDarkMode ? '#b0b3b8' : 'inherit',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Typography 
                    variant="body2" 
                    color={isDarkMode ? '#b0b3b8' : 'text.secondary'} 
                    fontWeight={500}
                  >
                    {likeCount}
                  </Typography>
                </Box>
                <IconButton sx={{ 
                  mx: 1,
                  color: isDarkMode ? '#b0b3b8' : 'inherit',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#1877f2',
                    backgroundColor: isDarkMode ? 'rgba(24,119,242,0.15)' : 'rgba(24,119,242,0.08)',
                  }
                }}>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton sx={{ 
                  color: isDarkMode ? '#b0b3b8' : 'inherit',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#4caf50',
                    backgroundColor: isDarkMode ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.08)',
                    transform: 'rotate(15deg)'
                  }
                }}>
                  <ShareIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    marginLeft: 'auto',
                    color: '#1877f2',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(24,119,242,0.15)' : 'rgba(24,119,242,0.08)',
                      transform: 'scale(1.1)'
                    }
                  }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnsavePost(selectedPost, e);
                    handleCloseDialog();
                  }}
                >
                  <BookmarkIcon />
                </IconButton>
              </Box>

              {/* Comments section */}
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                overflowY: 'auto',
                bgcolor: isDarkMode ? '#18191a' : '#fafafa',
                minHeight: 0
              }}>
                <Box sx={{ flex: 1, p: { xs: 1, sm: 2 } }}>
                  <CommentSection comments={comments} setComments={setComments} />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default SavedPosts;