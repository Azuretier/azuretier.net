# 🚀 Run Both Website & Server

## Quick Start

### Run Everything (Recommended)
```bash
npm run dev:all
```
This runs both:
- **Next.js website** on `http://localhost:3000`
- **WebSocket server** on `http://localhost:3001`

### Run Individually

**Website only:**
```bash
npm run dev
```

**Server only:**
```bash
npm run server
```

### Production Build

**Build everything:**
```bash
npm run build
npm run server:build
```

**Run in production:**
```bash
npm start          # Website
npm run server:start  # Server
```

## 📦 First Time Setup

```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install:server
```

## 🎮 Usage

1. **Start both**: `npm run dev:all`
2. **Open website**: `http://localhost:3000`
3. **Multiplayer pages**:
   - Host: `app/RYTHMIA-NEXUS/host.html` 
   - Player: `app/RYTHMIA-NEXUS/player.html`

The WebSocket server at `localhost:3001` is already configured in the HTML files!

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js website |
| `npm run server` | Start WebSocket server |
| `npm run dev:all` | Start both simultaneously |
| `npm run build` | Build website for production |
| `npm run server:build` | Build server for production |
| `npm start` | Run website in production |
| `npm run server:start` | Run server in production |
| `npm run install:server` | Install server dependencies |

---

✨ **Ready to develop!** Just run `npm run dev:all` and both services start together.
