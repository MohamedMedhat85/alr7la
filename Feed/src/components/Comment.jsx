import React, { useState, useRef, useEffect } from 'react';
import {
  Box, TextField, Typography, List, ListItem,
  ListItemAvatar, Avatar, ListItemText, IconButton, Popover,
  Dialog, DialogContent
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CloseIcon from '@mui/icons-material/Close';
import EmojiPicker from 'emoji-picker-react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import localStorageService from '../services/localStorageService';

// Helper
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
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

function ReplyItem({
  reply, onLikeReply, likedReplies, onReplyToReply, replyToReplyId,
  onReplyTextChange, replyToReplyText, onSubmitReplyToReply, parentUsername
}) {
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const replyInputRef = useRef(null);
  const navigate = useNavigate();

  const handleEmojiClick = (event) => setEmojiAnchorEl(event.currentTarget);
  const handleEmojiClose = () => setEmojiAnchorEl(null);

  const onEmojiSelect = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const inputField = replyInputRef.current;
    if (inputField) {
      const start = inputField.selectionStart || replyToReplyText.length;
      const end = inputField.selectionEnd || replyToReplyText.length;
      const newText = replyToReplyText.substring(0, start) + emoji + replyToReplyText.substring(end);
      onReplyTextChange(newText);
      setTimeout(() => {
        inputField.selectionStart = inputField.selectionEnd = start + emoji.length;
        inputField.focus();
      }, 0);
    } else {
      onReplyTextChange(prevText => prevText + emoji);
    }
    handleEmojiClose();
  };

  return (
    <Box sx={{
      borderLeft: '2px solid #e6f2ff',
      pl: 2,
      ml: 4,
      my: 1,
      position: 'relative'
    }}>
      <ListItem alignItems="flex-start" sx={{ p: 0, mb: 1 }}>
        <ListItemAvatar sx={{ minWidth: 36 }}>
          <Avatar
            alt={reply.user}
            src={reply.avatar}
            sx={{ width: 28, height: 28, cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${reply.userId || reply.user}`)}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={() => navigate(`/profile/${reply.userId || reply.user}`)}
                >
                  {reply.user}
                </Typography>
                {parentUsername && (
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 1,
                      color: '#65676B',
                      backgroundColor: '#F0F2F5',
                      px: 0.7,
                      py: 0.3,
                      borderRadius: 1,
                      fontSize: 10
                    }}
                  >
                    Replying to {parentUsername}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                {timeAgo(reply.time)}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Typography sx={{
                whiteSpace: 'normal',
                fontSize: 13,
                mb: 0.5,
                mt: 0.5,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                maxWidth: '100%'
              }}>
                {reply.text}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => onLikeReply(reply.id)}
                    sx={{
                      padding: "0px",
                      color: likedReplies[reply.id] ? '#d32f2f' : '#65676B',
                      '&:hover': { color: '#d32f2f', background: 'transparent' }
                    }}
                  >
                    {likedReplies[reply.id] ? <FavoriteIcon sx={{ fontSize: 16 }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
                  </IconButton>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, ml: 0.5 }}>
                    {reply.likeCount || 0}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 0.5,
                    color: '#65676B',
                    fontWeight: 500,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                  }}
                  onClick={() => onReplyToReply(reply.id, reply.user)}
                >
                  Reply
                </Typography>
              </Box>
            </Box>
          }
        />
      </ListItem>
      {replyToReplyId === reply.id && (
        <Box sx={{ pl: 2, pr: 1, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TextField
              fullWidth
              size="small"
              autoFocus
              placeholder={`Reply to ${reply.user}...`}
              value={replyToReplyText}
              onChange={e => onReplyTextChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmitReplyToReply(reply.id, reply.user);
                }
              }}
              variant="outlined"
              inputRef={replyInputRef}
              sx={{
                backgroundColor: '#f0f2f5',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: '2px',
                  },
                }
              }}
              InputProps={{
                style: { color: '#000', fontSize: 13 },
                sx: { py: 0.7, px: 1.2 }
              }}
            />
            <IconButton color="warning" onClick={handleEmojiClick}>
              <EmojiEmotionsIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => onSubmitReplyToReply(reply.id, reply.user)}
              disabled={!replyToReplyText.trim()}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
          <Popover
            open={Boolean(emojiAnchorEl)}
            anchorEl={emojiAnchorEl}
            onClose={handleEmojiClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <EmojiPicker
              onEmojiClick={onEmojiSelect}
              searchDisabled={false}
              width={280}
              height={350}
            />
          </Popover>
        </Box>
      )}
    </Box>
  );
}

export default function CommentSection({
  open = false,
  onClose,
  userName = 'User',
  isDarkMode = false,
  postId,
  onCommentCountChange,
  comments: externalComments,
  onCommentsChange,
  isEmbedded = false,
  isExpandView = false,
  likedComments: externalLikedComments,
  onLikedCommentsChange,
  likedReplies: externalLikedReplies,
  onLikedRepliesChange,
  onSubmitComment
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { profilePhoto } = useUserContext();

  // Comments control
  const [localComments, setLocalComments] = useState([]);
  const comments = externalComments !== undefined ? externalComments : localComments;
  const setComments = onCommentsChange || setLocalComments;

  // Likes control - Fixed the controlled/uncontrolled state logic
  const [uncontrolledLikedComments, setUncontrolledLikedComments] = useState({});
  const [uncontrolledLikedReplies, setUncontrolledLikedReplies] = useState({});

  const likedCommentsControlled = externalLikedComments !== undefined && onLikedCommentsChange;
  const likedRepliesControlled = externalLikedReplies !== undefined && onLikedRepliesChange;

  const likedComments = likedCommentsControlled ? externalLikedComments : uncontrolledLikedComments;
  const setLikedComments = likedCommentsControlled ? onLikedCommentsChange : setUncontrolledLikedComments;
  const likedReplies = likedRepliesControlled ? externalLikedReplies : uncontrolledLikedReplies;
  const setLikedReplies = likedRepliesControlled ? onLikedRepliesChange : setUncontrolledLikedReplies;

  const [comment, setComment] = useState('');
  const [replyAnchor, setReplyAnchor] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyToReplyId, setReplyToReplyId] = useState(null);
  const [replyToReplyText, setReplyToReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
  const [replyEmojiAnchorEl, setReplyEmojiAnchorEl] = useState(null);
  const commentInputRef = useRef(null);
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (onCommentCountChange) {
      const totalComments = comments.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0);
      }, 0);
      onCommentCountChange(totalComments);
    }
  }, [comments, onCommentCountChange]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  };

  const submitComment = () => {
    if (comment.trim() === '') return;
    if (onSubmitComment) {
      onSubmitComment(comment.trim());
      setComment('');
      return;
    }
    const currentUserId = localStorageService.getItem('id');
    const newComment = {
      id: Date.now(),
      user: 'You',
      userId: currentUserId,
      avatar: profilePhoto,
      text: comment.trim(),
      time: new Date().toISOString(),
      replies: [],
      likeCount: 0
    };
    setComments([newComment, ...comments]);
    setComment('');
  };

  // FIXED: Toggle like function now properly handles controlled/uncontrolled state
  const toggleLike = (id) => {
    const isLiked = !!likedComments[id];

    // Update liked comments state
    if (likedCommentsControlled) {
      // Controlled mode - use external state handler
      const newLikedComments = { ...likedComments };
      if (isLiked) {
        delete newLikedComments[id];
      } else {
        newLikedComments[id] = true;
      }
      onLikedCommentsChange(newLikedComments);
    } else {
      // Uncontrolled mode - use local state
      setUncontrolledLikedComments(prev => {
        const newLikedComments = { ...prev };
        if (isLiked) {
          delete newLikedComments[id];
        } else {
          newLikedComments[id] = true;
        }
        return newLikedComments;
      });
    }

    // Update comment like count
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === id
          ? { ...comment, likeCount: Math.max(0, (comment.likeCount || 0) + (isLiked ? -1 : 1)) }
          : comment
      )
    );
  };

  // FIXED: Toggle like reply function now properly handles controlled/uncontrolled state
  const toggleLikeReply = (id) => {
    const isLiked = !!likedReplies[id];

    // Update liked replies state
    if (likedRepliesControlled) {
      // Controlled mode - use external state handler
      const newLikedReplies = { ...likedReplies };
      if (isLiked) {
        delete newLikedReplies[id];
      } else {
        newLikedReplies[id] = true;
      }
      onLikedRepliesChange(newLikedReplies);
    } else {
      // Uncontrolled mode - use local state
      setUncontrolledLikedReplies(prev => {
        const newLikedReplies = { ...prev };
        if (isLiked) {
          delete newLikedReplies[id];
        } else {
          newLikedReplies[id] = true;
        }
        return newLikedReplies;
      });
    }

    // Update reply like count
    setComments(prevComments =>
      prevComments.map(comment => {
        const replyIndex = (comment.replies || []).findIndex(reply => reply.id === id);
        if (replyIndex < 0) return comment;

        const updatedReplies = [...comment.replies];
        const reply = updatedReplies[replyIndex];
        updatedReplies[replyIndex] = {
          ...reply,
          likeCount: Math.max(0, (reply.likeCount || 0) + (isLiked ? -1 : 1))
        };
        return { ...comment, replies: updatedReplies };
      })
    );
  };

  const handleReply = (id) => {
    setReplyAnchor(id === replyAnchor ? null : id);
    setReplyToReplyId(null);
  };

  const handleReplyToReply = (id, username) => {
    setReplyToReplyId(id === replyToReplyId ? null : id);
    setReplyingTo(username);
    setReplyAnchor(null);
  };

  const handleReplyKeyPress = (e, commentId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitReply(commentId);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleEmojiClick = (event) => setEmojiAnchorEl(event.currentTarget);
  const handleEmojiClose = () => setEmojiAnchorEl(null);
  const onEmojiSelect = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const inputField = commentInputRef.current;
    if (inputField) {
      const start = inputField.selectionStart || comment.length;
      const end = inputField.selectionEnd || comment.length;
      setComment(comment.substring(0, start) + emoji + comment.substring(end));
      setTimeout(() => {
        inputField.selectionStart = inputField.selectionEnd = start + emoji.length;
        inputField.focus();
      }, 0);
    } else setComment(comment + emoji);
    handleEmojiClose();
  };

  const handleReplyEmojiClick = (event) => setReplyEmojiAnchorEl(event.currentTarget);
  const handleReplyEmojiClose = () => setReplyEmojiAnchorEl(null);
  const onReplyEmojiSelect = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const inputField = replyInputRef.current;
    if (inputField) {
      const start = inputField.selectionStart || replyText.length;
      const end = inputField.selectionEnd || replyText.length;
      setReplyText(replyText.substring(0, start) + emoji + replyText.substring(end));
      setTimeout(() => {
        inputField.selectionStart = inputField.selectionEnd = start + emoji.length;
        inputField.focus();
      }, 0);
    } else setReplyText(replyText + emoji);
    handleReplyEmojiClose();
  };

  const submitReply = (parentId) => {
    if (replyText.trim() === '') return;
    if (onSubmitComment) {
      // Use the parent's submit handler with comment_parent_id
      onSubmitComment(replyText.trim(), parentId.toString());
      setExpandedReplies(prev => ({ ...prev, [parentId]: true }));
      setReplyText('');
      setReplyAnchor(null);
      return;
    }

    // Fallback to local state management
    const currentUserId = localStorageService.getItem('id');
    const newReply = {
      id: Date.now(),
      user: 'You',
      userId: currentUserId,
      avatar: profilePhoto,
      text: replyText.trim(),
      time: new Date().toISOString(),
      parentId: parentId,
      parentType: 'comment',
      likeCount: 0
    };
    setComments(comments =>
      comments.map(comment =>
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    );
    setExpandedReplies(prev => ({ ...prev, [parentId]: true }));
    setReplyText('');
    setReplyAnchor(null);
  };

  const submitReplyToReply = (parentReplyId, replyingToUsername) => {
    if (replyToReplyText.trim() === '') return;
    let parentCommentId = null;
    for (const comment of comments) {
      if ((comment.replies || []).some(reply => reply.id === parentReplyId)) {
        parentCommentId = comment.id;
        break;
      }
    }
    if (!parentCommentId) return;

    if (onSubmitComment) {
      // Use the parent's submit handler with comment_parent_id
      // For replies to replies, we use the parent comment ID as the parent
      onSubmitComment(replyToReplyText.trim(), parentCommentId.toString());
      setExpandedReplies(prev => ({ ...prev, [parentCommentId]: true }));
      setReplyToReplyText('');
      setReplyToReplyId(null);
      return;
    }

    // Fallback to local state management
    const currentUserId = localStorageService.getItem('id');
    const newReply = {
      id: Date.now(),
      user: 'You',
      userId: currentUserId,
      avatar: profilePhoto,
      text: replyToReplyText.trim(),
      time: new Date().toISOString(),
      parentId: parentReplyId,
      parentType: 'reply',
      replyingTo: replyingToUsername,
      likeCount: 0
    };
    setComments(comments =>
      comments.map(comment =>
        comment.id === parentCommentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
    setExpandedReplies(prev => ({ ...prev, [parentCommentId]: true }));
    setReplyToReplyText('');
    setReplyToReplyId(null);
  };

  // Rendering (unchanged)
  const renderContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {!isEmbedded && (
        <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 700, color: isDarkMode ? '#fff' : '#000' }}>
          {userName}'s Comments
        </Typography>
      )}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        mb: 2,
        backgroundColor: isDarkMode ? '#242526' : '#fff',
      }}>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 4 }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          <List dense sx={{ py: 0 }}>
            {comments.map((comment) => {
              const { id, user, userId, avatar, text, time, replies, likeCount = 0 } = comment;
              const shouldShowReplies = expandedReplies[id] || false;
              return (
                <Box key={id} component="div" sx={{
                  borderBottom: `1px solid ${isDarkMode ? '#3a3b3c' : '#eee'}`,
                  pb: 2,
                  mb: 1,
                }}>
                  <ListItem alignItems="flex-start" sx={{ alignItems: 'flex-start', p: '4px 0' }}>
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        alt={user}
                        src={avatar}
                        sx={{
                          width: 32,
                          height: 32,
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 }
                        }}
                        onClick={() => navigate(`/profile/${userId || user}`)}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              color: isDarkMode ? '#fff' : '#1c1e21',
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => navigate(`/profile/${userId || user}`)}
                          >
                            {user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 13, ml: 2 }}>
                            {timeAgo(time)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography sx={{
                            whiteSpace: 'normal',
                            mb: 0.5,
                            color: isDarkMode ? '#e4e6ea' : '#1c1e21',
                            wordWrap: 'break-word',
                          }}>
                            {text}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => toggleLike(id)}
                                sx={{
                                  padding: "2px",
                                  color: likedComments[id] ? '#d32f2f' : '#65676B',
                                  '&:hover': { color: '#d32f2f', background: 'transparent' }
                                }}
                              >
                                {likedComments[id] ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                              </IconButton>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: 12, ml: 0.5 }}
                              >
                                {likeCount}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                ml: 0.5,
                                color: '#65676B',
                                fontWeight: 500,
                                fontSize: 15,
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                                '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                              }}
                              onClick={() => handleReply(id)}
                            >
                              Reply
                            </Typography>
                          </Box>
                          {replyAnchor === id && (
                            <Box sx={{ pl: 4, pr: 2, mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  autoFocus
                                  placeholder="Write a reply..."
                                  value={replyText}
                                  onChange={e => setReplyText(e.target.value)}
                                  onKeyDown={e => handleReplyKeyPress(e, id)}
                                  variant="outlined"
                                  inputRef={replyInputRef}
                                  sx={{
                                    backgroundColor: isDarkMode ? '#3a3b3c' : '#f8f8fa',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                      '& fieldset': { borderColor: 'transparent' },
                                      '&:hover fieldset': { borderColor: '#1976d2' },
                                      '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: '2px' },
                                    }
                                  }}
                                  InputProps={{
                                    style: { color: isDarkMode ? '#fff' : '#000', fontSize: 14 },
                                    sx: { py: 0.7, px: 1.2 }
                                  }}
                                />
                                <IconButton color="warning" onClick={handleReplyEmojiClick}>
                                  <EmojiEmotionsIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  color="primary"
                                  onClick={() => submitReply(id)}
                                  disabled={!replyText.trim()}
                                >
                                  <SendIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Popover
                                open={Boolean(replyEmojiAnchorEl)}
                                anchorEl={replyEmojiAnchorEl}
                                onClose={handleReplyEmojiClose}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'center',
                                }}
                                transformOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'center',
                                }}
                              >
                                <EmojiPicker
                                  onEmojiClick={onReplyEmojiSelect}
                                  searchDisabled={false}
                                  width={280}
                                  height={350}
                                />
                              </Popover>
                            </Box>
                          )}
                          {(replies || []).length > 0 && (
                            <>
                              {shouldShowReplies && (
                                <Box sx={{ mt: 1.5 }}>
                                  {(replies || []).map(reply => (
                                    <ReplyItem
                                      key={reply.id}
                                      reply={reply}
                                      onLikeReply={toggleLikeReply}
                                      likedReplies={likedReplies}
                                      onReplyToReply={handleReplyToReply}
                                      replyToReplyId={replyToReplyId}
                                      onReplyTextChange={setReplyToReplyText}
                                      replyToReplyText={replyToReplyText}
                                      onSubmitReplyToReply={submitReplyToReply}
                                      parentUsername={reply.replyingTo}
                                    />
                                  ))}
                                </Box>
                              )}
                              <Typography
                                variant="body2"
                                onClick={() => toggleReplies(id)}
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: '#65676B',
                                  ml: 4,
                                  mt: 1,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                    color: '#1976d2'
                                  },
                                  display: 'inline-block'
                                }}
                              >
                                {!shouldShowReplies
                                  ? `View ${(replies || []).length === 1 ? '1 reply' : `all ${(replies || []).length} replies`}`
                                  : ((replies || []).length === 1 ? 'Hide reply' : 'Hide replies')}
                              </Typography>
                            </>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>
              );
            })}
          </List>
        )}
      </Box>
      {/* Input section */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mt: 'auto',
        pt: 2,
        px: isExpandView ? 2 : (isEmbedded ? 2 : 0),
        pb: isEmbedded || isExpandView ? 2 : 0,
        borderTop: isEmbedded || isExpandView ? `1px solid ${isDarkMode ? '#3a3b3c' : '#e4e6ea'}` : 'none',
        backgroundColor: isDarkMode ? '#242526' : '#fff'
      }}>
        <Avatar
          src={profilePhoto}
          alt="Your Avatar"
          sx={{
            width: 32,
            height: 32,
            mr: 1,
            mt: 0.5,
            flexShrink: 0
          }}
        />
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: 0.5
        }}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={3}
            placeholder="Write a comment..."
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyPress}
            inputRef={commentInputRef}
            sx={{
              backgroundColor: isDarkMode ? '#3a3b3c' : '#f5f5f7',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                p: '10px 12px',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                  borderWidth: '2px',
                },
              }
            }}
            InputProps={{
              style: {
                color: isDarkMode ? '#fff' : '#000',
                fontSize: 14
              }
            }}
          />
          <IconButton
            color="warning"
            onClick={handleEmojiClick}
            aria-label="Add emoji"
          >
            <EmojiEmotionsIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={submitComment}
            disabled={!comment.trim()}
            aria-label="Post comment"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={handleEmojiClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <EmojiPicker
          onEmojiClick={onEmojiSelect}
          searchDisabled={false}
          width={280}
          height={350}
        />
      </Popover>
    </Box>
  );

  if (isEmbedded) {
    return (
      <Box
        sx={{
          height: '100%',
          bgcolor: isDarkMode ? '#242526' : '#fff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {renderContent()}
      </Box>
    );
  }

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '550px',
          height: '650px',
          backgroundColor: isDarkMode ? '#242526' : '#fff',
          color: isDarkMode ? '#fff' : '#1c1e21',
          margin: '60px auto',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          position: 'relative'
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
          height: '100%',
          bgcolor: isDarkMode ? '#242526' : '#fff',
          borderRadius: '16px',
          position: 'relative',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            color: isDarkMode ? '#fff' : '#000',
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}