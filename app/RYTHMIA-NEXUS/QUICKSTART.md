# RHYTHMIA NEXUS - Quick Start Guide

## ✅ Files Fixed

All files are now properly organized:
- ✅ TypeScript server (`server.ts`)
- ✅ Build configuration (`tsconfig.json`)
- ✅ Package dependencies updated
- ✅ WebSocket URLs reset to localhost
- ✅ `.gitignore` added
- ✅ Deployment configs ready

---

## 🚀 Run Locally

### Start the Server
```bash
cd app/RYTHMIA-NEXUS/server
npm run dev
```

Server runs on `http://localhost:3001`

### Open the Interfaces
1. **Host**: Open `app/RYTHMIA-NEXUS/host.html` in browser
2. **Players**: Open `app/RYTHMIA-NEXUS/player.html` in other browsers/tabs

---

## 🌐 Deploy to Railway

### Method 1: GitHub (Recommended - Takes 2 minutes)

1. **Push to GitHub**
   ```bash
   cd D:\-\GitHub\azuretia.net
   git add .
   git commit -m "Add multiplayer server"
   git push
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app) and login
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects and deploys!

3. **Get Your URL**
   - Click on your service → Settings → "Generate Domain"
   - You'll get: `your-app.up.railway.app`

4. **Update HTML Files**
   - Open `host.html` line 583 and `player.html` line 613
   - Change:
     ```javascript
     const WS_URL = 'wss://your-app.up.railway.app';
     ```
   - Push changes to GitHub (Railway auto-deploys)

### Method 2: Railway CLI

```bash
cd app/RYTHMIA-NEXUS/server
railway login
railway init
railway up
railway domain
```

---

## 📝 Structure Overview

```
RYTHMIA-NEXUS/
├── server/
│   ├── server.ts          # TypeScript server ✅
│   ├── package.json       # Dependencies ✅
│   ├── tsconfig.json      # TS config ✅
│   ├── .gitignore         # Git ignore ✅
│   ├── Dockerfile         # Docker config ✅
│   └── railway.json       # Railway config ✅
├── host.html              # Host dashboard ✅
├── player.html            # Player client ✅
└── README_TYPESCRIPT.md   # Full documentation
```

---

## ✨ Next Steps

1. **Test locally** - Run `npm run dev` and open HTML files
2. **Push to GitHub** - Commit all changes
3. **Deploy on Railway** - Connect your GitHub repo
4. **Update URLs** - Change WebSocket URLs in HTML files
5. **Play!** - Share room codes and test multiplayer

---

## 🆘 Troubleshooting

**Server won't start?**
```bash
cd app/RYTHMIA-NEXUS/server
rm server.js        # Remove old file if exists
npm install         # Reinstall dependencies
npm run build       # Build TypeScript
npm start           # Start server
```

**Can't connect?**
- Check WebSocket URL matches your server
- For local: `ws://localhost:3001`
- For Railway: `wss://your-app.up.railway.app` (no port!)

**Railway deployment fails?**
- Check logs in Railway dashboard
- Ensure `package.json` has correct scripts
- Verify `npm run build` works locally

---

🎮 **Ready to play!** Host creates a room, players join with the code, and start gaming!
