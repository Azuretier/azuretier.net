# Azure Community Discord Bot

A Discord bot that integrates with the Azure Community web application for member management, XP tracking, role customization, and rule agreements.

## Features

- **Pre-Member Role Assignment**: Automatically assigns Pre-Member role when users join
- **Rule Agreement System**: Interactive button to view and agree to server rules
- **Member Role Promotion**: Promotes Pre-Members to Members upon rule agreement
- **XP & Leveling System**: Tracks member XP and levels with rank progression (Accordian → Arcadia → Apex → Legendary)
- **Profile Card Generation**: Generates profile cards accessible at `azuret.me/azure-community/{userid}`
- **Role Customization**: Web interface for members to select custom roles
- **Bot Reconnection**: Handles disconnections and re-registers slash commands/interactions

## Setup

### Prerequisites

- Node.js 18.x or higher
- Discord Bot Token
- Discord Application ID
- Discord Guild (Server) ID

### Installation

```bash
cd discord-bot
npm install
```

### Configuration

Create a `.env` file in the `discord-bot` directory:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here
DISCORD_GUILD_ID=your_guild_id_here
WEBAPP_URL=https://azuret.me
```

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Enable these Privileged Gateway Intents:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
5. Go to OAuth2 → URL Generator
6. Select scopes: `bot`, `applications.commands`
7. Select permissions:
   - Manage Roles
   - Send Messages
   - Use Slash Commands
   - Read Message History
8. Use the generated URL to invite the bot to your server

### Running the Bot

```bash
# Development
npm run dev

# Production
npm start
```

## Architecture

### Data Synchronization

The bot synchronizes with the web application using:
- Shared KV store via Spark runtime API
- Real-time updates when users interact with either platform
- Webhook notifications for critical events

### XP System

- **XP Calculation**: `level = floor(sqrt(xp / 100))`
- **Rank Thresholds**:
  - Accordian: Level 0-14
  - Arcadia: Level 15-29
  - Apex: Level 30-49
  - Legendary: Level 50+

### Role Categories

- **Activity Roles**: Based on participation (Dream Maker)
- **Interest Roles**: Dreamer, Community Fan, Thinker, Smart
- **Contribution Roles**: Rising Star, Gifted, Artist, Creator, Translator
- **Special Roles**: Cutie, Luminelle, Archeborne

## Commands

### Slash Commands

- `/profile [@user]` - View user profile card
- `/leaderboard` - View XP leaderboard
- `/rules` - Display server rules
- `/roles` - Get link to role customization page
- `/reconnect` - (Admin) Force bot to re-register interactions

## Development

### Project Structure

```
discord-bot/
├── src/
│   ├── index.ts              # Main bot entry point
│   ├── commands/             # Slash command handlers
│   ├── events/               # Discord event handlers
│   ├── services/             # Business logic
│   │   ├── xp.service.ts     # XP calculation and management
│   │   ├── profile.service.ts # Profile generation
│   │   ├── role.service.ts   # Role management
│   │   └── kv.service.ts     # KV store integration
│   ├── utils/                # Utility functions
│   └── types/                # TypeScript type definitions
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

## API Endpoints

The bot expects these endpoints from the web app:

- `GET /api/profile/:userId` - Get user profile data
- `POST /api/profile/:userId` - Update user profile
- `GET /api/roles` - Get available roles
- `POST /api/roles/:userId` - Update user roles

## Future Enhancements

- AI-powered auto-moderation
- Advanced analytics dashboard
- Custom profile card themes
- Achievement system
- Voice channel activity tracking
