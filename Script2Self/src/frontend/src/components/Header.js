import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <MovieFilterIcon sx={{ mr: 1, color: '#9c27b0' }} />
          <Typography variant="h5" component="div" className="gradient-text" sx={{ fontWeight: 700 }}>
            Script2Self
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          You write it. You voice it. We animate it.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
