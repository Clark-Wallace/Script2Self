const emotionService = require('../services/emotionService');

const analyzeEmotion = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const emotionData = await emotionService.detectEmotion(text);
    res.status(200).json(emotionData);
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    res.status(500).json({ error: 'Failed to analyze emotion' });
  }
};

module.exports = {
  analyzeEmotion
};
