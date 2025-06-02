const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotionController');

// Route to analyze text and detect emotion
router.post('/analyze', emotionController.analyzeEmotion);

module.exports = router;
