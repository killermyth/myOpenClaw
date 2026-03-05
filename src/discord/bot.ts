import { Client, GatewayIntentBits, Partials, PermissionFlagsBits } from 'discord.js';
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
    partials: [Partials.Channel, Partials.Message],
  });

  setupHandlers(client, config);

  // Raw event logging for diagnostics
  client.on('raw', (packet) => {
    if (packet.t === 'MESSAGE_CREATE') {
      log.info('RAW MESSAGE_CREATE event received from Discord');
    }
  });

  client.once('clientReady', () => {
    log.info(`Discord bot started as ${client.user?.tag}`);
    log.info(`Bot is in ${client.guilds.cache.size} servers`);

    // Diagnostic: Check permissions in all guilds
    client.guilds.cache.forEach((guild) => {
      log.info(`\n=== Guild: ${guild.name} (${guild.id}) ===`);
      const channels = guild.channels.cache.filter(ch => ch.isTextBased());
      log.info(`Text channels visible: ${channels.size}`);

      channels.forEach((channel) => {
        const perms = channel.permissionsFor(client.user!);
        if (perms) {
          const canView = perms.has(PermissionFlagsBits.ViewChannel);
          const canRead = perms.has(PermissionFlagsBits.ReadMessageHistory);
          const canSend = perms.has(PermissionFlagsBits.SendMessages);
          log.info(`  #${channel.name}: View=${canView}, Read=${canRead}, Send=${canSend}`);
        }
      });
    });

    log.info('\nMessage handlers are ready. Waiting for messages...');
  });

  client.on('error', (error) => {
    log.error('Discord client error:', error);
  });

  await client.login(token);
  log.info('Discord bot login successful');
}
