# Script2Self Architecture

## Overview
Script2Self is a web application that transforms user-written text into emotionally resonant video clips with synthesized voice and animations that match the detected emotional tone.

## System Components

### Frontend (React)
- **Text Input Component**: Captures user's written thoughts
- **Preview Component**: Displays the generated video with playback controls
- **Download Component**: Allows users to save the generated video
- **UI/UX**: Clean, modern, intuitive single-screen interface

### Backend Services
1. **Emotion Detection Service**
   - Uses OpenAI API to analyze text and detect emotional tone
   - Extracts key emotional attributes (joy, sadness, anger, etc.)
   - Determines appropriate visual style based on emotion

2. **Voice Synthesis Service**
   - Leverages ElevenLabs API for high-quality text-to-speech
   - Adjusts voice parameters based on detected emotion
   - Outputs audio file for video integration

3. **Video Generation Service**
   - Creates animations based on emotional context
   - Synchronizes animations with voice audio
   - Renders final MP4 video for playback and download

### Data Flow
1. User enters text in the frontend
2. Text is sent to the backend for processing
3. Emotion detection analyzes the text
4. Voice synthesis generates audio based on text and emotion
5. Video generation creates visuals based on emotion and synchronizes with audio
6. Final video is sent back to frontend for preview and download

## API Integration
- **OpenAI API**: For emotion detection and analysis
- **ElevenLabs API**: For voice synthesis
- **Local Animation Logic**: For video generation based on emotional context

## Technical Stack
- **Frontend**: React, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **APIs**: OpenAI, ElevenLabs
- **Video Processing**: FFMPEG (server-side)
- **Deployment**: GitHub-ready structure

## Future Expansion
- **Kaji Mode**: AI persona that responds to user input (post-MVP)
- **Enhanced Animation**: More sophisticated visual representations
- **User Accounts**: Save and share functionality
