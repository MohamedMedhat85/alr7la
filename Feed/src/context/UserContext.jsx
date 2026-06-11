import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import userAvatar from '../assets/images/hazem.jpg';
import postKhalid from '../assets/images/postKhalid.jpg';
import defaultProfilePic from '../assets/images/default-profile.svg';
import defaultWallpaper from '../assets/images/default-wallpaper.svg';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState(defaultProfilePic);
  const [coverPhoto, setCoverPhoto] = useState(defaultWallpaper);
  const [userName, setUserName] = useState('User');

  // Initialize user data from localStorage if available
  React.useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setProfilePhoto(parsedUserData?.profile_picture ? parsedUserData.profile_picture : defaultProfilePic);
        setCoverPhoto(parsedUserData?.wallpaper ? parsedUserData.wallpaper : defaultWallpaper);
        setUserName(parsedUserData?.name || 'User');
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  // Listen for auth state changes to update user data
  React.useEffect(() => {
    const handleAuthStateChanged = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setProfilePhoto(parsedUserData?.profile_picture ? parsedUserData.profile_picture : defaultProfilePic);
          setCoverPhoto(parsedUserData?.wallpaper ? parsedUserData.wallpaper : defaultWallpaper);
          setUserName(parsedUserData?.name || 'User');
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChanged);
    return () => window.removeEventListener('authStateChanged', handleAuthStateChanged);
  }, []);

  // Add a function to update from backend user data
  const updateUserFromBackend = (userData) => {
    setProfilePhoto(userData?.profile_picture ? userData.profile_picture : defaultProfilePic);
    setCoverPhoto(userData?.wallpaper ? userData.wallpaper : defaultWallpaper);
    setUserName(userData?.name || 'User');
    
    // Also store in localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const updateProfilePhoto = (newPhoto) => {
    setProfilePhoto(newPhoto || defaultProfilePic);
  };

  const updateCoverPhoto = (newPhoto) => {
    setCoverPhoto(newPhoto || defaultWallpaper);
  };

  const value = useMemo(() => ({
    profilePhoto,
    coverPhoto,
    updateProfilePhoto,
    updateCoverPhoto,
    userName,
    setUserName,
    updateUserFromBackend
  }), [profilePhoto, coverPhoto, userName]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider; 