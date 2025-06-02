const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Route to generate video from text, emotion, and audio
router.post('/generate', videoController.generateVideo);

module.exports = router;
