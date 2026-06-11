/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import userAvatar from '../assets/images/hazem.jpg';
import EmojiPicker from 'emoji-picker-react';
import { postService } from '../services/networkService';
import { useUserContext } from '../context/UserContext';
import localStorageService from '../services/localStorageService';

const CreatePost = ({ open, onClose, onPostCreated, userData }) => {
  const theme = useTheme();
  const { profilePhoto, userName } = useUserContext();
  // For debugging
  console.log('userData in CreatePost:', userData);
  const [postText, setPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);

  // Map backend privacy value to UI value
  const privacyBackendToUI = (value) => {
    if (value === 'private') return 'friends';
    if (value === 'only me') return 'only me';
    return value;
  };
  // Map UI value to backend value
  const privacyUIToBackend = (value) => {
    if (value === 'friends') return 'private';
    if (value === 'only me') return 'only me';
    return value;
  };

  // Privacy settings
  const [privacyLevel, setPrivacyLevel] = useState('public');
  const [privacyMenuAnchor, setPrivacyMenuAnchor] = useState(null);

  const fileInputRef = useRef(null);
  const textFieldRef = useRef(null);

  // Handle media file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Add new files to existing selection
    setSelectedMedia(prevMedia => [...prevMedia, ...files]);

    // Create preview URLs for all new files
    files.forEach(file => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setMediaPreview(prevPreviews => [...prevPreviews, fileReader.result]);
      };
      fileReader.readAsDataURL(file);
    });
  };

  // Handle submitting the post
  const handleSubmitPost = async () => {
    console.log('=== handleSubmitPost START ===');
    console.log('Button clicked - handleSubmitPost called');
    console.log('Current state:', {
      postText,
      selectedMedia,
      privacyLevel,
      isPosting
    });

    // Validate content
    if (!postText.trim() && selectedMedia.length === 0) {
      console.log('No content to post, returning early');
      return;
    }

    try {
      setIsPosting(true);
      console.log('Set isPosting to true');

      // Create FormData object
      const formData = new FormData();
      formData.append('description', postText);

      // Map UI value to backend value
      const backendVisibility = privacyUIToBackend(privacyLevel);
      formData.append('visibility', backendVisibility);

      // Append each image file
      selectedMedia.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, file.type, file.size);
        formData.append('images', file);
      });

      // Log the FormData contents
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      // Create post using the service
      console.log('About to call postService.createPost');
      const response = await postService.createPost(formData);
      console.log('postService.createPost response:', response);

      if (!response || !response.data) {
        console.error('Invalid response from server:', response);
        throw new Error('Invalid response from server');
      }

      // Extract the post data from the response
      const postData = response.data.data || response.data;
      console.log('Post data from response:', postData);

      // Create a post object that matches the UI format
      const newPost = {
        id: postData.id?.toString(),
        user_id: postData.user_id?.toString(),
        user: {
          id: postData.user_id?.toString(),
          name: userName,
          avatar: profilePhoto
        },
        time: new Date(postData.created_at),
        contentType: postData.PostsImages?.length > 0 ? 'image' : 'text',
        contentSrc: postData.PostsImages?.[0]?.img_url || '',
        text: postData.description,
        description: postData.description,
        isFirstPost: false,
        likes: postData.number_of_likes || 0,
        number_of_likes: postData.number_of_likes || 0,
        privacy: postData.visibility,
        visibility: postData.visibility,
        images: postData.PostsImages?.map(img => ({
          id: img.id,
          url: img.img_url,
          image_url: img.img_url,
          createdAt: new Date(img.created_at),
          created_at: img.created_at
        })) || [],
        createdAt: new Date(postData.created_at),
        created_at: postData.created_at,
        updatedAt: new Date(postData.updated_at),
        updated_at: postData.updated_at,
        postSourceId: postData.post_source_id?.toString() || '0',
        post_source_id: postData.post_source_id?.toString() || '0'
      };

      console.log('Transformed post object:', newPost);

      // Call the callback with the new post
      if (onPostCreated) {
        console.log('Calling onPostCreated callback with:', newPost);
        onPostCreated(newPost);
      } else {
        console.warn('No onPostCreated callback provided');
      }

      console.log('Resetting form and closing dialog');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error in handleSubmitPost:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      // Show error message to user
      alert('Failed to create post. Please try again.');
    } finally {
      console.log('Setting isPosting to false');
      setIsPosting(false);
    }
    console.log('=== handleSubmitPost END ===');
  };

  // Reset the form state
  const resetForm = () => {
    setPostText('');
    setSelectedMedia([]);
    setMediaPreview([]);
    setEmojiAnchorEl(null);
    setPrivacyLevel('public'); // Reset privacy to public
  };

  // Trigger file input click for image selection
  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.multiple = true; // Enable multiple selection
      fileInputRef.current.click();
    }
  };

  // Remove a specific media item by index
  const handleRemoveMedia = (index) => {
    setSelectedMedia(prevMedia =>
      prevMedia.filter((_, i) => i !== index)
    );
    setMediaPreview(prevPreviews =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  // Remove all selected media
  const handleRemoveAllMedia = () => {
    setSelectedMedia([]);
    setMediaPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle emoji picker open/close
  const handleEmojiClick = (event) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  // Handle privacy button click
  const handlePrivacyClick = (event) => {
    setPrivacyMenuAnchor(event.currentTarget);
  };

  // Handle privacy level selection
  const handlePrivacySelect = (level) => {
    setPrivacyLevel(level);
    setPrivacyMenuAnchor(null);
  };

  // Get privacy icon based on selected level
  const getPrivacyIcon = () => {
    switch (privacyLevel) {
      case 'public':
        return <PublicIcon fontSize="small" />;
      case 'friends':
        return <PeopleIcon fontSize="small" />;
      case 'only me':
        return <LockIcon fontSize="small" />;
      default:
        return <PublicIcon fontSize="small" />;
    }
  };

  // Get privacy text based on selected level
  const getPrivacyText = () => {
    switch (privacyLevel) {
      case 'public':
        return 'Public';
      case 'friends':
        return 'Friends';
      case 'only me':
        return 'Only me';
      default:
        return 'Public';
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    // Insert emoji at current cursor position or at end
    const emoji = emojiObject.emoji;
    const textField = textFieldRef.current;

    if (textField) {
      const start = textField.selectionStart || postText.length;
      const end = textField.selectionEnd || postText.length;
      const newText = postText.substring(0, start) + emoji + postText.substring(end);
      setPostText(newText);

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        textField.selectionStart = textField.selectionEnd = start + emoji.length;
        textField.focus();
      }, 0);
    } else {
      // Fallback if direct insertion isn't possible
      setPostText(prevText => prevText + emoji);
    }
  };

  const isEmojiPickerOpen = Boolean(emojiAnchorEl);
  const isPrivacyMenuOpen = Boolean(privacyMenuAnchor);

  return (
    <>
      <Dialog
        open={open}
        onClose={isPosting ? null : onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            borderRadius: '40px',
            width: '550px',
            height: '650px',
            backgroundColor: theme.palette.mode === 'dark' ? '#242526' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            margin: '60px auto',
            boxShadow: theme.palette.mode === 'dark'
              ? '0px 8px 30px rgba(0, 0, 0, 0.3)'
              : '0px 8px 30px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            position: 'relative'
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.7)'
              : 'rgba(200, 200, 200, 0.25)',
          },
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#eee'}`,
          bgcolor: theme.palette.mode === 'dark' ? '#242526' : '#fff',
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mx: 'auto', color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
            Create post
          </Typography>
          <IconButton
            onClick={onClose}
            disabled={isPosting}
            edge="end"
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.grey[500],
              '&:hover': {
                color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.grey[700],
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.mode === 'dark' ? '#242526' : '#fff',
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        }}>
          {/* User info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar src={profilePhoto} sx={{ width: 48, height: 48, mr: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {userName}
              </Typography>
              <Button
                size="small"
                startIcon={getPrivacyIcon()}
                endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                onClick={handlePrivacyClick}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'medium',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f0f2f5',
                  fontSize: '12px',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  borderRadius: '4px',
                  py: 0.5,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e4e6eb',
                  }
                }}
              >
                {getPrivacyText()}
              </Button>
              {/* Privacy menu */}
              <Menu
                anchorEl={privacyMenuAnchor}
                open={isPrivacyMenuOpen}
                onClose={() => setPrivacyMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    width: 200,
                    maxWidth: '100%',
                    borderRadius: '8px',
                    bgcolor: theme.palette.mode === 'dark' ? '#242526' : '#fff',
                    '& .MuiMenuItem-root': {
                      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                      },
                      '&.Mui-selected': {
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                      }
                    }
                  }
                }}
              >
                <MenuItem
                  selected={privacyLevel === 'public'}
                  onClick={() => handlePrivacySelect('public')}
                >
                  <ListItemIcon>
                    <PublicIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Public</ListItemText>
                </MenuItem>
                <MenuItem
                  selected={privacyLevel === 'friends'}
                  onClick={() => handlePrivacySelect('friends')}
                >
                  <ListItemIcon>
                    <PeopleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Friends</ListItemText>
                </MenuItem>
                <MenuItem
                  selected={privacyLevel === 'only me'}
                  onClick={() => handlePrivacySelect('only me')}
                >
                  <ListItemIcon>
                    <LockIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Only me</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Post text input */}
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 3 }}>
            <TextField
              multiline
              fullWidth
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              minRows={4}
              maxRows={12}
              variant="standard"
              inputRef={textFieldRef}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '1.25rem',
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                  '&::placeholder': {
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#65676b',
                  },
                },
              }}
              disabled={isPosting}
              sx={{ mb: 2 }}
            />

            {/* Multiple Media preview */}
            {mediaPreview.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography variant="subtitle2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                    {mediaPreview.length} {mediaPreview.length === 1 ? 'photo' : 'photos'} selected
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleRemoveAllMedia}
                    disabled={isPosting}
                    sx={{
                      textTransform: 'none',
                      color: theme.palette.mode === 'dark' ? 'primary.main' : 'inherit',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    Remove all
                  </Button>
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: mediaPreview.length === 1 ? '1fr' :
                    mediaPreview.length === 2 ? '1fr 1fr' :
                      'repeat(3, 1fr)',
                  gap: 1,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#eee'}`
                }}>
                  {mediaPreview.map((preview, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        paddingTop: mediaPreview.length === 1 ? '56.25%' : '100%',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f0f2f5',
                      }}
                    >
                      <Box
                        component="img"
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMedia(index)}
                        disabled={isPosting}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Action buttons */}
          <Box sx={{ mt: 'auto' }}>
            <Box
              sx={{
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#ddd'}`,
                borderRadius: '16px',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                Add to your post
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <IconButton
                  color="success"
                  onClick={handleImageButtonClick}
                  disabled={isPosting}
                >
                  <ImageIcon />
                </IconButton>
                <Tooltip title="Emoji">
                  <IconButton
                    color="warning"
                    onClick={handleEmojiClick}
                    disabled={isPosting}
                  >
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
            />

            {/* Post button */}
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={() => {
                console.log('Post button clicked');
                handleSubmitPost();
              }}
              disabled={isPosting || (!postText.trim() && selectedMedia.length === 0)}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                py: 1,
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
                '&.Mui-disabled': {
                  bgcolor: '#e4e6eb',
                  color: '#bcc0c4',
                }
              }}
            >
              {isPosting ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                  Posting...
                </Box>
              ) : 'Post'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Emoji Picker Popover */}
      {isEmojiPickerOpen && (
        <Dialog
          open={isEmojiPickerOpen}
          onClose={handleEmojiClose}
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
              overflow: 'visible',
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'transparent',
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
              searchDisabled={false}
              skinTonesDisabled={false}
              width={350}
              height={400}
            />
            <IconButton
              onClick={handleEmojiClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default CreatePost;