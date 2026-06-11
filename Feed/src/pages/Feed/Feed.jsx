import React, { useState, useEffect } from 'react';
import { Box, useTheme, CircularProgress, Button } from '@mui/material';
import ResponsiveAppBar from '../../components/ResponsiveAppBar';
import PostCard from '../../components/Post';
import People from '../../components/People';
import Sidebar from '../../components/SideBar';
import { usePostContext } from '../../context/PostContext';
import LeftSider from '../../components/LeftSider';
import { AnimatePresence, motion } from 'framer-motion';


function Feed() {
  // Use allPosts from context for pagination
  const { allPosts, loading, error } = usePostContext();
  const theme = useTheme();
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const POSTS_PER_PAGE = 5;

  // Update visible posts when allPosts or currentPage changes
  useEffect(() => {
    const end = (currentPage + 1) * POSTS_PER_PAGE;
    setVisiblePosts(allPosts.slice(0, end));
  }, [allPosts, currentPage]);

  // Reset pagination when allPosts changes
  useEffect(() => {
    setCurrentPage(0);
    setVisiblePosts(allPosts.slice(0, POSTS_PER_PAGE));
  }, [allPosts]);

  const handleSeeMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMore = visiblePosts.length < allPosts.length;

  return (
    <>
      <title>Feed</title>
      <Box
        display="flex"
        justifyContent="center"
        p={1}
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#242526' : undefined,
          minHeight: '100vh',
          maxWidth: 1280,
          margin: '0 auto',
          padding: '2rem',
          paddingBottom: { xs: '5rem', md: '2rem' }, // Add bottom padding for mobile
          textAlign: 'center',
        }}
      >
        {/* Unified layout container */}
        <Box
          display="flex"
          width="100%"
          maxWidth="1200px"
          gap={4} // equal spacing between parts
        >
          {/* Left Sidebar */}
          <LeftSider>
            <Sidebar page="feed" />
          </LeftSider>

          {/* Posts Section */}
          <Box
            flex={1}
            overflow="auto"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#242526' : undefined,
              mt: 4 // Add margin top for spacing
            }}
          >
            <Box sx={{ mt: 2 }}>
              {visiblePosts.map((post, idx) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Box>
            
            {/* See More button */}
            {hasMore && !loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Button variant="contained" onClick={handleSeeMore}>
                  See More
                </Button>
              </Box>
            )}

            {/* Loading indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Error message */}
            {error && (
              <Box sx={{ color: 'error.main', p: 2 }}>
                {error}
              </Box>
            )}
          </Box>

          {/* Right Sidebar */}
          <Box
            width={200}
            display={{ xs: 'none', md: 'flex' }}
            flexDirection="column"
            gap={2}
            position="sticky"
            top={80}
            height="fit-content"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#242526' : undefined
            }}
          >
            <People type="suggestions" />
            <People type="friends" />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Feed;
