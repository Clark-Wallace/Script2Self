import React from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { PulseLoader } from 'react-spinners';

const ProcessingIndicator = ({ emotion }) => {
  // Different messages to show during processing
  const processingMessages = [
    "Analyzing emotional tone...",
    "Generating voice synthesis...",
    "Creating visual elements...",
    "Composing your video..."
  ];

  // Get a random message from the array
  const getRandomMessage = () => {
    const index = Math.floor(Math.random() * processingMessages.length);
    return processingMessages[index];
  };

  const [message, setMessage] = React.useState(getRandomMessage());

  // Change message every few seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getRandomMessage());
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="fade-in" sx={{ textAlign: 'center', width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Paper 
        elevation={6}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
        
        <Typography variant="h5" gutterBottom className="gradient-text">
          {message}
        </Typography>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          <PulseLoader color="#9c27b0" size={10} speedMultiplier={0.8} />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
          Crafting your emotional experience...
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProcessingIndicator;
