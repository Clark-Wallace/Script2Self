import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const TextInput = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 280; // Twitter-like character limit

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInputText(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && inputText.length <= MAX_CHARS) {
      onSubmit(inputText);
    }
  };

  return (
    <Box className="text-input-container fade-in" sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Paper 
        elevation={6}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom align="center" className="gradient-text">
          Transform Your Thoughts
        </Typography>
        
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4, opacity: 0.8 }}>
          Write something meaningful to you. We'll turn it into an emotional video.
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="What's on your mind?"
            value={inputText}
            onChange={handleTextChange}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(156, 39, 176, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(156, 39, 176, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" color={charCount > MAX_CHARS * 0.8 ? 'error' : 'text.secondary'}>
              {charCount}/{MAX_CHARS}
            </Typography>
            
            <Button 
              type="submit"
              variant="contained" 
              color="primary"
              endIcon={<SendIcon />}
              disabled={!inputText.trim() || inputText.length > MAX_CHARS}
              sx={{ 
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(156, 39, 176, 0.6)',
                },
              }}
            >
              Create Video
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default TextInput;
