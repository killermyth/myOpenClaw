import { Client, GatewayIntentBits } from 'discord.js';
import type { MyClawConfig } from '../config/types.js';
import { setupHandlers } from './handlers.js';
import { createSubsystemLogger } from '../logging/subsystem.js';

const log = createSubsystemLogger('discord-bot');

export async function startDiscordBot(config: MyClawConfig): Promise<void> {
  const token = config.discord?.botToken;
  if (!token) {
    throw new Error('Discord bot token not configured');
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  setupHandlers(client, config);

  client.once('ready', () => {
    log.info(`Discord bot started as ${client.user?.tag}`);
    log.info(`Bot is in ${client.guilds.cache.size} servers`);
  });

  client.on('error', (error) => {
    log.error('Discord client error:', error);
  });

  await client.login(token);
  log.info('Discord bot login successful');
}
