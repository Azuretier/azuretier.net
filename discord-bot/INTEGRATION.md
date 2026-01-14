# Azure Community - Discord Bot & Web App Integration Guide

This document explains how the Discord bot synchronizes with the web application.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  Discord Bot    │◄───────►│  Shared KV Store │◄───────►│   Web App       │
│  (Node.js)      │         │  (Spark Runtime) │         │   (React)       │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                           │                             │
        │                           │                             │
        ▼                           ▼                             ▼
  Discord Events              Profile Data                  User Interface
  - New Members              - XP & Levels                  - Profile Cards
  - Messages                 - Rank Tiers                   - Role Selection
  - Commands                 - Rules Agreement              - Statistics
                             - Custom Roles
```

## Data Synchronization

### Key-Value Store Structure

All data is stored in the Spark KV store with these key patterns:

- `user-profile-{userId}` - User profile data
- `guild-config` - Server configuration
- `xp-cooldown-{userId}` - XP gain cooldowns

### Profile Data Schema

```typescript
{
  id: string;              // Discord user ID
  username: string;        // Discord username
  discriminator?: string;  // Discord discriminator (legacy)
  avatarUrl: string;       // Discord avatar URL
  xp: number;             // Total XP earned
  level: number;          // Calculated level
  rank: RankTier;         // Rank tier (accordian/arcadia/apex/legendary)
  rulesAgreed: boolean;   // Has agreed to server rules
  roles: string[];        // Custom role IDs
  joinedAt: string;       // ISO timestamp of join date
  lastMessageAt?: string; // Last message timestamp
  messageCount?: number;  // Total messages sent
}
```

## Bot Setup Instructions

### 1. Install Dependencies

```bash
cd discord-bot
npm install
```

### 2. Configure Environment

Create `.env` file in the `discord-bot` directory:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here
DISCORD_GUILD_ID=your_guild_id_here
WEBAPP_URL=https://azuret.me
WEBAPP_API_KEY=your_secure_api_key
```

### 3. Deploy Commands

```bash
npm run deploy-commands
```

### 4. Start the Bot

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

## Web App Integration

The web app needs to expose these API endpoints for the bot to integrate:

### API Endpoints

#### GET `/api/kv/user-profile-{userId}`
Returns user profile data from KV store.

**Headers:**
- `Authorization: Bearer {API_KEY}`

**Response:**
```json
{
  "id": "123456789",
  "username": "AzureDev",
  "xp": 12500,
  "level": 11,
  "rank": "arcadia",
  ...
}
```

#### POST `/api/kv/user-profile-{userId}`
Saves user profile data to KV store.

**Headers:**
- `Authorization: Bearer {API_KEY}`
- `Content-Type: application/json`

**Body:** Full UserProfile object

#### GET `/api/kv/keys?prefix={prefix}`
Returns all keys matching prefix.

**Headers:**
- `Authorization: Bearer {API_KEY}`

**Response:**
```json
["user-profile-123", "user-profile-456", ...]
```

## Bot Features & Flows

### 1. New Member Flow

```
User joins server
     ↓
Bot assigns "Pre-Member" role
     ↓
User uses /rules command
     ↓
User clicks "Agree to Rules"
     ↓
Bot saves agreement to KV
     ↓
Bot removes "Pre-Member" role
     ↓
Bot adds "Member" role
```

### 2. XP & Leveling Flow

```
User sends message
     ↓
Check XP cooldown (60s)
     ↓
If eligible, award XP
     ↓
Calculate new level
     ↓
Check for rank change
     ↓
Save to KV store
     ↓
Notify user if leveled up
```

### 3. Role Customization Flow

```
User visits web app profile page
     ↓
Web app loads profile from KV
     ↓
User selects custom roles
     ↓
Web app saves to KV store
     ↓
Bot reads updated roles
     ↓
Bot applies Discord roles (if mapped)
```

### 4. Profile Card Display

```
User or bot requests profile
     ↓
/profile command or web visit
     ↓
System reads from KV store
     ↓
Calculate progress & stats
     ↓
Display in Discord embed or web card
```

## Discord Bot Commands

### `/profile [@user]`
View user profile with XP, level, rank, and roles.

### `/leaderboard [limit]`
View top users by XP (default 10, max 25).

### `/rules`
Display server rules with agreement button.

### `/roles`
Get link to web-based role customization.

### `/reconnect` (Admin)
Force bot to re-register all interactions.

## XP System Details

### XP Calculation
- **Formula:** `level = floor(sqrt(xp / 100))`
- **XP per message:** 10 XP
- **Cooldown:** 60 seconds between XP gains

### Rank Thresholds
- **Accordian:** Level 0-14 (0-19,600 XP)
- **Arcadia:** Level 15-29 (22,500-84,100 XP)
- **Apex:** Level 30-49 (90,000-240,100 XP)
- **Legendary:** Level 50+ (250,000+ XP)

### Level Examples
- Level 10: 10,000 XP
- Level 20: 40,000 XP
- Level 30: 90,000 XP
- Level 50: 250,000 XP
- Level 100: 1,000,000 XP

## Role System

### Custom Roles (Selectable on Web)
Users can select these roles via the web interface:

**Special Roles:**
- ☆ଓ｡ Cutie ｡ଓ☆
- Luminelle
- Archeborne

**Interest Roles:**
- Dreamer
- Community Fan
- Thinker
- Smart

**Contribution Roles:**
- Rising Star
- Gifted
- Artist
- Creator
- Translator

**Activity Roles:**
- Dream Maker (Member)

### Automatic Roles
- **Pre-Member:** Assigned on join, removed after rule agreement
- **Member:** Assigned after rule agreement

## Bot Reconnection

If the bot disconnects or crashes:

1. Bot automatically reconnects on startup
2. All slash commands are re-registered
3. Event handlers are re-attached
4. No data is lost (stored in KV)

Admins can use `/reconnect` to force command re-registration without restart.

## Security Considerations

1. **API Key Authentication:** All bot-to-webapp requests use Bearer token authentication
2. **Rate Limiting:** XP gains have cooldowns to prevent abuse
3. **Role Validation:** Role selections are validated before saving
4. **Permission Checks:** Admin commands require Discord permissions

## Monitoring & Logging

The bot logs all significant events:
- New member joins
- Rule agreements
- XP gains and level ups
- Command executions
- Errors and warnings

Logs include timestamps, user info, and context for debugging.

## Future Enhancements

### AI Auto-Moderation
- Monitor messages for policy violations
- Automatic warnings and temporary mutes
- Escalation to human moderators
- Learn from moderator actions

### Advanced Analytics
- Member activity graphs
- XP gain trends
- Popular role combinations
- Engagement metrics

### Custom Profile Themes
- Multiple card designs
- Color scheme selection
- Badge collections
- Achievement showcase

## Troubleshooting

### Bot not responding to commands
1. Check bot is online in Discord
2. Verify bot has required permissions
3. Run `/reconnect` to re-register commands
4. Check logs for errors

### Profile not updating
1. Verify KV store is accessible
2. Check API key is valid
3. Ensure bot and webapp use same KV
4. Clear browser cache

### Roles not syncing
1. Verify bot has Manage Roles permission
2. Check bot role is above managed roles
3. Ensure role names match exactly
4. Check bot logs for role errors

## Support

For issues or questions:
1. Check bot logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure bot has necessary Discord permissions
4. Test with `/reconnect` command
