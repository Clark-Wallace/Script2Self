const videoService = require('../services/videoService');

const generateVideo = async (req, res) => {
  try {
    const { text, emotion, audioData } = req.body;
    
    if (!text || !emotion) {
      return res.status(400).json({ error: 'Text and emotion data are required' });
    }
    
    const videoData = await videoService.createVideo(text, emotion, audioData);
    res.status(200).json(videoData);
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
};

module.exports = {
  generateVideo
};
