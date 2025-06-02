const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

// Route to generate voice from text
router.post('/generate', voiceController.generateVoice);

module.exports = router;
