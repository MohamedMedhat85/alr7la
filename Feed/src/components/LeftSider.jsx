import React from 'react';
import { Box, useTheme } from '@mui/material';

const LeftSider = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 150,
        display: { xs: 'none', md: 'block' },
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        bgcolor: theme.palette.mode === 'dark' ? '#242526' : undefined
      }}
    >
      {children}
    </Box>
  );
};

export default LeftSider; 