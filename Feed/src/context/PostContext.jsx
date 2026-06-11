// src/assets/context/PostContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import avatarKhalid from '../assets/images/khalid.jpg';
import avatarHany from '../assets/images/hany.jpg';
import avatarHazem from '../assets/images/hazem.jpg';
import postKhalid from '../assets/images/postKhalid.jpg';
import postJinzo from '../assets/images/jinzo.jpg';
import { feedService } from '../services/networkService';
import { useUserContext } from './UserContext';
import localStorageService from '../services/localStorageService';

// Initial posts data - will be updated with current user's profile picture
const getInitialPosts = (currentUserAvatar) => [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Khalid Osama',
      avatar: avatarKhalid,
    },
    time: new Date('2025-05-04T08:30:00Z'),
    contentType: 'image',
    contentSrc: postKhalid,
    text: 'With my friend Ahmed Hany from Kafr el Sheikh',
    isFirstPost: true,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Ahmed Hany',
      avatar: avatarHany,
    },
    time: new Date('2025-05-03T10:00:00'),
    contentType: 'text',
    contentSrc: '',
    text: "During my trip to Egypt, I explored the iconic pyramids, stood in awe of the serene Nile River, and visited the Grand Egyptian Museum. The museum showcased incredible ancient artifacts, enriching my understanding of Egypt's rich history and culture. It was a truly unforgettable journey filled with wonder and discovery.",
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Omar Ahmed',
      avatar: avatarHazem,
    },
    time: new Date('2025-04-27T18:45:00'),
    contentType: 'image',
    contentSrc: postJinzo,
    text: 'Jinzo yr7b bekom mn Al Busayli.',
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Mostafa Islam',
      avatar: avatarHany,
    },
    time: new Date('2025-03-01T14:00:00'),
    contentType: 'text',
    contentSrc: '',
    text: "I love this website",
  },
  {
    id: '5',
    user: {
      id: localStorageService.getItem('id') || '5',
      name: 'Mohamed Hazem',
      avatar: currentUserAvatar || avatarHazem,
    },
    time: new Date('2025-05-05T14:30:00'),
    contentType: 'text',
    contentSrc: '',
    text: "Just joined this amazing platform! Looking forward to sharing my travel experiences with everyone. Let's connect!",
    isFirstPost: false,
  }
];

// Create the context
const PostContext = createContext();

// Custom hook to use the context
export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

// Provider component
export const PostProvider = ({ children }) => {
  const { profilePhoto } = useUserContext();
  const [allPosts, setAllPosts] = useState([]); // Store all fetched posts
  const [displayedPosts, setDisplayedPosts] = useState([]); // Store currently displayed posts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const POSTS_PER_PAGE = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  // Refresh posts when profile photo changes to update current user's posts
  useEffect(() => {
    if (profilePhoto) {
      updateCurrentUserPostsAvatar(profilePhoto);
      // Also refresh the feed to get updated posts from backend
      fetchPosts();
    }
  }, [profilePhoto]);

  // Update displayed posts when current page changes
  useEffect(() => {
    const start = currentPage * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    setDisplayedPosts(allPosts.slice(start, end));
  }, [currentPage, allPosts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const userId = localStorageService.getItem('id');
      const profilePhoto = localStorageService.getItem('profile_picture');

      console.log('Fetching posts for user:', userId);
      console.log('Current user profile photo:', profilePhoto);

      // Use the enhanced feed endpoint that includes like status
      const response = await feedService.getFeed(userId);
      const data = response.data;

      if (!data.success || !data.data?.posts || !Array.isArray(data.data.posts)) {
        console.error('Invalid response format:', data);
        // Fallback to initial posts if API response is invalid
        console.log('Falling back to initial posts');
        const fallbackPosts = getInitialPosts(profilePhoto);
        setAllPosts(fallbackPosts);
        setHasMore(fallbackPosts.length > POSTS_PER_PAGE);
        setError('Using cached posts due to server error');
        return;
      }

      // Transform the API response to match the PostCard component's expected format
      const transformedPosts = data.data.posts.map(post => {
        // Check if this post belongs to the current user
        const isCurrentUserPost = post.user_id?.toString() === userId?.toString();

        return {
          id: post.id.toString(),
          user_id: post.user_id.toString(),
          user: {
            id: post.user_id.toString(),
            name: post.User?.name || post.user?.name || 'User ' + post.user_id,
            avatar: isCurrentUserPost ? (profilePhoto || '/default-avatar.png') : (post.User?.profile_picture || post.user?.profile_picture || '/default-avatar.png')
          },
          time: new Date(post.created_at),
          contentType: post.PostsImages?.length > 0 ? 'image' : 'text',
          contentSrc: post.PostsImages?.map(img => img.img_url) || [],
          text: post.description || '',
          description: post.description || '',
          isFirstPost: false,
          likes: post.number_of_likes || 0,
          number_of_likes: post.number_of_likes || 0,
          isLiked: post.isLiked || false,
          commentCount: post.Comments?.length || 0,
          privacy: post.visibility,
          visibility: post.visibility,
          images: (post.PostsImages || []).map(img => ({
            id: img.id,
            url: img.img_url,
            image_url: img.img_url,
            createdAt: new Date(img.created_at)
          })) || [],
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          postSourceId: post.post_source_id
        };
      });

      console.log('Final transformed posts array:', transformedPosts);
      setAllPosts(transformedPosts);
      setHasMore(transformedPosts.length > POSTS_PER_PAGE);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      // Fallback to initial posts on error
      console.log('Falling back to initial posts due to error');
      const fallbackPosts = getInitialPosts(profilePhoto);
      setAllPosts(fallbackPosts);
      setHasMore(fallbackPosts.length > POSTS_PER_PAGE);
      setError('Using cached posts due to server error');
    } finally {
      setLoading(false);
    }
  };

  // Function to load next page
  const loadNextPage = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Function to load previous page
  const loadPreviousPage = () => {
    if (currentPage > 0 && !loading) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Add a new post to the beginning of the posts array
  const addPost = (newPost) => {
    console.log('Adding new post to context:', newPost);

    try {
      // Ensure the post has all required fields with proper types
      const processedPost = {
        ...newPost,
        id: newPost.id?.toString(),
        user_id: newPost.user_id?.toString(),
        user: {
          id: newPost.user_id?.toString() || newPost.user?.id?.toString(),
          name: newPost.user?.name || 'Mohamed Hazem',
          avatar: newPost.user?.avatar || profilePhoto || '/default-avatar.png'
        },
        time: new Date(newPost.created_at),
        contentType: newPost.images?.length > 0 ? 'image' : 'text',
        contentSrc: newPost.images?.[0]?.image_url || '',
        text: newPost.description,
        description: newPost.description,
        isFirstPost: false,
        likes: newPost.number_of_likes || 0,
        number_of_likes: newPost.number_of_likes || 0,
        isLiked: newPost.isLiked || false,
        commentCount: newPost.Comments?.length || 0,
        privacy: newPost.visibility,
        visibility: newPost.visibility,
        images: (newPost.images || []).map(img => ({
          id: img.id?.toString(),
          url: img.image_url,
          image_url: img.image_url,
          createdAt: new Date(img.created_at),
          created_at: img.created_at
        })),
        createdAt: new Date(newPost.created_at),
        created_at: newPost.created_at,
        updatedAt: new Date(newPost.updated_at),
        updated_at: newPost.updated_at,
        postSourceId: newPost.post_source_id?.toString() || '0',
        post_source_id: newPost.post_source_id?.toString() || '0'
      };

      console.log('Processed post before adding:', processedPost);

      // Add the new post at the beginning of all posts
      setAllPosts(prevPosts => {
        const updatedPosts = [processedPost, ...prevPosts];
        console.log('Updated posts array:', updatedPosts);
        return updatedPosts;
      });

      // Reset to first page to show the new post
      setCurrentPage(0);
    } catch (error) {
      console.error('Error adding new post:', error);
      // Still try to add the post even if processing fails
      setAllPosts(prevPosts => [newPost, ...prevPosts]);
      setCurrentPage(0);
    }
  };

  // Function to like/unlike a post
  const toggleLikePost = (postIndex) => {
    setAllPosts(currentPosts =>
      currentPosts.map((post, index) =>
        index === postIndex
          ? { ...post, liked: !post.liked, likes: post.liked ? (post.likes - 1) : (post.likes + 1 || 1) }
          : post
      )
    );
  };

  // Function to add a comment to a post
  const addComment = (postIndex, comment) => {
    setAllPosts(currentPosts =>
      currentPosts.map((post, index) => {
        if (index === postIndex) {
          const updatedComments = [...(post.comments || []), comment];
          return {
            ...post,
            comments: updatedComments
          };
        }
        return post;
      })
    );
  };

  const updatePost = (updatedPost) => {
    setAllPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const deletePost = (postId) => {
    console.log('PostContext: deletePost called with postId:', postId);
    console.log('PostContext: Current posts before deletion:', allPosts);

    if (!postId) {
      console.error('PostContext: No postId provided for deletion');
      return;
    }

    // Use a direct state update to ensure immediate effect
    const updatedPosts = allPosts.filter(post => post.id !== postId);
    console.log('PostContext: Posts after deletion:', updatedPosts);
    setAllPosts(updatedPosts);
  };

  // Update current user's posts avatar when profile photo changes
  const updateCurrentUserPostsAvatar = (newProfilePhoto) => {
    const currentUserId = localStorageService.getItem('id');
    if (!currentUserId) return;

    setAllPosts(prevPosts =>
      prevPosts.map(post => {
        // Check if this post belongs to the current user
        if (post.user?.id === currentUserId || post.user_id === currentUserId) {
          return {
            ...post,
            user: {
              ...post.user,
              avatar: newProfilePhoto
            }
          };
        }
        return post;
      })
    );
  };

  // Value to be provided to consumers
  const value = {
    posts: displayedPosts,
    allPosts,
    loading,
    error,
    hasMore,
    currentPage,
    addPost,
    toggleLikePost,
    addComment,
    updatePost,
    deletePost,
    refreshPosts: fetchPosts,
    loadNextPage,
    loadPreviousPage
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;