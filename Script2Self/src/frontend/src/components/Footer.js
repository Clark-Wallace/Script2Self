import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        textAlign: 'center',
        opacity: 0.7,
        mt: 'auto'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Script2Self
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        <Link href="#" color="inherit" sx={{ mx: 1 }}>Privacy</Link>
        <Link href="#" color="inherit" sx={{ mx: 1 }}>Terms</Link>
        <Link href="#" color="inherit" sx={{ mx: 1 }}>About</Link>
      </Typography>
    </Box>
  );
};

export default Footer;
