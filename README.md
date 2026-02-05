# Twitch IRC Chat UI

A modern web application that allows users to track and chat with their followed Twitch channels through an intuitive user interface.

## Overview

This project provides a comprehensive solution for Twitch users to:
- Track their followed channels in real-time
- Chat with multiple channels simultaneously through IRC
- Monitor channel activity and chat interactions
- Manage their Twitch streaming experience from a single interface

Built with modern web technologies and designed for extensibility to support additional functionality in the future.

## Architecture

The project is structured as a full-stack application with the following components:

### Backend (`/backend`)
- **Server**: `server.ts` - This doesn't do anything atm.

### Frontend (`/frontend`)
- Modern web UI built with Vite
- Real-time chat interface
- Channel tracking dashboard
- Responsive design for desktop and mobile

## Features

- 🎮 **Channel Tracking**: Monitor your followed Twitch channels
- 💬 **Multi-Channel Chat**: Chat in multiple channels simultaneously
- 🔐 **Secure Authentication**: OAuth integration with Twitch
- ⚡ **Real-time Updates**: Live chat messages and channel status
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔧 **Extensible**: Built for future feature additions

## Technology Stack

- **Runtime**: Deno
- **Frontend**: HTML5, CSS3, JavaScript/TypeScript
- **Build Tool**: Vite
- **Protocol**: Twitch IRC
- **Authentication**: Twitch OAuth 2.0

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your system
- Twitch Developer Account for OAuth credentials

### Installation

1. Set up your Twitch OAuth credentials (see `README_TOKEN.md` for details)

2. Install dependencies and start the development server:
   ```bash
   deno task dev
   ```

### Configuration

Before running the application, you'll need to configure your Twitch OAuth credentials. Please refer to `README_TOKEN.md` for detailed instructions on:
- Creating a Twitch application
- Obtaining OAuth credentials
- Setting up environment variables

## Development

### Project Structure
```
├── backend/           # Backend server and API
├── frontend/          # Frontend web application
├── irc/              # IRC protocol implementation
├── oauth/            # OAuth authentication
├── main.ts           # Main application entry point
├── utils.ts          # Utility functions
└── deno.json         # Deno configuration
```

### Available Scripts

- `deno run main.ts` - Start the main application
- Frontend development server available in `/frontend` directory

## Future Roadmap

This project is built with extensibility in mind. Potential future features include:
- Channel analytics and statistics
- Custom chat commands and moderation tools
- Stream overlay integration
- Mobile application
- Advanced notification system
- Multi-platform streaming support

## License

[Add your license information here]

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

----- 

README created by Claude the LLM
