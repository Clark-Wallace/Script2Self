# Emotion Inference Logic Documentation

## Overview

Script2Self uses advanced natural language processing to detect emotions in user-written text. This document explains the emotion detection system, how it works, and how it influences the video generation process.

## Emotion Detection Process

### 1. Text Analysis with OpenAI

The core of our emotion detection system uses OpenAI's GPT-4 model with a specialized prompt designed to extract emotional context:

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are an emotion detection specialist. Analyze the text and return a JSON object with the following properties: primaryEmotion (joy, sadness, anger, fear, surprise, disgust, neutral), intensity (1-10), visualStyle (a style that matches the emotion), colorPalette (array of hex colors that match the emotion), and briefDescription (1-2 sentences explaining the emotional tone)."
    },
    {
      role: "user",
      content: text
    }
  ],
  response_format: { type: "json_object" }
});
```

### 2. Emotion Data Structure

The API returns a structured JSON object containing:

```json
{
  "primaryEmotion": "joy",
  "intensity": 8,
  "visualStyle": "vibrant",
  "colorPalette": ["#FFD700", "#FFA500", "#FF4500"],
  "briefDescription": "The text expresses genuine happiness and excitement about a positive life event."
}
```

- **primaryEmotion**: One of seven core emotions (joy, sadness, anger, fear, surprise, disgust, neutral)
- **intensity**: Numerical value from 1-10 indicating the strength of the emotion
- **visualStyle**: Suggested visual style for animation (e.g., vibrant, muted, dramatic)
- **colorPalette**: Array of hex color codes that match the emotional tone
- **briefDescription**: Brief explanation of the detected emotional context

### 3. Emotion-to-Visual Mapping

Each primary emotion is mapped to specific visual characteristics:

| Emotion  | Animation Style | Color Palette Example       | Voice Modulation |
|----------|----------------|----------------------------|------------------|
| Joy      | Pulse          | Warm yellows and oranges   | Higher pitch, faster pace |
| Sadness  | Fade           | Blues and cool grays       | Lower pitch, slower pace |
| Anger    | Wave           | Reds and dark oranges      | Stronger emphasis, varied pace |
| Fear     | Shake          | Purples and dark blues     | Trembling effect, pauses |
| Surprise | Pop            | Bright blues and cyans     | Raised pitch, exclamations |
| Disgust  | Twist          | Greens and yellow-greens   | Nasal quality, emphasis |
| Neutral  | Simple         | Grays and soft colors      | Standard pace and tone |

## Implementation Details

### Emotion Service

The `emotionService.js` file contains the core logic for emotion detection:

```javascript
const detectEmotion = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an emotion detection specialist. Analyze the text and return a JSON object with the following properties: primaryEmotion (joy, sadness, anger, fear, surprise, disgust, neutral), intensity (1-10), visualStyle (a style that matches the emotion), colorPalette (array of hex colors that match the emotion), and briefDescription (1-2 sentences explaining the emotional tone)."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const emotionData = JSON.parse(response.choices[0].message.content);
    return emotionData;
  } catch (error) {
    console.error('Error in emotion detection service:', error);
    throw new Error('Failed to detect emotion');
  }
};
```

### Voice Adaptation

The emotion data influences voice synthesis parameters:

```javascript
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
      // Other emotions...
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
```

### Animation Selection

The video generation service selects animation styles based on the detected emotion:

```javascript
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
```

## Fallback Mechanisms

If the OpenAI API call fails, the system defaults to a neutral emotion setting:

```javascript
const fallbackEmotion = {
  primaryEmotion: 'neutral',
  intensity: 5,
  visualStyle: 'simple',
  colorPalette: ['#CCCCCC', '#FFFFFF', '#888888'],
  briefDescription: 'Unable to detect emotion from the provided text.'
};
```

## Future Enhancements

Planned improvements to the emotion inference system:

1. **Multi-emotion detection**: Identify multiple emotions in longer texts
2. **Contextual analysis**: Consider cultural and situational context
3. **Personalized baselines**: Learn user's typical emotional expression patterns
4. **Sentiment progression**: Track emotional changes throughout the text
5. **Emotion blending**: Create more nuanced animations for mixed emotions
