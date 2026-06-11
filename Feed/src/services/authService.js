import localStorageService from './localStorageService';

const authService = {
  logout: () => {
    // Clear all authentication data
    localStorageService.removeItem('userData');
    localStorageService.removeItem('token');
    localStorageService.removeItem('refreshToken');
    localStorageService.removeItem('profile_picture');
    localStorageService.removeItem('id');
    
    // Clear any other auth-related data
    localStorageService.removeItem('user');
    localStorageService.removeItem('auth');
    
    return true;
  },
  
  isAuthenticated: () => {
    return !!localStorageService.getItem('token');
  },
  
  getToken: () => {
    return localStorageService.getItem('token');
  },
  
  getUserId: () => {
    return localStorageService.getItem('id');
  }
};

export default authService; 