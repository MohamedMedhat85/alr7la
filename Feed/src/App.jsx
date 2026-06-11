import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import SavedPosts from './pages/SavedPosts/SavedPosts';
import SearchPage from './pages/Search/SearchPage';
import { PostProvider } from './context/PostContext';
import { SavedPostProvider } from './context/SavedPostContext';
import UserProvider from './context/UserContext';

import { ThemeProvider } from './context/ThemeContext';
import CustomizeTrip from './pages/TripPlanner/CustomizeTrip.jsx'
import TripPlanner from './pages/TripPlanner/result/trip-planner.tsx'
import ResponsiveAppBar from './components/ResponsiveAppBar';
import BottomNav from './components/BottomNavigation';
import Home from './pages/Home/Home.jsx';
import Discover from './components/Discover/Discover.jsx';
import CountryProfile from './components/Country/Country.jsx';
import ProtectedRoute from './components/ProtectedRoute';

import MyTrips from './pages/MyTrips/MyTrips.jsx';
import PlaceProfile from './components/Place/Place.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from './services/authService';
import { AuthProvider, useAuth } from './context/AuthContext';

// Add a hook to detect screen width
function useIsWideScreen(breakpoint = 600) {
  const [isWide, setIsWide] = React.useState(window.innerWidth >= breakpoint);
  React.useEffect(() => {
    const handleResize = () => setIsWide(window.innerWidth >= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isWide;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const isWideScreen = useIsWideScreen(600);

  return (
    <Router>
      <ResponsiveAppBar />
      {isAuthenticated && <BottomNav />}
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Auth/" element={<Home />} />
        <Route path="/trending-trips" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/country/:id" element={<CountryProfile />} />
        <Route path="/place/:id" element={<PlaceProfile />} />

        {/* Protected Routes */}
        <Route path="/trip-planner" element={
          <ProtectedRoute>
            <CustomizeTrip />
          </ProtectedRoute>
        } />
        <Route path="/trip-planner/:id" element={
          <ProtectedRoute>
            <TripPlanner />
          </ProtectedRoute>
        } />

        <Route path="/trip-planner/result" element={
          <ProtectedRoute>
            <TripPlanner />
          </ProtectedRoute>
        } />

        <Route path="/trip-planner/result/:id" element={
          <ProtectedRoute>
            <TripPlanner />
          </ProtectedRoute>
        } />

        {/* Routes that need PostProvider */}
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path="/my-trips" element={
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        } />
        <Route path="/saved-posts" element={
          <ProtectedRoute>
            <SavedPosts />
          </ProtectedRoute>
        } />
        <Route path="/profile/:id" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/my-trips" element={
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <PostProvider>
        <ThemeProvider>
          <SavedPostProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </SavedPostProvider>
        </ThemeProvider>
      </PostProvider>
    </UserProvider>
  );
}

export default App;