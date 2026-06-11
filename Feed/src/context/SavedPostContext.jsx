import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for saved posts
const SavedPostContext = createContext();

// Custom hook to use the context
export const useSavedPostContext = () => useContext(SavedPostContext);

// Provider component
export const SavedPostProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      const storedPosts = localStorage.getItem('savedPosts');
      return storedPosts ? JSON.parse(storedPosts) : [];
    } catch (error) {
      console.error('Error retrieving saved posts from localStorage:', error);
      return [];
    }
  });

  // Update localStorage whenever savedPosts changes
  useEffect(() => {
    try {
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  }, [savedPosts]);

  // Function to add a post to saved posts
  const addSavedPost = (post) => {
    console.log("Adding post to saved:", post);
    setSavedPosts((prevSavedPosts) => {
      // Check if post already exists
      const isDuplicate = prevSavedPosts.some(
        (savedPost) => savedPost.id === post.id
      );
      
      if (isDuplicate) {
        console.log("Post already saved");
        return prevSavedPosts;
      }
      
      // Create new post with timestamp
      const newPost = { 
        ...post, 
        savedAt: new Date().toISOString() // Use ISO string for better serialization
      };
      
      const updatedPosts = [...prevSavedPosts, newPost];
      console.log("New saved posts:", updatedPosts);
      return updatedPosts;
    });
  };

  // Function to remove a post from saved posts
  const removeSavedPost = (post) => {
    console.log("Removing post from saved:", post);
    setSavedPosts((prevSavedPosts) => {
      const updatedPosts = prevSavedPosts.filter((savedPost) => {
        const idsMatch = savedPost.id === post.id;
        const contentAndTimeMatch = 
          savedPost.contentSrc === post.contentSrc && 
          savedPost.time === post.time;
        
        return !(idsMatch || contentAndTimeMatch);
      });
      console.log("Updated saved posts after removal:", updatedPosts);
      return updatedPosts;
    });
  };

  // Values to expose through context
  const contextValue = {
    savedPosts,
    addSavedPost,
    removeSavedPost,
  };

  return (
    <SavedPostContext.Provider value={contextValue}>
      {children}
    </SavedPostContext.Provider>
  );
};