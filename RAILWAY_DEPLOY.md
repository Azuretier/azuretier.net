# RHYTHMIA NEXUS - Railway Deployment Guide

## 🚂 Deploy to Railway

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   cd D:\-\GitHub\azuretia.net
   git add .
   git commit -m "Add multiplayer server"
   git push
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy!

3. **Configure**
   - Railway will automatically set `PORT` variable
   - Click on your service → Settings → Generate Domain
   - Copy your domain (e.g., `your-app.up.railway.app`)

4. **Update your clients**
   Update `WS_URL` in `host.html` and `player.html`:
   ```javascript
   const WS_URL = 'wss://your-app.up.railway.app';
   ```

### Option 2: Deploy via CLI

1. **Install Railway CLI**
   ```powershell
   npm install -g @railway/cli
   ```

2. **Login (in browser)**
   ```bash
   railway login
   ```
   This will open your browser to authenticate.

3. **Initialize project**
   ```bash
   cd app/RYTHMIA-NEXUS/server
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Add domain**
   ```bash
   railway domain
   ```

### Railway Configuration

The server will automatically:
- ✅ Build TypeScript with `npm run build`
- ✅ Start with `npm start`
- ✅ Handle WebSocket connections
- ✅ Auto-restart on crashes
- ✅ Use PORT environment variable

### Environment Variables (Optional)

In Railway dashboard, add:
- `NODE_ENV` = `production`
- Railway automatically provides `PORT`

### Monitoring

```bash
# View logs
railway logs

# Check status
railway status

# Open in browser
railway open
```

### Cost

- **Free Tier**: $5 credit/month (enough for testing)
- **Pro Plan**: $5/month + usage
- WebSocket connections are fully supported!

### Troubleshooting

If deployment fails:
1. Check logs: `railway logs`
2. Ensure `package.json` has correct scripts
3. Verify TypeScript compiles: `npm run build`
4. Check Railway dashboard for errors

---

## Alternative: Deploy Directly via Web

Just push to GitHub and use Railway's web interface - it's the easiest way!
