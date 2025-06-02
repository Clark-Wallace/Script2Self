const fs = require('fs');
const path = require('path');
const util = require('util');
const ffmpeg = require('fluent-ffmpeg');
const { createCanvas, loadImage } = require('canvas');

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

/**
 * Creates a video based on text, emotion, and audio data
 * @param {string} text - The original text
 * @param {Object} emotion - Emotion data including primary emotion, intensity, and visual style
 * @param {Object} audioData - Audio data including file path and duration
 * @returns {Object} - Video data including file path
 */
const createVideo = async (text, emotion, audioData) => {
  try {
    // Create directory for video files if it doesn't exist
    const videoDir = path.join(__dirname, '../../assets/video');
    await mkdir(videoDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = Date.now();
    const videoFilePath = path.join(videoDir, `video_${timestamp}.mp4`);
    
    // Generate animation frames based on emotion
    const framesDir = path.join(__dirname, '../../assets/frames');
    await mkdir(framesDir, { recursive: true });
    
    // Generate frames for animation
    await generateAnimationFrames(text, emotion, framesDir);
    
    // Determine audio source
    let audioSource;
    if (audioData && audioData.audioPath && fs.existsSync(audioData.audioPath)) {
      audioSource = audioData.audioPath;
    } else {
      // If no audio file, we'll create a silent video
      // Frontend will handle TTS fallback
      audioSource = null;
    }
    
    // Create video from frames and audio
    await createVideoFromFrames(framesDir, audioSource, videoFilePath, audioData?.duration || 10);
    
    return {
      success: true,
      videoPath: videoFilePath
    };
  } catch (error) {
    console.error('Error in video creation service:', error);
    throw new Error('Failed to create video');
  }
};

/**
 * Generates animation frames based on emotion
 * @param {string} text - The original text
 * @param {Object} emotion - Emotion data
 * @param {string} framesDir - Directory to save frames
 */
const generateAnimationFrames = async (text, emotion, framesDir) => {
  // Get animation style based on emotion
  const animationStyle = getAnimationStyleForEmotion(emotion);
  
  // Create frames
  const frameCount = 60; // 2 seconds at 30fps
  
  for (let i = 0; i < frameCount; i++) {
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');
    
    // Apply background color based on emotion
    const backgroundColor = emotion.colorPalette?.[0] || '#000000';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw animation frame based on style and progress
    const progress = i / frameCount;
    await drawAnimationFrame(ctx, text, emotion, animationStyle, progress, canvas.width, canvas.height);
    
    // Save frame
    const frameFilePath = path.join(framesDir, `frame_${i.toString().padStart(5, '0')}.png`);
    const buffer = canvas.toBuffer('image/png');
    await writeFile(frameFilePath, buffer);
  }
};

/**
 * Draws a single animation frame
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - The original text
 * @param {Object} emotion - Emotion data
 * @param {string} style - Animation style
 * @param {number} progress - Animation progress (0-1)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 */
const drawAnimationFrame = async (ctx, text, emotion, style, progress, width, height) => {
  // Set text properties
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Set text color based on emotion
  const textColor = emotion.colorPalette?.[1] || '#FFFFFF';
  ctx.fillStyle = textColor;
  
  // Apply animation style
  switch (style) {
    case 'pulse':
      // Pulsing text effect
      const scale = 1 + 0.2 * Math.sin(progress * Math.PI * 4);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.fillText(text, 0, 0);
      ctx.restore();
      break;
      
    case 'fade':
      // Fade in/out effect
      ctx.globalAlpha = Math.sin(progress * Math.PI);
      ctx.fillText(text, width / 2, height / 2);
      break;
      
    case 'wave':
      // Wavy text effect
      const lines = text.split('\\n');
      const lineHeight = 40;
      const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, i) => {
        const chars = line.split('');
        let xPos = width / 2 - (chars.length * 16) / 2;
        
        chars.forEach((char, j) => {
          const charOffset = Math.sin((progress * 4) + (j * 0.2)) * 15;
          ctx.fillText(char, xPos, startY + i * lineHeight + charOffset);
          xPos += 16;
        });
      });
      break;
      
    default:
      // Simple centered text
      const lines = text.split('\\n');
      const lineHeight = 40;
      const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight);
      });
  }
  
  // Draw emotion indicator
  const emotionText = emotion.primaryEmotion || 'neutral';
  ctx.font = '24px Arial';
  ctx.fillText(emotionText, width / 2, height - 50);
};

/**
 * Creates video from frames and audio
 * @param {string} framesDir - Directory with frames
 * @param {string} audioPath - Path to audio file
 * @param {string} outputPath - Path for output video
 * @param {number} duration - Video duration in seconds
 */
const createVideoFromFrames = async (framesDir, audioPath, outputPath, duration) => {
  return new Promise((resolve, reject) => {
    let command = ffmpeg()
      .input(path.join(framesDir, 'frame_%05d.png'))
      .inputFPS(30)
      .outputFPS(30);
    
    if (audioPath) {
      command = command.input(audioPath);
    }
    
    command
      .outputOptions([
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-shortest',
        `-t ${duration}`
      ])
      .output(outputPath)
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
};

/**
 * Gets animation style based on emotion
 * @param {Object} emotion - Emotion data
 * @returns {string} - Animation style
 */
const getAnimationStyleForEmotion = (emotion) => {
  if (!emotion || !emotion.primaryEmotion) {
    return 'simple';
  }
  
  switch (emotion.primaryEmotion) {
    case 'joy':
      return 'pulse';
    case 'sadness':
      return 'fade';
    case 'anger':
      return 'wave';
    default:
      return 'simple';
  }
};

module.exports = {
  createVideo
};
