# Azuret.me

様々なページあるので現在の用途を説明.
Explaining current situation below since there are several pages.

```cmd
azuret.net/: Interactive homepage with UI version selection (Discord-like or Patreon-style)
azuret.net/current: Storing my portfolio (currently in working) 現在制作中（わら）ポートフォリオだぅ
azuret.net/azure-supporter: my discord bot developing page with role selection 開発中discord botぺージ（
azuret.net/azure-community/[userId]: Discord community user profiles with XP, levels, and stats
azuret.net/guilds/[guild_id]/rank-card/[display_name]: Discord rank card system with real-time Firebase data
azuret.net/play: Multiplayer Score Attack game with real-time WebSocket gameplay
```

## Discord Community Integration

**NEW**: Azure Community Discord bot and profile system integrated into Azuret.me!

- **Discord Bot** - Track XP, levels, roles, and rules agreement
- **User Profiles** - View profiles at `/azure-community/[userId]`
- **Firestore Backend** - Real-time data sync between bot and web

See [DISCORD_COMMUNITY_SETUP.md](./DISCORD_COMMUNITY_SETUP.md) for setup instructions.

## Version Selection

When you visit the homepage, you'll be presented with a version selector after the loading screen. You can choose between:

- **v1.0.0 - Discord-like UI**: Interactive homepage with Discord-like messenger UI and GPU-rendered background
- **v1.0.1 - Patreon User UI**: Portfolio interface with advanced window management and customizable themes

Your selection is saved for reference purposes, but you'll be prompted to select a version each time you visit. You can also change your selected version at any time:

- On the **Discord-like UI** (v1.0.0): Click the floating settings button in the bottom-right corner
- On the **Patreon User UI** (v1.0.1): Open the Settings window and use the Version Selection section

## Features

### 1. Multiplayer Game (`/play`)

A real-time multiplayer game with host/join functionality and synchronized gameplay.

#### Key Features
- **Room System**: Create or join game rooms with shareable 6-character room codes
- **Real-time Multiplayer**: WebSocket-based communication using `ws` library
- **Host/Join Flow**: Host controls game start, players mark themselves ready
- **Live Player List**: See all connected players and their ready status
- **Message Relay**: Room-scoped message broadcasting for game state
- **Disconnect Handling**: Automatic host migration when host leaves
- **Origin Validation**: Security through origin whitelist
- **Separated Architecture**: Frontend on Vercel, WebSocket server on Railway

#### How to Play
1. Visit `/play` and enter your player name
2. **Create Room**: Start a new game and share the 6-character room code with friends
3. **Join Room**: Enter a room code to join an existing game
4. **Lobby**: Wait for all players to join and mark themselves ready
5. **Host**: Start the game when all players are ready
6. **Gameplay**: Implement custom game logic using the relay system

#### Technical Details
- **Frontend**: Next.js on Vercel, connects via WebSocket client
- **Backend**: Standalone WebSocket server using `ws`, deployable to Railway
- **Protocol**: JSON messages with `type` field for routing
- **Security**: Origin validation, room code validation, payload sanitization

**📖 Deployment Guide**: See [MULTIPLAYER_DEPLOYMENT.md](./MULTIPLAYER_DEPLOYMENT.md) for step-by-step instructions on deploying to Vercel + Railway.

### 2. Interactive Homepage (`/`)

The homepage features a modern interactive experience with **user-selectable UI versions**:

#### UI Version Selection
- **v1.0.0 - Discord UI**: Discord-like messenger interface with intent-based social navigation
- **v1.0.1 - Patreon UI**: Patreon-style creator layout with profile card and content feed
- **First Visit**: Choose your preferred UI version after the loading screen
- **Persistent**: Your choice is saved and automatically loaded on return visits
- **Switchable**: Change versions anytime using the floating settings button

**Documentation**: See [VERSION_SELECTION_GUIDE.md](./VERSION_SELECTION_GUIDE.md) for details.

#### Common Features (All Versions)
- **GPU-Accelerated Background**: WebGL shader rendering with atmospheric effects, city silhouettes, and fog
- **Loading Screen**: Smooth animated loading experience with progress indicators
- **Modern Design**: Glassmorphism UI with gradients and animations

#### v1.0.0 - Discord UI
- **Discord-like Messenger UI**: Chat interface where you can interact with Azur
- **Intent Router**: Type messages to find social media links (X, YouTube, Discord, GitHub, Instagram)

**Customizing Social Links**: Edit `/src/lib/intent/parser.ts` to customize your social media links.

**Documentation**: See [HOMEPAGE_GUIDE.md](./HOMEPAGE_GUIDE.md) for detailed setup and customization instructions.

#### v1.0.1 - Patreon UI
- **Profile Card**: Avatar, bio, stats, and support button
- **Content Feed**: Recent posts with likes and engagement
- **Social Links**: Quick access to all social media platforms

### 2. Discord Community Learning System (`/community`)

An interactive educational platform for learning community rules and guidelines:

- **📚 Interactive Lessons**: Step-by-step rule learning with examples
- **🎮 Quizzes**: Test your knowledge with interactive quizzes
- **📊 Progress Tracking**: Track completion and mastery of all rules
- **🏆 Points System**: Earn points for completing lessons and passing quizzes
- **📖 Quick Reference**: Search and browse all rules in one place
- **💾 Local Storage**: Progress saved automatically in browser

**Features:**
- Tab-based navigation (Learn, Quiz, Progress, Reference)
- Beautiful gradient UI with smooth animations
- Real-time progress tracking
- Quiz scoring with 70% passing threshold
- Confetti celebration when all rules are mastered

The community learning system was integrated from the [Azuretier/Discord](https://github.com/Azuretier/Discord) repository and adapted for Next.js.

### 3. Discord Rank Card System

Display real-time Discord rank cards for server members:

- **Real-time Updates**: Firebase Firestore integration for live data
- **Smart Matching**: Handles member lookup with normalization
- **Beautiful UI**: Glass-morphism design with gradients
- **Unique URLs**: Each member gets a persistent rank card URL

**URL Format**: `/guilds/[guild_id]/rank-card/[display_name]`

**Documentation**: See [RANK_CARD_SETUP.md](./RANK_CARD_SETUP.md) for setup instructions.

### 4. Discord Role Selection (`/azure-supporter`)

The `/azure-supporter` page allows users to select EN or JP roles which are synced to your Discord server.

### Prerequisites
1. A Discord bot with the following permissions:
   - Manage Roles
   - Read Messages/View Channels
2. Discord OAuth2 application credentials

### Setup Instructions

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file with the values below**

### Environment Variables

Add the following to your `.env` file:

```bash
# Discord Bot Configuration
DISCORD_BOT_TOKEN='your_discord_bot_token'
DISCORD_GUILD_ID='your_discord_server_id'
DISCORD_ROLE_EN='your_en_role_id'
DISCORD_ROLE_JP='your_jp_role_id'

# Discord OAuth2 Configuration
DISCORD_CLIENT_ID='your_discord_client_id'
DISCORD_CLIENT_SECRET='your_discord_client_secret'
NEXT_PUBLIC_DISCORD_CLIENT_ID='your_discord_client_id'
NEXT_PUBLIC_DISCORD_REDIRECT_URI='http://localhost:3000/api/auth/discord/callback'
```

### Getting Discord IDs

#### Bot Token
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create or select your application
3. Go to "Bot" section
4. Copy the token (reset if needed)

#### OAuth2 Credentials
1. In the same application, go to "OAuth2" section
2. Copy the Client ID and Client Secret
3. Add `http://localhost:3000/api/auth/discord/callback` to redirects (or your production URL)

#### Server and Role IDs
1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click your server → Copy Server ID
3. Right-click each role → Copy Role ID

### Bot Permissions
Your bot needs these permissions in the Discord server:
- Manage Roles
- View Channels

**Important:** The bot's role must be positioned ABOVE the EN and JP roles in the role hierarchy.

### Installation and Development

```bash
# Install dependencies
npm install

# Run Next.js development server
npm run dev

# Run multiplayer WebSocket server (separate terminal)
npm run multiplayer

# Build for production
npm run build

# Start Next.js production server
npm start
```

**Available Routes:**
- `http://localhost:3000/` - Interactive homepage
- `http://localhost:3000/play` - Multiplayer game with WebSocket
- `http://localhost:3000/azure-supporter` - Discord role selection
- `http://localhost:3000/current` - Portfolio page

### Deployment Configuration

The multiplayer system uses a **separated architecture** for optimal deployment:

#### Architecture Overview
- **Frontend (Next.js)**: Deploy to **Vercel** (or any static host)
- **WebSocket Server**: Deploy to **Railway** (or any Node.js host)
- **Communication**: Frontend connects to WebSocket server via `NEXT_PUBLIC_MULTIPLAYER_URL`

#### Required Environment Variables

**For Vercel (Frontend):**
```env
NEXT_PUBLIC_MULTIPLAYER_URL=wss://your-railway-app.railway.app
```

**For Railway (WebSocket Server):**
```env
PORT=3001  # Railway sets this automatically
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
```

#### Local Development Setup

1. **Start the WebSocket server** (in one terminal):
   ```bash
   npm run multiplayer
   ```
   Server runs on `ws://localhost:3001`

2. **Set environment variable** for Next.js:
   ```bash
   # In .env.local
   NEXT_PUBLIC_MULTIPLAYER_URL=ws://localhost:3001
   ```

3. **Start Next.js** (in another terminal):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

4. **Visit** `http://localhost:3000/play` to test multiplayer

#### Deploying to Production

**Step 1: Deploy WebSocket Server to Railway**

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set the start command: `npm run multiplayer`
4. Add environment variables:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3000
   ```
5. Railway will automatically set the `PORT` variable
6. Note your Railway URL (e.g., `your-app.railway.app`)

**Step 2: Deploy Frontend to Vercel**

1. Create a new project on [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Add environment variable:
   ```
   NEXT_PUBLIC_MULTIPLAYER_URL=wss://your-railway-app.railway.app
   ```
4. Deploy! Vercel will build and deploy your Next.js app

**Step 3: Update Origins**

After getting your Vercel URL, update Railway's `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app
```

#### Alternative Deployment Options

**Single Server Deployment (Railway/VPS):**
- Deploy both Next.js and WebSocket server on the same host
- Use `npm start` for Next.js (includes old Socket.IO server)
- Use `npm run multiplayer` for the new WebSocket server
- Set `NEXT_PUBLIC_MULTIPLAYER_URL=ws://localhost:3001` or your domain

**Docker Deployment:**
```dockerfile
# Dockerfile for WebSocket server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "multiplayer"]
```

### Deployment Notes

**Platform Compatibility:**
- ✅ **Vercel + Railway**: **Recommended** - Separated architecture, optimal performance
- ✅ **Railway Only**: Single host for both frontend and WebSocket server
- ✅ **VPS/Dedicated Server**: Full control, run both services
- ✅ **AWS/Azure/GCP**: Container or serverless deployment
- ✅ **Heroku**: Supported with custom buildpacks

**Important Notes:**
1. Use `wss://` (not `ws://`) in production for secure WebSocket connections
2. Ensure CORS/Origin validation is properly configured
3. WebSocket server needs to listen on `0.0.0.0` for Railway
4. Frontend and backend can be deployed independently

**📖 Railway 24/7 Deployment Guide**: See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for complete Railway deployment instructions.

### Discord Bot Integration

The `/discord-bot` folder contains a standalone Discord bot that can be deployed separately from the web application.

**Features:**
- XP tracking and level system
- Discord slash commands (/profile, /leaderboard, /rules, /roles)
- Auto role assignment for new members
- Integration with community learning system

**Setup:**
1. Navigate to the `discord-bot` folder
2. Copy `.env.example` to `.env` and configure:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_GUILD_ID=your_guild_id_here
   WEBAPP_URL=https://azuret.me
   WEBAPP_API_KEY=your-secure-api-key-here
   ```
3. Install dependencies: `npm install`
4. Deploy commands: `npm run deploy-commands`
5. Start bot: `npm start`

**Documentation**: See `/discord-bot/QUICKSTART.md` for detailed setup instructions.

### Project Structure

```
/src
  /app
    /community         # Discord community learning system
    /play              # Multiplayer game page
    /azure-supporter   # Discord role selection
    /api               # API routes
  /components
    /discord-community # Community learning UI components
    /game              # Game UI components (legacy)
  /hooks
    /useMultiplayer.ts # WebSocket client hook
    /useLocalStorage.ts # Local storage state management
    /useGameSocket.ts  # Socket.IO client hook (legacy)
  /lib
    /discord-community # Community learning logic & rules
    /multiplayer       # Multiplayer room management
    /game              # Game logic (legacy)
  /types
    /community.ts      # Community learning types
    /multiplayer.ts    # Multiplayer protocol types
    /game.ts           # Game types (legacy)
/discord-bot           # Standalone Discord bot
  /src
    /commands          # Slash commands
    /events            # Discord event handlers
    /services          # XP, KV, and role services
/multiplayer-server.ts # Standalone WebSocket server
/server.ts             # Custom Next.js + Socket.IO server
```

