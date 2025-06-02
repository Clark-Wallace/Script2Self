import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextInput from './components/TextInput';
import VideoPreview from './components/VideoPreview';
import ProcessingIndicator from './components/ProcessingIndicator';
import Header from './components/Header';
import Footer from './components/Footer';
import { processText } from './utils/api';
import './styles/App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#03a9f4',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

function App() {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);
  const [emotion, setEmotion] = useState(null);

  const handleTextSubmit = async (inputText) => {
    if (!inputText.trim()) return;
    
    setText(inputText);
    setProcessing(true);
    setError(null);
    setVideoData(null);
    
    try {
      const result = await processText(inputText);
      setVideoData(result.videoData);
      setEmotion(result.emotion);
    } catch (err) {
      console.error('Error processing text:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setText('');
    setVideoData(null);
    setEmotion(null);
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
            {!videoData && !processing && (
              <TextInput onSubmit={handleTextSubmit} />
            )}
            
            {processing && (
              <ProcessingIndicator emotion={emotion} />
            )}
            
            {videoData && !processing && (
              <VideoPreview 
                videoData={videoData} 
                text={text}
                emotion={emotion}
                onReset={handleReset}
              />
            )}
            
            {error && (
              <Box sx={{ textAlign: 'center', color: 'error.main', mt: 2 }}>
                {error}
              </Box>
            )}
          </Box>
          
          <Footer />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
