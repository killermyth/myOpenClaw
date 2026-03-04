import { Bot, Context } from 'grammy';
import { apiThrottler } from '@grammyjs/transformer-throttler';
import type { MyClawConfig } from '../config/types.js';
import { createSubsystemLogger } from '../logging/subsystem.js';
import { setupHandlers } from './handlers.js';

const log = createSubsystemLogger('telegram');

export async function startBot(config: MyClawConfig): Promise<void> {
  const bot = new Bot(config.telegram!.botToken!);

  bot.api.config.use(apiThrottler());

  bot.catch((err) => {
    log.error('Bot error:', err);
  });

  setupHandlers(bot, config);

  log.info('Bot starting...');
  await bot.start();
}
