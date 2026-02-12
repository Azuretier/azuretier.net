import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

let client: Client | null = null;
let isReady = false;

/**
 * Initialize the Discord bot client.
 * Requires DISCORD_BOT_TOKEN environment variable.
 * Returns the client instance or null if token is not configured.
 */
export async function initDiscordBot(): Promise<Client | null> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token || token === 'your_discord_bot_token') {
    console.log('[DISCORD_BOT] No bot token configured — skipping initialization');
    return null;
  }

  if (client && isReady) {
    return client;
  }

  client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  return new Promise((resolve) => {
    client!.once('ready', () => {
      isReady = true;
      console.log(`[DISCORD_BOT] Logged in as ${client!.user?.tag}`);
      resolve(client);
    });

    client!.on('error', (error) => {
      console.error('[DISCORD_BOT] Client error:', error.message);
    });

    client!.login(token).catch((error) => {
      console.error('[DISCORD_BOT] Login failed:', error.message);
      client = null;
      isReady = false;
      resolve(null);
    });
  });
}

/**
 * Get the current Discord bot client instance.
 * Returns null if not initialized or not ready.
 */
export function getDiscordBot(): Client | null {
  return isReady ? client : null;
}

/**
 * Send a message to a Discord channel by ID.
 * Returns true if the message was sent successfully.
 */
export async function sendToChannel(
  channelId: string,
  content: string | { embeds: object[] },
): Promise<boolean> {
  const bot = getDiscordBot();
  if (!bot) return false;

  try {
    const channel = await bot.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannel)) {
      console.error(`[DISCORD_BOT] Channel ${channelId} not found or not a text channel`);
      return false;
    }

    await channel.send(content);

    return true;
  } catch (error) {
    console.error(`[DISCORD_BOT] Failed to send to channel ${channelId}:`, (error as Error).message);
    return false;
  }
}

/**
 * Gracefully destroy the Discord bot client.
 */
export async function destroyDiscordBot(): Promise<void> {
  if (client) {
    client.destroy();
    client = null;
    isReady = false;
    console.log('[DISCORD_BOT] Client destroyed');
  }
}
