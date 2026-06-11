import React from 'react';
import { Navigate } from 'react-router-dom';
import localStorageService from '../services/localStorageService';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorageService.getItem('token');

    if (!isAuthenticated) {
        // Redirect to home page if not authenticated
        return <Navigate to="/Home" replace />;
    }

    return children;
};

export default ProtectedRoute; 