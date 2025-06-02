import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Process text to generate emotion analysis, voice, and video
 * @param {string} text - User input text
 * @returns {Object} - Processing result with video data and emotion info
 */
export const processText = async (text) => {
  try {
    // Step 1: Analyze emotion
    const emotionResponse = await axios.post(`${API_URL}/emotion/analyze`, { text });
    const emotion = emotionResponse.data;
    
    // Step 2: Generate voice
    const voiceResponse = await axios.post(`${API_URL}/voice/generate`, { 
      text, 
      emotion 
    });
    const audioData = voiceResponse.data;
    
    // Step 3: Generate video
    const videoResponse = await axios.post(`${API_URL}/video/generate`, {
      text,
      emotion,
      audioData
    });
    const videoData = videoResponse.data;
    
    // Add a URL for frontend to access the video
    videoData.url = `${API_URL}/assets/video/${videoData.videoPath.split('/').pop()}`;
    
    return {
      success: true,
      emotion,
      audioData,
      videoData
    };
  } catch (error) {
    console.error('API processing error:', error);
    throw new Error('Failed to process text');
  }
};
