const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Detects emotion in text using OpenAI API
 * @param {string} text - The text to analyze
 * @returns {Object} - Emotion data including primary emotion, intensity, and visual style
 */
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

module.exports = {
  detectEmotion
};
