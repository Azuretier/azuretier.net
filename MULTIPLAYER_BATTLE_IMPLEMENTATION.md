# Multiplayer Battle Implementation

## Overview

This implementation integrates the VanillaGame mechanics into the multiplayer battle system, allowing two players to compete in real-time Tetris-like gameplay.

## Components

### MultiplayerBattle.tsx

The main battle component that:
- Displays two game boards side-by-side (player vs opponent)
- Reuses core game logic from VanillaGame
- Synchronizes game state via WebSocket
- Implements garbage line mechanics
- Handles win/loss conditions

### Key Features

#### 1. Dual Board Layout
- Player board on the left (10x18 grid)
- Opponent board on the right (slightly dimmed)
- Real-time score and line count display
- Responsive design for mobile and desktop

#### 2. Core Game Mechanics (from VanillaGame)
- Piece shapes: 7 Tetris pieces
- Collision detection
- Rotation system
- Beat timing and rhythm mechanics
- Scoring and combo system
- Audio feedback (tones, drums, line clear sounds)

#### 3. WebSocket Synchronization
- Connects to multiplayer server at `NEXT_PUBLIC_MULTIPLAYER_URL`
- Uses `relay` message type for game state updates
- Syncs board state, score, and line count
- Handles disconnection gracefully

#### 4. Garbage Line Mechanics
When a player clears lines, garbage is sent to the opponent:
- 1 line = 0 garbage
- 2 lines = 1 garbage line
- 3 lines = 2 garbage lines
- 4 lines (Tetris) = 4 garbage lines
- Combos add additional garbage (1 extra per 3 combo)

Garbage lines:
- Appear at the bottom of the opponent's board
- Have one random gap per line
- Gray color (#666666)
- Push existing pieces upward

#### 5. Win/Loss Conditions
- A player loses when a new piece cannot spawn (board topped out)
- The losing player broadcasts `game_over` message via WebSocket
- The opponent automatically wins
- Results screen shows winner/loser and final scores

## Usage

### Starting a Multiplayer Game

1. Navigate to the multiplayer mode
2. Create or join a room
3. Wait for opponent in the waiting room
4. Host starts the game
5. Battle begins with MultiplayerBattle component

### Controls

- **Arrow Left/Right**: Move piece horizontally
- **Arrow Down**: Soft drop
- **Arrow Up**: Rotate piece
- **Space**: Hard drop
- Touch controls available on mobile

### Beat Timing

- Drop pieces on the beat for "PERFECT!" judgment
- Perfect timing doubles your score multiplier
- Perfect timing builds combo counter
- Combo increases garbage sent to opponent

## WebSocket Message Protocol

### Outgoing Messages

```typescript
// Game state update
{
  type: 'relay',
  payload: {
    type: 'game_state',
    board: (PieceCell | null)[][],
    score: number,
    lines: number
  }
}

// Send garbage
{
  type: 'relay',
  payload: {
    type: 'garbage',
    count: number
  }
}

// Game over
{
  type: 'relay',
  payload: {
    type: 'game_over'
  }
}
```

### Incoming Messages

```typescript
// Relayed game state from opponent
{
  type: 'relayed',
  fromPlayerId: string,
  payload: {
    type: 'game_state',
    board: (PieceCell | null)[][],
    score: number,
    lines: number
  }
}

// Received garbage
{
  type: 'relayed',
  fromPlayerId: string,
  payload: {
    type: 'garbage',
    count: number
  }
}

// Opponent game over
{
  type: 'relayed',
  fromPlayerId: string,
  payload: {
    type: 'game_over'
  }
}
```

## Environment Variables

```bash
# WebSocket server URL for multiplayer
NEXT_PUBLIC_MULTIPLAYER_URL=ws://localhost:3001
```

## Styling

The component uses `MultiplayerBattle.module.css` with:
- Neon color scheme matching Rhythmia theme
- Dark gradient background
- Glowing borders and shadows
- Smooth animations for piece movement
- Responsive layout for mobile devices

## Future Enhancements

Potential improvements:
- Spectator mode
- Tournament system
- Replay functionality
- Custom room settings (speed, garbage rules)
- Power-ups and special attacks
- Ranking and leaderboard
- Voice/text chat

## Testing

To test the multiplayer battle:

1. Start the multiplayer WebSocket server:
   ```bash
   npm run multiplayer
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```

3. Open two browser windows
4. Create a room in one window
5. Join the room in the other window
6. Start the game and test gameplay

## Technical Notes

- The component maintains separate refs for current game state to avoid race conditions
- Audio context is initialized on user interaction (browser requirement)
- WebSocket reconnection is handled by the parent component
- Cell size is dynamically calculated based on viewport
- Beat phase is calculated using requestAnimationFrame for smooth animation

## Dependencies

- React hooks (useState, useEffect, useRef, useCallback)
- WebSocket API for real-time communication
- CSS Modules for component-scoped styling
- Web Audio API for sound effects
