// Script2Self - Main Server Configuration
// This file sets up the Express server and routes for the Script2Self application

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Server Configuration
 * - CORS setup for frontend communication
 * - JSON body parsing
 * - Static file serving for generated assets
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create assets directories if they don't exist
const assetsDir = path.join(__dirname, '../assets');
const audioDir = path.join(assetsDir, 'audio');
const videoDir = path.join(assetsDir, 'video');
const framesDir = path.join(assetsDir, 'frames');

[assetsDir, audioDir, videoDir, framesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files from assets directory
app.use('/api/assets', express.static(path.join(__dirname, '../assets')));

// Import routes
const emotionRoutes = require('./routes/emotionRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const videoRoutes = require('./routes/videoRoutes');

// Use routes
app.use('/api/emotion', emotionRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/video', videoRoutes);

// Root route - API status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Script2Self API is running',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Script2Self server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
