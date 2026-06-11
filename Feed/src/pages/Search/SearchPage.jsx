import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import Search from './Search';
import ResponsiveAppBar from '../../components/ResponsiveAppBar';
import LeftSider from '../../components/LeftSider';
import Sidebar from '../../components/SideBar';

function SearchPage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <>
      <ResponsiveAppBar />
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: isDarkMode ? '#18191a' : 'background.default',
        pt: { xs: 8, sm: 10, md: 12 }, // Responsive padding top
        paddingBottom: { xs: '5rem', md: '0' }, // Add bottom padding for mobile
      }}>
        {/* Left Sidebar - hidden on mobile */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <LeftSider>
            <Sidebar page="search" />
          </LeftSider>
        </Box>

        {/* Main Content */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: { xs: 0, sm: 2, md: 8, lg: 12 }, // Responsive left padding
          pr: { xs: 0, sm: 2, md: 3 }, // Responsive right padding
          ml: { xs: 0, sm: 2, md: 8 }, // Responsive left margin
          px: { xs: 1, sm: 2 }, // Extra padding for mobile
        }}>
          <Container 
            maxWidth="lg" 
            sx={{
              height: { 
                xs: 'calc(100vh - 100px)', // Mobile height
                sm: 'calc(100vh - 120px)', // Tablet height
                md: 'calc(100vh - 140px)' // Desktop height
              },
              maxWidth: { 
                xs: '100% !important', // Full width on mobile
                sm: '600px !important', // Medium width on tablet
                md: '800px !important' // Full width on desktop
              },
              px: { xs: 0, sm: 2 } // Remove horizontal padding on mobile
            }}
          >
            <Box sx={{
              bgcolor: isDarkMode ? '#242526' : 'background.paper',
              borderRadius: { xs: 0, sm: 2 }, // Remove border radius on mobile
              boxShadow: {
                xs: 'none', // Remove shadow on mobile
                sm: isDarkMode
                  ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  : '0 4px 20px rgba(0, 0, 0, 0.1)'
              },
              overflow: 'hidden',
              height: '100%',
              border: {
                xs: 'none', // Remove border on mobile
                sm: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              },
              backdropFilter: isDarkMode ? 'blur(10px)' : 'none',
              // Full width on mobile
              width: { xs: '100%', sm: 'auto' },
              // Remove margin on mobile
              mx: { xs: 0, sm: 'auto' }
            }}>
              <Search />
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default SearchPage;