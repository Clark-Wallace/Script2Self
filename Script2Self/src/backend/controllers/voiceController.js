const voiceService = require('../services/voiceService');

const generateVoice = async (req, res) => {
  try {
    const { text, emotion } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const audioData = await voiceService.synthesizeVoice(text, emotion);
    res.status(200).json(audioData);
  } catch (error) {
    console.error('Error generating voice:', error);
    res.status(500).json({ error: 'Failed to generate voice' });
  }
};

module.exports = {
  generateVoice
};
