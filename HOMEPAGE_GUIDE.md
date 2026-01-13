# Interactive Homepage Documentation

## Overview

The interactive homepage at `/` features a GPU-rendered loading screen with atmospheric effects that transitions into a Discord-like messenger UI with intent-based routing to social media profiles.

## Features

- **GPU-Rendered Background**: Atmospheric shader effects with building silhouettes and fog
  - Desktop: Uses WebGPU (WGSL shaders)
  - Mobile: Uses WebGL (GLSL shaders)
  - Graceful fallback to static gradient if GPU rendering fails
- **Loading Screen**: Modern TailwindCSS widget overlay showing initialization progress
- **Messenger UI**: Discord-inspired chat interface
- **Intent-Based Routing**: Heuristic parsing of user messages to navigate to social platforms
- **Animated Routing Cards**: Modern UI cards with background/foreground animations before navigation

## Changing Links

To update the social media destinations, edit the file:
```
/home/runner/work/Azuret.me/Azuret.me/src/lib/intent/parser.ts
```

Modify the `destinations` object:

```typescript
const destinations = {
  x: {
    name: "X (Twitter)",
    url: "https://x.com/c2c546",        // ← Change this URL
    icon: "𝕏",
    keywords: ["x", "twitter", "tweet", "tweets", "𝕏"],  // ← Add/modify keywords
  },
  youtube: {
    name: "YouTube",
    url: "https://www.youtube.com/@azuretya",  // ← Change this URL
    icon: "▶",
    keywords: ["youtube", "video", "videos", "channel", "watch", "yt"],
  },
  discord: {
    name: "Discord",
    url: "https://discord.gg/TRFHTWCY4W",  // ← Change this URL
    icon: "💬",
    keywords: ["discord", "server", "chat", "community", "join"],
  },
};
```

You can also add new destinations following the same pattern.

## WebGPU/WebGL Support

### WebGPU (Desktop)

**Browser Support:**
- Chrome/Edge 113+ (enabled by default)
- Firefox 133+ (behind flag: `dom.webgpu.enabled`)
- Safari 18+ (experimental)

**Features:**
- Better performance
- Modern compute capabilities
- Lower CPU overhead

**Shader Location:** `/public/shaders/atmosphere.wgsl`

### WebGL (Mobile Fallback)

**Browser Support:**
- All modern browsers (iOS, Android, Desktop)
- WebGL 2.0 preferred, WebGL 1.0 fallback

**Features:**
- Wider compatibility
- Mature ecosystem
- Reliable on mobile devices

**Shader Location:** `/public/shaders/atmosphere.frag`

### Fallback Behavior

If neither WebGPU nor WebGL is available, the system falls back to a static CSS gradient background. The messenger UI remains fully functional.

## File Structure

```
src/
├── components/home/
│   ├── InteractiveHomepage.tsx    # Main component
│   ├── GPURenderer.tsx            # GPU detection & rendering orchestration
│   ├── WebGPURenderer.tsx         # WebGPU implementation
│   ├── WebGLRenderer.tsx          # WebGL implementation
│   ├── LoadingWidget.tsx          # Loading screen overlay
│   ├── MessengerUI.tsx            # Discord-like chat interface
│   └── RoutingCard.tsx            # Animated navigation card
├── lib/intent/
│   └── parser.ts                  # Intent parsing logic
public/shaders/
├── atmosphere.wgsl                # WebGPU shader
└── atmosphere.frag                # WebGL shader
```

## Customizing the UI

### Changing Owner Name/Message

Edit `/src/components/home/MessengerUI.tsx`:

```typescript
const [messages, setMessages] = useState<Message[]>([
  {
    id: "1",
    content: "Hey! 👋 Welcome...",  // ← Change this message
    sender: "azur",
    timestamp: new Date(),
  },
]);
```

### Modifying Shader Effects

**WebGPU Shader:** Edit `/public/shaders/atmosphere.wgsl`
- Adjust colors in the `skyGradient` section
- Modify `buildingSilhouette` function for different architecture
- Change fog parameters in the fog calculation section

**WebGL Shader:** Edit `/public/shaders/atmosphere.frag`
- Same sections as WebGPU shader
- Keep logic consistent between both shaders

### Styling

The UI uses TailwindCSS. Colors and styles can be modified directly in the component files:
- Discord theme colors: `bg-[#313338]`, `bg-[#2b2d31]`, etc.
- Adjust in `MessengerUI.tsx` for consistent theming

## Technical Notes

- All GPU components are client-side only (`"use client"` directive)
- Dynamic imports with `ssr: false` prevent SSR issues
- Capability detection runs once on component mount
- Animation library: Framer Motion (already in dependencies)
- TypeScript strict mode compatible
- Three.js used for WebGL rendering (existing dependency)

## Testing

**Desktop:**
1. Open in Chrome/Edge (WebGPU should activate)
2. Check console for "WebGPU" messages
3. Verify shader rendering and loading screen

**Mobile:**
1. Open on iOS/Android device
2. Check console for "WebGL" messages  
3. Verify shader rendering works

**Fallback:**
1. Open in a browser without GPU support
2. Should see static gradient background
3. Messenger UI should still work

## Performance Considerations

- Shaders are optimized for 60fps on most devices
- WebGPU is preferred on desktop for better performance
- Mobile devices use WebGL with simplified shader calculations
- Fallback has zero GPU overhead
