# Script2Self Architecture Documentation

## System Overview

Script2Self is designed as a modern web application with a clear separation between frontend and backend components. The architecture follows a client-server model with RESTful API communication between layers.

```
┌─────────────────┐      ┌──────────────────────────────────────┐
│                 │      │                                      │
│    Frontend     │◄────►│               Backend                │
│    (React)      │      │           (Node.js/Express)          │
│                 │      │                                      │
└─────────────────┘      └───────────────┬──────────────────────┘
                                         │
                                         ▼
                         ┌──────────────────────────────────────┐
                         │           External Services           │
                         │                                      │
                         │  ┌─────────────┐    ┌─────────────┐  │
                         │  │   OpenAI    │    │ ElevenLabs  │  │
                         │  │    API      │    │    API      │  │
                         │  └─────────────┘    └─────────────┘  │
                         │                                      │
                         └──────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

The frontend is built with React and follows a component-based architecture:

```
App
├── Header
├── TextInput
├── ProcessingIndicator
├── VideoPreview
│   └── Video Player + Controls
└── Footer
```

#### Key Frontend Components:

1. **App**: Main container component that manages application state and flow
2. **TextInput**: Captures user's written thoughts with character limit and validation
3. **ProcessingIndicator**: Shows processing status with animated feedback
4. **VideoPreview**: Displays the generated video with playback and download options

### Backend Architecture

The backend is built with Node.js/Express and follows a layered architecture:

```
Server
├── Routes
│   ├── Emotion Routes
│   ├── Voice Routes
│   └── Video Routes
├── Controllers
│   ├── Emotion Controller
│   ├── Voice Controller
│   └── Video Controller
└── Services
    ├── Emotion Service (OpenAI)
    ├── Voice Service (ElevenLabs)
    └── Video Service (FFMPEG)
```

#### Key Backend Services:

1. **Emotion Detection Service**:
   - Analyzes text using OpenAI's API
   - Extracts primary emotion, intensity, and visual style
   - Returns structured emotion data

2. **Voice Synthesis Service**:
   - Converts text to speech using ElevenLabs API
   - Adjusts voice parameters based on detected emotion
   - Falls back to browser TTS if API fails
   - Returns audio file path and metadata

3. **Video Generation Service**:
   - Creates animation frames based on emotional context
   - Synchronizes animation with audio
   - Uses FFMPEG to compile frames and audio into MP4
   - Returns video file path and metadata

## Data Flow

1. User enters text in the frontend text input
2. Frontend sends text to backend `/api/emotion/analyze` endpoint
3. Backend analyzes text using OpenAI API and returns emotion data
4. Frontend sends text and emotion data to `/api/voice/generate` endpoint
5. Backend generates voice audio using ElevenLabs API
6. Frontend sends text, emotion, and audio data to `/api/video/generate` endpoint
7. Backend creates video by generating animation frames and combining with audio
8. Frontend receives video URL and displays in the video player
9. User can preview, download, or create a new video

## Technical Implementation Details

### Emotion Detection Logic

The emotion detection service uses OpenAI's GPT-4 model with a specialized prompt:

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

The returned JSON structure contains:
- `primaryEmotion`: The dominant emotion detected
- `intensity`: Numerical value from 1-10 indicating strength
- `visualStyle`: Suggested visual style for animation
- `colorPalette`: Array of hex color codes that match the emotion
- `briefDescription`: Brief explanation of the emotional tone

### Animation Generation

The video service generates animation frames based on the detected emotion:

1. Different animation styles are selected based on the primary emotion:
   - Joy → Pulsing animation
   - Sadness → Fade in/out effect
   - Anger → Wave effect
   - Others → Simple centered text

2. Color palettes are applied based on the emotion data

3. Frames are generated using Node.js Canvas API

4. FFMPEG combines frames with audio to create the final MP4

## Security Considerations

- API keys are stored in environment variables, not in code
- Input validation is performed on all user inputs
- CORS is configured to restrict API access to the frontend domain
- Error handling prevents sensitive information leakage

## Scalability Considerations

- Stateless backend design allows for horizontal scaling
- File storage is currently local but can be migrated to cloud storage
- Processing-intensive tasks can be moved to background workers

## Future Architecture Extensions

The architecture is designed to accommodate the planned "Kaji Mode" feature:

```
┌─────────────────┐      ┌──────────────────────────────────────┐
│                 │      │                                      │
│    Frontend     │◄────►│               Backend                │
│    (React)      │      │           (Node.js/Express)          │
│                 │      │                                      │
└─────────────────┘      └───────────────┬──────────────────────┘
                                         │
                                         ▼
                         ┌──────────────────────────────────────┐
                         │           External Services           │
                         │                                      │
                         │  ┌─────────────┐    ┌─────────────┐  │
                         │  │   OpenAI    │    │ ElevenLabs  │  │
                         │  │    API      │    │    API      │  │
                         │  └─────────────┘    └─────────────┘  │
                         │                                      │
                         │  ┌─────────────────────────────────┐ │
                         │  │      Kaji Dialogue System       │ │
                         │  └─────────────────────────────────┘ │
                         │                                      │
                         └──────────────────────────────────────┘
```

The Kaji Dialogue System would extend the existing architecture with:
- Persona management for the Kaji character
- Dialogue generation based on user input
- Response styling based on Kaji's personality
- Two-way conversation flow
