# RHYTHMIA NEXUS - Multiplayer Infrastructure (TypeScript)

Complete multiplayer game infrastructure with TypeScript WebSocket server and client interfaces.

## 🎮 Features

- **TypeScript** for type safety and better development experience
- **Real-time multiplayer** using WebSockets
- **Host/Player architecture** with room-based system
- **6-character room codes** for easy joining
- **Up to 8 players** per room
- **Real-time chat** between host and players
- **Player ready system** before game start
- **Score tracking** for all players
- **Automatic reconnection** handling
- **Room cleanup** and management

## 📁 Structure

```
RYTHMIA-NEXUS/
├── server/
│   ├── server.ts          # TypeScript WebSocket server
│   ├── package.json       # Server dependencies
│   └── tsconfig.json      # TypeScript configuration
├── host.html              # Host dashboard
├── player.html            # Player interface
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Development Mode (with auto-reload)

```bash
npm run dev
```

This uses `ts-node-dev` for automatic recompilation and restart.

### 3. Production Build & Run

```bash
# Build TypeScript to JavaScript
npm run build

# Start the compiled server
npm start
```

The server will start on `http://localhost:3001`

### 4. Open Host Interface

Open `host.html` in a browser. The host will:
- Automatically create a room
- Get a 6-character room code
- See players as they join
- Start the game when all are ready

### 5. Open Player Interface(s)

Open `player.html` in other browsers/tabs. Players will:
- Enter their name
- Enter the room code
- Click "I'm Ready!" when prepared
- Wait for host to start

## 🔌 Server Configuration

Edit `WS_URL` in both `host.html` and `player.html`:

```javascript
const WS_URL = 'ws://localhost:3001';  // Local development
// const WS_URL = 'wss://your-server.com';  // Production
```

### Environment Variables

```bash
PORT=3001  # Server port (default: 3001)
```

## 📦 Available Scripts

```bash
npm run dev      # Development with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm run start    # Run compiled server
npm run watch    # Watch mode for TypeScript compilation
npm run clean    # Remove dist folder
```

## 🎯 TypeScript Types

### Client Message Types

```typescript
interface ClientMessage {
    type: 'CREATE_ROOM' | 'JOIN_ROOM' | 'START_GAME' | 'PLAYER_READY' | 
          'GAME_ACTION' | 'UPDATE_SCORE' | 'CHAT_MESSAGE' | 'LEAVE_ROOM';
    roomCode?: string;
    playerName?: string;
    level?: number;
    isReady?: boolean;
    action?: string;
    payload?: any;
    score?: number;
    message?: string;
}
```

### Player Info Type

```typescript
interface PlayerInfo {
    id: string;
    name: string;
    score: number;
    isReady: boolean;
}
```

### Room Info Type

```typescript
interface RoomInfo {
    roomCode: string;
    playerCount: number;
    maxPlayers: number;
    isStarted: boolean;
    players: PlayerInfo[];
}
```

## 📡 WebSocket API

### Client → Server Messages

#### Host Messages
```javascript
{ type: 'CREATE_ROOM' }
{ type: 'START_GAME', level: 1 }
{ type: 'GAME_ACTION', action: 'pause', payload: {} }
```

#### Player Messages
```javascript
{ type: 'JOIN_ROOM', roomCode: 'ABC123', playerName: 'Player1' }
{ type: 'PLAYER_READY', isReady: true }
{ type: 'UPDATE_SCORE', score: 1000 }
```

#### Common Messages
```javascript
{ type: 'CHAT_MESSAGE', message: 'Hello!' }
{ type: 'LEAVE_ROOM' }
```

### Server → Client Messages

```javascript
{ type: 'ROOM_CREATED', roomCode: 'ABC123', roomInfo: {...} }
{ type: 'ROOM_JOINED', playerId: 'xyz...', roomCode: 'ABC123' }
{ type: 'PLAYER_JOINED', player: {...}, players: [...] }
{ type: 'PLAYER_LEFT', playerId: 'xyz...', players: [...] }
{ type: 'GAME_STARTED', level: 1, timestamp: 123456 }
{ type: 'SCORE_UPDATED', playerId: 'xyz...', score: 1000 }
{ type: 'CHAT_MESSAGE', playerName: 'Player1', message: 'Hi!' }
{ type: 'ERROR', error: 'Room not found' }
```

## 🎯 Game Flow

1. **Host creates room** → Gets room code
2. **Players join** → Enter code and name
3. **Players ready up** → Click ready button
4. **Host starts game** → Game begins for all
5. **Gameplay** → Actions sync via WebSocket
6. **Score updates** → Real-time leaderboard
7. **Game ends** → Host can reset or close

## 🔧 Customization

### Change Max Players

In `server.ts`:
```typescript
this.maxPlayers = 8;  // Change to desired max
```

### Change Room Code Length

In `server.ts`:
```typescript
for (let i = 0; i < 6; i++) {  // Change 6 to desired length
```

### Add Custom Game Events

In `handleGameAction()`:
```typescript
function handleGameAction(ws: WebSocket, data: ClientMessage): void {
    // Add your game-specific logic
    if (data.action === 'jump') {
        // Handle jump action with full type safety
    }
}
```

## 🛡️ TypeScript Benefits

1. **Type Safety** - Catch errors at compile time
2. **Better IDE Support** - Autocomplete and IntelliSense
3. **Refactoring** - Easier to maintain and update
4. **Documentation** - Types serve as inline documentation
5. **Error Prevention** - Prevents common runtime errors

## 🐛 Debugging

Enable detailed logging:
```typescript
console.log('Debug:', data);
```

Monitor WebSocket in browser DevTools:
- Network tab → WS filter
- See all messages in real-time

Check TypeScript compilation errors:
```bash
npm run build
```

## 📊 Room Management

Rooms automatically clean up:
- **Host disconnects** → Room closes immediately
- **All players leave** → Room deletes
- **After 24 hours** → Room expires

## 🎨 Styling

Both interfaces use:
- **Orbitron** font for titles
- **Zen Kaku Gothic New** for body
- Neon color scheme (pink, cyan, purple, gold)
- Responsive design for mobile/desktop

## 🔄 Testing Locally

1. Start server: `npm run dev`
2. Open `host.html` in Chrome
3. Open `player.html` in Firefox
4. Open another `player.html` in Edge
5. Test joining, chat, ready, start

## 📝 TODO / Future Features

- [ ] Spectator mode
- [ ] Private rooms (password)
- [ ] Persistent leaderboards with database
- [ ] Game state recovery
- [ ] Voice chat integration
- [ ] Mobile app versions
- [ ] Tournament mode
- [ ] Replay system
- [ ] Add more strict type checking
- [ ] Add unit tests with Jest

## 🤝 Integration

To integrate with your game:

1. Include game logic in `handleGameAction()`
2. Send game events via `GAME_ACTION` messages
3. Update UI based on received messages
4. Sync game state through WebSocket

Example with TypeScript:
```typescript
// In your game code
interface MovePayload {
    x: number;
    y: number;
}

function onPlayerMove(x: number, y: number): void {
    const message: ClientMessage = {
        type: 'GAME_ACTION',
        action: 'move',
        payload: { x, y } as MovePayload
    };
    sendMessage(message);
}
```

## 📄 License

MIT License - Feel free to use and modify!

## 💬 Support

For issues or questions:
1. Check console for errors
2. Verify WebSocket connection
3. Check TypeScript compilation: `npm run build`
4. Check server logs
5. Ensure ports are open (3001)

---

**Made for RHYTHMIA NEXUS with TypeScript** 🎵✨
