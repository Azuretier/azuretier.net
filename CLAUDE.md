# CLAUDE.md - AI Assistant Guide for azuretier.net

## Project Overview

**azuretier.net** (package name: `azuret.net`) is a full-stack interactive portfolio and gaming platform built with Next.js 16 and TypeScript. It features multiplayer rhythm/battle games (Rhythmia), Discord community integration, rank card systems, a blog, and WebGL/Three.js visual effects. The primary locale is Japanese (`lang="ja"`).

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4 + CSS Modules + Framer Motion
- **UI Components**: Radix UI primitives (shadcn/ui pattern)
- **3D/Graphics**: Three.js, WebGL shaders (GLSL)
- **Real-time**: Socket.IO + raw WebSocket (`ws`)
- **Database**: Firebase (Firestore) — multiple projects for different features
- **Discord**: discord.js 14 + OAuth2
- **Deployment**: Vercel (main app) + Railway (multiplayer WebSocket server)

## Commands

```bash
npm run dev          # Start dev server with Socket.IO (localhost:3000)
npm run build        # Next.js production build
npm run start        # Production server with Socket.IO
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm run multiplayer  # Start standalone WebSocket multiplayer server (port 3001)

# Discord bot (in apps/discord-bot/)
npm run bot:install          # Install bot dependencies
npm run bot:dev              # Run bot in development
npm run bot:build            # Build bot
npm run bot:start            # Start bot in production
npm run bot:deploy-commands  # Deploy slash commands to Discord
```

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx          # Root layout (VersionProvider → ThemeProvider)
│   ├── page.tsx            # Home page (Rhythmia game lobby)
│   ├── provider.tsx        # Client providers (AnimatePresence, ThemeProvider)
│   ├── blog/               # Blog route
│   ├── shader-demo/        # WebGL shader demo route
│   ├── sns-widgets/        # Social media widgets route
│   ├── sunphase/           # WebGPU heartbeat demo route
│   └── fonts/              # Local font files (Geist)
├── components/             # React components organized by feature
│   ├── home/               # Homepage components
│   ├── rhythmia/           # Rhythm game components
│   ├── game/               # Multiplayer game UI
│   ├── effects/            # Visual effects (WebGL backgrounds, particles)
│   ├── portfolio/          # Portfolio display
│   ├── rank-card/          # Discord rank card components
│   ├── blog/               # Blog components
│   ├── MNSW/               # Voxel engine UI
│   ├── sns-widgets/        # Social media widgets
│   └── main/               # Shared main UI components
├── lib/                    # Business logic and utilities
│   ├── game/               # GameManager (Socket.IO game state)
│   ├── multiplayer/        # Room management + Firestore integration
│   ├── discord-community/  # Discord OAuth2 and role management
│   ├── rank-card/          # Rank card generation logic
│   ├── rhythmia/           # Game-specific logic
│   ├── portfolio/          # Portfolio data logic
│   ├── MNSW/               # Voxel engine logic
│   ├── version/            # Version selection context
│   ├── intent/             # Intent parser for commands
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
├── hooks/                  # Custom React hooks
│   ├── useGameSocket.ts    # Socket.IO connection hook
│   ├── use-mobile.ts       # Mobile detection
│   ├── use-kv.ts           # Key-value storage
│   └── useLocalStorage.ts  # Local storage persistence
├── types/                  # TypeScript type definitions
│   ├── game.ts             # Socket.IO event types + GAME_CONFIG
│   ├── multiplayer.ts      # WebSocket protocol types
│   └── community.ts        # Discord community types
└── styles/                 # Global and module CSS

# Root-level server files
server.ts                   # Custom Next.js + Socket.IO server
multiplayer-server.ts       # Standalone WebSocket multiplayer server
```

### Server Architecture

The project runs two separate servers:

1. **Main server** (`server.ts`): Custom Node HTTP server wrapping Next.js with Socket.IO for game room management (create/join/leave rooms, score events, reconnection)
2. **Multiplayer server** (`multiplayer-server.ts`): Standalone WebSocket server for lower-latency room-based multiplayer with tick-based game state (10 ticks/second)

### Provider Hierarchy

```
<html lang="ja">
  <VersionProvider>        ← UI version selection context
    <AnimatePresence>      ← Framer Motion page transitions
      <ThemeProvider>      ← next-themes (dark mode default, class strategy)
        {children}
      </ThemeProvider>
    </AnimatePresence>
  </VersionProvider>
</html>
```

## Code Conventions

### Imports and Path Aliases

- Use `@/*` path alias for all imports from `src/`: `import { cn } from '@/lib/utils'`
- Use the `cn()` utility from `@/lib/utils` for combining Tailwind classes (clsx + tailwind-merge)

### Component Patterns

- **Feature-based organization**: Components are grouped by feature area, not by type
- **Client components**: Mark with `'use client'` directive when using hooks, event handlers, or browser APIs
- **CSS Modules**: Component-scoped styles use `.module.css` files alongside components
- **Radix UI**: Use Radix primitives for accessible UI components (shadcn/ui pattern)
- **Framer Motion**: Use for animations and page transitions

### Styling

- **Tailwind CSS** is the primary styling approach
- **Custom colors**: `azure-500` (#007FFF), `azure-600` (#0066CC) — use CSS variables for theme colors (`--background`, `--foreground`, `--border`, `--subtext`)
- **Dark mode**: Class-based strategy via `next-themes`, dark is the default theme
- **Custom fonts**: `font-pixel` (pixel font), `font-sans` (Inter), plus Geist (Sans and Mono) loaded as local fonts, Orbitron and Zen Kaku Gothic New via Google Fonts

### TypeScript

- Strict mode is enabled
- Target: ES2015
- Path alias: `@/*` → `./src/*`
- GLSL/shader files are typed in `declarations.d.ts`
- Socket.IO events are fully typed in `src/types/game.ts`

### ESLint

- Extends `next/core-web-vitals` and `next/typescript`
- Run with `npm run lint`

## Environment Variables

The project uses multiple Firebase configurations for isolated feature backends. See `.env.example` for the full list. Key groups:

| Prefix | Purpose |
|--------|---------|
| `NEXT_PUBLIC_AZURE_SUPPORTER_*` | Discord community Firebase |
| `NEXT_PUBLIC_MNSW_*` | Voxel engine Firebase |
| `NEXT_PUBLIC_PORTFOLIO_*` | Portfolio Firebase |
| `NEXT_PUBLIC_RANKCARD_*` | Rank card Firebase |
| `NEXT_PUBLIC_RHYTHMIA_*` | Rhythmia game Firebase |
| `DISCORD_*` | Discord bot token, guild, roles, OAuth2 |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Server-side Firebase Admin SDK |
| `NEXT_PUBLIC_MULTIPLAYER_URL` | WebSocket server URL |

## Deployment

- **Vercel**: Main Next.js app deploys via git integration
- **Railway**: Multiplayer WebSocket server (`multiplayer-server.ts`) with Nixpacks builder, health checks at `/health`, auto-restart on failure
- Configuration files: `railway.json`, `railway.multiplayer.json`, `nixpacks.toml`

## Webpack Customizations

Defined in `next.config.mjs`:
- **GLSL loader**: `.glsl`, `.vs`, `.fs`, `.vert`, `.frag` files loaded as raw strings via `raw-loader`
- **Server externals**: `bufferutil`, `utf-8-validate`, `zlib-sync` externalized for discord.js server-side compatibility
- **Cache-Control**: All routes set to `no-cache, no-store, must-revalidate`

## Testing

No automated test framework is configured. Testing is done manually. See `TESTING.md` for manual test procedures (primarily for Discord role selection features).

## Key Patterns to Follow

1. **Feature isolation**: Keep feature logic in its own `lib/<feature>/` and `components/<feature>/` directories
2. **Type safety**: Define Socket.IO and WebSocket event types explicitly in `src/types/`
3. **Multiple Firebase projects**: Each feature has its own Firebase project — never cross-contaminate configurations
4. **Server vs client**: discord.js and Firebase Admin SDK are server-only — ensure they are not imported in client components
5. **Real-time state**: Game state flows through Socket.IO events (main server) or WebSocket messages (multiplayer server), not through React state directly
6. **No automated tests**: When making changes, manually verify behavior. Consider adding tests if introducing complex logic
