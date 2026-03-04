import { Command } from 'commander';
import { loadConfig } from '../config/config.js';
import { createSubsystemLogger } from '../logging/subsystem.js';

const log = createSubsystemLogger('cli');

export function buildProgram(): Command {
  const program = new Command();

  program
    .name('myclaw')
    .description('Personal AI assistant via Telegram')
    .version('0.1.0');

  program
    .command('start')
    .description('Start the Telegram bot')
    .action(async () => {
      const config = loadConfig();

      if (!config.telegram?.botToken) {
        log.error('TELEGRAM_BOT_TOKEN is not set. Please configure it in .env or ~/.myclaw/myclaw.json');
        process.exit(1);
      }

      if (!config.ai?.apiKey) {
        log.error('OPENAI_API_KEY is not set. Please configure it in .env or ~/.myclaw/myclaw.json');
        process.exit(1);
      }

      log.info('Starting Telegram bot...');
      const { startBot } = await import('../telegram/bot.js');
      await startBot(config);
    });

  program
    .command('start-discord')
    .description('Start the Discord bot')
    .action(async () => {
      const config = loadConfig();

      if (!config.discord?.botToken) {
        log.error('DISCORD_BOT_TOKEN is not set. Please configure it in .env or ~/.myclaw/myclaw.json');
        process.exit(1);
      }

      if (!config.ai?.apiKey) {
        log.error('OPENAI_API_KEY is not set. Please configure it in .env or ~/.myclaw/myclaw.json');
        process.exit(1);
      }

      log.info('Starting Discord bot...');
      const { startDiscordBot } = await import('../discord/bot.js');
      await startDiscordBot(config);
    });

  program
    .command('config')
    .description('Show current configuration')
    .action(() => {
      const config = loadConfig();
      console.log(JSON.stringify({
        telegram: { botToken: config.telegram?.botToken ? '***' : undefined },
        ai: {
          ...config.ai,
          apiKey: config.ai?.apiKey ? '***' : undefined,
        },
      }, null, 2));
    });

  program
    .command('chat')
    .description('Test AI chat in terminal')
    .action(async () => {
      const config = loadConfig();

      if (!config.ai?.apiKey) {
        log.error('OPENAI_API_KEY is not set. Please configure it in .env or ~/.myclaw/myclaw.json');
        process.exit(1);
      }

      log.info(`Using model: ${config.ai.model} at ${config.ai.baseUrl}`);
      const { testChat } = await import('../test/chat.js');
      await testChat(config);
    });

  return program;
}
