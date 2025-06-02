# Script2Self

> "You write it. You voice it. We animate it."

Script2Self is an AI-powered application that transforms self-written thoughts into emotionally resonant video clips with synthesized voice and animations that match the detected emotional tone.

## Features

- **Emotion Detection**: Analyzes your text to understand the emotional context
- **Voice Synthesis**: Converts your text to natural-sounding speech
- **Video Generation**: Creates animations that match the emotional tone
- **One-Screen Experience**: Simple, intuitive interface with zero friction

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- ElevenLabs API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/script2self.git
   cd script2self
   ```

2. Install backend dependencies
   ```
   cd src/backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables
   - Copy `.env.example` to `.env` in the backend directory
   - Add your API keys to the `.env` file
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

### Running the Application

1. Start the backend server
   ```
   cd src/backend
   npm start
   ```

2. Start the frontend development server
   ```
   cd ../frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter your text in the input field
2. Click "Create Video"
3. Wait for processing (emotion detection, voice synthesis, video generation)
4. Preview your video
5. Download or share your creation

## Architecture

Script2Self follows a client-server architecture:

- **Frontend**: React application with Material-UI components
- **Backend**: Node.js/Express server with three main services:
  - Emotion Detection Service (OpenAI)
  - Voice Synthesis Service (ElevenLabs)
  - Video Generation Service (FFMPEG)

For more details, see the [Architecture Documentation](docs/architecture.md).

## Development

### Project Structure

```
script2self/
├── src/
│   ├── backend/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Helper functions
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── utils/      # Helper functions
│   │   │   ├── styles/     # CSS and styling
│   │   │   └── assets/     # Static assets
│   └── assets/             # Generated media files
├── docs/                   # Documentation
└── config/                 # Global configuration
```

### API Endpoints

- `POST /api/emotion/analyze` - Analyze text and detect emotion
- `POST /api/voice/generate` - Generate voice from text
- `POST /api/video/generate` - Create video from text, emotion, and audio

## Roadmap

- **Enhanced Animations**: More sophisticated visual representations
- **Kaji Mode**: AI persona that responds to user input
- **User Accounts**: Save and share functionality
- **Custom Voices**: Allow users to customize voice settings
- **Mobile App**: Native mobile experience

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for emotion detection
- ElevenLabs for voice synthesis
- The entire Script2Self team for their vision and support
