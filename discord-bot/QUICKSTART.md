# Quick Start Guide

Get the Azure Community Discord bot running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Discord bot token ([Get one here](https://discord.com/developers/applications))
- Your Discord server (guild) ID
- Your Discord application ID

## Step 1: Clone and Install

```bash
cd discord-bot
npm install
```

## Step 2: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here
WEBAPP_URL=https://azuret.me
WEBAPP_API_KEY=your-secure-api-key-here
```

### How to get these values:

**DISCORD_TOKEN:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "Bot" section
4. Click "Reset Token" and copy the token

**DISCORD_CLIENT_ID:**
1. In Developer Portal, select your application
2. Go to "OAuth2" section
3. Copy the "Client ID"

**DISCORD_GUILD_ID:**
1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click your server icon
3. Click "Copy Server ID"

## Step 3: Set Up Discord Bot Permissions

1. Go to OAuth2 → URL Generator in Developer Portal
2. Select these scopes:
   - `bot`
   - `applications.commands`
3. Select these bot permissions:
   - Manage Roles
   - Send Messages
   - Read Messages/View Channels
   - Read Message History
   - Use Slash Commands
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

## Step 4: Enable Required Intents

In the Discord Developer Portal:
1. Go to "Bot" section
2. Scroll to "Privileged Gateway Intents"
3. Enable:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT

## Step 5: Deploy Commands

```bash
npm run deploy-commands
```

You should see:
```
✓ Loaded command: profile
✓ Loaded command: leaderboard
✓ Loaded command: rules
✓ Loaded command: roles
✓ Loaded command: reconnect

✅ Successfully reloaded 5 application (/) commands.
```

## Step 6: Start the Bot

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

You should see:
```
[Bot] INFO: Starting Azure Community Discord Bot...
[Bot] INFO: Loaded command: profile
[Bot] INFO: Loaded command: leaderboard
...
[Ready] INFO: Bot ready! Logged in as AzureBot#1234
```

## Step 7: Test in Discord

In your Discord server, try these commands:

```
/rules          - View server rules
/profile        - View your profile
/leaderboard    - View XP rankings
/roles          - Get role customization link
```

## Verify It's Working

1. ✅ Bot shows as online in your server
2. ✅ Slash commands appear when you type `/`
3. ✅ New members get "Pre-Member" role automatically
4. ✅ `/rules` command shows rules with agreement button
5. ✅ Messages award XP (check with `/profile`)

## Common Issues

### "Invalid Token" error
- Make sure you copied the entire token from Discord Developer Portal
- Check there are no extra spaces in your `.env` file
- Try resetting the token and using the new one

### Commands not showing up
- Wait 5-10 minutes for Discord to update (it caches commands)
- Try running `npm run deploy-commands` again
- Use `/reconnect` in Discord if bot is already running

### Bot can't assign roles
- Check bot role is above the roles it needs to manage
- Verify "Manage Roles" permission is enabled
- Check the role hierarchy in Server Settings → Roles

### "Missing Access" errors
- Verify all required intents are enabled in Developer Portal
- Check bot has permission to view the channel
- Ensure bot role isn't restricted by channel permissions

## Next Steps

1. **Configure Roles:** Create "Pre-Member" and "Member" roles in your server
2. **Customize XP:** Edit `src/services/xp.service.ts` to adjust XP rates
3. **Add Custom Roles:** Edit `src/services/role.service.ts` to add Discord role IDs
4. **Set Up Web App:** Follow the integration guide to connect with the web application
5. **Monitor Logs:** Watch the console for events and errors

## Development Tips

### Watch mode for development
```bash
npm run dev
```
Changes to TypeScript files will automatically reload the bot.

### View detailed logs
Set `NODE_ENV=development` in `.env` for debug logs.

### Test commands locally
You can modify command files in `src/commands/` and the bot will reload automatically in dev mode.

### Database inspection
Since we use KV store, check the web app to see stored profile data.

## Support

- **Integration Guide:** See `INTEGRATION.md` for detailed architecture
- **Discord Bot Docs:** https://discord.js.org/
- **Discord Developer Portal:** https://discord.com/developers/applications

## Security Reminders

⚠️ **Never commit your `.env` file!**
⚠️ **Keep your bot token secret!**
⚠️ **Use a strong API key for production!**

If your token is exposed:
1. Go to Discord Developer Portal
2. Reset your bot token immediately
3. Update your `.env` file
4. Restart the bot

---

Enjoy your Azure Community bot! 🚀
