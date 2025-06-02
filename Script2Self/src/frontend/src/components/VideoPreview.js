import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Paper, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ReplayIcon from '@mui/icons-material/Replay';
import ShareIcon from '@mui/icons-material/Share';

const VideoPreview = ({ videoData, text, emotion, onReset }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Auto-play when video is loaded
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Auto-play was prevented:', error);
          });
      }
    }
  }, [videoData]);
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = videoData.url;
    a.download = `Script2Self_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Script2Self Video',
          text: 'Check out this video I created with Script2Self!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Sharing is not supported on this browser. You can download the video and share it manually.');
    }
  };
  
  // Get emotion class for styling
  const getEmotionClass = () => {
    if (!emotion || !emotion.primaryEmotion) return 'emotion-neutral';
    return `emotion-${emotion.primaryEmotion.toLowerCase()}`;
  };

  return (
    <Box className="fade-in" sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Paper 
        elevation={6}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom align="center" className="gradient-text">
          Your Video is Ready
        </Typography>
        
        {emotion && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="body1" className={getEmotionClass()}>
              <strong>{emotion.primaryEmotion}</strong> • Intensity: {emotion.intensity}/10
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
              {emotion.briefDescription}
            </Typography>
          </Box>
        )}
        
        <Box className="video-container" sx={{ mb: 3 }}>
          <video 
            ref={videoRef}
            width="100%" 
            height="auto"
            controls
            onClick={handlePlayPause}
            style={{ borderRadius: '8px' }}
          >
            <source src={videoData.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ReplayIcon />}
            onClick={onReset}
          >
            Create New
          </Button>
          
          <Box>
            <IconButton 
              color="primary" 
              onClick={handleShare}
              sx={{ mr: 1 }}
            >
              <ShareIcon />
            </IconButton>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ 
                boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(156, 39, 176, 0.6)',
                },
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default VideoPreview;
