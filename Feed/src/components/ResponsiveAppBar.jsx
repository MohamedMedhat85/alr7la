import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import LoginModal from '../pages/Auth/SignIn/LoginModal.jsx';
import RegisterModal from '../pages/Auth/SignUp/RegisterModal.jsx';
import OtpModal from '../pages/Auth/Otp/OtpModal.jsx';
import ResetPasswordModal from '../pages/Auth/Otp/ResetPasswordModal.jsx';
import UserAvatar from './UserAvatar';
import CurrencyConverter from './Currency';

import localStorageService from '../services/localStorageService';
import authService from '../services/authService';
import { useUserContext } from '../context/UserContext';
import { profileService } from '../services/networkService';
import { useAuth } from '../context/AuthContext';

const pages = [
  { label: 'Discover', path: '/discover' },
  { label: 'Trip Planner', path: '/trip-planner' },
  { label: 'Feed', path: '/feed' },
  // "More" will hold others
];

const moreMenuItems = [
  { label: 'My Trips', path: '/my-trips' },
  { label: 'Currency Converter', action: 'currency' },
];

// Only show Profile and Logout
const settings = [
  { label: 'Profile', path: '/profile' },
  { label: 'Logout', action: 'logout' },
];

function ResponsiveAppBar() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElMore, setAnchorElMore] = React.useState(null);
  const [converterOpen, setConverterOpen] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showOtp, setShowOtp] = React.useState(false);
  const [showResetPassword, setShowResetPassword] = React.useState(false);
  const { updateUserFromBackend } = useUserContext();
  const { isAuthenticated, logout } = useAuth();

  // Function to fetch user data
  const fetchUserData = async (userId) => {
    try {
      const response = await profileService.getProfile(userId);
      if (response.data) {
        updateUserFromBackend(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorageService.getItem('token');
      const currentAuth = !!token;
      if (currentAuth !== isAuthenticated) {
        setIsAuthenticated(currentAuth);
        
        // If user is authenticated, fetch their data
        if (currentAuth) {
          const userId = localStorageService.getItem('id');
          if (userId) {
            fetchUserData(userId);
          }
        }
      }
    };

    const handleAuthStateChanged = () => {
      // When auth state changes (like after login), fetch user data immediately
      const userId = localStorageService.getItem('id');
      if (userId) {
        fetchUserData(userId);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authStateChanged', handleAuthStateChanged);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, [isAuthenticated, updateUserFromBackend]);

  // Initial fetch of user data if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const userId = localStorageService.getItem('id');
      if (userId) {
        fetchUserData(userId);
      }
    }
  }, []);

  const openLogin = () => {
    setShowRegister(false); setShowOtp(false); setShowLogin(true); setShowResetPassword(false);
  };

  const openRegister = () => {
    setShowLogin(false); setShowOtp(false); setShowRegister(true); setShowResetPassword(false);
  };

  const openOtp = () => {
    setShowLogin(false); setShowRegister(false); setShowOtp(true); setShowResetPassword(false);
  };

  const openResetPassword = () => {
    setShowLogin(false); setShowRegister(false); setShowOtp(false); setShowResetPassword(true);
  };

  const closeAll = () => {
    setShowLogin(false); setShowRegister(false); setShowOtp(false); setShowResetPassword(false);
  };

  const handleOpenNavMenu = (event) => { setAnchorElNav(event.currentTarget); };
  const handleOpenUserMenu = (event) => { setAnchorElUser(event.currentTarget); };
  const handleOpenMoreMenu = (event) => { setAnchorElMore(event.currentTarget); };
  const handleCloseNavMenu = () => { setAnchorElNav(null); };
  const handleCloseUserMenu = () => { setAnchorElUser(null); };
  const handleCloseMoreMenu = () => { setAnchorElMore(null); };

  const handleNavigation = (page) => {
    if ((page.path === '/feed' || page.path === '/trip-planner') && !isAuthenticated) {
      openLogin(); return;
    }
    navigate(page.path);
    handleCloseNavMenu();
    handleCloseMoreMenu();
  };

  const handleMenuItemClick = (setting) => {
    if (setting.action === 'currency') setConverterOpen(true);
    else if (setting.action === 'logout') {
      logout();
      handleCloseUserMenu();
      handleCloseNavMenu();
      handleCloseMoreMenu();
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 0);
    } else if (setting.path) navigate(setting.path);
    handleCloseUserMenu();
    handleCloseNavMenu();
    handleCloseMoreMenu();
  };

  const handleMoreMenuClick = (item) => {
    if (item.action === 'currency') setConverterOpen(true);
    else handleNavigation(item);
    handleCloseMoreMenu();
  };

  const handleCloseConverter = () => setConverterOpen(false);

  return (
    <AppBar position="fixed"
      sx={{
        backgroundColor: isDarkMode ? '#242526' : '#FEFFFF',
        color: isDarkMode ? '#e4e6eb' : '#1E1E1E',
        zIndex: 1201,
      }}
    >
      <Container maxWidth="xl" sx={{ p: 0, mb: 0 }}>
        {/* Modals */}
        {showLogin && <LoginModal open onClose={closeAll} onSwitchToRegister={openRegister}
          onSwitchToOtp={openOtp}
          onLoginSuccess={() => { setIsAuthenticated(true); closeAll(); }}
        />}
        {showRegister && <RegisterModal open onClose={closeAll} onSwitchToLogin={openLogin} />}
        {showOtp && <OtpModal open onClose={closeAll} onSwitchToLogin={openLogin} onSwitchToResetPassword={openResetPassword} />}
        {showResetPassword && <ResetPasswordModal open onClose={closeAll} onSwitchToOtp={openOtp} onSwitchToRegister={openRegister} />}

        <Toolbar
          disableGutters
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minHeight: { xs: 56, sm: 64 },
            px: 2,
            width: '100%',
          }}
        >

          {/* --- Left: Nav/Menu (mobile & desktop) --- */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            flexBasis: 'auto',
            flexGrow: 0,
            position: { xs: 'static', lg: 'fixed' },
            left: { xs: 'auto', lg: 24 },
            zIndex: 2
          }}>
            {/* --- Mobile Hamburger --- */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleOpenNavMenu}
                sx={{ color: isDarkMode ? '#e4e6eb' : '#1E1E1E' }}
              >
                <MenuIcon />
              </IconButton>
              {/* Hamburger Menu */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    bgcolor: isDarkMode ? '#242526' : '#fff',
                    color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                  }
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.label} onClick={() => handleNavigation(page)} >
                    <Typography sx={{
                      textAlign: 'center',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: isDarkMode ? '#e4e6eb' : '#1E1E1E',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#147DFF',
                      }
                    }}>{page.label}</Typography>
                  </MenuItem>
                ))}
                {/* Add More dropdown to the Hamburger Menu */}
                <MenuItem onClick={handleOpenMoreMenu}>
                  <Typography sx={{
                    fontWeight: 500,
                    color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                  }}>
                    More <KeyboardArrowDownIcon fontSize="small" style={{ verticalAlign: 'middle', marginLeft: 4 }} />
                  </Typography>
                </MenuItem>
              </Menu>
              <Menu
                id="menu-appbar-more-mobile"
                anchorEl={anchorElMore}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElMore)}
                onClose={handleCloseMoreMenu}
                sx={{
                  '& .MuiPaper-root': {
                    bgcolor: isDarkMode ? '#242526' : '#fff',
                    color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                  }
                }}
              >
                {moreMenuItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => handleMoreMenuClick(item)}>
                    <Typography sx={{
                      textAlign: 'center', color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                    }}>{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* --- Desktop Nav --- */}
            <Stack direction="row" spacing={1}
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', minWidth: 0 }}>
              {pages.map((page) => (
                <Button
                  key={page.label}
                  onClick={() => handleNavigation(page)}
                  sx={{
                    my: 2, mx: { md: '1px', lg: '10px' },
                    color: isDarkMode ? '#e4e6eb' : '#1E1E1E',
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    minWidth: 0,
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: '#147DFF'
                    }
                  }}
                >
                  {page.label}
                </Button>
              ))}
              <Button
                id="more-button"
                onClick={handleOpenMoreMenu}
                sx={{
                  my: 2, mx: { md: '1px', lg: '10px' },
                  color: isDarkMode ? '#e4e6eb' : '#1E1E1E',
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: '#147DFF'
                  }
                }}
                endIcon={<KeyboardArrowDownIcon />}
                aria-controls={Boolean(anchorElMore) ? 'more-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorElMore) ? 'true' : undefined}
              >
                More
              </Button>
              <Menu
                id="more-menu"
                anchorEl={anchorElMore}
                open={Boolean(anchorElMore)}
                onClose={handleCloseMoreMenu}
                MenuListProps={{ 'aria-labelledby': 'more-button' }}
                sx={{
                  '& .MuiPaper-root': {
                    bgcolor: isDarkMode ? '#242526' : '#fff',
                    color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                  }
                }}
              >
                {moreMenuItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => handleMoreMenuClick(item)}>
                    <Typography sx={{
                      textAlign: 'center', color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                    }}>{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
          </Box>

          {/* --- Center: LOGO (absolute, independent of flex grow) --- */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              maxWidth: { xs: 100, sm: 120, md: 160 },
              width: { xs: 80, sm: 100, md: 160 },
              visibility: { xs: 'visible', lg: 'hidden' }
            }}
          >
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                p: 0, '&:hover': { backgroundColor: 'transparent' },
                width: '100%',
              }}
            >
              <Box
                component="img"
                src={Logo}
                alt="Logo"
                sx={{
                  width: '100%',
                  height: 'auto',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                  maxHeight: '48px',
                  minHeight: '32px',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              />
            </IconButton>
          </Box>

          {/* --- Right: Notification + Avatar/Login --- */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            ml: 'auto',
            position: { xs: 'static', lg: 'fixed' },
            right: { xs: 'auto', lg: 24 },
            zIndex: 2
          }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <UserAvatar size={40} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: '40px',
                    '& .MuiPaper-root': {
                      bgcolor: isDarkMode ? '#242526' : '#fff',
                      color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                    }
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.label}
                      onClick={() => handleMenuItemClick(setting)}
                      sx={{
                        '&:hover': {
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <Typography sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        color: isDarkMode ? '#e4e6eb' : '#1E1E1E'
                      }}>{setting.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                sx={{
                  textTransform: 'none',
                  borderRadius: 5,
                  padding: '6px 16px',
                  backgroundColor: 'black',
                  color: 'white',
                  fontWeight: 600,
                  marginRight: 2,
                  minWidth: { xs: 70, md: 96 },
                  '&:hover': { transform: 'scale(1.05)' }
                }}
                onClick={openLogin}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Currency Converter Modal */}
      <Modal
        aria-labelledby="currency-converter-modal"
        aria-describedby="currency-converter-description"
        open={converterOpen}
        onClose={handleCloseConverter}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(5px)',
            },
          }
        }}
      >
        <Fade in={converterOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 500,
            width: '90%',
            bgcolor: isDarkMode ? '#242526' : 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: 'none',
            color: isDarkMode ? '#e4e6eb' : 'inherit'
          }}>
            <IconButton
              aria-label="close"
              onClick={handleCloseConverter}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: isDarkMode ? '#e4e6eb' : theme.palette.grey[500],
                '&:hover': {
                  color: '#147DFF',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <CurrencyConverter />
          </Box>
        </Fade>
      </Modal>

      {/* Desktop Logo (only visible on large screens) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          alignItems: 'center',
          maxWidth: 160,
          width: 160
        }}
      >
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            p: 0,
            '&:hover': { backgroundColor: 'transparent' },
            width: '100%',
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              width: '100%',
              height: 'auto',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
              maxHeight: '48px',
              minHeight: '32px',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          />
        </IconButton>
      </Box>
    </AppBar>
  );
}

export default ResponsiveAppBar;