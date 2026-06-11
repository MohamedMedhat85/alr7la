import React, { useRef, useState } from 'react';
import { Avatar, IconButton, Box, Backdrop, Dialog, DialogContent, Typography, CircularProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useUserContext } from '../context/UserContext';
import { uploadService } from '../services/networkService';
import localStorageService from '../services/localStorageService';

const UserAvatar = ({ src, size = 32, sx = {}, allowChange = false, onUploadStart, onUploadSuccess, onUploadEnd, onAvatarClick }) => {
  const { profilePhoto, updateProfilePhoto } = useUserContext();
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadStart?.('Uploading profile picture...');
      
      try {
        // Upload the file to the backend
        const response = await uploadService.uploadProfilePicture(file);
        
        if (response.data.success) {
          // Update the profile photo with the URL from the backend
          const profilePictureUrl = response.data.data?.profile_picture;
          if (profilePictureUrl) {
            updateProfilePhoto(profilePictureUrl);
            
            // Also update user data in localStorage if it exists
            const currentUserData = localStorageService.getItem('userData');
            if (currentUserData) {
              const updatedUserData = {
                ...currentUserData,
                profile_picture: profilePictureUrl
              };
              localStorageService.setItem('userData', updatedUserData);
            }
            
            // Show success message
            onUploadSuccess?.('Profile picture updated successfully!');
          } else {
            console.error('Failed to upload profile picture: No URL in response');
          }
        } else {
          console.error('Failed to upload profile picture:', response.data.message);
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      } finally {
        onUploadEnd?.();
      }
    }
  };

  const handleClick = () => {
    if (allowChange) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        display: 'inline-block',
        '&:hover .profile-photo-edit': {
          opacity: 1,
        },
      }}
    >
      <Avatar
        src={src || profilePhoto}
        alt="User Avatar"
        sx={{
          width: size,
          height: size,
          cursor: allowChange ? 'pointer' : 'default',
          ...sx
        }}
        onClick={onAvatarClick}
      />
      {allowChange && (
        <>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <IconButton
            className="profile-photo-edit"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'primary.main',
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.2s',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              width: size * 0.4,
              height: size * 0.4,
              minWidth: 0,
              minHeight: 0,
            }}
            onClick={handleClick}
          >
            <PhotoCameraIcon sx={{ fontSize: size * 0.25 }} />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default UserAvatar; 