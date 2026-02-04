# Project Split Architecture

## Current Monolithic Structure

```
Azuretier/Azuret.me
├── Personal Website Features
│   ├── Interactive Homepage (GPU rendering)
│   ├── Portfolio (/current)
│   ├── Blog (/blog)
│   └── MNSW page (/MNSW)
│
└── Discord Bot Features
    ├── Rank Card System (/guilds/...)
    ├── Role Selection (/azure-supporter)
    └── Discord OAuth & API
```

## After Split: Two Focused Projects

```
┌─────────────────────────────────────────────────────────────┐
│                    Azuretier/Azuret.me                      │
│                  (Personal Website Only)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  URL: azuret.net                                           │
│  Purpose: Personal portfolio and interactive homepage       │
│                                                             │
│  Features:                                                  │
│  ✓ Interactive homepage with WebGL background             │
│  ✓ Portfolio page (/current)                              │
│  ✓ Blog section (/blog)                                   │
│  ✓ MNSW page (/MNSW)                                      │
│  ✓ Intent-based social media navigation                   │
│                                                             │
│  Tech Stack:                                                │
│  • Next.js 14                                              │
│  • React 18                                                │
│  • Three.js (3D rendering)                                │
│  • Tailwind CSS                                            │
│  • Framer Motion                                           │
│  • Firebase Client SDK (portfolio data)                    │
│                                                             │
│  Size: ~40% of current bundle                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                            ↓ Split ↓

┌─────────────────────────────────────────────────────────────┐
│            Azuretier/Discord-Bot-Dashboard                  │
│              (Discord Bot Management)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  URL: bot.azuret.net (or subdomain)                        │
│  Purpose: Discord bot features and management              │
│                                                             │
│  Features:                                                  │
│  ✓ Rank card system (/guilds/[id]/rank-card/...)         │
│  ✓ Role selection page (/azure-supporter)                 │
│  ✓ Discord OAuth integration                               │
│  ✓ Real-time Firebase sync                                │
│  ✓ Discord bot API endpoints                              │
│                                                             │
│  Tech Stack:                                                │
│  • Next.js 14                                              │
│  • React 18                                                │
│  • Discord.js 14                                           │
│  • Firebase Client SDK                                     │
│  • Firebase Admin SDK                                      │
│  • Tailwind CSS                                            │
│                                                             │
│  Size: ~60% of current bundle                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Distribution

### Azuret.me (Keep)
```
src/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── layout.tsx            ← Root layout
│   ├── current/              ← Portfolio
│   ├── blog/                 ← Blog
│   └── MNSW/                 ← MNSW page
├── components/
│   ├── home/                 ← Homepage components
│   ├── portfolio/            ← Portfolio components
│   ├── blog/                 ← Blog components
│   ├── MNSW/                 ← MNSW components
│   └── main/                 ← Shared UI (buttons, etc)
├── lib/
│   ├── intent/               ← Intent parser
│   ├── portfolio/            ← Portfolio utilities
│   ├── MNSW/                 ← MNSW utilities
│   └── utils.ts              ← Shared utilities
└── public/
    ├── shaders/              ← WebGL shaders
    └── ...                   ← Static assets

Dependencies (~15):
- next, react, react-dom
- three (3D rendering)
- framer-motion (animations)
- tailwind-merge, clsx
- firebase (client only)
- lucide-react, react-icons
```

### Discord-Bot-Dashboard (Move)
```
src/
├── app/
│   ├── api/
│   │   ├── auth/discord/     ← OAuth endpoints
│   │   ├── discord/          ← Bot API endpoints
│   │   └── guilds/           ← Rank card API
│   ├── azure-supporter/      ← Role selection page
│   └── guilds/               ← Rank card pages
├── components/
│   ├── rank-card/            ← Rank card components
│   └── main/                 ← Shared UI (copy)
├── lib/
│   ├── firebase-admin.ts     ← Admin SDK init
│   ├── rank-card/            ← Rank card utilities
│   └── utils.ts              ← Shared utilities (copy)
└── public/
    └── ...                   ← Static assets

Dependencies (~20):
- next, react, react-dom
- discord.js (bot integration)
- firebase, firebase-admin
- tailwind-merge, clsx
- framer-motion
- bufferutil, utf-8-validate, zlib-sync
- lucide-react, react-icons
```

## Communication Between Projects

```
┌─────────────────┐                    ┌──────────────────────┐
│   Azuret.me     │                    │  Discord Dashboard   │
│  (azuret.net)   │                    │  (bot.azuret.net)    │
└────────┬────────┘                    └──────────┬───────────┘
         │                                        │
         │  Homepage links to Discord bot        │
         │  dashboard for rank cards              │
         │                                        │
         └──────────────────────────────────────►│
                                                  │
         Firestore                                │
         ┌────────────────────────────┐          │
         │  guilds/{id}/members       │◄─────────┤
         │  guilds/{id}/rankCards     │          │
         └────────────────────────────┘          │
                                                  │
         Discord API                              │
         ┌────────────────────────────┐          │
         │  Bot manages roles         │◄─────────┤
         │  OAuth authentication      │          │
         └────────────────────────────┘          │
```

### How They Work Together

1. **Independent Deployment**
   - Each project deployed separately
   - Different domains/subdomains
   - Separate environment variables

2. **Shared Data (Firestore)**
   - Both can read from same Firebase project
   - Only Dashboard has Admin SDK (write access)
   - Personal site reads portfolio data only

3. **User Experience**
   - Personal site can link to bot dashboard
   - Bot dashboard is standalone
   - No runtime dependencies between them

## Benefits Visualization

```
┌────────────────────────────────────────────────────────────┐
│                     BEFORE SPLIT                           │
├────────────────────────────────────────────────────────────┤
│  Single Repository                                         │
│  ├─ 25+ dependencies mixed together                       │
│  ├─ Complex deployment (all or nothing)                   │
│  ├─ Discord secrets exposed to website code               │
│  ├─ Larger bundle size (~100%)                            │
│  └─ Can't scale features independently                    │
└────────────────────────────────────────────────────────────┘

                            ↓ SPLIT ↓

┌──────────────────────────┐  ┌──────────────────────────────┐
│   PERSONAL WEBSITE       │  │   DISCORD DASHBOARD          │
├──────────────────────────┤  ├──────────────────────────────┤
│ ✓ 15 focused deps        │  │ ✓ 20 focused deps            │
│ ✓ Deploy independently   │  │ ✓ Deploy independently       │
│ ✓ No bot secrets         │  │ ✓ Secrets isolated           │
│ ✓ 40% bundle size        │  │ ✓ 60% bundle size            │
│ ✓ Scale as needed        │  │ ✓ Scale as needed            │
│ ✓ Faster builds          │  │ ✓ Faster builds              │
│ ✓ Clearer purpose        │  │ ✓ Clearer purpose            │
└──────────────────────────┘  └──────────────────────────────┘
```

## Deployment Comparison

### Before (Monolithic)
```
Single Vercel Project
├─ Domain: azuret.net
├─ Env Vars: 20+ mixed variables
├─ Build Time: 3-4 minutes
├─ Bundle: ~2.5MB JS
└─ Routes: All features together
```

### After (Split)

**Personal Website**
```
Vercel Project #1
├─ Domain: azuret.net
├─ Env Vars: 12 (portfolio + Firebase client)
├─ Build Time: 1-2 minutes
├─ Bundle: ~1MB JS (60% smaller)
└─ Routes: Homepage, Portfolio, Blog, MNSW
```

**Discord Dashboard**
```
Vercel Project #2
├─ Domain: bot.azuret.net
├─ Env Vars: 15 (Discord + Firebase admin)
├─ Build Time: 2 minutes
├─ Bundle: ~1.5MB JS (40% smaller)
└─ Routes: Rank cards, Role selection, OAuth
```

## Decision Tree: Is This Split Right for You?

```
Do you want to manage Discord features separately? 
    │
    ├─ YES → Proceed with split
    │         Benefits:
    │         • Cleaner separation
    │         • Independent scaling
    │         • Better security
    │
    └─ NO → Consider alternatives:
              1. Monorepo (Turborepo/Nx)
              2. Keep as is with better organization
              3. Feature flags for deployment
```

## Next Steps

1. **Review this architecture** ✓ (You're here!)
2. **Read SPLIT_QUICKSTART.md** for step-by-step instructions
3. **Read PROJECT_SPLIT_GUIDE.md** for detailed information
4. **Create Discord-Bot-Dashboard repository**
5. **Follow migration steps**
6. **Test both projects**
7. **Deploy separately**

---

**Questions?** See `PROJECT_SPLIT_GUIDE.md` for FAQ and detailed information.
