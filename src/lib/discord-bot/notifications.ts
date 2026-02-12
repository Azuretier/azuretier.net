import { sendToChannel } from './client';

// Cooldown tracking to prevent spam when users reconnect rapidly
const recentNotifications = new Map<string, number>();
const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; // 5 minutes per user

/**
 * Parse the DISCORD_NOTIFICATION_CHANNEL_IDS env var into an array.
 * Supports comma-separated channel IDs.
 */
function getNotificationChannelIds(): string[] {
  const raw = process.env.DISCORD_NOTIFICATION_CHANNEL_IDS;
  if (!raw) return [];
  return raw.split(',').map((id) => id.trim()).filter(Boolean);
}

/**
 * Send an "online" notification to all configured Discord channels.
 * Includes cooldown logic so rapid reconnects don't spam.
 */
export async function notifyPlayerOnline(
  playerName: string,
  playerIcon: string,
  onlineCount: number,
): Promise<void> {
  const channels = getNotificationChannelIds();
  if (channels.length === 0) return;

  // Cooldown check — skip if this player was notified recently
  const now = Date.now();
  const lastNotified = recentNotifications.get(playerName);
  if (lastNotified && now - lastNotified < NOTIFICATION_COOLDOWN) {
    return;
  }
  recentNotifications.set(playerName, now);

  const iconLabel = playerIcon || '🎮';

  const embed = {
    embeds: [
      {
        title: '🟢 Player Online',
        color: 0x007fff, // Azure blue
        fields: [
          { name: 'Player', value: playerName, inline: true },
          { name: 'Icon', value: iconLabel, inline: true },
          { name: 'Online Now', value: `${onlineCount} player${onlineCount !== 1 ? 's' : ''}`, inline: true },
        ],
        footer: { text: 'azuretier.net — Rhythmia' },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  for (const channelId of channels) {
    sendToChannel(channelId, embed).catch((err) => {
      console.error(`[DISCORD_BOT] Notification failed for channel ${channelId}:`, err);
    });
  }
}

/**
 * Send a custom message to all configured notification channels.
 */
export async function sendNotification(
  content: string | { embeds: object[] },
): Promise<void> {
  const channels = getNotificationChannelIds();
  for (const channelId of channels) {
    sendToChannel(channelId, content).catch((err) => {
      console.error(`[DISCORD_BOT] Notification failed for channel ${channelId}:`, err);
    });
  }
}

/**
 * Clean up stale cooldown entries (call periodically).
 */
export function cleanupNotificationCooldowns(): void {
  const now = Date.now();
  for (const [name, time] of recentNotifications) {
    if (now - time > NOTIFICATION_COOLDOWN) {
      recentNotifications.delete(name);
    }
  }
}
