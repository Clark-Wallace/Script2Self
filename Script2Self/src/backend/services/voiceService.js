const axios = require('axios');
const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

/**
 * Synthesizes voice from text using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @param {Object} emotion - Emotion data to adjust voice parameters
 * @returns {Object} - Audio data including file path
 */
const synthesizeVoice = async (text, emotion) => {
  try {
    // Create directory for audio files if it doesn't exist
    const audioDir = path.join(__dirname, '../../assets/audio');
    await mkdir(audioDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = Date.now();
    const audioFilePath = path.join(audioDir, `voice_${timestamp}.mp3`);
    
    // Adjust voice parameters based on emotion
    const voiceSettings = getVoiceSettingsForEmotion(emotion);
    
    // Call ElevenLabs API
    const response = await axios({
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: voiceSettings
      },
      responseType: 'arraybuffer'
    });
    
    // Save audio file
    await writeFile(audioFilePath, response.data);
    
    return {
      success: true,
      audioPath: audioFilePath,
      duration: estimateAudioDuration(text)
    };
  } catch (error) {
    console.error('Error in voice synthesis service:', error);
    
    // Fallback to browser's TTS if ElevenLabs fails
    return fallbackTTS(text, emotion);
  }
};

/**
 * Fallback to browser's TTS if ElevenLabs API fails
 * @param {string} text - The text to convert to speech
 * @param {Object} emotion - Emotion data
 * @returns {Object} - Audio data for frontend to use browser's TTS
 */
const fallbackTTS = (text, emotion) => {
  return {
    success: false,
    fallback: true,
    text: text,
    emotion: emotion
  };
};

/**
 * Estimates audio duration based on text length
 * @param {string} text - The text to estimate duration for
 * @returns {number} - Estimated duration in seconds
 */
const estimateAudioDuration = (text) => {
  // Average reading speed is about 150 words per minute
  const words = text.split(' ').length;
  const minutes = words / 150;
  return Math.max(minutes * 60, 3); // Minimum 3 seconds
};

/**
 * Gets voice settings based on emotion
 * @param {Object} emotion - Emotion data
 * @returns {Object} - Voice settings for ElevenLabs API
 */
const getVoiceSettingsForEmotion = (emotion) => {
  // Default settings
  let stability = 0.5;
  let similarity_boost = 0.5;
  
  if (emotion) {
    switch(emotion.primaryEmotion) {
      case 'joy':
        stability = 0.3; // More variable for happy emotions
        similarity_boost = 0.7;
        break;
      case 'sadness':
        stability = 0.8; // More stable for sad emotions
        similarity_boost = 0.4;
        break;
      case 'anger':
        stability = 0.2; // Very variable for angry emotions
        similarity_boost = 0.6;
        break;
      case 'fear':
        stability = 0.7;
        similarity_boost = 0.3;
        break;
      default:
        // Use defaults for other emotions
    }
    
    // Adjust based on intensity
    if (emotion.intensity) {
      const intensityFactor = emotion.intensity / 10;
      stability = Math.max(0.1, Math.min(0.9, stability * (1 - intensityFactor * 0.5)));
    }
  }
  
  return {
    stability,
    similarity_boost
  };
};

module.exports = {
  synthesizeVoice
};
